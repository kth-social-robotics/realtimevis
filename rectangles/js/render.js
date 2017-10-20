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
        var disp1 = "";
        var disp2 = "";
        var disp3 = "";

        if (running) {
            // Start rendering after the first position values
            if (csvData != null) {
                // Stop rendering at the last posision value

                // Check if index_frame has already been changed to file limits
                if (index_frame > 50000) {
                    index_frame = index_frame - csvData[6][0] + 1;
                }

                if (csvData[index_frame] != null) {
                    // Get headers from csv
                    var numFrames = csvData[2][2];
                    var gazeStart = csvData[2][8];
                    var gazeEnd = csvData[2][9];

                    // Get current csv start and end frame and time
                    var csvFirstFrame = csvData[6][0];
                    var csvFirstTime = csvData[6][1];

                    // Text
                    // Display text for frames
                    text1.innerHTML = ("Frame: " + csv_frame);
                    document.body.appendChild(text1);

                    // Display text for time
                    timenow = csv_frame/50;
                    timenow = parseFloat(Math.round(timenow * 100) / 100).toFixed(2);
                    text2.innerHTML = ("Time: " + timenow);
                    document.body.appendChild(text2);

                    // Display text for csv start and end times
                    csvFirstTime = parseFloat(Math.round(csvFirstTime * 100) / 100).toFixed(2);
                    text3.innerHTML = ("CSV Start: " + csvFirstTime);
                    document.body.appendChild(text3);

                    // Tobii Glasses 1
                    var g1x = 2;
                    // Check if the Tobii Glasses first row has values or not
                    if (!csvData[index_frame][g1x]) { // x from object position
                        // Set the object's markers
                        g1m1_pos = new THREE.Vector3(0, 0, 0);
                        g1marker1.position.copy(g1m1_pos);
                        g1m2_pos = new THREE.Vector3(0, 0, 0);
                        g1marker2.position.copy(g1m2_pos);
                        g1m3_pos = new THREE.Vector3(0, 0, 0);
                        g1marker3.position.copy(g1m3_pos);
                        g1m4_pos = new THREE.Vector3(0, 0, 0);
                        g1marker4.position.copy(g1m4_pos);
                        g1mc_pos = new THREE.Vector3(0, 0, 0);
                        g1markerc.position.copy(g1mc_pos);
                    }

                    // Check if the Tobii Glasses row has values or not
                    else if (csvData[index_frame][g1x]) { // x from marker position
                        // Set the object's markers
                        g1m1_pos = new THREE.Vector3(csvData[index_frame][g1x], csvData[index_frame][g1x+1], csvData[index_frame][g1x+2]);
                        g1marker1.position.copy(g1m1_pos);
                        g1m2_pos = new THREE.Vector3(csvData[index_frame][g1x+3], csvData[index_frame][g1x+4], csvData[index_frame][g1x+5]);
                        g1marker2.position.copy(g1m2_pos);
                        g1m3_pos = new THREE.Vector3(csvData[index_frame][g1x+6], csvData[index_frame][g1x+7], csvData[index_frame][g1x+8]);
                        g1marker3.position.copy(g1m3_pos);
                        g1m4_pos = new THREE.Vector3(csvData[index_frame][g1x+9], csvData[index_frame][g1x+10], csvData[index_frame][g1x+11]);
                        g1marker4.position.copy(g1m4_pos);

                        // Calculate midpoint of two front markers
                        g1mc_x = (csvData[index_frame][g1x+3] + csvData[index_frame][g1x+6]) / 2;
                        g1mc_y = (csvData[index_frame][g1x+4] + csvData[index_frame][g1x+7]) / 2;
                        g1mc_z = (csvData[index_frame][g1x+5] + csvData[index_frame][g1x+8]) / 2;
                        g1mc_pos = new THREE.Vector3(g1mc_x, g1mc_y, g1mc_z);
                        g1markerc.position.copy(g1mc_pos);

                        // Connect markers with a line
                        glinegeo1.vertices[0].set(csvData[index_frame][g1x], csvData[index_frame][g1x+1], csvData[index_frame][g1x+2]);
                        glinegeo1.vertices[1].set(csvData[index_frame][g1x+6], csvData[index_frame][g1x+7], csvData[index_frame][g1x+8]);
                        glinegeo1.vertices[2].set(csvData[index_frame][g1x+3], csvData[index_frame][g1x+4], csvData[index_frame][g1x+5]);
                        glinegeo1.vertices[3].set(csvData[index_frame][g1x+9], csvData[index_frame][g1x+10], csvData[index_frame][g1x+11]);
                        glinegeo1.vertices[4].set(csvData[index_frame][g1x], csvData[index_frame][g1x+1], csvData[index_frame][g1x+2]);
                        glinegeo1.verticesNeedUpdate = true;
                    }

                    // Tobii Glasses 2
                    var g2x = 14;
                    // Check if the Tobii Glasses first row has values or not
                    if (!csvData[index_frame][g2x]) { // x from object position
                        // Set the object's markers
                        g2m1_pos = new THREE.Vector3(0, 0, 0);
                        g2marker1.position.copy(g2m1_pos);
                        g2m2_pos = new THREE.Vector3(0, 0, 0);
                        g2marker2.position.copy(g2m2_pos);
                        g2m3_pos = new THREE.Vector3(0, 0, 0);
                        g2marker3.position.copy(g2m3_pos);
                        g2m4_pos = new THREE.Vector3(0, 0, 0);
                        g2marker4.position.copy(g2m4_pos);
                        g2mc_pos = new THREE.Vector3(0, 0, 0);
                        g2markerc.position.copy(g2mc_pos);
                    }

                    // Check if the Tobii Glasses row has values or not
                    else if (csvData[index_frame][g2x]) { // x from marker position
                        // Set the object's markers
                        g2m1_pos = new THREE.Vector3(csvData[index_frame][g2x], csvData[index_frame][g2x+1], csvData[index_frame][g2x+2]);
                        g2marker1.position.copy(g2m1_pos);
                        g2m2_pos = new THREE.Vector3(csvData[index_frame][g2x+3], csvData[index_frame][g2x+4], csvData[index_frame][g2x+5]);
                        g2marker2.position.copy(g2m2_pos);
                        g2m3_pos = new THREE.Vector3(csvData[index_frame][g2x+6], csvData[index_frame][g2x+7], csvData[index_frame][g2x+8]);
                        g2marker3.position.copy(g2m3_pos);
                        g2m4_pos = new THREE.Vector3(csvData[index_frame][g2x+9], csvData[index_frame][g2x+10], csvData[index_frame][g2x+11]);
                        g2marker4.position.copy(g2m4_pos);

                        // Calculate midpoint of two front markers
                        g2mc_x = (csvData[index_frame][g2x] + csvData[index_frame][g2x+6]) / 2;
                        g2mc_y = (csvData[index_frame][g2x+1] + csvData[index_frame][g2x+7]) / 2;
                        g2mc_z = (csvData[index_frame][g2x+2] + csvData[index_frame][g2x+8]) / 2;
                        g2mc_pos = new THREE.Vector3(g2mc_x, g2mc_y, g2mc_z);
                        g2markerc.position.copy(g2mc_pos);

                        // Connect markers with a line
                        glinegeo2.vertices[0].set(csvData[index_frame][g2x], csvData[index_frame][g2x+1], csvData[index_frame][g2x+2]);
                        glinegeo2.vertices[1].set(csvData[index_frame][g2x+3], csvData[index_frame][g2x+4], csvData[index_frame][g2x+5]);
                        glinegeo2.vertices[2].set(csvData[index_frame][g2x+9], csvData[index_frame][g2x+10], csvData[index_frame][g2x+11]);
                        glinegeo2.vertices[3].set(csvData[index_frame][g2x+6], csvData[index_frame][g2x+7], csvData[index_frame][g2x+8]);
                        glinegeo2.vertices[4].set(csvData[index_frame][g2x], csvData[index_frame][g2x+1], csvData[index_frame][g2x+2]);
                        glinegeo2.verticesNeedUpdate = true;
                    }

                    // Tobii Glasses 3
                    var g3x = 26;
                    // Check if the Tobii Glasses first row has values or not
                    if (!csvData[index_frame][g3x]) { // x from object position
                        // Set the object's markers
                        g3m1_pos = new THREE.Vector3(0, 0, 0);
                        g3marker1.position.copy(g3m1_pos);
                        g3m2_pos = new THREE.Vector3(0, 0, 0);
                        g3marker2.position.copy(g3m2_pos);
                        g3m3_pos = new THREE.Vector3(0, 0, 0);
                        g3marker3.position.copy(g3m3_pos);
                        g3m4_pos = new THREE.Vector3(0, 0, 0);
                        g3marker4.position.copy(g3m4_pos);
                        g3mc_pos = new THREE.Vector3(0, 0, 0);
                        g3markerc.position.copy(g3mc_pos);
                    }

                    // Check if the Tobii Glasses row has values or not
                    else if (csvData[index_frame][g3x]) { // x from marker position
                        // Set the object's markers
                        g3m1_pos = new THREE.Vector3(csvData[index_frame][g3x], csvData[index_frame][g3x+1], csvData[index_frame][g3x+2]);
                        g3marker1.position.copy(g3m1_pos);
                        g3m2_pos = new THREE.Vector3(csvData[index_frame][g3x+3], csvData[index_frame][g3x+4], csvData[index_frame][g3x+5]);
                        g3marker2.position.copy(g3m2_pos);
                        g3m3_pos = new THREE.Vector3(csvData[index_frame][g3x+6], csvData[index_frame][g3x+7], csvData[index_frame][g3x+8]);
                        g3marker3.position.copy(g3m3_pos);
                        g3m4_pos = new THREE.Vector3(csvData[index_frame][g3x+9], csvData[index_frame][g3x+10], csvData[index_frame][g3x+11]);
                        g3marker4.position.copy(g3m4_pos);

                        // Calculate midpoint of two front markers
                        g3mc_x = (csvData[index_frame][g3x] + csvData[index_frame][g3x+3]) / 2;
                        g3mc_y = (csvData[index_frame][g3x+1] + csvData[index_frame][g3x+4]) / 2;
                        g3mc_z = (csvData[index_frame][g3x+2] + csvData[index_frame][g3x+5]) / 2;
                        g3mc_pos = new THREE.Vector3(g3mc_x, g3mc_y, g3mc_z);
                        g3markerc.position.copy(g3mc_pos);

                        // Connect markers with a line
                        glinegeo3.vertices[0].set(csvData[index_frame][g3x], csvData[index_frame][g3x+1], csvData[index_frame][g3x+2]);
                        glinegeo3.vertices[1].set(csvData[index_frame][g3x+6], csvData[index_frame][g3x+7], csvData[index_frame][g3x+8]);
                        glinegeo3.vertices[2].set(csvData[index_frame][g3x+9], csvData[index_frame][g3x+10], csvData[index_frame][g3x+11]);
                        glinegeo3.vertices[3].set(csvData[index_frame][g3x+3], csvData[index_frame][g3x+4], csvData[index_frame][g3x+5]);
                        glinegeo3.vertices[4].set(csvData[index_frame][g3x], csvData[index_frame][g3x+1], csvData[index_frame][g3x+2]);
                        glinegeo3.verticesNeedUpdate = true;
                    }

                    // Gaze GP3 Glasses 1
                    var g1gp3x = 140;
                    // Check if the Gaze GP3 first row has values or not
                    if (!csvData[index_frame][g1gp3x]) { // x from object position
                        // Set the object's markers
                        gp3_pos1 = new THREE.Vector3(0, 0, 0);
                        gp3marker1.position.copy(gp3_pos1);
                    }
                    // Check if the Gaze GP3 row has values or not
                    else if (csvData[index_frame][g1gp3x]) { // x from marker position
                        // Set the object's markers
                        gp3_pos1 = new THREE.Vector3(csvData[index_frame][g1gp3x], csvData[index_frame][g1gp3x+1], csvData[index_frame][g1gp3x+2]);
                        gp3marker1.position.copy(gp3_pos1);

                        // Connect markers with a line
                        gp3linegeo1.vertices[0].set(csvData[index_frame][g1gp3x], csvData[index_frame][g1gp3x+1], csvData[index_frame][g1gp3x+2]);
                        gp3linegeo1.vertices[1].set(g1mc_x, g1mc_y, g1mc_z);
                        gp3linegeo1.verticesNeedUpdate = true;
                    }

                    // Gaze GP3 Glasses 2
                    var g2gp3x = 152;
                    // Check if the Gaze GP3 first row has values or not
                    if (!csvData[index_frame][g2gp3x]) { // x from object position
                        // Set the object's markers
                        gp3_pos2 = new THREE.Vector3(0, 0, 0);
                        gp3marker2.position.copy(gp3_pos2);
                    }
                    // Check if the Gaze GP3 row has values or not
                    else if (csvData[index_frame][g2gp3x]) { // x from marker position
                        // Set the object's markers
                        gp3_pos2 = new THREE.Vector3(csvData[index_frame][g2gp3x], csvData[index_frame][g2gp3x+1], csvData[index_frame][g2gp3x+2]);
                        gp3marker2.position.copy(gp3_pos2);

                        // Connect markers with a line
                        gp3linegeo2.vertices[0].set(csvData[index_frame][g2gp3x], csvData[index_frame][g2gp3x+1], csvData[index_frame][g2gp3x+2]);
                        gp3linegeo2.vertices[1].set(g2mc_x, g2mc_y, g2mc_z);
                        gp3linegeo2.verticesNeedUpdate = true;
                    }

                    // Gaze GP3 Glasses 3
                    var g3gp3x = 164;
                    // Check if the Gaze GP3 first row has values or not
                    if (!csvData[index_frame][g3gp3x]) { // x from object position
                        // Set the object's markers
                        gp3_pos3 = new THREE.Vector3(0, 0, 0);
                        gp3marker3.position.copy(gp3_pos3);
                    }
                    // Check if the Gaze GP3 row has values or not
                    else if (csvData[index_frame][g3gp3x]) { // x from marker position
                        // Set the object's markers
                        gp3_pos3 = new THREE.Vector3(csvData[index_frame][g3gp3x], csvData[index_frame][g3gp3x+1], csvData[index_frame][g3gp3x+2]);
                        gp3marker3.position.copy(gp3_pos3);

                        // Connect markers with a line
                        gp3linegeo3.vertices[0].set(csvData[index_frame][g3gp3x], csvData[index_frame][g3gp3x+1], csvData[index_frame][g3gp3x+2]);
                        gp3linegeo3.vertices[1].set(g3mc_x, g3mc_y, g3mc_z);
                        gp3linegeo3.verticesNeedUpdate = true;
                    }

                    // Rectangle 1
                    var r1x = 38;
                    // Check if the Rectangle first row has values or not
                    if (!csvData[index_frame][r1x]) { // x from object position
                        // Set the object's markers
                        r1m1_pos = new THREE.Vector3(0, 0, 0);
                        r1marker1.position.copy(r1m1_pos);
                        r1m2_pos = new THREE.Vector3(0, 0, 0);
                        r1marker2.position.copy(r1m2_pos);
                        r1m3_pos = new THREE.Vector3(0, 0, 0);
                        r1marker3.position.copy(r1m3_pos);
                        r1m4_pos = new THREE.Vector3(0, 0, 0);
                        r1marker4.position.copy(r1m4_pos);
                    }

                    // Check if the Rectangle row has values or not
                    else if (csvData[index_frame][r1x]) { // x from marker position
                        // Set the object's markers
                        r1m1_pos = new THREE.Vector3(csvData[index_frame][r1x], csvData[index_frame][r1x+1], csvData[index_frame][r1x+2]);
                        r1marker1.position.copy(r1m1_pos);
                        r1m2_pos = new THREE.Vector3(csvData[index_frame][r1x+3], csvData[index_frame][r1x+4], csvData[index_frame][r1x+5]);
                        r1marker2.position.copy(r1m2_pos);
                        r1m3_pos = new THREE.Vector3(csvData[index_frame][r1x+6], csvData[index_frame][r1x+7], csvData[index_frame][r1x+8]);
                        r1marker3.position.copy(r1m3_pos);
                        r1m4_pos = new THREE.Vector3(csvData[index_frame][r1x+9], csvData[index_frame][r1x+10], csvData[index_frame][r1x+11]);
                        r1marker4.position.copy(r1m4_pos);

                        // Connect markers with a line
                        r1linegeo.vertices[0].set(csvData[index_frame][r1x], csvData[index_frame][r1x+1], csvData[index_frame][r1x+2]);
                        r1linegeo.vertices[1].set(csvData[index_frame][r1x+3], csvData[index_frame][r1x+4], csvData[index_frame][r1x+5]);
                        r1linegeo.vertices[2].set(csvData[index_frame][r1x+6], csvData[index_frame][r1x+7], csvData[index_frame][r1x+8]);
                        r1linegeo.vertices[3].set(csvData[index_frame][r1x+9], csvData[index_frame][r1x+10], csvData[index_frame][r1x+11]);
                        r1linegeo.vertices[4].set(csvData[index_frame][r1x], csvData[index_frame][r1x+1], csvData[index_frame][r1x+2]);
                        r1linegeo.verticesNeedUpdate = true;
                    }

                    // Rectangle 2
                    var r2x = 50;
                    // Check if the Rectangle first row has values or not
                    if (!csvData[index_frame][r2x]) { // x from object position
                        // Set the object's markers
                        r2m1_pos = new THREE.Vector3(0, 0, 0);
                        r2marker1.position.copy(r2m1_pos);
                        r2m2_pos = new THREE.Vector3(0, 0, 0);
                        r2marker2.position.copy(r2m2_pos);
                        r2m3_pos = new THREE.Vector3(0, 0, 0);
                        r2marker3.position.copy(r2m3_pos);
                        r2m4_pos = new THREE.Vector3(0, 0, 0);
                        r2marker4.position.copy(r2m4_pos);
                    }

                    // Check if the Rectangle row has values or not
                    else if (csvData[index_frame][r2x]) { // x from marker position
                        // Set the object's markers
                        r2m1_pos = new THREE.Vector3(csvData[index_frame][r2x], csvData[index_frame][r2x+1], csvData[index_frame][r2x+2]);
                        r2marker1.position.copy(r2m1_pos);
                        r2m2_pos = new THREE.Vector3(csvData[index_frame][r2x+3], csvData[index_frame][r2x+4], csvData[index_frame][r2x+5]);
                        r2marker2.position.copy(r2m2_pos);
                        r2m3_pos = new THREE.Vector3(csvData[index_frame][r2x+6], csvData[index_frame][r2x+7], csvData[index_frame][r2x+8]);
                        r2marker3.position.copy(r2m3_pos);
                        r2m4_pos = new THREE.Vector3(csvData[index_frame][r2x+9], csvData[index_frame][r2x+10], csvData[index_frame][r2x+11]);
                        r2marker4.position.copy(r2m4_pos);

                        // Connect markers with a line
                        r2linegeo.vertices[0].set(csvData[index_frame][r2x], csvData[index_frame][r2x+1], csvData[index_frame][r2x+2]);
                        r2linegeo.vertices[1].set(csvData[index_frame][r2x+3], csvData[index_frame][r2x+4], csvData[index_frame][r2x+5]);
                        r2linegeo.vertices[2].set(csvData[index_frame][r2x+6], csvData[index_frame][r2x+7], csvData[index_frame][r2x+8]);
                        r2linegeo.vertices[3].set(csvData[index_frame][r2x+9], csvData[index_frame][r2x+10], csvData[index_frame][r2x+11]);
                        r2linegeo.vertices[4].set(csvData[index_frame][r2x], csvData[index_frame][r2x+1], csvData[index_frame][r2x+2]);
                        r2linegeo.verticesNeedUpdate = true;
                    }

                    // Rectangle 3
                    var r3x = 62;
                    // Check if the Rectangle first row has values or not
                    if (!csvData[index_frame][r3x]) { // x from object position
                        // Set the object's markers
                        r3m1_pos = new THREE.Vector3(0, 0, 0);
                        r3marker1.position.copy(r3m1_pos);
                        r3m2_pos = new THREE.Vector3(0, 0, 0);
                        r3marker2.position.copy(r3m2_pos);
                        r3m3_pos = new THREE.Vector3(0, 0, 0);
                        r3marker3.position.copy(r3m3_pos);
                        r3m4_pos = new THREE.Vector3(0, 0, 0);
                        r3marker4.position.copy(r3m4_pos);
                    }

                    // Check if the Rectangle row has values or not
                    else if (csvData[index_frame][r3x]) { // x from marker position
                        // Set the object's markers
                        r3m1_pos = new THREE.Vector3(csvData[index_frame][r3x], csvData[index_frame][r3x+1], csvData[index_frame][r3x+2]);
                        r3marker1.position.copy(r3m1_pos);
                        r3m2_pos = new THREE.Vector3(csvData[index_frame][r3x+3], csvData[index_frame][r3x+4], csvData[index_frame][r3x+5]);
                        r3marker2.position.copy(r3m2_pos);
                        r3m3_pos = new THREE.Vector3(csvData[index_frame][r3x+6], csvData[index_frame][r3x+7], csvData[index_frame][r3x+8]);
                        r3marker3.position.copy(r3m3_pos);
                        r3m4_pos = new THREE.Vector3(csvData[index_frame][r3x+9], csvData[index_frame][r3x+10], csvData[index_frame][r3x+11]);
                        r3marker4.position.copy(r3m4_pos);

                        // Connect markers with a line
                        r3linegeo.vertices[0].set(csvData[index_frame][r3x], csvData[index_frame][r3x+1], csvData[index_frame][r3x+2]);
                        r3linegeo.vertices[1].set(csvData[index_frame][r3x+3], csvData[index_frame][r3x+4], csvData[index_frame][r3x+5]);
                        r3linegeo.vertices[2].set(csvData[index_frame][r3x+6], csvData[index_frame][r3x+7], csvData[index_frame][r3x+8]);
                        r3linegeo.vertices[3].set(csvData[index_frame][r3x+9], csvData[index_frame][r3x+10], csvData[index_frame][r3x+11]);
                        r3linegeo.vertices[4].set(csvData[index_frame][r3x], csvData[index_frame][r3x+1], csvData[index_frame][r3x+2]);
                        r3linegeo.verticesNeedUpdate = true;
                    }

                    // Rectangle 4
                    var r4x = 74;
                    // Check if the Rectangle first row has values or not
                    if (!csvData[index_frame][r4x]) { // x from object position
                        // Set the object's markers
                        r4m1_pos = new THREE.Vector3(0, 0, 0);
                        r4marker1.position.copy(r4m1_pos);
                        r4m2_pos = new THREE.Vector3(0, 0, 0);
                        r4marker2.position.copy(r4m2_pos);
                        r4m3_pos = new THREE.Vector3(0, 0, 0);
                        r4marker3.position.copy(r4m3_pos);
                        r4m4_pos = new THREE.Vector3(0, 0, 0);
                        r4marker4.position.copy(r4m4_pos);
                    }

                    // Check if the Rectangle row has values or not
                    else if (csvData[index_frame][r4x]) { // x from marker position
                        // Set the object's markers
                        r4m1_pos = new THREE.Vector3(csvData[index_frame][r4x], csvData[index_frame][r4x+1], csvData[index_frame][r4x+2]);
                        r4marker1.position.copy(r4m1_pos);
                        r4m2_pos = new THREE.Vector3(csvData[index_frame][r4x+3], csvData[index_frame][r4x+4], csvData[index_frame][r4x+5]);
                        r4marker2.position.copy(r4m2_pos);
                        r4m3_pos = new THREE.Vector3(csvData[index_frame][r4x+6], csvData[index_frame][r4x+7], csvData[index_frame][r4x+8]);
                        r4marker3.position.copy(r4m3_pos);
                        r4m4_pos = new THREE.Vector3(csvData[index_frame][r4x+9], csvData[index_frame][r4x+10], csvData[index_frame][r4x+11]);
                        r4marker4.position.copy(r4m4_pos);

                        // Connect markers with a line
                        r4linegeo.vertices[0].set(csvData[index_frame][r4x], csvData[index_frame][r4x+1], csvData[index_frame][r4x+2]);
                        r4linegeo.vertices[1].set(csvData[index_frame][r4x+3], csvData[index_frame][r4x+4], csvData[index_frame][r4x+5]);
                        r4linegeo.vertices[2].set(csvData[index_frame][r4x+6], csvData[index_frame][r4x+7], csvData[index_frame][r4x+8]);
                        r4linegeo.vertices[3].set(csvData[index_frame][r4x+9], csvData[index_frame][r4x+10], csvData[index_frame][r4x+11]);
                        r4linegeo.vertices[4].set(csvData[index_frame][r4x], csvData[index_frame][r4x+1], csvData[index_frame][r4x+2]);
                        r4linegeo.verticesNeedUpdate = true;
                    }

                    // Rectangle 5
                    var r5x = 86;
                    // Check if the Rectangle first row has values or not
                    if (!csvData[index_frame][r5x]) { // x from object position
                        // Set the object's markers
                        r5m1_pos = new THREE.Vector3(0, 0, 0);
                        r5marker1.position.copy(r5m1_pos);
                        r5m2_pos = new THREE.Vector3(0, 0, 0);
                        r5marker2.position.copy(r5m2_pos);
                        r5m3_pos = new THREE.Vector3(0, 0, 0);
                        r5marker3.position.copy(r5m3_pos);
                        r5m4_pos = new THREE.Vector3(0, 0, 0);
                        r5marker4.position.copy(r5m4_pos);
                    }

                    // Check if the Rectangle row has values or not
                    else if (csvData[index_frame][r5x]) { // x from marker position
                        // Set the object's markers
                        r5m1_pos = new THREE.Vector3(csvData[index_frame][r5x], csvData[index_frame][r5x+1], csvData[index_frame][r5x+2]);
                        r5marker1.position.copy(r5m1_pos);
                        r5m2_pos = new THREE.Vector3(csvData[index_frame][r5x+3], csvData[index_frame][r5x+4], csvData[index_frame][r5x+5]);
                        r5marker2.position.copy(r5m2_pos);
                        r5m3_pos = new THREE.Vector3(csvData[index_frame][r5x+6], csvData[index_frame][r5x+7], csvData[index_frame][r5x+8]);
                        r5marker3.position.copy(r5m3_pos);
                        r5m4_pos = new THREE.Vector3(csvData[index_frame][r5x+9], csvData[index_frame][r5x+10], csvData[index_frame][r5x+11]);
                        r5marker4.position.copy(r5m4_pos);

                        // Connect markers with a line
                        r5linegeo.vertices[0].set(csvData[index_frame][r5x], csvData[index_frame][r5x+1], csvData[index_frame][r5x+2]);
                        r5linegeo.vertices[1].set(csvData[index_frame][r5x+3], csvData[index_frame][r5x+4], csvData[index_frame][r5x+5]);
                        r5linegeo.vertices[2].set(csvData[index_frame][r5x+6], csvData[index_frame][r5x+7], csvData[index_frame][r5x+8]);
                        r5linegeo.vertices[3].set(csvData[index_frame][r5x+9], csvData[index_frame][r5x+10], csvData[index_frame][r5x+11]);
                        r5linegeo.vertices[4].set(csvData[index_frame][r5x], csvData[index_frame][r5x+1], csvData[index_frame][r5x+2]);
                        r5linegeo.verticesNeedUpdate = true;
                    }

                    // Rectangle 6
                    var r6x = 98;
                    // Check if the Rectangle first row has values or not
                    if (!csvData[index_frame][r6x]) { // x from object position
                        // Set the object's markers
                        r6m1_pos = new THREE.Vector3(0, 0, 0);
                        r6marker1.position.copy(r6m1_pos);
                        r6m2_pos = new THREE.Vector3(0, 0, 0);
                        r6marker2.position.copy(r6m2_pos);
                        r6m3_pos = new THREE.Vector3(0, 0, 0);
                        r6marker3.position.copy(r6m3_pos);
                        r6m4_pos = new THREE.Vector3(0, 0, 0);
                        r6marker4.position.copy(r6m4_pos);
                    }

                    // Check if the Rectangle row has values or not
                    else if (csvData[index_frame][r6x]) { // x from marker position
                        // Set the object's markers
                        r6m1_pos = new THREE.Vector3(csvData[index_frame][r6x], csvData[index_frame][r6x+1], csvData[index_frame][r6x+2]);
                        r6marker1.position.copy(r6m1_pos);
                        r6m2_pos = new THREE.Vector3(csvData[index_frame][r6x+3], csvData[index_frame][r6x+4], csvData[index_frame][r6x+5]);
                        r6marker2.position.copy(r6m2_pos);
                        r6m3_pos = new THREE.Vector3(csvData[index_frame][r6x+6], csvData[index_frame][r6x+7], csvData[index_frame][r6x+8]);
                        r6marker3.position.copy(r6m3_pos);
                        r6m4_pos = new THREE.Vector3(csvData[index_frame][r6x+9], csvData[index_frame][r6x+10], csvData[index_frame][r6x+11]);
                        r6marker4.position.copy(r6m4_pos);

                        // Connect markers with a line
                        r6linegeo.vertices[0].set(csvData[index_frame][r6x], csvData[index_frame][r6x+1], csvData[index_frame][r6x+2]);
                        r6linegeo.vertices[1].set(csvData[index_frame][r6x+3], csvData[index_frame][r6x+4], csvData[index_frame][r6x+5]);
                        r6linegeo.vertices[2].set(csvData[index_frame][r6x+6], csvData[index_frame][r6x+7], csvData[index_frame][r6x+8]);
                        r6linegeo.vertices[3].set(csvData[index_frame][r6x+9], csvData[index_frame][r6x+10], csvData[index_frame][r6x+11]);
                        r6linegeo.vertices[4].set(csvData[index_frame][r6x], csvData[index_frame][r6x+1], csvData[index_frame][r6x+2]);
                        r6linegeo.verticesNeedUpdate = true;
                    }

                    // Rectangle 7
                    var r7x = 110;
                    // Check if the Rectangle first row has values or not
                    if (!csvData[index_frame][r7x]) { // x from object position
                        // Set the object's markers
                        r7m1_pos = new THREE.Vector3(0, 0, 0);
                        r7marker1.position.copy(r7m1_pos);
                        r7m2_pos = new THREE.Vector3(0, 0, 0);
                        r7marker2.position.copy(r7m2_pos);
                        r7m3_pos = new THREE.Vector3(0, 0, 0);
                        r7marker3.position.copy(r7m3_pos);
                        r7m4_pos = new THREE.Vector3(0, 0, 0);
                        r7marker4.position.copy(r7m4_pos);
                    }

                    // Check if the Rectangle row has values or not
                    else if (csvData[index_frame][r7x]) { // x from marker position
                        // Set the object's markers
                        r7m1_pos = new THREE.Vector3(csvData[index_frame][r7x], csvData[index_frame][r7x+1], csvData[index_frame][r7x+2]);
                        r7marker1.position.copy(r7m1_pos);
                        r7m2_pos = new THREE.Vector3(csvData[index_frame][r7x+3], csvData[index_frame][r7x+4], csvData[index_frame][r7x+5]);
                        r7marker2.position.copy(r7m2_pos);
                        r7m3_pos = new THREE.Vector3(csvData[index_frame][r7x+6], csvData[index_frame][r7x+7], csvData[index_frame][r7x+8]);
                        r7marker3.position.copy(r7m3_pos);
                        r7m4_pos = new THREE.Vector3(csvData[index_frame][r7x+9], csvData[index_frame][r7x+10], csvData[index_frame][r7x+11]);
                        r7marker4.position.copy(r7m4_pos);

                        // Connect markers with a line
                        r7linegeo.vertices[0].set(csvData[index_frame][r7x], csvData[index_frame][r7x+1], csvData[index_frame][r7x+2]);
                        r7linegeo.vertices[1].set(csvData[index_frame][r7x+3], csvData[index_frame][r7x+4], csvData[index_frame][r7x+5]);
                        r7linegeo.vertices[2].set(csvData[index_frame][r7x+6], csvData[index_frame][r7x+7], csvData[index_frame][r7x+8]);
                        r7linegeo.vertices[3].set(csvData[index_frame][r7x+9], csvData[index_frame][r7x+10], csvData[index_frame][r7x+11]);
                        r7linegeo.vertices[4].set(csvData[index_frame][r7x], csvData[index_frame][r7x+1], csvData[index_frame][r7x+2]);
                        r7linegeo.verticesNeedUpdate = true;
                    }

                    // Rectangle 8
                    var r8x = 122;
                    // Check if the Rectangle first row has values or not
                    if (!csvData[index_frame][r8x]) { // x from object position
                        // Set the object's markers
                        r8m1_pos = new THREE.Vector3(0, 0, 0);
                        r8marker1.position.copy(r8m1_pos);
                        r8m2_pos = new THREE.Vector3(0, 0, 0);
                        r8marker2.position.copy(r8m2_pos);
                        r8m3_pos = new THREE.Vector3(0, 0, 0);
                        r8marker3.position.copy(r8m3_pos);
                        r8m4_pos = new THREE.Vector3(0, 0, 0);
                        r8marker4.position.copy(r8m4_pos);
                    }

                    // Check if the Rectangle row has values or not
                    else if (csvData[index_frame][r8x]) { // x from marker position
                        // Set the object's markers
                        r8m1_pos = new THREE.Vector3(csvData[index_frame][r8x], csvData[index_frame][r8x+1], csvData[index_frame][r8x+2]);
                        r8marker1.position.copy(r8m1_pos);
                        r8m2_pos = new THREE.Vector3(csvData[index_frame][r8x+3], csvData[index_frame][r8x+4], csvData[index_frame][r8x+5]);
                        r8marker2.position.copy(r8m2_pos);
                        r8m3_pos = new THREE.Vector3(csvData[index_frame][r8x+6], csvData[index_frame][r8x+7], csvData[index_frame][r8x+8]);
                        r8marker3.position.copy(r8m3_pos);
                        r8m4_pos = new THREE.Vector3(csvData[index_frame][r8x+9], csvData[index_frame][r8x+10], csvData[index_frame][r8x+11]);
                        r8marker4.position.copy(r8m4_pos);

                        // Connect markers with a line
                        r8linegeo.vertices[0].set(csvData[index_frame][r8x], csvData[index_frame][r8x+1], csvData[index_frame][r8x+2]);
                        r8linegeo.vertices[1].set(csvData[index_frame][r8x+3], csvData[index_frame][r8x+4], csvData[index_frame][r8x+5]);
                        r8linegeo.vertices[2].set(csvData[index_frame][r8x+6], csvData[index_frame][r8x+7], csvData[index_frame][r8x+8]);
                        r8linegeo.vertices[3].set(csvData[index_frame][r8x+9], csvData[index_frame][r8x+10], csvData[index_frame][r8x+11]);
                        r8linegeo.vertices[4].set(csvData[index_frame][r8x], csvData[index_frame][r8x+1], csvData[index_frame][r8x+2]);
                        r8linegeo.verticesNeedUpdate = true;
                    }

                    // Incrementing to next frame
                    index_frame++;
                    csv_frame = csvData[index_frame][0];
                }
                else {
                    // Stop animating at the end of file
                    running = false;
                    console.log("End of file!")
                }
            }

            // Stop animation after x/100 seconds
            if (csv_frame == framelimit) {
                running = false;
                console.log("Frame limit!")
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
