'use strict';

if (!Detector.webgl)
    Detector.addGetWebGLMessage();

// Scene definition
var initScene, render, renderer, scene, camera;
var bulbLight, bulbMat, hemiLight, object;
var clock = new THREE.Clock();

// Text definition
var text1 = document.createElement('div');
var text2 = document.createElement('div');
var text3 = document.createElement('div');
var text4 = document.createElement('div');
var text5 = document.createElement('div');
var text6 = document.createElement('div');
var text7 = document.createElement('div');

// Define image array
var img = new Array(700);

// Object definition
// Glasses
var g1marker1 = null;
var g1marker2 = null;
var g1marker3 = null;
var g1marker4 = null;
var g1markerc = null;
var g2marker1 = null;
var g2marker2 = null;
var g2marker3 = null;
var g2marker4 = null;
var g2markerc = null;
var g3marker1 = null;
var g3marker2 = null;
var g3marker3 = null;
var g3marker4 = null;
var g3markerc = null;

// Gp3
var gp3marker1 = null;
var gp3marker2 = null;
var gp3marker3 = null;

// Rectangles
var r1marker1 = null;
var r1marker2 = null;
var r1marker3 = null;
var r1marker4 = null;
var r2marker1 = null;
var r2marker2 = null;
var r2marker3 = null;
var r2marker4 = null;
var r3marker1 = null;
var r3marker2 = null;
var r3marker3 = null;
var r3marker4 = null;
var r4marker1 = null;
var r4marker2 = null;
var r4marker3 = null;
var r4marker4 = null;
var r5marker1 = null;
var r5marker2 = null;
var r5marker3 = null;
var r5marker4 = null;
var r6marker1 = null;
var r6marker2 = null;
var r6marker3 = null;
var r6marker4 = null;
var r7marker1 = null;
var r7marker2 = null;
var r7marker3 = null;
var r7marker4 = null;
var r8marker1 = null;
var r8marker2 = null;
var r8marker3 = null;
var r8marker4 = null;

// Floor
var floorMat;

// Helper variables
var running = true;
var timetostart = startvis;
var timetoend = endvis;
var csv_frame = timetostart * 50;
var index_frame = csv_frame + 5;
var framelimit = timetoend * 50;
var previousShadowMap = false;
var framesPerSecond = 60; // max 60
var stats;

// Tobii Glasses 1 helper
var g1m1_pos, g1m2_pos, g1m3_pos, g1m4_pos;
var g1mc_pos;
var g1mc_x, g1mc_y, g1mc_z;

// Tobii Glasses 2 helper
var g2m1_pos, g2m2_pos, g2m3_pos, g2m4_pos;
var g2mc_pos;
var g2mc_x, g2mc_y, g2mc_z;

// Tobii Glasses 3 helper
var g3m1_pos, g3m2_pos, g3m3_pos, g3m4_pos;
var g3mc_pos;
var g3mc_x, g3mc_y, g3mc_z;

// Glasses Marker Lines
var glinegeo1;
var glinegeo2;
var glinegeo3;
var g1line;
var g2line;
var g3line;

// GP3
var gp3_pos1;
var gp3_pos2;
var gp3_pos3;

// GP3 Marker Lines
var gp3linegeo1;
var gp3linegeo2;
var gp3linegeo3;
var gp3line1;
var gp3line2;
var gp3line3;

// Rectangles
var r1m1_pos, r1m2_pos, r1m3_pos, r1m4_pos;
var r2m1_pos, r2m2_pos, r2m3_pos, r2m4_pos;
var r3m1_pos, r3m2_pos, r3m3_pos, r3m4_pos;
var r4m1_pos, r4m2_pos, r4m3_pos, r4m4_pos;
var r5m1_pos, r5m2_pos, r5m3_pos, r5m4_pos;
var r6m1_pos, r6m2_pos, r6m3_pos, r6m4_pos;
var r7m1_pos, r7m2_pos, r7m3_pos, r7m4_pos;
var r8m1_pos, r8m2_pos, r8m3_pos, r8m4_pos;

// Rectangles Marker Lines
var r1line, r1linegeo;
var r2line, r2linegeo;
var r3line, r3linegeo;
var r4line, r4linegeo;
var r5line, r5linegeo;
var r6line, r6linegeo;
var r7line, r7linegeo;
var r8line, r8linegeo;

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

// Read position data from csv file
function parsePositionData(dataLocation, callBack) {
    Papa.parse(dataLocation, {
        download: true,
        dynamicTyping: true,
        delimeter: "",
        complete: function(results) {
            // When data is parsed
            console.log("Position data parsed!")
            callBack(results.data);
        }
    });
}

var csvData;
function positionDataHandler(data) {
    // CSV Position Data is usable here
    csvData = data;
}

window.onload = initScene();
