// Rendering the scene
render = function(results) {
    // setTimout() is used for frame rate definition
    setTimeout(function() {
        // Start stats report
        stats.begin();

        // Modify light and shadow
        renderer.toneMappingExposure = Math.pow(params.exposure, 5.0); // to allow for very bright scenes
        renderer.shadowMap.enabled = params.shadows;
        bulbLight.castShadow = params.shadows;
        // Update shadows on objects
        if(params.shadows !== previousShadowMap) {
            //cubeMat.needsUpdate = true;
            floorMat.needsUpdate = true;
            previousShadowMap = params.shadows;
        }
        bulbLight.power = bulbLuminousPowers[params.bulbPower];
        bulbMat.emissiveIntensity = bulbLight.intensity / Math.pow(0.02, 2.0); // convert from intensity to irradiance at bulb surface

        hemiLight.intensity = hemiLuminousIrradiances[params.hemiIrradiance];
        var time = Date.now() * 0.0005;
        var delta = clock.getDelta();
        var timenow = 0;

        // Get message from web socket
        ws.onmessage = function(event) {
            csvStream = event.data;

            // Check that MATLAB has started
            if (csvStream == 'MATLAB'){
                console.log("MATLAB has started");
            }
            csvStream = csvStream.replace(/'/g, '"');
        };

        //csvData = data3d;
        if(csvStream != "{}" && csvStream != 'MATLAB'){
            //console.log(csvStream);
            csvData = JSON.parse(csvStream);
        }

        if (running) {
            // Start rendering after the first position values
            if (csvData != null) {
                // Text
                // Display text for frames
                if (csvData['mocap_target1']) {
                    text1.innerHTML = ("Frame: " + csvData['mocap_target1']['frame']);
                    document.body.appendChild(text1);
                }

                // Tobii Glasses
                // Set the object's markers
                for (var i = 1; i <= glasses_num; i++) {
                    if (csvData['mocap_target' + i]) {
                        gm1_pos[i] = new THREE.Vector3(csvData['mocap_glasses' + i]['marker1']['x'], csvData['mocap_glasses' + i]['marker1']['y'], csvData['mocap_glasses' + i]['marker1']['z']);
                        gmarker1[i].position.copy(gm1_pos[i]);
                        gm2_pos[i] = new THREE.Vector3(csvData['mocap_glasses' + i]['marker2']['x'], csvData['mocap_glasses' + i]['marker2']['y'], csvData['mocap_glasses' + i]['marker2']['z']);
                        gmarker2[i].position.copy(gm2_pos[i]);
                        gm3_pos[i] = new THREE.Vector3(csvData['mocap_glasses' + i]['marker3']['x'], csvData['mocap_glasses' + i]['marker3']['y'], csvData['mocap_glasses' + i]['marker3']['z']);
                        gmarker3[i].position.copy(gm3_pos[i]);
                        gm4_pos[i] = new THREE.Vector3(csvData['mocap_glasses' + i]['marker4']['x'], csvData['mocap_glasses' + i]['marker4']['y'], csvData['mocap_glasses' + i]['marker4']['z']);
                        gmarker4[i].position.copy(gm4_pos[i]);

                        // Calculate midpoint of two front markers
                        gmc_x[i] = (csvData['mocap_glasses' + i]['marker1']['x'] + csvData['mocap_glasses' + i]['marker3']['x']) / 2;
                        gmc_y[i] = (csvData['mocap_glasses' + i]['marker1']['y'] + csvData['mocap_glasses' + i]['marker3']['y']) / 2;
                        gmc_z[i] = (csvData['mocap_glasses' + i]['marker1']['z'] + csvData['mocap_glasses' + i]['marker3']['z']) / 2;
                        gmc_pos[i] = new THREE.Vector3(gmc_x[i], gmc_y[i], gmc_z[i]);
                        gmarkerc[i].position.copy(gmc_pos[i]);

                        // Connect markers with a line
                        glinegeo[i].vertices[0].set(csvData['mocap_glasses' + i]['marker1']['x'], csvData['mocap_glasses' + i]['marker1']['y'], csvData['mocap_glasses' + i]['marker1']['z']);
                        glinegeo[i].vertices[1].set(csvData['mocap_glasses' + i]['marker3']['x'], csvData['mocap_glasses' + i]['marker3']['y'], csvData['mocap_glasses' + i]['marker3']['z']);
                        glinegeo[i].vertices[2].set(csvData['mocap_glasses' + i]['marker2']['x'], csvData['mocap_glasses' + i]['marker2']['y'], csvData['mocap_glasses' + i]['marker2']['z']);
                        glinegeo[i].vertices[3].set(csvData['mocap_glasses' + i]['marker4']['x'], csvData['mocap_glasses' + i]['marker4']['y'], csvData['mocap_glasses' + i]['marker4']['z']);
                        glinegeo[i].vertices[4].set(csvData['mocap_glasses' + i]['marker1']['x'], csvData['mocap_glasses' + i]['marker1']['y'], csvData['mocap_glasses' + i]['marker1']['z']);
                        glinegeo[i].verticesNeedUpdate = true;
                    }
                }

                // Check that the glasses are on
                for (var i = 1; i <= glasses_num; i++) {
                    if(csvData['tobii_glasses' + i] && csvData['tobii_glasses' + i]['gp3_3d']){
                        if(csvData['tobii_glasses' + i]['gp3_3d']['x'] != 0){
                            // Gaze GP3 Glasses 1
                            // Set the object's markers
                            gp3_pos[i] = new THREE.Vector3(csvData['tobii_glasses' + i]['gp3_3d']['x'], csvData['tobii_glasses' + i]['gp3_3d']['y'], csvData['tobii_glasses' + i]['gp3_3d']['z']);
                            gp3marker[i].position.copy(gp3_pos[i]);

                            // Connect markers with a line
                            gp3linegeo[i].vertices[0].set(csvData['tobii_glasses' + i]['gp3_3d']['x'], csvData['tobii_glasses' + i]['gp3_3d']['y'], csvData['tobii_glasses' + i]['gp3_3d']['z']);
                            gp3linegeo[i].vertices[1].set(gmc_x[i], gmc_y[i], gmc_z[i]);
                            gp3linegeo[i].verticesNeedUpdate = true;

                            // Gaze Head pose Glasses
                            // Set the object's markers
                            hp_pos[i] = new THREE.Vector3(csvData['tobii_glasses' + i]['headpose']['x'], csvData['tobii_glasses' + i]['headpose']['y'], csvData['tobii_glasses' + i]['headpose']['z']);
                            hpmarker[i].position.copy(hp_pos[i]);

                            // Connect markers with a line
                            hplinegeo[i].vertices[0].set(csvData['tobii_glasses' + i]['headpose']['x'], csvData['tobii_glasses' + i]['headpose']['y'], csvData['tobii_glasses' + i]['headpose']['z']);
                            hplinegeo[i].vertices[1].set(gmc_x[i], gmc_y[i], gmc_z[i]);
                            hplinegeo[i].verticesNeedUpdate = true;
                        }
                    }
                }

                // Hand L
                for (var i = 2; i <= gloves_num + 1; i++) {
                    if (csvData['mocap_hand' + i + 'l']) {
                        // Set the object's markers
                        hlm1_pos[i] = new THREE.Vector3(csvData['mocap_hand' + i + 'l']['marker1']['x'], csvData['mocap_hand' + i + 'l']['marker1']['y'], csvData['mocap_hand' + i + 'l']['marker1']['z']);
                        hlmarker1[i].position.copy(hlm1_pos[i]);
                        hlm2_pos[i] = new THREE.Vector3(csvData['mocap_hand' + i + 'l']['marker2']['x'], csvData['mocap_hand' + i + 'l']['marker2']['y'], csvData['mocap_hand' + i + 'l']['marker2']['z']);
                        hlmarker2[i].position.copy(hlm2_pos[i]);
                        hlm3_pos[i] = new THREE.Vector3(csvData['mocap_hand' + i + 'l']['marker3']['x'], csvData['mocap_hand' + i + 'l']['marker3']['y'], csvData['mocap_hand' + i + 'l']['marker3']['z']);
                        hlmarker3[i].position.copy(hlm3_pos[i]);
                        hlm4_pos[i] = new THREE.Vector3(csvData['mocap_hand' + i + 'l']['marker4']['x'], csvData['mocap_hand' + i + 'l']['marker4']['y'], csvData['mocap_hand' + i + 'l']['marker4']['z']);
                        hlmarker4[i].position.copy(hlm4_pos[i]);

                        // Get mid point
                        hlmc_x[i] = csvData['mocap_hand' + i + 'l']['position']['x'];
                        hlmc_y[i] = csvData['mocap_hand' + i + 'l']['position']['y'];
                        hlmc_z[i] = csvData['mocap_hand' + i + 'l']['position']['z'];
                        hlmc_pos[i] = new THREE.Vector3(hlmc_x[i], hlmc_y[i], hlmc_z[i]);
                        hlmarkerc[i].position.copy(hlmc_pos[i]);

                        // Connect markers with a line
                        hlinegeol[i].vertices[0].set(csvData['mocap_hand' + i + 'l']['marker1']['x'], csvData['mocap_hand' + i + 'l']['marker1']['y'], csvData['mocap_hand' + i + 'l']['marker1']['z']);
                        hlinegeol[i].vertices[1].set(csvData['mocap_hand' + i + 'l']['marker4']['x'], csvData['mocap_hand' + i + 'l']['marker4']['y'], csvData['mocap_hand' + i + 'l']['marker4']['z']);
                        hlinegeol[i].vertices[2].set(csvData['mocap_hand' + i + 'l']['marker3']['x'], csvData['mocap_hand' + i + 'l']['marker3']['y'], csvData['mocap_hand' + i + 'l']['marker3']['z']);
                        hlinegeol[i].vertices[3].set(csvData['mocap_hand' + i + 'l']['marker2']['x'], csvData['mocap_hand' + i + 'l']['marker2']['y'], csvData['mocap_hand' + i + 'l']['marker2']['z']);
                        hlinegeol[i].vertices[4].set(csvData['mocap_hand' + i + 'l']['marker1']['x'], csvData['mocap_hand' + i + 'l']['marker1']['y'], csvData['mocap_hand' + i + 'l']['marker1']['z']);
                        hlinegeol[i].verticesNeedUpdate = true;

                        // Connect glasses and hand1l with a line
                        ghlinegeol[i].vertices[0].set(hlmc_x[i], hlmc_y[i], hlmc_z[i]);
                        ghlinegeol[i].vertices[1].set(gmc_x[i], gmc_y[i], gmc_z[i]);
                        ghlinegeol[i].verticesNeedUpdate = true;
                    }
                }

                // Hand R
                for (var i = 2; i <= gloves_num + 1; i++) {
                    if (csvData['mocap_hand' + i + 'r']) {
                        // Set the object's markers
                        hrm1_pos[i] = new THREE.Vector3(csvData['mocap_hand' + i + 'r']['marker1']['x'], csvData['mocap_hand' + i + 'r']['marker1']['y'], csvData['mocap_hand' + i + 'r']['marker1']['z']);
                        hrmarker1[i].position.copy(hrm1_pos[i]);
                        hrm2_pos[i] = new THREE.Vector3(csvData['mocap_hand' + i + 'r']['marker2']['x'], csvData['mocap_hand' + i + 'r']['marker2']['y'], csvData['mocap_hand' + i + 'r']['marker2']['z']);
                        hrmarker2[i].position.copy(hrm2_pos[i]);
                        hrm3_pos[i] = new THREE.Vector3(csvData['mocap_hand' + i + 'r']['marker3']['x'], csvData['mocap_hand' + i + 'r']['marker3']['y'], csvData['mocap_hand' + i + 'r']['marker3']['z']);
                        hrmarker3[i].position.copy(hrm3_pos[i]);
                        hrm4_pos[i] = new THREE.Vector3(csvData['mocap_hand' + i + 'r']['marker4']['x'], csvData['mocap_hand' + i + 'r']['marker4']['y'], csvData['mocap_hand' + i + 'r']['marker4']['z']);
                        hrmarker4[i].position.copy(hrm4_pos[i]);

                        // Get mid point
                        hrmc_x[i] = csvData['mocap_hand' + i + 'r']['position']['x'];
                        hrmc_y[i] = csvData['mocap_hand' + i + 'r']['position']['y'];
                        hrmc_z[i] = csvData['mocap_hand' + i + 'r']['position']['z'];
                        hrmc_pos[i] = new THREE.Vector3(hrmc_x[i], hrmc_y[i], hrmc_z[i]);
                        hrmarkerc[i].position.copy(hrmc_pos[i]);

                        // Connect markers with a line
                        hlinegeor[i].vertices[0].set(csvData['mocap_hand' + i + 'r']['marker1']['x'], csvData['mocap_hand' + i + 'r']['marker1']['y'], csvData['mocap_hand' + i + 'r']['marker1']['z']);
                        hlinegeor[i].vertices[1].set(csvData['mocap_hand' + i + 'r']['marker3']['x'], csvData['mocap_hand' + i + 'r']['marker3']['y'], csvData['mocap_hand' + i + 'r']['marker3']['z']);
                        hlinegeor[i].vertices[2].set(csvData['mocap_hand' + i + 'r']['marker4']['x'], csvData['mocap_hand' + i + 'r']['marker4']['y'], csvData['mocap_hand' + i + 'r']['marker4']['z']);
                        hlinegeor[i].vertices[3].set(csvData['mocap_hand' + i + 'r']['marker2']['x'], csvData['mocap_hand' + i + 'r']['marker2']['y'], csvData['mocap_hand' + i + 'r']['marker2']['z']);
                        hlinegeor[i].vertices[4].set(csvData['mocap_hand' + i + 'r']['marker1']['x'], csvData['mocap_hand' + i + 'r']['marker1']['y'], csvData['mocap_hand' + i + 'r']['marker1']['z']);
                        hlinegeor[i].verticesNeedUpdate = true;

                        // Connect glasses and hand1r with a line
                        ghlinegeor[i].vertices[0].set(hrmc_x[i], hrmc_y[i], hrmc_z[i]);
                        ghlinegeor[i].vertices[1].set(gmc_x[i], gmc_y[i], gmc_z[i]);
                        ghlinegeor[i].verticesNeedUpdate = true;
                    }
                }

                // Target
                for (var i = 1; i <= targets_num; i++) {
                    if (csvData['mocap_target' + i]) {
                        // Set the object's markers
                        tm1_pos[i] = new THREE.Vector3(csvData['mocap_target' + i]['marker1']['x'], csvData['mocap_target' + i]['marker1']['y'], csvData['mocap_target' + i]['marker1']['z']);
                        tmarker1[i].position.copy(tm1_pos[i]);
                        tm2_pos[i] = new THREE.Vector3(csvData['mocap_target' + i]['marker2']['x'], csvData['mocap_target' + i]['marker2']['y'], csvData['mocap_target' + i]['marker2']['z']);
                        tmarker2[i].position.copy(tm2_pos[i]);
                        tm3_pos[i] = new THREE.Vector3(csvData['mocap_target' + i]['marker3']['x'], csvData['mocap_target' + i]['marker3']['y'], csvData['mocap_target' + i]['marker3']['z']);
                        tmarker3[i].position.copy(tm3_pos[i]);
                        tm4_pos[i] = new THREE.Vector3(csvData['mocap_target' + i]['marker4']['x'], csvData['mocap_target' + i]['marker4']['y'], csvData['mocap_target' + i]['marker4']['z']);
                        tmarker4[i].position.copy(tm4_pos[i]);

                        // Get mid point
                        tmc_x[i] = csvData['mocap_target' + i]['position']['x'];
                        tmc_y[i] = csvData['mocap_target' + i]['position']['y'];
                        tmc_z[i] = csvData['mocap_target' + i]['position']['z'];
                        tmc_pos[i] = new THREE.Vector3(tmc_x[i], tmc_y[i], tmc_z[i]);
                        tmarkerc[i].position.copy(tmc_pos[i]);

                        // Connect markers with a line
                        tlinegeo[i].vertices[0].set(csvData['mocap_target' + i]['marker1']['x'], csvData['mocap_target' + i]['marker1']['y'], csvData['mocap_target' + i]['marker1']['z']);
                        tlinegeo[i].vertices[1].set(csvData['mocap_target' + i]['marker2']['x'], csvData['mocap_target' + i]['marker2']['y'], csvData['mocap_target' + i]['marker2']['z']);
                        tlinegeo[i].vertices[2].set(csvData['mocap_target' + i]['marker4']['x'], csvData['mocap_target' + i]['marker4']['y'], csvData['mocap_target' + i]['marker4']['z']);
                        tlinegeo[i].vertices[3].set(csvData['mocap_target' + i]['marker3']['x'], csvData['mocap_target' + i]['marker3']['y'], csvData['mocap_target' + i]['marker3']['z']);
                        tlinegeo[i].vertices[4].set(csvData['mocap_target' + i]['marker1']['x'], csvData['mocap_target' + i]['marker1']['y'], csvData['mocap_target' + i]['marker1']['z']);
                        tlinegeo[i].verticesNeedUpdate = true;
                    }
                }

                // Table
                for (var i = 1; i <= tables_num; i++) {
                    if (csvData['mocap_table' + i]) {
                        // Set the object's markers
                        tabm1_pos[i] = new THREE.Vector3(csvData['mocap_table' + i]['marker1']['x'], csvData['mocap_table' + i]['marker1']['y'], csvData['mocap_table' + i]['marker1']['z']);
                        tabmarker1[i].position.copy(tabm1_pos[i]);
                        tabm2_pos[i] = new THREE.Vector3(csvData['mocap_table' + i]['marker2']['x'], csvData['mocap_table' + i]['marker2']['y'], csvData['mocap_table' + i]['marker2']['z']);
                        tabmarker2[i].position.copy(tabm2_pos[i]);
                        tabm3_pos[i] = new THREE.Vector3(csvData['mocap_table' + i]['marker3']['x'], csvData['mocap_table' + i]['marker3']['y'], csvData['mocap_table' + i]['marker3']['z']);
                        tabmarker3[i].position.copy(tabm3_pos[i]);
                        tabm4_pos[i] = new THREE.Vector3(csvData['mocap_table' + i]['marker4']['x'], csvData['mocap_table' + i]['marker4']['y'], csvData['mocap_table' + i]['marker4']['z']);
                        tabmarker4[i].position.copy(tabm4_pos[i]);

                        // Get mid point
                        tabmc_x[i] = csvData['mocap_table' + i]['position']['x'];
                        tabmc_y[i] = csvData['mocap_table' + i]['position']['y'];
                        tabmc_z[i] = csvData['mocap_table' + i]['position']['z'];
                        tabmc_pos[i] = new THREE.Vector3(tabmc_x[i], tabmc_y[i], tabmc_z[i]);
                        tabmarkerc[i].position.copy(tabmc_pos[i]);

                        // Connect markers with a line
                        tablinegeo[i].vertices[0].set(csvData['mocap_table' + i]['marker1']['x'], csvData['mocap_table' + i]['marker1']['y'], csvData['mocap_table' + i]['marker1']['z']);
                        tablinegeo[i].vertices[1].set(csvData['mocap_table' + i]['marker2']['x'], csvData['mocap_table' + i]['marker2']['y'], csvData['mocap_table' + i]['marker2']['z']);
                        tablinegeo[i].vertices[2].set(csvData['mocap_table' + i]['marker3']['x'], csvData['mocap_table' + i]['marker3']['y'], csvData['mocap_table' + i]['marker3']['z']);
                        tablinegeo[i].vertices[3].set(csvData['mocap_table' + i]['marker4']['x'], csvData['mocap_table' + i]['marker4']['y'], csvData['mocap_table' + i]['marker4']['z']);
                        tablinegeo[i].vertices[4].set(csvData['mocap_table' + i]['marker1']['x'], csvData['mocap_table' + i]['marker1']['y'], csvData['mocap_table' + i]['marker1']['z']);
                        tablinegeo[i].verticesNeedUpdate = true;
                    }
                }

                // Furhat
                if (csvData['mocap_furhat']) {
                    // Set the object's markers
                    fm1_pos = new THREE.Vector3(csvData['mocap_furhat']['marker1']['x'], csvData['mocap_furhat']['marker1']['y'], csvData['mocap_furhat']['marker1']['z']);
                    fmarker1.position.copy(fm1_pos);
                    fm2_pos = new THREE.Vector3(csvData['mocap_furhat']['marker2']['x'], csvData['mocap_furhat']['marker2']['y'], csvData['mocap_furhat']['marker2']['z']);
                    fmarker2.position.copy(fm2_pos);
                    fm3_pos = new THREE.Vector3(csvData['mocap_furhat']['marker3']['x'], csvData['mocap_furhat']['marker3']['y'], csvData['mocap_furhat']['marker3']['z']);
                    fmarker3.position.copy(fm3_pos);
                    fm4_pos = new THREE.Vector3(csvData['mocap_furhat']['marker4']['x'], csvData['mocap_furhat']['marker4']['y'], csvData['mocap_furhat']['marker4']['z']);
                    fmarker4.position.copy(fm4_pos);

                    // Get mid point
                    fmc_x = csvData['mocap_furhat']['position']['x'];
                    fmc_y = csvData['mocap_furhat']['position']['y'];
                    fmc_z = csvData['mocap_furhat']['position']['z'];
                    fmc_pos = new THREE.Vector3(fmc_x, fmc_y, fmc_z);
                    fmarkerc.position.copy(fmc_pos);

                    // Connect markers with a line
                    flinegeo.vertices[0].set(csvData['mocap_furhat']['marker1']['x'], csvData['mocap_furhat']['marker1']['y'], csvData['mocap_furhat']['marker1']['z']);
                    flinegeo.vertices[1].set(csvData['mocap_furhat']['marker2']['x'], csvData['mocap_furhat']['marker2']['y'], csvData['mocap_furhat']['marker2']['z']);
                    flinegeo.vertices[2].set(csvData['mocap_furhat']['marker3']['x'], csvData['mocap_furhat']['marker3']['y'], csvData['mocap_furhat']['marker3']['z']);
                    flinegeo.vertices[3].set(csvData['mocap_furhat']['marker4']['x'], csvData['mocap_furhat']['marker4']['y'], csvData['mocap_furhat']['marker4']['z']);
                    flinegeo.vertices[4].set(csvData['mocap_furhat']['marker1']['x'], csvData['mocap_furhat']['marker1']['y'], csvData['mocap_furhat']['marker1']['z']);
                    flinegeo.verticesNeedUpdate = true;
                }

                // Calibration
                if (csvData['mocap_calibration']) {
                    // Set the object's markers
                    cm1_pos = new THREE.Vector3(csvData['mocap_calibration']['marker1']['x'], csvData['mocap_calibration']['marker1']['y'], csvData['mocap_calibration']['marker1']['z']);
                    cmarker1.position.copy(cm1_pos);
                    cm2_pos = new THREE.Vector3(csvData['mocap_calibration']['marker2']['x'], csvData['mocap_calibration']['marker2']['y'], csvData['mocap_calibration']['marker2']['z']);
                    cmarker2.position.copy(cm2_pos);
                    cm3_pos = new THREE.Vector3(csvData['mocap_calibration']['marker3']['x'], csvData['mocap_calibration']['marker3']['y'], csvData['mocap_calibration']['marker3']['z']);
                    cmarker3.position.copy(cm3_pos);
                    cm4_pos = new THREE.Vector3(csvData['mocap_calibration']['marker4']['x'], csvData['mocap_calibration']['marker4']['y'], csvData['mocap_calibration']['marker4']['z']);
                    cmarker4.position.copy(cm4_pos);

                    // Get mid point
                    cmc_x = csvData['mocap_calibration']['position']['x'];
                    cmc_y = csvData['mocap_calibration']['position']['y'];
                    cmc_z = csvData['mocap_calibration']['position']['z'];
                    cmc_pos = new THREE.Vector3(cmc_x, cmc_y, cmc_z);
                    cmarkerc.position.copy(cmc_pos);

                    // Connect markers with a line
                    clinegeo.vertices[0].set(csvData['mocap_calibration']['marker1']['x'], csvData['mocap_calibration']['marker1']['y'], csvData['mocap_calibration']['marker1']['z']);
                    clinegeo.vertices[1].set(csvData['mocap_calibration']['marker2']['x'], csvData['mocap_calibration']['marker2']['y'], csvData['mocap_calibration']['marker2']['z']);
                    clinegeo.vertices[2].set(csvData['mocap_calibration']['marker4']['x'], csvData['mocap_calibration']['marker4']['y'], csvData['mocap_calibration']['marker4']['z']);
                    clinegeo.vertices[3].set(csvData['mocap_calibration']['marker3']['x'], csvData['mocap_calibration']['marker3']['y'], csvData['mocap_calibration']['marker3']['z']);
                    clinegeo.vertices[4].set(csvData['mocap_calibration']['marker1']['x'], csvData['mocap_calibration']['marker1']['y'], csvData['mocap_calibration']['marker1']['z']);
                    clinegeo.verticesNeedUpdate = true;
                }

                // Screen
                if (csvData['mocap_screen']) {
                    // Set the object's markers
                    sm1_pos = new THREE.Vector3(csvData['mocap_screen']['marker1']['x'], csvData['mocap_screen']['marker1']['y'], csvData['mocap_screen']['marker1']['z']);
                    smarker1.position.copy(sm1_pos);
                    sm2_pos = new THREE.Vector3(csvData['mocap_screen']['marker2']['x'], csvData['mocap_screen']['marker2']['y'], csvData['mocap_screen']['marker2']['z']);
                    smarker2.position.copy(sm2_pos);
                    sm3_pos = new THREE.Vector3(csvData['mocap_screen']['marker3']['x'], csvData['mocap_screen']['marker3']['y'], csvData['mocap_screen']['marker3']['z']);
                    smarker3.position.copy(sm3_pos);
                    sm4_pos = new THREE.Vector3(csvData['mocap_screen']['marker4']['x'], csvData['mocap_screen']['marker4']['y'], csvData['mocap_screen']['marker4']['z']);
                    smarker4.position.copy(sm4_pos);

                    // Get mid point
                    smc_x = csvData['mocap_screen']['position']['x'];
                    smc_y = csvData['mocap_screen']['position']['y'];
                    smc_z = csvData['mocap_screen']['position']['z'];
                    smc_pos = new THREE.Vector3(smc_x, smc_y, smc_z);
                    smarkerc.position.copy(smc_pos);

                    // Connect markers with a line
                    slinegeo.vertices[0].set(csvData['mocap_screen']['marker1']['x'], csvData['mocap_screen']['marker1']['y'], csvData['mocap_screen']['marker1']['z']);
                    slinegeo.vertices[1].set(csvData['mocap_screen']['marker2']['x'], csvData['mocap_screen']['marker2']['y'], csvData['mocap_screen']['marker2']['z']);
                    slinegeo.vertices[2].set(csvData['mocap_screen']['marker4']['x'], csvData['mocap_screen']['marker4']['y'], csvData['mocap_screen']['marker4']['z']);
                    slinegeo.vertices[3].set(csvData['mocap_screen']['marker3']['x'], csvData['mocap_screen']['marker3']['y'], csvData['mocap_screen']['marker3']['z']);
                    slinegeo.vertices[4].set(csvData['mocap_screen']['marker1']['x'], csvData['mocap_screen']['marker1']['y'], csvData['mocap_screen']['marker1']['z']);
                    slinegeo.verticesNeedUpdate = true;
                }
            }

            // Render the scene
            renderer.render(scene, camera);

            // End of stats report
            stats.end();

            // Animate next frame
            requestAnimationFrame(render);
        }
    }, 1000 / framesPerSecond);
};
