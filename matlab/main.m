% Process performance capture data from a setup containing fulldata mocap
% (processed by motive), and gaze data from tobii glasses

% 1 for Test or 2 for full recording
test = 2;

% 1 for new datasets, 2 for testing code
run = 1;

% File names and directories
rec = sprintf('rec15');
base = sprintf('../../../Documents/Data/Baby Robot/Processed/%s', rec);

% Mocap
mocapfile = sprintf('%s/mocap/%s.csv', base, rec);

% Tobii
gazefiles{1} = {sprintf('%s/gaze/%s_tobii1.json', base, rec)};
gazefiles{2} = {sprintf('%s/gaze/%s_tobii2.json', base, rec)};
gazefiles{3} = {sprintf('%s/gaze/%s_tobii3.json', base, rec)};

% Microphones
audiofile{1} = {sprintf('%s/audio/%s-01.wav', base, rec)};
audiofile{2} = {sprintf('%s/audio/%s-02.wav', base, rec)};
audiofile{3} = {sprintf('%s/audio/%s-03.wav', base, rec)};

% Sync
mocap_syncfile = sprintf('%s/sync/%s-05.wav', base, rec);
audio_tobii{1} = {sprintf('%s/sync/%s-01.wav', base, rec)};
audio_tobii{2} = {sprintf('%s/sync/%s-03.wav', base, rec)};
audio_tobii{3} = {sprintf('%s/sync/%s-02.wav', base, rec)};
app_syncfile = sprintf('%s/sync/%s-04.wav', base, rec);

% Output
mocapoutfile = sprintf('%s/output/%s_output.trc', base, rec);
mocapoutcsvfile = sprintf('%s/output/%s_output.csv', base, rec);

% Check if development or test mode
if (run == 1)
    % Parse performance data
    [DATA, labels, types, t] = mocapread_csv2matrix(mocapfile);
    mocap_data.timestamps = t;
    mocap_data.data = DATA;

    % Parse gaze data
    nEyetrackers = 3;
    for i=1:nEyetrackers
        [timestamps, gazedata, syncpulse_ts, video_ts] = parse_tobii(gazefiles{i}{1});
        gaze_data{i}.timestamps = timestamps;
        gaze_data{i}.gazedata = gazedata;
        gaze_data{i}.syncpulse_ts = syncpulse_ts;
        gaze_data{i}.video_ts = video_ts;
    end
end

% Check time syncing
if (test == 1)
    appstart = 10;
    clap_start = 0;
    clap_end = 0;
else
    [appstart, clap_start, clap_end] = get_starttime(app_syncfile, audiofile{1}, base);
end
[gaze, mocap, starttime, endtime] = sync_gaze_and_mocap(audio_tobii, audiofile, mocap_syncfile, mocap_data, gaze_data, appstart, 120, 20, 'pulse', 'pulse');

% Extract rigid body data
tobii_rgbName1 = 'tobii1';
tobii_rgbName2 = 'tobii2';
tobii_rgbName3 = 'tobii3';
tobii_rgbdata1 = extract_rigidbodydata(mocap, labels, tobii_rgbName1);
tobii_rgbdata2 = extract_rigidbodydata(mocap, labels, tobii_rgbName2);
tobii_rgbdata3 = extract_rigidbodydata(mocap, labels, tobii_rgbName3);

% Calculate a transform from rigidbody coordinates to tobii glasses
% coordinates, assuming there are 2 markers on the front, and 2 markers
% at the back
front_left_marker1 = 1;
front_right_marker1 = 2;
back_left_marker1 = 4;
back_right_marker1 = 3;
front_left_marker2 = 2;
front_right_marker2 = 1;
back_left_marker2 = 3;
back_right_marker2 = 4;
front_left_marker3 = 1;
front_right_marker3 = 4;
back_left_marker3 = 3;
back_right_marker3 = 2;

% Transform markers to rigid body coordinates
gd1 = gaze{1};
gd2 = gaze{2};
gd3 = gaze{3};

% Clamp the gaze target as this seem to be unreliable
gd1.gp3 = clamp_magnitude(gd1.gp3, 2, Inf);
gd2.gp3 = clamp_magnitude(gd2.gp3, 2, Inf);
gd3.gp3 = clamp_magnitude(gd3.gp3, 2, Inf);

