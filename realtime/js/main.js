'use strict';

if (!Detector.webgl)
    Detector.addGetWebGLMessage();

// Scene definition
var initScene, render, renderer, scene, camera;
var bulbLight, bulbMat, hemiLight, object;
var clock = new THREE.Clock();

// Object definition
// Glasses
var g1marker1 = null;
var g1marker2 = null;
var g1marker3 = null;
var g1marker4 = null;
var g1markerc = null;

// Gp3
var gp3marker1 = null;

// Floor
var floorMat;

// Helper variables
var running = true;
var timetostart = startvis;
var previousShadowMap = false;
var framesPerSecond = 60; // max 60
var stats;

// Tobii Glasses 1 helper
var g1m1_pos, g1m2_pos, g1m3_pos, g1m4_pos;
var g1mc_pos;
var g1mc_x, g1mc_y, g1mc_z;

// Glasses Marker Lines
var glinegeo1;
var g1line;

// GP3
var gp3_pos1;

// GP3 Marker Lines
var gp3linegeo1;
var gp3line1;

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

// Read asr data from csv file
function parseASRData(dataLocation, callBack) {
    Papa.parse(dataLocation, {
        download: true,
        dynamicTyping: true,
        delimeter: "",
        complete: function(results) {
            // When data is parsed
            console.log("ASR data parsed!")
            callBack(results.data);
        }
    });
}

var csvASRData;
function asrDataHandler(data) {
    // CSV ASR Data is usable here
    csvASRData = data;
}

// Read app data from csv file
function parseAppData(dataLocation, callBack) {
    Papa.parse(dataLocation, {
        download: true,
        dynamicTyping: true,
        delimeter: "",
        complete: function(results) {
            // When data is parsed
            console.log("App data parsed!")
            callBack(results.data);
        }
    });
}

var csvAppData;
function appDataHandler(data) {
    // CSV App Data is usable here
    csvAppData = data;
}

// Read furniture data from csv file
function parseFurnitureData(dataLocation, callBack) {
    Papa.parse(dataLocation, {
        download: true,
        dynamicTyping: true,
        delimeter: "",
        complete: function(results) {
            // When data is parsed
            console.log("Furniture data parsed!")
            callBack(results.data);
        }
    });
}

var csvFurnitureData;
function furnitureDataHandler(data) {
    // CSV Furniture Data is usable here
    csvFurnitureData = data;
}

window.onload = initScene();
