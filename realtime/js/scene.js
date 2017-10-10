// Initialising the scene
initScene = function() {
    // Initialising WebGL
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.physicallyCorrectLights = true;
    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    var container = document.getElementById('container');
    container.appendChild(renderer.domElement);

    // Define stats.js
    stats = new Stats();
    stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    document.body.appendChild(stats.dom);

    // Initialising Scene
    scene = new THREE.Scene;

    // Camera definition
    camera = new THREE.PerspectiveCamera(
        25, // Field of view
        window.innerWidth / window.innerHeight, // Aspect ratio
        0.1, // Near
        100 // Far
    );
    camera.position.set(-3, 3, -2);
    camera.lookAt(scene.position);
    scene.add(camera);

    // Initialise lights
    var bulbGeometry = new THREE.SphereGeometry(0.02, 16, 8);
    bulbLight = new THREE.PointLight(0xffee88, 1, 100, 2);

    bulbMat = new THREE.MeshStandardMaterial( {
        emissive: 0xffffee,
        emissiveIntensity: 1,
        color: 0x000000
    });
    bulbLight.add(new THREE.Mesh(bulbGeometry, bulbMat));
    // The light is 2 meters minus 0.78 (the height of the table)
    bulbLight.position.set(0, 1.22, 0);
    bulbLight.castShadow = true;
    scene.add(bulbLight);

    hemiLight = new THREE.HemisphereLight(0xddeeff, 0x0f0e0d, 0.02);
    scene.add(hemiLight);

    // Object definition
    // Define Floor
    floorMat = new THREE.MeshStandardMaterial( {
        roughness: 0.8,
        color: 0xffffff,
        metalness: 0.2,
        bumpScale: 0.0005,
    });
    var textureLoader = new THREE.TextureLoader();
    textureLoader.load("textures/hardwood2_diffuse.jpg", function(map) {
        map.wrapS = THREE.RepeatWrapping;
        map.wrapT = THREE.RepeatWrapping;
        map.anisotropy = 4;
        map.repeat.set(10, 24);
        floorMat.map = map;
        floorMat.needsUpdate = true;
    });

    // Add Floor
    var floorGeometry = new THREE.PlaneBufferGeometry(5, 6); // dimensions
    var floorMesh = new THREE.Mesh(floorGeometry, floorMat);
    floorMesh.receiveShadow = true;
    // The floor is minus 0.78 (the height of the table)
    floorMesh.position.set(0, -0.78, 0); // position
    floorMesh.rotation.x = -Math.PI / 2.0;
    scene.add(floorMesh);

    // Add app images
    // marker1 (top right): 0.052582	0.030279	0.889596
    // marker2 (bottom right): -0.474992	0.029005	0.888369
    // marker3 (bottom left): -0.477954	0.027106	-0.051085
    // marker4 (top left): 0.051298	0.026969	-0.049968
    // middle top: 0.051, 0.028, 0.420
    // middle bottom: -0.475, 0.028, 0.418
    // screen centre: -0.212, 0.028, 0.419
    // rotation: -0.000, -0.002, -0.000, -0.999
    //img.position.set(-0.215, 0.01, 0.42); //initial position

    // Black screen
    img1.position.set(-0.212, 0, 0.419);
    img1.rotation.y = 1.57;
    //scene.add(img1);

    // Empty flat screen
    img2.position.set(-0.212, 0, 0.419);
    img2.rotation.y = 1.57;

    // Bathroom screen
    img3.position.set(-0.212, 0, 0.419);
    img3.rotation.y = 1.57;

    // Bedroom screen
    img4.position.set(-0.212, 0, 0.419);
    img4.rotation.y = 1.57;

    // Kitchen screen
    img5.position.set(-0.212, 0, 0.419);
    img5.rotation.y = 1.57;

    // Living room screen
    img6.position.set(-0.212, 0, 0.419);
    img6.rotation.y = 1.57;

    // Misc screen
    img7.position.set(-0.212, 0, 0.419);
    img7.rotation.y = 1.57;

    // Rugs screen
    img8.position.set(-0.212, 0, 0.419);
    img8.rotation.y = 1.57;

    // Text 1
    text1.style.position = 'absolute';
    text1.style.width = 100;
    text1.style.height = 100;
    text1.style.backgroundColor = "yellow";
    text1.style.top = 10 + 'px';
    text1.style.left = 100 + 'px';

    // Text 2
    text2.style.position = 'absolute';
    text2.style.width = 100;
    text2.style.height = 100;
    text2.style.backgroundColor = "yellow";
    text2.style.top = 40 + 'px';
    text2.style.left = 100 + 'px';

    // Text 3
    text3.style.position = 'absolute';
    text3.style.width = 100;
    text3.style.height = 100;
    text3.style.backgroundColor = "yellow";
    text3.style.top = 70 + 'px';
    text3.style.left = 100 + 'px';

    // Text 4
    text4.style.position = 'absolute';
    text4.style.width = 100;
    text4.style.height = 100;
    text4.style.backgroundColor = "yellow";
    text4.style.top = 100 + 'px';
    text4.style.left = 100 + 'px';

    // Text 5
    text5.style.position = 'absolute';
    text5.style.width = 100;
    text5.style.height = 100;
    text5.style.backgroundColor = "white";
    text5.style.top = 130 + 'px';
    text5.style.left = 100 + 'px';

    // Text 6
    text6.style.position = 'absolute';
    text6.style.width = 100;
    text6.style.height = 100;
    text6.style.backgroundColor = "white";
    text6.style.top = 160 + 'px';
    text6.style.left = 100 + 'px';

    // Text 7
    text7.style.position = 'absolute';
    text7.style.width = 100;
    text7.style.height = 100;
    text7.style.backgroundColor = "white";
    text7.style.top = 190 + 'px';
    text7.style.left = 100 + 'px';

    // Glasses markers
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    var dotMaterial = new THREE.PointsMaterial({size: 5, sizeAttenuation: false, color: 0xFF3300});
    g1marker1 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(g1marker1);
    g1marker2 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(g1marker2);
    g1marker3 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(g1marker3);
    g1marker4 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(g1marker4);
    g1markerc = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(g1markerc);
    g2marker1 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(g2marker1);
    g2marker2 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(g2marker2);
    g2marker3 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(g2marker3);
    g2marker4 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(g2marker4);
    g2markerc = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(g2markerc);
    g3marker1 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(g3marker1);
    g3marker2 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(g3marker2);
    g3marker3 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(g3marker3);
    g3marker4 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(g3marker4);
    g3markerc = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(g3markerc);

    // Glasses marker line
    var glinematerial1 = new THREE.LineBasicMaterial({
        color: 0xFFFFFF,
        linewidth: 4 //this does not work at the moment
    });
    var glinematerial2 = new THREE.LineBasicMaterial({
        color: 0x000000
    });
    var glinematerial3 = new THREE.LineBasicMaterial({
        color: 0x0000ff
    });
    glinegeo1 = new THREE.Geometry();
    glinegeo1.vertices.push(new THREE.Vector3(0, 0, 0));
    glinegeo1.vertices.push(new THREE.Vector3(0, 0, 0));
    glinegeo1.vertices.push(new THREE.Vector3(0, 0, 0));
    glinegeo1.vertices.push(new THREE.Vector3(0, 0, 0));
    glinegeo1.vertices.push(new THREE.Vector3(0, 0, 0));
    glinegeo2 = new THREE.Geometry();
    glinegeo2.vertices.push(new THREE.Vector3(0, 0, 0));
    glinegeo2.vertices.push(new THREE.Vector3(0, 0, 0));
    glinegeo2.vertices.push(new THREE.Vector3(0, 0, 0));
    glinegeo2.vertices.push(new THREE.Vector3(0, 0, 0));
    glinegeo2.vertices.push(new THREE.Vector3(0, 0, 0));
    glinegeo3 = new THREE.Geometry();
    glinegeo3.vertices.push(new THREE.Vector3(0, 0, 0));
    glinegeo3.vertices.push(new THREE.Vector3(0, 0, 0));
    glinegeo3.vertices.push(new THREE.Vector3(0, 0, 0));
    glinegeo3.vertices.push(new THREE.Vector3(0, 0, 0));
    glinegeo3.vertices.push(new THREE.Vector3(0, 0, 0));
    g1line = new THREE.Line(glinegeo1, glinematerial1);
    scene.add(g1line);
    g2line = new THREE.Line(glinegeo2, glinematerial2);
    scene.add(g2line);
    g3line = new THREE.Line(glinegeo3, glinematerial3);
    scene.add(g3line);

    // Right Hand 1 markers
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    var dotMaterial = new THREE.PointsMaterial({size: 5, sizeAttenuation: false, color: 0xFF3300});
    rh1marker1 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(rh1marker1);
    rh1marker2 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(rh1marker2);
    rh1marker3 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(rh1marker3);
    rh1marker4 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(rh1marker4);

    // Left Hand 1 markers
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    var dotMaterial = new THREE.PointsMaterial({size: 5, sizeAttenuation: false, color: 0xFF3300});
    lh1marker1 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(lh1marker1);
    lh1marker2 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(lh1marker2);
    lh1marker3 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(lh1marker3);
    lh1marker4 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(lh1marker4);

    // Right Hand 2 markers
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    var dotMaterial = new THREE.PointsMaterial({size: 5, sizeAttenuation: false, color: 0xFF3300});
    rh2marker1 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(rh2marker1);
    rh2marker2 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(rh2marker2);
    rh2marker3 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(rh2marker3);
    rh2marker4 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(rh2marker4);

    // Left Hand 2 markers
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    var dotMaterial = new THREE.PointsMaterial({size: 5, sizeAttenuation: false, color: 0xFF3300});
    lh2marker1 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(lh2marker1);
    lh2marker2 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(lh2marker2);
    lh2marker3 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(lh2marker3);
    lh2marker4 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(lh2marker4);

    // Hands marker line
    var hlinematerial1 = new THREE.LineBasicMaterial({
        color: 0x000000
    });
    var hlinematerial2 = new THREE.LineBasicMaterial({
        color: 0x0000ff
    });
    lh1linegeo = new THREE.Geometry();
    lh1linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    lh1linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    lh1linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    lh1linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    lh1linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    rh1linegeo = new THREE.Geometry();
    rh1linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    rh1linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    rh1linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    rh1linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    rh1linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    lh2linegeo = new THREE.Geometry();
    lh2linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    lh2linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    lh2linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    lh2linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    lh2linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    rh2linegeo = new THREE.Geometry();
    rh2linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    rh2linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    rh2linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    rh2linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    rh2linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    rh1line = new THREE.Line(rh1linegeo, hlinematerial1);
    scene.add(rh1line);
    lh1line = new THREE.Line(lh1linegeo, hlinematerial1);
    scene.add(lh1line);
    rh2line = new THREE.Line(rh2linegeo, hlinematerial2);
    scene.add(rh2line);
    lh2line = new THREE.Line(lh2linegeo, hlinematerial2);
    scene.add(lh2line);

    // Screen markers
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    var dotMaterial = new THREE.PointsMaterial({size: 5, sizeAttenuation: false, color: 0xFF3300});
    smarker1 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(smarker1);
    smarker2 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(smarker2);
    smarker3 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(smarker3);
    smarker4 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(smarker4);

    // Screen marker line
    var slinematerial = new THREE.LineBasicMaterial({
        color: 0xFFCC00
    });
    slinegeo = new THREE.Geometry();
    slinegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    slinegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    slinegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    slinegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    slinegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    sline = new THREE.Line(slinegeo, slinematerial);
    scene.add(sline);

    // GP3 markers
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    var dotMaterial = new THREE.PointsMaterial({size: 5, sizeAttenuation: false, color: 0xFF3300});
    gp3marker1 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(gp3marker1);
    gp3marker2 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(gp3marker2);
    gp3marker3 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(gp3marker3);

    // GP3 marker line
    var gp3linematerial = new THREE.LineBasicMaterial({
        color: 0xCC0000
    });
    gp3linegeo1 = new THREE.Geometry();
    gp3linegeo1.vertices.push(new THREE.Vector3(0, 0, 0));
    gp3linegeo1.vertices.push(new THREE.Vector3(0, 0, 0));
    gp3linegeo2 = new THREE.Geometry();
    gp3linegeo2.vertices.push(new THREE.Vector3(0, 0, 0));
    gp3linegeo2.vertices.push(new THREE.Vector3(0, 0, 0));
    gp3linegeo3 = new THREE.Geometry();
    gp3linegeo3.vertices.push(new THREE.Vector3(0, 0, 0));
    gp3linegeo3.vertices.push(new THREE.Vector3(0, 0, 0));
    gp3line1 = new THREE.Line(gp3linegeo1, gp3linematerial);
    scene.add(gp3line1);
    gp3line2 = new THREE.Line(gp3linegeo2, gp3linematerial);
    scene.add(gp3line2);
    gp3line3 = new THREE.Line(gp3linegeo3, gp3linematerial);
    scene.add(gp3line3);

    // Camera movement
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();

    // Resize window
    window.addEventListener('resize', onWindowResize, false);

    // GUI
    var gui = new dat.GUI();

    gui.add(params, 'hemiIrradiance', Object.keys(hemiLuminousIrradiances));
    gui.add(params, 'bulbPower', Object.keys(bulbLuminousPowers));
    gui.add(params, 'exposure', 0, 1);
    gui.add(params, 'shadows');
    gui.open();

    // Call the parsing function and the callback for position data
    parsePositionData("data/recordings/rec12/output/rec12_data" + filevis + ".csv", positionDataHandler);

    // Call the parsing function and the callback for ASR data
    parseASRData("data/recordings/rec12/asr/rec12.csv", asrDataHandler);

    // Call the parsing function and the callback for App data
    parseAppData("data/recordings/rec12/app/rec12_final.csv", appDataHandler);

    // Call the parsing function and the callback for Furniture data
    parseFurnitureData("data/recordings/rec12/app/furniture.csv", furnitureDataHandler);

    requestAnimationFrame(render);
};
