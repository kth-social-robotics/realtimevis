'use strict';

// Create an instance
var wavesurfer = Object.create(WaveSurfer);

// Init & load
document.addEventListener('DOMContentLoaded', function () {
    var options = {
        container     : '#waveform',
        waveColor     : 'violet',
        progressColor : 'purple',
        loaderColor   : 'purple',
        cursorColor   : 'navy'
    };

    options.minPxPerSec = 100;
    options.scrollParent = true;

    options.normalize = true;

    /* Progress bar */
    (function () {
        var progressDiv = document.querySelector('#progress-bar');
        var progressBar = progressDiv.querySelector('.progress-bar');

        var showProgress = function (percent) {
            progressDiv.style.display = 'block';
            progressBar.style.width = percent + '%';
        };

        var hideProgress = function () {
            progressDiv.style.display = 'none';
        };

        wavesurfer.on('loading', showProgress);
        wavesurfer.on('ready', hideProgress);
        wavesurfer.on('destroy', hideProgress);
        wavesurfer.on('error', hideProgress);
    }());

    wavesurfer.on('ready', function () {
        // Init Timeline plugin
        var timeline = Object.create(WaveSurfer.Timeline);

        timeline.init({
            wavesurfer: wavesurfer,
            container: '#wave-timeline'
        });

        // Play wav here with start and end time
        wavesurfer.play(startvis, endvis);
    });

    // Init wavesurfer
    if (soundvis == "yes") {
        wavesurfer.init(options);
        wavesurfer.load('data/recordings/rec12/audio/video1.wav');
    }
});
