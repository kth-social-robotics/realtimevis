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
    camera.position.set(-8, 5, -2);
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
    bulbLight.position.set(0, 2, 0);
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
    floorMesh.position.set(0, 0, 0); // position
    floorMesh.rotation.x = -Math.PI / 2.0;
    scene.add(floorMesh);

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
        linewidth: 3
    });
    var glinematerial2 = new THREE.LineBasicMaterial({
        color: 0x000000,
        linewidth: 3
    });
    var glinematerial3 = new THREE.LineBasicMaterial({
        color: 0x0000ff,
        linewidth: 3
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
        color: 0xCC0000,
        linewidth: 3
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

    // Rectangle 1 markers
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    var dotMaterial = new THREE.PointsMaterial({size: 5, sizeAttenuation: false, color: 0xFF3300});
    r1marker1 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(r1marker1);
    r1marker2 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(r1marker2);
    r1marker3 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(r1marker3);
    r1marker4 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(r1marker4);

    // Rectangle 1 marker line
    var rlinematerial = new THREE.LineBasicMaterial({
        color: 0xFFCC00,
        linewidth: 3
    });
    r1linegeo = new THREE.Geometry();
    r1linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    r1linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    r1linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    r1linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    r1linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    r1line = new THREE.Line(r1linegeo, rlinematerial);
    scene.add(r1line);

    // Rectangle 2 markers
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    var dotMaterial = new THREE.PointsMaterial({size: 5, sizeAttenuation: false, color: 0xFF3300});
    r2marker1 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(r2marker1);
    r2marker2 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(r2marker2);
    r2marker3 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(r2marker3);
    r2marker4 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(r2marker4);

    // Rectangle 2 marker line
    var rlinematerial = new THREE.LineBasicMaterial({
        color: 0xFFCC00,
        linewidth: 3
    });
    r2linegeo = new THREE.Geometry();
    r2linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    r2linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    r2linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    r2linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    r2linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    r2line = new THREE.Line(r2linegeo, rlinematerial);
    scene.add(r2line);

    // Rectangle 3 markers
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    var dotMaterial = new THREE.PointsMaterial({size: 5, sizeAttenuation: false, color: 0xFF3300});
    r3marker1 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(r3marker1);
    r3marker2 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(r3marker2);
    r3marker3 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(r3marker3);
    r3marker4 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(r3marker4);

    // Rectangle 3 marker line
    var rlinematerial = new THREE.LineBasicMaterial({
        color: 0xFFCC00,
        linewidth: 3
    });
    r3linegeo = new THREE.Geometry();
    r3linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    r3linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    r3linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    r3linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    r3linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    r3line = new THREE.Line(r3linegeo, rlinematerial);
    scene.add(r3line);

    // Rectangle 4 markers
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    var dotMaterial = new THREE.PointsMaterial({size: 5, sizeAttenuation: false, color: 0xFF3300});
    r4marker1 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(r4marker1);
    r4marker2 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(r4marker2);
    r4marker3 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(r4marker3);
    r4marker4 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(r4marker4);

    // Rectangle 4 marker line
    var rlinematerial = new THREE.LineBasicMaterial({
        color: 0xFFCC00,
        linewidth: 3
    });
    r4linegeo = new THREE.Geometry();
    r4linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    r4linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    r4linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    r4linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    r4linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    r4line = new THREE.Line(r4linegeo, rlinematerial);
    scene.add(r4line);

    // Rectangle 5 markers
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    var dotMaterial = new THREE.PointsMaterial({size: 5, sizeAttenuation: false, color: 0xFF3300});
    r5marker1 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(r5marker1);
    r5marker2 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(r5marker2);
    r5marker3 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(r5marker3);
    r5marker4 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(r5marker4);

    // Rectangle 5 marker line
    var rlinematerial = new THREE.LineBasicMaterial({
        color: 0xFFCC00,
        linewidth: 3
    });
    r5linegeo = new THREE.Geometry();
    r5linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    r5linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    r5linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    r5linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    r5linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    r5line = new THREE.Line(r5linegeo, rlinematerial);
    scene.add(r5line);

    // Rectangle 6 markers
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    var dotMaterial = new THREE.PointsMaterial({size: 5, sizeAttenuation: false, color: 0xFF3300});
    r6marker1 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(r6marker1);
    r6marker2 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(r6marker2);
    r6marker3 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(r6marker3);
    r6marker4 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(r6marker4);

    // Rectangle 6 marker line
    var rlinematerial = new THREE.LineBasicMaterial({
        color: 0xFFCC00,
        linewidth: 3
    });
    r6linegeo = new THREE.Geometry();
    r6linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    r6linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    r6linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    r6linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    r6linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    r6line = new THREE.Line(r6linegeo, rlinematerial);
    scene.add(r6line);

    // Rectangle 7 markers
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    var dotMaterial = new THREE.PointsMaterial({size: 5, sizeAttenuation: false, color: 0xFF3300});
    r7marker1 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(r7marker1);
    r7marker2 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(r7marker2);
    r7marker3 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(r7marker3);
    r7marker4 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(r7marker4);

    // Rectangle 7 marker line
    var rlinematerial = new THREE.LineBasicMaterial({
        color: 0xFFCC00,
        linewidth: 3
    });
    r7linegeo = new THREE.Geometry();
    r7linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    r7linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    r7linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    r7linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    r7linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    r7line = new THREE.Line(r7linegeo, rlinematerial);
    scene.add(r7line);

    // Rectangle 8 markers
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    var dotMaterial = new THREE.PointsMaterial({size: 5, sizeAttenuation: false, color: 0xFF3300});
    r8marker1 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(r8marker1);
    r8marker2 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(r8marker2);
    r8marker3 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(r8marker3);
    r8marker4 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(r8marker4);

    // Rectangle 8 marker line
    var rlinematerial = new THREE.LineBasicMaterial({
        color: 0xFFCC00,
        linewidth: 3
    });
    r8linegeo = new THREE.Geometry();
    r8linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    r8linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    r8linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    r8linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    r8linegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    r8line = new THREE.Line(r8linegeo, rlinematerial);
    scene.add(r8line);

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
    parsePositionData("data/recordings/" + recvis + "/output/" + recvis + "_data.csv", positionDataHandler);

    requestAnimationFrame(render);
};
