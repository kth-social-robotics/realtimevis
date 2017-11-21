'use strict';

if (!Detector.webgl)
    Detector.addGetWebGLMessage();

// Scene definition
var initScene, render, renderer, scene, camera;
var bulbLight, bulbMat, hemiLight, object;
var clock = new THREE.Clock();

// Text definition
var text1 = document.createElement('div');

var csvStream = null;
var csvData = null;

// Object definition
// Glasses
var g1marker1 = null;
var g1marker2 = null;
var g1marker3 = null;
var g1marker4 = null;
var g1markerc = null;

// Gp3
var gp3marker1 = null;

// Headpose
var hpmarker1 = null;

// Targets
var t1marker1 = null;
var t1marker2 = null;
var t1marker3 = null;
var t1marker4 = null;
var t1markerc = null;
var t2marker1 = null;
var t2marker2 = null;
var t2marker3 = null;
var t2marker4 = null;
var t2markerc = null;

// Floor
var floorMat;

// Helper variables
var running = true;
var timetostart = startvis;
var previousShadowMap = false;
var framesPerSecond = 50; // max 60
var stats;

// Tobii Glasses 1 helper
var g1m1_pos, g1m2_pos, g1m3_pos, g1m4_pos;
var g1mc_pos;
var g1mc_x, g1mc_y, g1mc_z;

// Glasses 1 Marker Lines
var glinegeo1;
var g1line;

// GP3
var gp3_pos1;

// GP3 Marker Lines
var gp3linegeo1;
var gp3line1;

// Head pose
var hp_pos1;

// Head pose Marker Lines
var hplinegeo1;
var hpline1;

// Target 1 helper
var t1m1_pos, t1m2_pos, t1m3_pos, t1m4_pos;
var t1mc_pos;
var t1mc_x, t1mc_y, t1mc_z;

// Target 1 Marker Lines
var tlinegeo1;
var t1line;

// Target 2 helper
var t2m1_pos, t2m2_pos, t2m3_pos, t2m4_pos;
var t2mc_pos;
var t2mc_x, t2mc_y, t2mc_z;

// Target 2 Marker Lines
var tlinegeo2;
var t2line;

// Light settings
var bulbLuminousPowers = {
    "110000 lm (1000W)": 110000,
    "3500 lm (300W)": 3500,
    "1700 lm (100W)": 1700,
    "800 lm (60W)": 800,
    "400 lm (40W)": 400,
    "180 lm (25W)": 180,
    "20 lm (4W)": 20,
    "Off": 0
};

// Solar irradiances
var hemiLuminousIrradiances = {
    "0.0001 lx (Moonless Night)": 0.0001,
    "0.002 lx (Night Airglow)": 0.002,
    "0.5 lx (Full Moon)": 0.5,
    "3.4 lx (City Twilight)": 3.4,
    "50 lx (Living Room)": 50,
    "100 lx (Very Overcast)": 100,
    "350 lx (Office Room)": 350,
    "400 lx (Sunrise/Sunset)": 400,
    "1000 lx (Overcast)": 1000,
    "18000 lx (Daylight)": 18000,
    "50000 lx (Direct Sun)": 50000,
};

// GUI parameters
var params = {
    shadows: true,
    exposure: 0.77,
    bulbPower: Object.keys(bulbLuminousPowers)[4],
    hemiIrradiance: Object.keys(hemiLuminousIrradiances)[2]
};

// Resize window
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Connect to web socket
var ws = new WebSocket('ws://130.237.67.120:8080/');
ws.onopen = function() {
    console.log('CONNECT');
};
ws.onclose = function() {
    console.log('DISCONNECT');
    running = false;
};

window.onload = initScene();

// var data3d = {
//    "mocap_target1":{
//       "name":"target1",
//       "marker4":{
//          "y":0.8121280074119568,
//          "x":-3.0052330493927,
//          "z":1.2687002420425415
//       },
//       "frame":1243884,
//       "marker1":{
//          "y":0.8138397932052612,
//          "x":-3.0820324420928955,
//          "z":1.3705765008926392
//       },
//       "marker3":{
//          "y":0.8125203847885132,
//          "x":-3.0178568363189697,
//          "z":1.370245099067688
//       },
//       "marker2":{
//          "y":0.8139135241508484,
//          "x":-3.081951856613159,
//          "z":1.2542681694030762
//       },
//       "mocaptimestamp":34603.1719921,
//       "position":{
//          "y":0.8131003379821777,
//          "x":-3.0467684268951416,
//          "z":1.3159475326538086
//       },
//       "rotation":{
//          "y":2.3824650270398706e-06,
//          "x":-1.0701196515583433e-05,
//          "z":1.9223429262638092e-05,
//          "w":-1.0
//       },
//       "id":2,
//       "localtime":1511138724.6466603
//    },
//    "mocap_glasses1":{
//       "name":"glasses1",
//       "marker4":{
//          "y":0.9546578526496887,
//          "x":-4.62416934967041,
//          "z":2.4623360633850098
//       },
//       "frame":1243884,
//       "marker1":{
//          "y":0.9499883651733398,
//          "x":-4.5850605964660645,
//          "z":2.518827438354492
//       },
//       "marker3":{
//          "y":0.9483512043952942,
//          "x":-4.766242980957031,
//          "z":2.518057346343994
//       },
//       "marker2":{
//          "y":0.9416577219963074,
//          "x":-4.7567338943481445,
//          "z":2.5682265758514404
//       },
//       "mocaptimestamp":34603.1719921,
//       "position":{
//          "y":0.9486637711524963,
//          "x":-4.683051586151123,
//          "z":2.516861915588379
//       },
//       "rotation":{
//          "y":-0.8100244402885437,
//          "x":0.03251512348651886,
//          "z":0.01980029232800007,
//          "w":-0.5851590037345886
//       },
//       "id":1,
//       "localtime":1511138724.6466603
//    },
//    "mocap_target2":{
//       "name":"target2",
//       "marker4":{
//          "y":0.5635424852371216,
//          "x":-2.6178488731384277,
//          "z":4.162487983703613
//       },
//       "frame":1243884,
//       "marker1":{
//          "y":0.5650076866149902,
//          "x":-2.7018988132476807,
//          "z":4.124541759490967
//       },
//       "marker3":{
//          "y":0.5635974407196045,
//          "x":-2.6328799724578857,
//          "z":4.239823341369629
//       },
//       "marker2":{
//          "y":0.5645341873168945,
//          "x":-2.6987645626068115,
//          "z":4.241466522216797
//       },
//       "mocaptimestamp":34603.1719921,
//       "position":{
//          "y":0.5641704797744751,
//          "x":-2.6628479957580566,
//          "z":4.192079544067383
//       },
//       "rotation":{
//          "y":-2.512839091650676e-05,
//          "x":-6.7712971940636635e-06,
//          "z":1.0973308235406876e-06,
//          "w":-1.0
//       },
//       "id":3,
//       "localtime":1511138724.6466603
//    }
// }
