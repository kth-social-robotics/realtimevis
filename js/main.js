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
//var img = new Array(csvAppData.length-2);
var img = new Array(700);

// App screen definition
var cur_screen = "";
// Black screen
var imgloader1 = new THREE.TextureLoader();
var texture1 = imgloader1.load('textures/black.png');
var imgmaterial1 = new THREE.MeshPhongMaterial({map: texture1});
// Screen size: 42,5 inches, 53x94
var imggeometry1 = new THREE.CubeGeometry(0.94, 0.001, 0.53);
var img1 = new THREE.Mesh(imggeometry1, imgmaterial1);

if (appvis == 'yes'){
// Empty flat
var imgloader2 = new THREE.TextureLoader();
var texture2 = imgloader2.load('textures/flat.png');
var imgmaterial2 = new THREE.MeshPhongMaterial({map: texture2});
// Screen size: 42,5 inches, 94x53, 2048x1024 (on webgl), 1920x1080 (original), divide width with: 2042, divide height with 2037
var imggeometry2 = new THREE.CubeGeometry(0.94, 0.001, 0.53);
var img2 = new THREE.Mesh(imggeometry2, imgmaterial2);

// Bathroom
var imgloader3 = new THREE.TextureLoader();
var texture3 = imgloader3.load('textures/bathroom.png');
var imgmaterial3 = new THREE.MeshPhongMaterial({map: texture3});
// Screen size: 42,5 inches, 53x94
var imggeometry3 = new THREE.CubeGeometry(0.94, 0.001, 0.53);
var img3 = new THREE.Mesh(imggeometry3, imgmaterial3);

// Bedroom
var imgloader4 = new THREE.TextureLoader();
var texture4 = imgloader4.load('textures/bedroom.png');
var imgmaterial4 = new THREE.MeshPhongMaterial({map: texture4});
// Screen size: 42,5 inches, 53x94
var imggeometry4 = new THREE.CubeGeometry(0.94, 0.001, 0.53);
var img4 = new THREE.Mesh(imggeometry4, imgmaterial4);

// Kitchen
var imgloader5 = new THREE.TextureLoader();
var texture5 = imgloader5.load('textures/kitchen.png');
var imgmaterial5 = new THREE.MeshPhongMaterial({map: texture5});
// Screen size: 42,5 inches, 53x94
var imggeometry5 = new THREE.CubeGeometry(0.94, 0.001, 0.53);
var img5 = new THREE.Mesh(imggeometry5, imgmaterial5);

// Living room
var imgloader6 = new THREE.TextureLoader();
var texture6 = imgloader6.load('textures/livingroom.png');
var imgmaterial6 = new THREE.MeshPhongMaterial({map: texture6});
// Screen size: 42,5 inches, 53x94
var imggeometry6 = new THREE.CubeGeometry(0.94, 0.001, 0.53);
var img6 = new THREE.Mesh(imggeometry6, imgmaterial6);

// Misc
var imgloader7 = new THREE.TextureLoader();
var texture7 = imgloader7.load('textures/misc.png');
var imgmaterial7 = new THREE.MeshPhongMaterial({map: texture7});
// Screen size: 42,5 inches, 53x94
var imggeometry7 = new THREE.CubeGeometry(0.94, 0.001, 0.53);
var img7 = new THREE.Mesh(imggeometry7, imgmaterial7);

// Rugs
var imgloader8 = new THREE.TextureLoader();
var texture8 = imgloader8.load('textures/rugs.png');
var imgmaterial8 = new THREE.MeshPhongMaterial({map: texture8});
// Screen size: 42,5 inches, 53x94
var imggeometry8 = new THREE.CubeGeometry(0.94, 0.001, 0.53);
var img8 = new THREE.Mesh(imggeometry8, imgmaterial8);
}

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

// Hands
var rh1marker1 = null;
var rh1marker2 = null;
var rh1marker3 = null;
var rh1marker4 = null;
var lh1marker1 = null;
var lh1marker2 = null;
var lh1marker3 = null;
var lh1marker4 = null;
var rh2marker1 = null;
var rh2marker2 = null;
var rh2marker3 = null;
var rh2marker4 = null;
var lh2marker1 = null;
var lh2marker2 = null;
var lh2marker3 = null;
var lh2marker4 = null;

// Screen
var smarker = null;
var smarker1 = null;
var smarker2 = null;
var smarker3 = null;
var smarker4 = null;

// Gp3
var gp3marker1 = null;
var gp3marker2 = null;
var gp3marker3 = null;

// Headpose
if (headposevis == 'yes'){
    var hpmarker1 = null;
    var hpmarker2 = null;
    var hpmarker3 = null;
}

// Reference plain
if (refvis == '1'){
    var refmarker1 = null;
    var refmarker2 = null;
    var refmarker3 = null;
    var refmarker4 = null;
    var refmarkerc = null;
}

// Floor
var floorMat;

// Helper variables
var running = true;
var timetostart = startvis;
var timetoend = endvis;
var csv_frame = timetostart * 120;
var index_frame = csv_frame + 5;
var framelimit = timetoend * 120;
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

// Gloves helper
var rh1m1_pos, rh1m2_pos, rh1m3_pos, rh1m4_pos;
var lh1m1_pos, lh1m2_pos, lh1m3_pos, lh1m4_pos;
var rh2m1_pos, rh2m2_pos, rh2m3_pos, rh2m4_pos;
var lh2m1_pos, lh2m2_pos, lh2m3_pos, lh2m4_pos;

// Screen helper
var sm_pos, sm1_pos, sm2_pos, sm3_pos, sm4_pos;

// Gloves Marker Lines
var lh1linegeo;
var rh1linegeo;
var lh2linegeo;
var rh2linegeo;
var rh1line;
var lh1line;
var rh2line;
var lh2line;

// Screen Marker Line
var sline;
var slinegeo;

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

// Headpose helper and marker lines
if (headposevis == 'yes'){
    var hp_pos1;
    var hp_pos2;
    var hp_pos3;

    var hplinegeo1;
    var hplinegeo2;
    var hplinegeo3;
    var hpline1;
    var hpline2;
    var hpline3;
}

// Refpoint marker lines
if (refvis == '1'){
    // var reflinegeo1;
    // var reflinegeo2;
    // var reflinegeo3;
    // var refline1;
    // var refline2;
    // var refline3;

    var ref_pos1;
    var ref_pos2;
    var ref_pos3;
    var ref_pos4;
    var ref_posc;

    var reflinegeo;
    var refclinegeo;
    var refline;
    var refcline;
}

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
