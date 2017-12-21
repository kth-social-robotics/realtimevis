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
        35, // Field of view
        2,
        0.5, // Near
        100 // Far
    );
    camera.position.set(5.5, 6, 4.2);
    //camera.lookAt(scene.position);
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
    bulbLight.position.set(-2, 2, 2);
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
    floorMesh.position.set(-2, 0, 2.5); // position
    floorMesh.rotation.x = -Math.PI / 2.0;
    scene.add(floorMesh);

    // Text 1
    text1.style.position = 'absolute';
    text1.style.width = 100;
    text1.style.height = 100;
    text1.style.backgroundColor = "yellow";
    text1.style.top = 10 + 'px';
    text1.style.left = 100 + 'px';

    // Glasses markers
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    var dotMaterial = new THREE.PointsMaterial({size: 5, sizeAttenuation: false, color: 0xFF3300});
    for (var i = 1; i <= glasses_num; i++) {
        gmarker1[i] = new THREE.Points(dotGeometry, dotMaterial);
        scene.add(gmarker1[i]);
        gmarker2[i] = new THREE.Points(dotGeometry, dotMaterial);
        scene.add(gmarker2[i]);
        gmarker3[i] = new THREE.Points(dotGeometry, dotMaterial);
        scene.add(gmarker3[i]);
        gmarker4[i] = new THREE.Points(dotGeometry, dotMaterial);
        scene.add(gmarker4[i]);
        gmarkerc[i] = new THREE.Points(dotGeometry, dotMaterial);
        scene.add(gmarkerc[i]);
    }

    // Glasses marker line
    var glinematerial = new THREE.LineBasicMaterial({
        color: 0xFFFFFF,
        linewidth: 3
    });
    for (var i = 1; i <= glasses_num; i++) {
        glinegeo[i] = new THREE.Geometry();
        glinegeo[i].vertices.push(new THREE.Vector3(0, 0, 0));
        glinegeo[i].vertices.push(new THREE.Vector3(0, 0, 0));
        glinegeo[i].vertices.push(new THREE.Vector3(0, 0, 0));
        glinegeo[i].vertices.push(new THREE.Vector3(0, 0, 0));
        glinegeo[i].vertices.push(new THREE.Vector3(0, 0, 0));
        gline[i] = new THREE.Line(glinegeo[i], glinematerial);
        scene.add(gline[i]);
    }

    // GP3 markers
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    var dotMaterial = new THREE.PointsMaterial({size: 5, sizeAttenuation: false, color: 0xFF3300});
    for (var i = 1; i <= glasses_num; i++) {
        gp3marker[i] = new THREE.Points(dotGeometry, dotMaterial);
        scene.add(gp3marker[i]);
    }

    // GP3 marker line
    var gp3linematerial = new THREE.LineBasicMaterial({
        color: 0xCC0000,
        linewidth: 3
    });
    for (var i = 1; i <= glasses_num; i++) {
        gp3linegeo[i] = new THREE.Geometry();
        gp3linegeo[i].vertices.push(new THREE.Vector3(0, 0, 0));
        gp3linegeo[i].vertices.push(new THREE.Vector3(0, 0, 0));
        gp3line[i] = new THREE.Line(gp3linegeo[i], gp3linematerial);
        scene.add(gp3line[i]);
    }

    // Head pose markers
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    var dotMaterial = new THREE.PointsMaterial({size: 5, sizeAttenuation: false, color: 0xFF3300});
    for (var i = 1; i <= glasses_num; i++) {
        hpmarker[i] = new THREE.Points(dotGeometry, dotMaterial);
        scene.add(hpmarker[i]);
    }

    // Head pose marker line
    var hplinematerial = new THREE.LineBasicMaterial({
        color: 0xFFFFFF,
        linewidth: 3
    });
    for (var i = 1; i <= glasses_num; i++) {
        hplinegeo[i] = new THREE.Geometry();
        hplinegeo[i].vertices.push(new THREE.Vector3(0, 0, 0));
        hplinegeo[i].vertices.push(new THREE.Vector3(0, 0, 0));
        hpline[i] = new THREE.Line(hplinegeo[i], hplinematerial);
        scene.add(hpline[i]);
    }

    // Hand L markers
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    var dotMaterial = new THREE.PointsMaterial({size: 5, sizeAttenuation: false, color: 0xFF3300});
    for (var i = 1; i <= gloves_num; i++) {
        hlmarker1[i] = new THREE.Points(dotGeometry, dotMaterial);
        scene.add(hlmarker1[i]);
        hlmarker2[i] = new THREE.Points(dotGeometry, dotMaterial);
        scene.add(hlmarker2[i]);
        hlmarker3[i] = new THREE.Points(dotGeometry, dotMaterial);
        scene.add(hlmarker3[i]);
        hlmarker4[i] = new THREE.Points(dotGeometry, dotMaterial);
        scene.add(hlmarker4[i]);
        hlmarkerc[i] = new THREE.Points(dotGeometry, dotMaterial);
        scene.add(hlmarkerc[i]);
    }

    // Hand L marker line
    var hlinemateriall = new THREE.LineBasicMaterial({
        color: 0xFFFFFF,
        linewidth: 3
    });
    for (var i = 1; i <= gloves_num; i++) {
        hlinegeol[i] = new THREE.Geometry();
        hlinegeol[i].vertices.push(new THREE.Vector3(0, 0, 0));
        hlinegeol[i].vertices.push(new THREE.Vector3(0, 0, 0));
        hlinegeol[i].vertices.push(new THREE.Vector3(0, 0, 0));
        hlinegeol[i].vertices.push(new THREE.Vector3(0, 0, 0));
        hlinegeol[i].vertices.push(new THREE.Vector3(0, 0, 0));
        hlline[i] = new THREE.Line(hlinegeol[i], hlinemateriall);
        scene.add(hlline[i]);
    }

    // Hand R markers
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    var dotMaterial = new THREE.PointsMaterial({size: 5, sizeAttenuation: false, color: 0xFF3300});
    for (var i = 1; i <= gloves_num; i++) {
        hrmarker1[i] = new THREE.Points(dotGeometry, dotMaterial);
        scene.add(hrmarker1[i]);
        hrmarker2[i] = new THREE.Points(dotGeometry, dotMaterial);
        scene.add(hrmarker2[i]);
        hrmarker3[i] = new THREE.Points(dotGeometry, dotMaterial);
        scene.add(hrmarker3[i]);
        hrmarker4[i] = new THREE.Points(dotGeometry, dotMaterial);
        scene.add(hrmarker4[i]);
        hrmarkerc[i] = new THREE.Points(dotGeometry, dotMaterial);
        scene.add(hrmarkerc[i]);
    }

    // Hand R marker line
    var hlinematerialr = new THREE.LineBasicMaterial({
        color: 0xFFFFFF,
        linewidth: 3
    });
    for (var i = 1; i <= gloves_num; i++) {
        hlinegeor[i] = new THREE.Geometry();
        hlinegeor[i].vertices.push(new THREE.Vector3(0, 0, 0));
        hlinegeor[i].vertices.push(new THREE.Vector3(0, 0, 0));
        hlinegeor[i].vertices.push(new THREE.Vector3(0, 0, 0));
        hlinegeor[i].vertices.push(new THREE.Vector3(0, 0, 0));
        hlinegeor[i].vertices.push(new THREE.Vector3(0, 0, 0));
        hrline[i] = new THREE.Line(hlinegeor[i], hlinematerialr);
        scene.add(hrline[i]);
    }

    // Glasses Hand L marker line
    var ghlinemateriall = new THREE.LineBasicMaterial({
        color: 0xFFFFFF,
        linewidth: 3
    });
    for (var i = 1; i <= gloves_num; i++) {
        ghlinegeol[i] = new THREE.Geometry();
        ghlinegeol[i].vertices.push(new THREE.Vector3(0, 0, 0));
        ghlinegeol[i].vertices.push(new THREE.Vector3(0, 0, 0));
        ghlinel[i] = new THREE.Line(ghlinegeol[i], ghlinemateriall);
        scene.add(ghlinel[i]);
    }

    // Glasses Hand R marker line
    var ghlinematerialr = new THREE.LineBasicMaterial({
        color: 0xFFFFFF,
        linewidth: 3
    });
    for (var i = 1; i <= gloves_num; i++) {
        ghlinegeor[i] = new THREE.Geometry();
        ghlinegeor[i].vertices.push(new THREE.Vector3(0, 0, 0));
        ghlinegeor[i].vertices.push(new THREE.Vector3(0, 0, 0));
        ghliner[i] = new THREE.Line(ghlinegeor[i], ghlinematerialr);
        scene.add(ghliner[i]);
    }

    // Target markers
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    var dotMaterial = new THREE.PointsMaterial({size: 5, sizeAttenuation: false, color: 0xFF3300});
    for (var i = 1; i <= targets_num; i++) {
        tmarker1[i] = new THREE.Points(dotGeometry, dotMaterial);
        scene.add(tmarker1[i]);
        tmarker2[i] = new THREE.Points(dotGeometry, dotMaterial);
        scene.add(tmarker2[i]);
        tmarker3[i] = new THREE.Points(dotGeometry, dotMaterial);
        scene.add(tmarker3[i]);
        tmarker4[i] = new THREE.Points(dotGeometry, dotMaterial);
        scene.add(tmarker4[i]);
        tmarkerc[i] = new THREE.Points(dotGeometry, dotMaterial);
        scene.add(tmarkerc[i]);
    }

    // Target marker line
    var tlinematerial = new THREE.LineBasicMaterial({
        color: 0x000000,
        linewidth: 3
    });
    for (var i = 1; i <= targets_num; i++) {
        tlinegeo[i] = new THREE.Geometry();
        tlinegeo[i].vertices.push(new THREE.Vector3(0, 0, 0));
        tlinegeo[i].vertices.push(new THREE.Vector3(0, 0, 0));
        tlinegeo[i].vertices.push(new THREE.Vector3(0, 0, 0));
        tlinegeo[i].vertices.push(new THREE.Vector3(0, 0, 0));
        tlinegeo[i].vertices.push(new THREE.Vector3(0, 0, 0));
        tline[i] = new THREE.Line(tlinegeo[i], tlinematerial);
        scene.add(tline[i]);
    }

    // Table markers
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    var dotMaterial = new THREE.PointsMaterial({size: 5, sizeAttenuation: false, color: 0xFF3300});
    for (var i = 1; i <= tables_num; i++) {
        tabmarker1[i] = new THREE.Points(dotGeometry, dotMaterial);
        scene.add(tabmarker1[i]);
        tabmarker2[i] = new THREE.Points(dotGeometry, dotMaterial);
        scene.add(tabmarker2[i]);
        tabmarker3[i] = new THREE.Points(dotGeometry, dotMaterial);
        scene.add(tabmarker3[i]);
        tabmarker4[i] = new THREE.Points(dotGeometry, dotMaterial);
        scene.add(tabmarker4[i]);
        tabmarkerc[i] = new THREE.Points(dotGeometry, dotMaterial);
        scene.add(tabmarkerc[i]);
    }

    // Table marker line
    var tablinematerial = new THREE.LineBasicMaterial({
        color: 0x000000,
        linewidth: 3
    });
    for (var i = 1; i <= tables_num; i++) {
        tablinegeo[i] = new THREE.Geometry();
        tablinegeo[i].vertices.push(new THREE.Vector3(0, 0, 0));
        tablinegeo[i].vertices.push(new THREE.Vector3(0, 0, 0));
        tablinegeo[i].vertices.push(new THREE.Vector3(0, 0, 0));
        tablinegeo[i].vertices.push(new THREE.Vector3(0, 0, 0));
        tablinegeo[i].vertices.push(new THREE.Vector3(0, 0, 0));
        tabline[i] = new THREE.Line(tablinegeo[i], tablinematerial);
        scene.add(tabline[i]);
    }

    // Furhat markers
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    var dotMaterial = new THREE.PointsMaterial({size: 5, sizeAttenuation: false, color: 0xFF3300});
    fmarker1 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(fmarker1);
    fmarker2 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(fmarker2);
    fmarker3 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(fmarker3);
    fmarker4 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(fmarker4);
    fmarkerc = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(fmarkerc);

    // Furhat marker line
    var flinematerial = new THREE.LineBasicMaterial({
        color: 0x000000,
        linewidth: 3
    });
    flinegeo = new THREE.Geometry();
    flinegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    flinegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    flinegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    flinegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    flinegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    fline = new THREE.Line(flinegeo, flinematerial);
    scene.add(fline);

    // calibration markers
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    var dotMaterial = new THREE.PointsMaterial({size: 5, sizeAttenuation: false, color: 0xFF3300});
    cmarker1 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(cmarker1);
    cmarker2 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(cmarker2);
    cmarker3 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(cmarker3);
    cmarker4 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(cmarker4);
    cmarkerc = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(cmarkerc);

    // Calibration marker line
    var clinematerial = new THREE.LineBasicMaterial({
        color: 0x000000,
        linewidth: 3
    });
    clinegeo = new THREE.Geometry();
    clinegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    clinegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    clinegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    clinegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    clinegeo.vertices.push(new THREE.Vector3(0, 0, 0));
    cline = new THREE.Line(clinegeo, clinematerial);
    scene.add(cline);

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

    requestAnimationFrame(render);
};
