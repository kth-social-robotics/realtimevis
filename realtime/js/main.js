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

// Hands
var h1lmarker1 = null;
var h1lmarker2 = null;
var h1lmarker3 = null;
var h1lmarker4 = null;
var h1lmarkerc = null;
var h1rmarker1 = null;
var h1rmarker2 = null;
var h1rmarker3 = null;
var h1rmarker4 = null;
var h1rmarkerc = null;

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

// Table
var tab1marker1 = null;
var tab1marker2 = null;
var tab1marker3 = null;
var tab1marker4 = null;
var tab1markerc = null;

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

// Hand 1L helper
var h1lm1_pos, h1lm2_pos, h1lm3_pos, h1lm4_pos;
var h1lmc_pos;
var h1lmc_x, h1lmc_y, h1lmc_z;

// Hand 1L Marker Lines
var hlinegeo1l;
var h1lline;

// Hand 1R helper
var h1rm1_pos, h1rm2_pos, h1rm3_pos, h1rm4_pos;
var h1rmc_pos;
var h1rmc_x, h1rmc_y, h1rmc_z;

// Hand 1R Marker Lines
var hlinegeo1r;
var h1rline;

// GlassesHand 1L Marker Lines
var ghlinegeo1l;
var ghline1l;

// GlassesHand 1R Marker Lines
var ghlinegeo1r;
var ghline1r;

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

// Table helper
var tab1m1_pos, tab1m2_pos, tab1m3_pos, tab1m4_pos;
var tab1mc_pos;
var tab1mc_x, tab1mc_y, tab1mc_z;

// Table Marker Lines
var tablinegeo1;
var tab1line;

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
var ws = new WebSocket('ws://130.237.67.209:8080/');
ws.onopen = function() {
    console.log('CONNECT');
};
ws.onclose = function() {
    console.log('DISCONNECT');
    running = false;
};

window.onload = initScene();