% Assemble tobii data. Only 3 markers are used, the forth (back right) is
% not necessary as it is only used for robustness. The back left marker is
% positioned always at the same place for all glasses, while the back right
% position varies.
tobii_data1 = assemble_tobii_data(gd1, tobii_rgbdata1, front_left_marker1, front_right_marker1, back_left_marker1);
tobii_data2 = assemble_tobii_data(gd2, tobii_rgbdata2, front_left_marker2, front_right_marker2, back_left_marker2);
tobii_data3 = assemble_tobii_data(gd3, tobii_rgbdata3, front_left_marker3, front_right_marker3, back_left_marker3);

% Trim errors
Pgaze1 = trim_trails(matrix2points([tobii_data1.gazeLeftDir_w, tobii_data1.gazeRightDir_w, tobii_data1.gaze3D_w]), 10, 10);
Pgaze2 = trim_trails(matrix2points([tobii_data2.gazeLeftDir_w, tobii_data2.gazeRightDir_w, tobii_data2.gaze3D_w]), 10, 10);
Pgaze3 = trim_trails(matrix2points([tobii_data3.gazeLeftDir_w, tobii_data3.gazeRightDir_w, tobii_data3.gaze3D_w]), 10, 10);

% Smooth gaze data. 12 is 100ms.
Pgaze_sm1 = mocap_smooth(Pgaze1, 12, 'moving');
Pgaze_sm2 = mocap_smooth(Pgaze2, 12, 'moving');
Pgaze_sm3 = mocap_smooth(Pgaze3, 12, 'moving');

% Append all mocap data (mocap and gaze)
[Plabeled, outlabels] = extract_all_rigidbodymarkers(mocap, labels, types);
Ptot1 = mc_append(Plabeled, Pgaze_sm1);
Ptot2 = mc_append(Ptot1, Pgaze_sm2);
Ptot3 = mc_append(Ptot2, Pgaze_sm3);

% Manual labelling
outlbls = [{'camera:a1', 'camera:a2', 'camera:a3', 'clap:b1', 'clap:b2', 'clap:b3', 'hand1l:f1', 'hand1l:f2', 'hand1l:f3', 'hand1l:f4', 'hand1r:g1', 'hand1r:g2', 'hand1r:g3', 'hand1r:g4', 'hand2l:h1', 'hand2l:h2', 'hand2l:h3', 'hand2l:h4', 'hand2r:i1', 'hand2r:i2', 'hand2r:i3', 'hand2r:i4', 'hat:o1', 'hat:o2', 'hat:o3', 'screen:j1', 'screen:j2', 'screen:j3', 'screen:j4', 'tobii1:c1', 'tobii1:c2', 'tobii1:c3', 'tobii1:c4', 'tobii2:d1', 'tobii2:d2', 'tobii2:d3', 'tobii2:d4', 'tobii3:e1', 'tobii3:e2', 'tobii3:e3', 'tobii3:e4', 'g1l:l1', 'g1r:l2', 'g1c:l3', 'g2l:m1', 'g2r:m2', 'g2c:m3', 'g3l:n1', 'g3r:n2', 'g3c:n3'}];
mocapwrite_trc(mocapoutfile, Ptot3, outlbls, 1/120, 0, starttime, endtime, appstart, clap_start, clap_end);
mocapwrite_csv(mocapoutcsvfile, Ptot3, outlbls, 1/120, 0, starttime, endtime, appstart, clap_start, clap_end);

%pseudocode from annotate_gaze.m
% for each tobii glasses
%     for each target point
%         
%         %calcalute delta position
%         Pij = target position (pt2) - tobii position
%         gaze_vec = gaze target position (gp3) - tobii position
%         
%         error_radius = 0.2;
%         dist_ij = calc_norm(Pij);
%         thres_ang = atan(error_radius./dist_ij);
%         gaze_to_target_ang = calc_angle(gaze_vec, Pij);
%         
%         gaze_hits = gaze_to_target_ang<=tres_ang;
%         write_annotation(bin2interv(gaze_hits, nFrames), 'gaze', fileName);
% 
%     end
% end
