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

    // Glasses marker line
    var glinematerial1 = new THREE.LineBasicMaterial({
        color: 0xFFFFFF,
        linewidth: 3
    });
    glinegeo1 = new THREE.Geometry();
    glinegeo1.vertices.push(new THREE.Vector3(0, 0, 0));
    glinegeo1.vertices.push(new THREE.Vector3(0, 0, 0));
    glinegeo1.vertices.push(new THREE.Vector3(0, 0, 0));
    glinegeo1.vertices.push(new THREE.Vector3(0, 0, 0));
    glinegeo1.vertices.push(new THREE.Vector3(0, 0, 0));
    g1line = new THREE.Line(glinegeo1, glinematerial1);
    scene.add(g1line);

    // GP3 markers
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    var dotMaterial = new THREE.PointsMaterial({size: 5, sizeAttenuation: false, color: 0xFF3300});
    gp3marker1 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(gp3marker1);

    // GP3 marker line
    var gp3linematerial = new THREE.LineBasicMaterial({
        color: 0xCC0000,
        linewidth: 3
    });
    gp3linegeo1 = new THREE.Geometry();
    gp3linegeo1.vertices.push(new THREE.Vector3(0, 0, 0));
    gp3linegeo1.vertices.push(new THREE.Vector3(0, 0, 0));
    gp3line1 = new THREE.Line(gp3linegeo1, gp3linematerial);
    scene.add(gp3line1);

    // Head pose markers
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    var dotMaterial = new THREE.PointsMaterial({size: 5, sizeAttenuation: false, color: 0xFF3300});
    hpmarker1 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(hpmarker1);

    // Head pose marker line
    var hplinematerial1 = new THREE.LineBasicMaterial({
        color: 0xFFFFFF,
        linewidth: 3
    });
    hplinegeo1 = new THREE.Geometry();
    hplinegeo1.vertices.push(new THREE.Vector3(0, 0, 0));
    hplinegeo1.vertices.push(new THREE.Vector3(0, 0, 0));
    hpline1 = new THREE.Line(hplinegeo1, hplinematerial1);
    scene.add(hpline1);

    // Hand 1L markers
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    var dotMaterial = new THREE.PointsMaterial({size: 5, sizeAttenuation: false, color: 0xFF3300});
    h1lmarker1 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(h1lmarker1);
    h1lmarker2 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(h1lmarker2);
    h1lmarker3 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(h1lmarker3);
    h1lmarker4 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(h1lmarker4);
    h1lmarkerc = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(h1lmarkerc);

    // Hand 1L marker line
    var hlinematerial1l = new THREE.LineBasicMaterial({
        color: 0xFFFFFF,
        linewidth: 3
    });
    hlinegeo1l = new THREE.Geometry();
    hlinegeo1l.vertices.push(new THREE.Vector3(0, 0, 0));
    hlinegeo1l.vertices.push(new THREE.Vector3(0, 0, 0));
    hlinegeo1l.vertices.push(new THREE.Vector3(0, 0, 0));
    hlinegeo1l.vertices.push(new THREE.Vector3(0, 0, 0));
    hlinegeo1l.vertices.push(new THREE.Vector3(0, 0, 0));
    h1lline = new THREE.Line(hlinegeo1l, hlinematerial1l);
    scene.add(h1lline);

    // Hand 1R markers
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    var dotMaterial = new THREE.PointsMaterial({size: 5, sizeAttenuation: false, color: 0xFF3300});
    h1rmarker1 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(h1rmarker1);
    h1rmarker2 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(h1rmarker2);
    h1rmarker3 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(h1rmarker3);
    h1rmarker4 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(h1rmarker4);
    h1rmarkerc = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(h1rmarkerc);

    // Hand 1R marker line
    var hlinematerial1r = new THREE.LineBasicMaterial({
        color: 0xFFFFFF,
        linewidth: 3
    });
    hlinegeo1r = new THREE.Geometry();
    hlinegeo1r.vertices.push(new THREE.Vector3(0, 0, 0));
    hlinegeo1r.vertices.push(new THREE.Vector3(0, 0, 0));
    hlinegeo1r.vertices.push(new THREE.Vector3(0, 0, 0));
    hlinegeo1r.vertices.push(new THREE.Vector3(0, 0, 0));
    hlinegeo1r.vertices.push(new THREE.Vector3(0, 0, 0));
    h1rline = new THREE.Line(hlinegeo1r, hlinematerial1r);
    scene.add(h1rline);

    // Glasses Hand 1L marker line
    var ghlinematerial1l = new THREE.LineBasicMaterial({
        color: 0xFFFFFF,
        linewidth: 3
    });
    ghlinegeo1l = new THREE.Geometry();
    ghlinegeo1l.vertices.push(new THREE.Vector3(0, 0, 0));
    ghlinegeo1l.vertices.push(new THREE.Vector3(0, 0, 0));
    ghline1l = new THREE.Line(ghlinegeo1l, ghlinematerial1l);
    scene.add(ghline1l);

    // Glasses Hand 1R marker line
    var ghlinematerial1r = new THREE.LineBasicMaterial({
        color: 0xFFFFFF,
        linewidth: 3
    });
    ghlinegeo1r = new THREE.Geometry();
    ghlinegeo1r.vertices.push(new THREE.Vector3(0, 0, 0));
    ghlinegeo1r.vertices.push(new THREE.Vector3(0, 0, 0));
    ghline1r = new THREE.Line(ghlinegeo1r, ghlinematerial1r);
    scene.add(ghline1r);

    // Target 1 markers
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    var dotMaterial = new THREE.PointsMaterial({size: 5, sizeAttenuation: false, color: 0xFF3300});
    t1marker1 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(t1marker1);
    t1marker2 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(t1marker2);
    t1marker3 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(t1marker3);
    t1marker4 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(t1marker4);
    t1markerc = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(t1markerc);

    // Target 1 marker line
    var tlinematerial1 = new THREE.LineBasicMaterial({
        color: 0x000000,
        linewidth: 3
    });
    tlinegeo1 = new THREE.Geometry();
    tlinegeo1.vertices.push(new THREE.Vector3(0, 0, 0));
    tlinegeo1.vertices.push(new THREE.Vector3(0, 0, 0));
    tlinegeo1.vertices.push(new THREE.Vector3(0, 0, 0));
    tlinegeo1.vertices.push(new THREE.Vector3(0, 0, 0));
    tlinegeo1.vertices.push(new THREE.Vector3(0, 0, 0));
    t1line = new THREE.Line(tlinegeo1, tlinematerial1);
    scene.add(t1line);

    // Target 2 markers
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    var dotMaterial = new THREE.PointsMaterial({size: 5, sizeAttenuation: false, color: 0xFF3300});
    t2marker1 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(t2marker1);
    t2marker2 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(t2marker2);
    t2marker3 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(t2marker3);
    t2marker4 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(t2marker4);
    t2markerc = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(t2markerc);

    // Target 2 marker line
    var tlinematerial2 = new THREE.LineBasicMaterial({
        color: 0x000000,
        linewidth: 3
    });
    tlinegeo2 = new THREE.Geometry();
    tlinegeo2.vertices.push(new THREE.Vector3(0, 0, 0));
    tlinegeo2.vertices.push(new THREE.Vector3(0, 0, 0));
    tlinegeo2.vertices.push(new THREE.Vector3(0, 0, 0));
    tlinegeo2.vertices.push(new THREE.Vector3(0, 0, 0));
    tlinegeo2.vertices.push(new THREE.Vector3(0, 0, 0));
    t2line = new THREE.Line(tlinegeo2, tlinematerial2);
    scene.add(t2line);

    // Table markers
    var dotGeometry = new THREE.Geometry();
    dotGeometry.vertices.push(new THREE.Vector3(0, 0, 0));
    var dotMaterial = new THREE.PointsMaterial({size: 5, sizeAttenuation: false, color: 0xFF3300});
    tab1marker1 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(tab1marker1);
    tab1marker2 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(tab1marker2);
    tab1marker3 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(tab1marker3);
    tab1marker4 = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(tab1marker4);
    tab1markerc = new THREE.Points(dotGeometry, dotMaterial);
    scene.add(tab1markerc);

    // Table marker line
    var tablinematerial1 = new THREE.LineBasicMaterial({
        color: 0x000000,
        linewidth: 3
    });
    tablinegeo1 = new THREE.Geometry();
    tablinegeo1.vertices.push(new THREE.Vector3(0, 0, 0));
    tablinegeo1.vertices.push(new THREE.Vector3(0, 0, 0));
    tablinegeo1.vertices.push(new THREE.Vector3(0, 0, 0));
    tablinegeo1.vertices.push(new THREE.Vector3(0, 0, 0));
    tablinegeo1.vertices.push(new THREE.Vector3(0, 0, 0));
    tab1line = new THREE.Line(tablinegeo1, tablinematerial1);
    scene.add(tab1line);

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
