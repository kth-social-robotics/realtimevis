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
// Number of glasses
var glasses_num = 2;
// Number of gloves
var gloves_num = 2;
// Number of targets
var targets_num = 14;
// Number of tables
var tables_num = 1;

// Glasses
var gmarker1 = [];
var gmarker2 = [];
var gmarker3 = [];
var gmarker4 = [];
var gmarkerc = [];
var gp3marker = [];
var hpmarker = [];
var gm1_pos = [];
var gm2_pos = [];
var gm3_pos = [];
var gm4_pos = [];
var gmc_pos = [];
var gmc_x = [];
var gmc_y = [];
var gmc_z = [];
var glinegeo = [];
var gline = [];
var gp3_pos = [];
var gp3linegeo = [];
var gp3line = [];
var hp_pos = [];
var hplinegeo = [];
var hpline = [];

for (var i = 1; i <= glasses_num; i++) {
    gmarker1[i] = null;
    gmarker2[i] = null;
    gmarker3[i] = null;
    gmarker4[i] = null;
    gmarkerc[i] = null;

    // Gp3
    gp3marker[i] = null;

    // Headpose
    hpmarker[i] = null;

    // Glasses helper
    gm1_pos[i], gm2_pos[i], gm3_pos[i], gm4_pos[i];
    gmc_pos[i];
    gmc_x[i], gmc_y[i], gmc_z[i];

    // Glasses Marker Lines
    glinegeo[i];
    gline[i];

    // GP3
    gp3_pos[i];

    // GP3 Marker Lines
    gp3linegeo[i];
    gp3line[i];

    // Head pose
    hp_pos[i];

    // Head pose Marker Lines
    hplinegeo[i];
    hpline[i];
}

// Hands
var hlmarker1 = [];
var hlmarker2 = [];
var hlmarker3 = [];
var hlmarker4 = [];
var hlmarkerc = [];
var hrmarker1 = [];
var hrmarker2 = [];
var hrmarker3 = [];
var hrmarker4 = [];
var hrmarkerc = [];
var hlm1_pos = [];
var hlm2_pos = [];
var hlm3_pos = [];
var hlm4_pos = [];
var hlmc_pos = [];
var hlmc_x = [];
var hlmc_y = [];
var hlmc_z = [];
var hlinegeol = [];
var hlline = [];
var hrm1_pos = [];
var hrm2_pos = [];
var hrm3_pos = [];
var hrm4_pos = [];
var hrmc_pos = [];
var hrmc_x = [];
var hrmc_y = [];
var hrmc_z = [];
var hlinegeor = [];
var hrline = [];
var ghlinegeol = [];
var ghlinel = [];
var ghlinegeor = [];
var ghliner = [];
var gplinegeol = [];
var gplinel = [];
var gplinegeor = [];
var gpliner = [];

for (var i = 1; i <= gloves_num; i++) {
    // Left hand
    hlmarker1[i] = null;
    hlmarker2[i] = null;
    hlmarker3[i] = null;
    hlmarker4[i] = null;
    hlmarkerc[i] = null;

    // Right hand
    hrmarker1[i] = null;
    hrmarker2[i] = null;
    hrmarker3[i] = null;
    hrmarker4[i] = null;
    hrmarkerc[i] = null;

    // Hand L helper
    hlm1_pos[i], hlm2_pos[i], hlm3_pos[i], hlm4_pos[i];
    hlmc_pos[i];
    hlmc_x[i], hlmc_y[i], hlmc_z[i];

    // Hand L Marker Lines
    hlinegeol[i];
    hlline[i];

    // Hand R helper
    hrm1_pos[i], hrm2_pos[i], hrm3_pos[i], hrm4_pos[i];
    hrmc_pos[i];
    hrmc_x[i], hrmc_y[i], hrmc_z[i];

    // Hand R Marker Lines
    hlinegeor[i];
    hrline[i];

    // // GlassesHand L Marker Lines
    // ghlinegeol[i];
    // ghlinel[i];
    //
    // // GlassesHand R Marker Lines
    // ghlinegeor[i];
    // ghliner[i];

    // PointHand L Marker Lines
    gplinegeol[i];
    gplinel[i];

    // PointHand R Marker Lines
    gplinegeor[i];
    gpliner[i];
}

// Targets
var tmarker1 = [];
var tmarker2 = [];
var tmarker3 = [];
var tmarker4 = [];
var tmarkerc = [];
var tm1_pos = [];
var tm2_pos = [];
var tm3_pos = [];
var tm4_pos = [];
var tmc_pos = [];
var tmc_x = [];
var tmc_y = [];
var tmc_z = [];
var tlinegeo = [];
var tline = [];

for (var i = 1; i <= targets_num; i++) {
    tmarker1[i] = null;
    tmarker2[i] = null;
    tmarker3[i] = null;
    tmarker4[i] = null;
    tmarkerc[i] = null;

    // Target helper
    tm1_pos[i], tm2_pos[i], tm3_pos[i], tm4_pos[i];
    tmc_pos[i];
    tmc_x[i], tmc_y[i], tmc_z[i];

    // Target Marker Lines
    tlinegeo[i];
    tline[i];
}

// Tables
var tabmarker1 = [];
var tabmarker2 = [];
var tabmarker3 = [];
var tabmarker4 = [];
var tabmarkerc = [];
var tabm1_pos = [];
var tabm2_pos = [];
var tabm3_pos = [];
var tabm4_pos = [];
var tabmc_pos = [];
var tabmc_x = [];
var tabmc_y = [];
var tabmc_z = [];
var tablinegeo = [];
var tabline = [];

for (var i = 1; i <= tables_num; i++) {
    tabmarker1[i] = null;
    tabmarker2[i] = null;
    tabmarker3[i] = null;
    tabmarker4[i] = null;
    tabmarkerc[i] = null;

    // Table helper
    tabm1_pos[i], tabm2_pos[i], tabm3_pos[i], tabm4_pos[i];
    tabmc_pos[i];
    tabmc_x[i], tabmc_y[i], tabmc_z[i];

    // Table Marker Lines
    tablinegeo[i];
    tabline[i];
}

// Furhat
var fmarker1 = null;
var fmarker2 = null;
var fmarker3 = null;
var fmarker4 = null;
var fmarkerc = null;

// Furhat helper
var fm1_pos, fm2_pos, fm3_pos, fm4_pos;
var fmc_pos;
var fmc_x, fmc_y, fmc_z;

// Furhat Marker Lines
var flinegeo;
var fline;

// Calibration
var cmarker1 = null;
var cmarker2 = null;
var cmarker3 = null;
var cmarker4 = null;
var cmarkerc = null;

// Calibration helper
var cm1_pos, cm2_pos, cm3_pos, cm4_pos;
var cmc_pos;
var cmc_x, cmc_y, cmc_z;

// Calibration Marker Lines
var clinegeo;
var cline;

// Screen
var smarker1 = null;
var smarker2 = null;
var smarker3 = null;
var smarker4 = null;
var smarkerc = null;

// Screen helper
var sm1_pos, sm2_pos, sm3_pos, sm4_pos;
var smc_pos;
var smc_x, smc_y, smc_z;

// Screen Marker Lines
var slinegeo;
var sline;

// Floor
var floorMat;

// Helper variables
var running = true;
var previousShadowMap = false;
var framesPerSecond = 50; // max 60
var stats;

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
var ws = new WebSocket('ws://' + ipvis + ':8080/');
ws.onopen = function() {
    console.log('CONNECT');
};
ws.onclose = function() {
    console.log('DISCONNECT');
    running = false;
};

window.onload = initScene();
