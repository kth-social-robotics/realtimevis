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
                text1.innerHTML = ("Frame: " + csvData['mocap_glasses1']['frame']);
                document.body.appendChild(text1);

                // Tobii Glasses 1
                // Set the object's markers
                g1m1_pos = new THREE.Vector3(csvData['mocap_glasses1']['marker1']['x'], csvData['mocap_glasses1']['marker1']['y'], csvData['mocap_glasses1']['marker1']['z']);
                g1marker1.position.copy(g1m1_pos);
                g1m2_pos = new THREE.Vector3(csvData['mocap_glasses1']['marker2']['x'], csvData['mocap_glasses1']['marker2']['y'], csvData['mocap_glasses1']['marker2']['z']);
                g1marker2.position.copy(g1m2_pos);
                g1m3_pos = new THREE.Vector3(csvData['mocap_glasses1']['marker3']['x'], csvData['mocap_glasses1']['marker3']['y'], csvData['mocap_glasses1']['marker3']['z']);
                g1marker3.position.copy(g1m3_pos);
                g1m4_pos = new THREE.Vector3(csvData['mocap_glasses1']['marker4']['x'], csvData['mocap_glasses1']['marker4']['y'], csvData['mocap_glasses1']['marker4']['z']);
                g1marker4.position.copy(g1m4_pos);

                // Calculate midpoint of two front markers
                g1mc_x = (csvData['mocap_glasses1']['marker3']['x'] + csvData['mocap_glasses1']['marker4']['x']) / 2;
                g1mc_y = (csvData['mocap_glasses1']['marker3']['y'] + csvData['mocap_glasses1']['marker4']['y']) / 2;
                g1mc_z = (csvData['mocap_glasses1']['marker3']['z'] + csvData['mocap_glasses1']['marker4']['z']) / 2;
                g1mc_pos = new THREE.Vector3(g1mc_x, g1mc_y, g1mc_z);
                g1markerc.position.copy(g1mc_pos);

                // Connect markers with a line
                glinegeo1.vertices[0].set(csvData['mocap_glasses1']['marker1']['x'], csvData['mocap_glasses1']['marker1']['y'], csvData['mocap_glasses1']['marker1']['z']);
                glinegeo1.vertices[1].set(csvData['mocap_glasses1']['marker2']['x'], csvData['mocap_glasses1']['marker2']['y'], csvData['mocap_glasses1']['marker2']['z']);
                glinegeo1.vertices[2].set(csvData['mocap_glasses1']['marker3']['x'], csvData['mocap_glasses1']['marker3']['y'], csvData['mocap_glasses1']['marker3']['z']);
                glinegeo1.vertices[3].set(csvData['mocap_glasses1']['marker4']['x'], csvData['mocap_glasses1']['marker4']['y'], csvData['mocap_glasses1']['marker4']['z']);
                glinegeo1.vertices[4].set(csvData['mocap_glasses1']['marker1']['x'], csvData['mocap_glasses1']['marker1']['y'], csvData['mocap_glasses1']['marker1']['z']);
                glinegeo1.verticesNeedUpdate = true;

                // Check that the glasses are on
                if(csvData['tobii_glasses1'] && csvData['tobii_glasses1']['gp3_3d']['x'] != 0){

                    // Gaze GP3 Glasses 1
                    // Set the object's markers
                    gp3_pos1 = new THREE.Vector3(csvData['tobii_glasses1']['gp3_3d']['x'], csvData['tobii_glasses1']['gp3_3d']['y'], csvData['tobii_glasses1']['gp3_3d']['z']);
                    gp3marker1.position.copy(gp3_pos1);

                    // Connect markers with a line
                    gp3linegeo1.vertices[0].set(csvData['tobii_glasses1']['gp3_3d']['x'], csvData['tobii_glasses1']['gp3_3d']['y'], csvData['tobii_glasses1']['gp3_3d']['z']);
                    gp3linegeo1.vertices[1].set(g1mc_x, g1mc_y, g1mc_z);
                    gp3linegeo1.verticesNeedUpdate = true;

                    // Gaze Head pose Glasses 1
                    // Set the object's markers
                    hp_pos1 = new THREE.Vector3(csvData['tobii_glasses1']['headpose']['x'], csvData['tobii_glasses1']['headpose']['y'], csvData['tobii_glasses1']['headpose']['z']);
                    hpmarker1.position.copy(hp_pos1);

                    // Connect markers with a line
                    hplinegeo1.vertices[0].set(csvData['tobii_glasses1']['headpose']['x'], csvData['tobii_glasses1']['headpose']['y'], csvData['tobii_glasses1']['headpose']['z']);
                    hplinegeo1.vertices[1].set(g1mc_x, g1mc_y, g1mc_z);
                    hplinegeo1.verticesNeedUpdate = true;
                }

                // Hand 1R
                // Set the object's markers
                h1rm1_pos = new THREE.Vector3(csvData['mocap_hand1right']['marker1']['x'], csvData['mocap_hand1right']['marker1']['y'], csvData['mocap_hand1right']['marker1']['z']);
                h1rmarker1.position.copy(h1rm1_pos);
                h1rm2_pos = new THREE.Vector3(csvData['mocap_hand1right']['marker2']['x'], csvData['mocap_hand1right']['marker2']['y'], csvData['mocap_hand1right']['marker2']['z']);
                h1rmarker2.position.copy(h1rm2_pos);
                h1rm3_pos = new THREE.Vector3(csvData['mocap_hand1right']['marker3']['x'], csvData['mocap_hand1right']['marker3']['y'], csvData['mocap_hand1right']['marker3']['z']);
                h1rmarker3.position.copy(h1rm3_pos);
                h1rm4_pos = new THREE.Vector3(csvData['mocap_hand1right']['marker4']['x'], csvData['mocap_hand1right']['marker4']['y'], csvData['mocap_hand1right']['marker4']['z']);
                h1rmarker4.position.copy(h1rm4_pos);

                // Get mid point
                h1rmc_x = csvData['mocap_hand1right']['position']['x'];
                h1rmc_y = csvData['mocap_hand1right']['position']['y'];
                h1rmc_z = csvData['mocap_hand1right']['position']['z'];
                h1rmc_pos = new THREE.Vector3(h1rmc_x, h1rmc_y, h1rmc_z);
                h1rmarkerc.position.copy(h1rmc_pos);

                // Connect markers with a line
                hlinegeo1r.vertices[0].set(csvData['mocap_hand1right']['marker1']['x'], csvData['mocap_hand1right']['marker1']['y'], csvData['mocap_hand1right']['marker1']['z']);
                hlinegeo1r.vertices[1].set(csvData['mocap_hand1right']['marker3']['x'], csvData['mocap_hand1right']['marker3']['y'], csvData['mocap_hand1right']['marker3']['z']);
                hlinegeo1r.vertices[2].set(csvData['mocap_hand1right']['marker4']['x'], csvData['mocap_hand1right']['marker4']['y'], csvData['mocap_hand1right']['marker4']['z']);
                hlinegeo1r.vertices[3].set(csvData['mocap_hand1right']['marker2']['x'], csvData['mocap_hand1right']['marker2']['y'], csvData['mocap_hand1right']['marker2']['z']);
                hlinegeo1r.vertices[4].set(csvData['mocap_hand1right']['marker1']['x'], csvData['mocap_hand1right']['marker1']['y'], csvData['mocap_hand1right']['marker1']['z']);
                hlinegeo1r.verticesNeedUpdate = true;

                // Connect glasses and hand with a line
                ghlinegeo1r.vertices[0].set(h1rmc_x, h1rmc_y, h1rmc_z);
                ghlinegeo1r.vertices[1].set(g1mc_x, g1mc_y, g1mc_z);
                ghlinegeo1r.verticesNeedUpdate = true;

                // Target 1
                // Set the object's markers
                t1m1_pos = new THREE.Vector3(csvData['mocap_target1']['marker1']['x'], csvData['mocap_target1']['marker1']['y'], csvData['mocap_target1']['marker1']['z']);
                t1marker1.position.copy(t1m1_pos);
                t1m2_pos = new THREE.Vector3(csvData['mocap_target1']['marker2']['x'], csvData['mocap_target1']['marker2']['y'], csvData['mocap_target1']['marker2']['z']);
                t1marker2.position.copy(t1m2_pos);
                t1m3_pos = new THREE.Vector3(csvData['mocap_target1']['marker3']['x'], csvData['mocap_target1']['marker3']['y'], csvData['mocap_target1']['marker3']['z']);
                t1marker3.position.copy(t1m3_pos);
                t1m4_pos = new THREE.Vector3(csvData['mocap_target1']['marker4']['x'], csvData['mocap_target1']['marker4']['y'], csvData['mocap_target1']['marker4']['z']);
                t1marker4.position.copy(t1m4_pos);

                // Get mid point
                t1mc_x = csvData['mocap_target1']['position']['x'];
                t1mc_y = csvData['mocap_target1']['position']['y'];
                t1mc_z = csvData['mocap_target1']['position']['z'];
                t1mc_pos = new THREE.Vector3(t1mc_x, t1mc_y, t1mc_z);
                t1markerc.position.copy(t1mc_pos);

                // Connect markers with a line
                tlinegeo1.vertices[0].set(csvData['mocap_target1']['marker1']['x'], csvData['mocap_target1']['marker1']['y'], csvData['mocap_target1']['marker1']['z']);
                tlinegeo1.vertices[1].set(csvData['mocap_target1']['marker2']['x'], csvData['mocap_target1']['marker2']['y'], csvData['mocap_target1']['marker2']['z']);
                tlinegeo1.vertices[2].set(csvData['mocap_target1']['marker4']['x'], csvData['mocap_target1']['marker4']['y'], csvData['mocap_target1']['marker4']['z']);
                tlinegeo1.vertices[3].set(csvData['mocap_target1']['marker3']['x'], csvData['mocap_target1']['marker3']['y'], csvData['mocap_target1']['marker3']['z']);
                tlinegeo1.vertices[4].set(csvData['mocap_target1']['marker1']['x'], csvData['mocap_target1']['marker1']['y'], csvData['mocap_target1']['marker1']['z']);
                tlinegeo1.verticesNeedUpdate = true;

                // Target 2
                // Set the object's markers
                t2m1_pos = new THREE.Vector3(csvData['mocap_target2']['marker1']['x'], csvData['mocap_target2']['marker1']['y'], csvData['mocap_target2']['marker1']['z']);
                t2marker1.position.copy(t2m1_pos);
                t2m2_pos = new THREE.Vector3(csvData['mocap_target2']['marker2']['x'], csvData['mocap_target2']['marker2']['y'], csvData['mocap_target2']['marker2']['z']);
                t2marker2.position.copy(t2m2_pos);
                t2m3_pos = new THREE.Vector3(csvData['mocap_target2']['marker3']['x'], csvData['mocap_target2']['marker3']['y'], csvData['mocap_target2']['marker3']['z']);
                t2marker3.position.copy(t2m3_pos);
                t2m4_pos = new THREE.Vector3(csvData['mocap_target2']['marker4']['x'], csvData['mocap_target2']['marker4']['y'], csvData['mocap_target2']['marker4']['z']);
                t2marker4.position.copy(t2m4_pos);

                // Get mid point
                t2mc_x = csvData['mocap_target2']['position']['x'];
                t2mc_y = csvData['mocap_target2']['position']['y'];
                t2mc_z = csvData['mocap_target2']['position']['z'];
                t2mc_pos = new THREE.Vector3(t2mc_x, t2mc_y, t2mc_z);
                t2markerc.position.copy(t2mc_pos);

                // Connect markers with a line
                tlinegeo2.vertices[0].set(csvData['mocap_target2']['marker1']['x'], csvData['mocap_target2']['marker1']['y'], csvData['mocap_target2']['marker1']['z']);
                tlinegeo2.vertices[1].set(csvData['mocap_target2']['marker2']['x'], csvData['mocap_target2']['marker2']['y'], csvData['mocap_target2']['marker2']['z']);
                tlinegeo2.vertices[2].set(csvData['mocap_target2']['marker3']['x'], csvData['mocap_target2']['marker3']['y'], csvData['mocap_target2']['marker3']['z']);
                tlinegeo2.vertices[3].set(csvData['mocap_target2']['marker4']['x'], csvData['mocap_target2']['marker4']['y'], csvData['mocap_target2']['marker4']['z']);
                tlinegeo2.vertices[4].set(csvData['mocap_target2']['marker1']['x'], csvData['mocap_target2']['marker1']['y'], csvData['mocap_target2']['marker1']['z']);
                tlinegeo2.verticesNeedUpdate = true;
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
