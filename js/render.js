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
        var app_frame = 0;
        var app_screen = "";

        if (running) {
            // Start rendering after the first position values
            if (csvData != null) {
                // Stop rendering at the last posision value

                // Check if index_frame has already been changed to file limits
                if (index_frame > 50000) {
                    index_frame = index_frame - csvData[6][0] + 1;
                }

                if (csvData[index_frame] != null) {
                    // Motion capture and gaze output system frame rate is 120. Skip every second frame because of limitation to 60fps.
                    if (csv_frame % 2 == 0) {
                        // console.log("Frame: #" + frame);

                        // Get headers from csv
                        var numFrames = csvData[2][2];
                        var gazeStart = csvData[2][8];
                        var gazeEnd = csvData[2][9];
                        var recStart = csvData[2][10];
                        var appStart = csvData[2][11];
                        var clapStart = csvData[2][12];
                        var clapEnd = csvData[2][13];

                        // Get current csv start and end frame and time
                        var csvFirstFrame = csvData[6][0];
                        var csvFirstTime = csvData[6][1];
                        var csvLastFrame = csvData[49999][0];
                        var csvLastTime = csvData[49999][1];

                        // Text
                        // Display text for frames
                        text1.innerHTML = ("Frame: " + csv_frame);
                        document.body.appendChild(text1);

                        // Display text for time
                        timenow = csv_frame/120;
                        timenow = parseFloat(Math.round(timenow * 100) / 100).toFixed(2);
                        text2.innerHTML = ("Time: " + timenow);
                        document.body.appendChild(text2);

                        // Display text for csv start and end times
                        csvFirstTime = parseFloat(Math.round(csvFirstTime * 100) / 100).toFixed(2);
                        csvLastTime = parseFloat(Math.round(csvLastTime * 100) / 100).toFixed(2);
                        text3.innerHTML = ("CSV Start: " + csvFirstTime + ", CSV End: " + csvLastTime);
                        document.body.appendChild(text3);

                        // Display text for events
                        if (appvis == 'yes'){
                        if (Math.abs(timenow - (appStart - recStart)) < 1) {
                            text4.innerHTML = "App started";
                        }
                        else {
                            text4.innerHTML = "-----------";
                        }
                        }
                        else {
                            text4.innerHTML = "-----------";
                        }
                        document.body.appendChild(text4);

                        // Display text for moderator (channel 3)
                        disp1 = Math.floor((csv_frame/12)+5);
                        text5.innerHTML = "M: " + csvASRData[disp1][4];
                        document.body.appendChild(text5);

                        // Display text for participant 1 (channel 2)
                        disp2 = Math.floor((csv_frame/12)+5);
                        text6.innerHTML = "P1: " + csvASRData[disp2][3];
                        document.body.appendChild(text6);

                        // Display text for participant 2 (channel 1)
                        disp3 = Math.floor((csv_frame/12)+5);
                        text7.innerHTML = "P2: " + csvASRData[disp3][2];
                        document.body.appendChild(text7);

                        if (appvis == 'yes'){
                        // App
                        // Calculate csv frame
                        app_frame = Math.floor((csv_frame/12)+5);

                        // Check what screen is displayed
                        app_screen = csvAppData[app_frame][4];
                        if (app_screen != cur_screen) {
                            // Switch screen according to the diplayed one
                            switch(app_screen) {
                                case "black":
                                    scene.remove(img2);
                                    scene.remove(img3);
                                    scene.remove(img4);
                                    scene.remove(img5);
                                    scene.remove(img6);
                                    scene.remove(img7);
                                    scene.remove(img8);
                                    scene.add(img1);
                                    break;
                                case "flat":
                                    scene.remove(img1);
                                    scene.remove(img3);
                                    scene.remove(img4);
                                    scene.remove(img5);
                                    scene.remove(img6);
                                    scene.remove(img7);
                                    scene.remove(img8);
                                    scene.add(img2);
                                    break;
                                case "shop: bathroom":
                                    scene.remove(img1);
                                    scene.remove(img2);
                                    scene.remove(img4);
                                    scene.remove(img5);
                                    scene.remove(img6);
                                    scene.remove(img7);
                                    scene.remove(img8);
                                    scene.add(img3);
                                    break;
                                case "shop: bedroom":
                                    scene.remove(img1);
                                    scene.remove(img2);
                                    scene.remove(img3);
                                    scene.remove(img5);
                                    scene.remove(img6);
                                    scene.remove(img7);
                                    scene.remove(img8);
                                    scene.add(img4);
                                    break;
                                case "shop: kitchen":
                                    scene.remove(img1);
                                    scene.remove(img2);
                                    scene.remove(img3);
                                    scene.remove(img4);
                                    scene.remove(img6);
                                    scene.remove(img7);
                                    scene.remove(img8);
                                    scene.add(img5);
                                    break;
                                case "shop: living room":
                                    scene.remove(img1);
                                    scene.remove(img2);
                                    scene.remove(img3);
                                    scene.remove(img4);
                                    scene.remove(img5);
                                    scene.remove(img7);
                                    scene.remove(img8);
                                    scene.add(img6);
                                    break;
                                case "shop: misc":
                                    scene.remove(img1);
                                    scene.remove(img2);
                                    scene.remove(img3);
                                    scene.remove(img4);
                                    scene.remove(img5);
                                    scene.remove(img6);
                                    scene.remove(img8);
                                    scene.add(img7);
                                    break;
                                case "shop: rugs":
                                    scene.remove(img1);
                                    scene.remove(img2);
                                    scene.remove(img3);
                                    scene.remove(img4);
                                    scene.remove(img5);
                                    scene.remove(img6);
                                    scene.remove(img7);
                                    scene.add(img8);
                                    break;
                            }
                            cur_screen = app_screen;
                        }

                        // Furniture
                        if (csv_frame == (timetostart * 120)) {
                            // Object images
                            var imgloader = new Array(csvAppData.length-2);
                            var texture = new Array(csvAppData.length-2);
                            var imgmaterial = new Array(csvAppData.length-2);
                            var imggeometry = new Array(csvAppData.length-2);

                            for (k = 5; k < csvAppData[csvAppData.length-2].length - 1; k += 5) {
                                if (csvAppData[csvAppData.length-2][k] != "NULL") {
                                    // Add furniture
                                    imgloader[k] = new THREE.TextureLoader();
                                    texture[k] = imgloader[k].load(csvFurnitureData[csvAppData[csvAppData.length-2][k]][2]);
                                    texture[k].minFilter = THREE.LinearFilter;
                                    imgmaterial[k] = new THREE.MeshPhongMaterial({map: texture[k], transparent: true});

                                    var imgwidth = csvFurnitureData[csvAppData[csvAppData.length-2][k]][3];
                                    var imgheight = csvFurnitureData[csvAppData[csvAppData.length-2][k]][4];

                                    // Apply image pixel transformation and decrease it by 67%
                                    imggeometry[k] = new THREE.CubeGeometry((imgwidth * 0.0002645833) * 0.64, 0.001, (imgheight * 0.0002645833) * 0.64);
                                    img[k] = new THREE.Mesh(imggeometry[k], imgmaterial[k]);

                                    // scene.remove(img[k]);
                                    //img[k].position.set(-0.338, 0.029, 0.370);
                                    //img[k].rotation.y = 1.57;
                                    //scene.add(img[k]);
                                }
                            }
                        }

                        if (cur_screen == "flat") {
                            for (l = 5; l < csvAppData[app_frame-2].length - 1; l += 5) {
                                if (csvAppData[app_frame-2][l] != "NULL") {
                                    // Update furniture
                                    var image_x = csvAppData[app_frame-2][l+1];
                                    var image_y = csvAppData[app_frame-2][l+2];
                                    var image_z = csvAppData[app_frame-2][l+3];
                                    var image_r = csvAppData[app_frame-2][l+4];

                                    var image_xapp = ((((53 * image_y) / 720) - 53) / 100) + 0.051;
                                    var image_yapp = ((94 - ((94 * image_x) / 1280)) / 100) - 0.049;
                                    // Fix z value
                                    // Fix rotation

                                    scene.remove(img[l]);
                                    img[l].position.set(image_xapp, 0.001, image_yapp);

                                    // Update referent object points
                                    if (appvis == 'yes' && refvis != '0'){
                                        // Get object ID
                                        if (csvAppData[app_frame-2][l] == refvis) {
                                            var refx = img[l].position.x;
                                            var refy = img[l].position.y;
                                            var refz = img[l].position.z;
                                        }
                                    }

                                    img[l].rotation.y = 1.57;
                                    scene.add(img[l]);
                                }
                            }
                        }
                        }
                        else {
                            scene.add(img1);
                        }

                        if (cur_screen != "flat" && cur_screen != "black" && refvis != '0' && appvis == 'yes') {
                            // Get values from furniture data and convert to room coordinates
                            var refx = ((((53 * csvFurnitureData[refvis][9]) / 720) - 53) / 100) + 0.051;
                            var refy = 0.001;
                            var refz = ((94 - ((94 * csvFurnitureData[refvis][8]) / 1280)) / 100) - 0.049;
                        }

                        // Tobii Glasses 1
                        var g1x = 89;
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

                            // Console log position and rotation
                            //console.log("No glasses found");
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
                            g1mc_x = (csvData[index_frame][g1x] + csvData[index_frame][g1x+3]) / 2;
                            g1mc_y = (csvData[index_frame][g1x+1] + csvData[index_frame][g1x+4]) / 2;
                            g1mc_z = (csvData[index_frame][g1x+2] + csvData[index_frame][g1x+5]) / 2;
                            g1mc_pos = new THREE.Vector3(g1mc_x, g1mc_y, g1mc_z);
                            g1markerc.position.copy(g1mc_pos);

                            // Connect markers with a line
                            glinegeo1.vertices[0].set(csvData[index_frame][g1x], csvData[index_frame][g1x+1], csvData[index_frame][g1x+2]);
                            glinegeo1.vertices[1].set(csvData[index_frame][g1x+3], csvData[index_frame][g1x+4], csvData[index_frame][g1x+5]);
                            glinegeo1.vertices[2].set(csvData[index_frame][g1x+6], csvData[index_frame][g1x+7], csvData[index_frame][g1x+8]);
                            glinegeo1.vertices[3].set(csvData[index_frame][g1x+9], csvData[index_frame][g1x+10], csvData[index_frame][g1x+11]);
                            glinegeo1.vertices[4].set(csvData[index_frame][g1x], csvData[index_frame][g1x+1], csvData[index_frame][g1x+2]);
                            glinegeo1.verticesNeedUpdate = true;
                        }
                        else {
                            // Console log position and rotation (unknown)
                            //console.log("Glasses Position: Unknown");
                        }

                        // Tobii Glasses 2
                        var g2x = 101;
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

                            // Console log position and rotation
                            //console.log("No glasses found");
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
                            g2mc_x = (csvData[index_frame][g2x] + csvData[index_frame][g2x+3]) / 2;
                            g2mc_y = (csvData[index_frame][g2x+1] + csvData[index_frame][g2x+4]) / 2;
                            g2mc_z = (csvData[index_frame][g2x+2] + csvData[index_frame][g2x+5]) / 2;
                            g2mc_pos = new THREE.Vector3(g2mc_x, g2mc_y, g2mc_z);
                            g2markerc.position.copy(g2mc_pos);

                            // Connect markers with a line
                            glinegeo2.vertices[0].set(csvData[index_frame][g2x], csvData[index_frame][g2x+1], csvData[index_frame][g2x+2]);
                            glinegeo2.vertices[1].set(csvData[index_frame][g2x+3], csvData[index_frame][g2x+4], csvData[index_frame][g2x+5]);
                            glinegeo2.vertices[2].set(csvData[index_frame][g2x+6], csvData[index_frame][g2x+7], csvData[index_frame][g2x+8]);
                            glinegeo2.vertices[3].set(csvData[index_frame][g2x+9], csvData[index_frame][g2x+10], csvData[index_frame][g2x+11]);
                            glinegeo2.vertices[4].set(csvData[index_frame][g2x], csvData[index_frame][g2x+1], csvData[index_frame][g2x+2]);
                            glinegeo2.verticesNeedUpdate = true;
                        }
                        else {
                            // Console log position and rotation (unknown)
                            //console.log("Glasses Position: Unknown");
                        }

                        // Tobii Glasses 3
                        var g3x = 113;
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

                            // Console log position and rotation
                            //console.log("No glasses found");
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
                            g3mc_x = (csvData[index_frame][g3x] + csvData[index_frame][g3x+9]) / 2;
                            g3mc_y = (csvData[index_frame][g3x+1] + csvData[index_frame][g3x+10]) / 2;
                            g3mc_z = (csvData[index_frame][g3x+2] + csvData[index_frame][g3x+11]) / 2;
                            g3mc_pos = new THREE.Vector3(g3mc_x, g3mc_y, g3mc_z);
                            g3markerc.position.copy(g3mc_pos);

                            // Connect markers with a line
                            glinegeo3.vertices[0].set(csvData[index_frame][g3x], csvData[index_frame][g3x+1], csvData[index_frame][g3x+2]);
                            glinegeo3.vertices[1].set(csvData[index_frame][g3x+6], csvData[index_frame][g3x+7], csvData[index_frame][g3x+8]);
                            glinegeo3.vertices[2].set(csvData[index_frame][g3x+3], csvData[index_frame][g3x+4], csvData[index_frame][g3x+5]);
                            glinegeo3.vertices[3].set(csvData[index_frame][g3x+9], csvData[index_frame][g3x+10], csvData[index_frame][g3x+11]);
                            glinegeo3.vertices[4].set(csvData[index_frame][g3x], csvData[index_frame][g3x+1], csvData[index_frame][g3x+2]);
                            glinegeo3.verticesNeedUpdate = true;
                        }
                        else {
                            // Console log position and rotation (unknown)
                            //console.log("Glasses Position: Unknown");
                        }

                        // Left Hand 1
                        var lh1x = 20;
                        // Check if the Left Hand 1 row has values or not
                        if (csvData[index_frame][lh1x]) { // x from object position
                            // Set the object's markers
                            lh1m1_pos = new THREE.Vector3(csvData[index_frame][lh1x], csvData[index_frame][lh1x+1], csvData[index_frame][lh1x+2]);
                            lh1marker1.position.copy(lh1m1_pos);
                            lh1m2_pos = new THREE.Vector3(csvData[index_frame][lh1x+3], csvData[index_frame][lh1x+4], csvData[index_frame][lh1x+5]);
                            lh1marker2.position.copy(lh1m2_pos);
                            lh1m3_pos = new THREE.Vector3(csvData[index_frame][lh1x+6], csvData[index_frame][lh1x+7], csvData[index_frame][lh1x+8]);
                            lh1marker3.position.copy(lh1m3_pos);
                            lh1m4_pos = new THREE.Vector3(csvData[index_frame][lh1x+9], csvData[index_frame][lh1x+10], csvData[index_frame][lh1x+11]);
                            lh1marker4.position.copy(lh1m4_pos);

                            // Connect markers with a line
                            lh1linegeo.vertices[0].set(csvData[index_frame][lh1x], csvData[index_frame][lh1x+1], csvData[index_frame][lh1x+2]);
                            lh1linegeo.vertices[1].set(csvData[index_frame][lh1x+3], csvData[index_frame][lh1x+4], csvData[index_frame][lh1x+5]);
                            lh1linegeo.vertices[2].set(csvData[index_frame][lh1x+6], csvData[index_frame][lh1x+7], csvData[index_frame][lh1x+8]);
                            lh1linegeo.vertices[3].set(csvData[index_frame][lh1x+9], csvData[index_frame][lh1x+10], csvData[index_frame][lh1x+11]);
                            lh1linegeo.vertices[4].set(csvData[index_frame][lh1x], csvData[index_frame][lh1x+1], csvData[index_frame][lh1x+2]);
                            lh1linegeo.verticesNeedUpdate = true;
                        }
                        else {
                            // Console log position and rotation (unknown)
                            //console.log("Hand Marker Position: Unknown");
                        }

                        // Right Hand 1
                        var rh1x = 32;
                        // Check if the Right Hand 1 row has values or not
                        if (csvData[index_frame][rh1x]) { // x from object position
                            // Set the object's markers
                            rh1m1_pos = new THREE.Vector3(csvData[index_frame][rh1x], csvData[index_frame][rh1x+1], csvData[index_frame][rh1x+2]);
                            rh1marker1.position.copy(rh1m1_pos);
                            rh1m2_pos = new THREE.Vector3(csvData[index_frame][rh1x+3], csvData[index_frame][rh1x+4], csvData[index_frame][rh1x+5]);
                            rh1marker2.position.copy(rh1m2_pos);
                            rh1m3_pos = new THREE.Vector3(csvData[index_frame][rh1x+6], csvData[index_frame][rh1x+7], csvData[index_frame][rh1x+8]);
                            rh1marker3.position.copy(rh1m3_pos);
                            rh1m4_pos = new THREE.Vector3(csvData[index_frame][rh1x+9], csvData[index_frame][rh1x+10], csvData[index_frame][rh1x+11]);
                            rh1marker4.position.copy(rh1m4_pos);

                            // Connect markers with a line
                            rh1linegeo.vertices[0].set(csvData[index_frame][rh1x], csvData[index_frame][rh1x+1], csvData[index_frame][rh1x+2]);
                            rh1linegeo.vertices[1].set(csvData[index_frame][rh1x+3], csvData[index_frame][rh1x+4], csvData[index_frame][rh1x+5]);
                            rh1linegeo.vertices[2].set(csvData[index_frame][rh1x+9], csvData[index_frame][rh1x+10], csvData[index_frame][rh1x+11]);
                            rh1linegeo.vertices[3].set(csvData[index_frame][rh1x+6], csvData[index_frame][rh1x+7], csvData[index_frame][rh1x+8]);
                            rh1linegeo.vertices[4].set(csvData[index_frame][rh1x], csvData[index_frame][rh1x+1], csvData[index_frame][rh1x+2]);
                            rh1linegeo.verticesNeedUpdate = true;
                        }
                        else {
                            // Console log position and rotation (unknown)
                            //console.log("Hand Marker Position: Unknown");
                        }

                        // Left Hand 2
                        var lh2x = 44;
                        // Check if the Left Hand 2 row has values or not
                        if (csvData[index_frame][lh2x]) { // x from object position
                            // Set the object's markers
                            lh2m1_pos = new THREE.Vector3(csvData[index_frame][lh2x], csvData[index_frame][lh2x+1], csvData[index_frame][lh2x+2]);
                            lh2marker1.position.copy(lh2m1_pos);
                            lh2m2_pos = new THREE.Vector3(csvData[index_frame][lh2x+3], csvData[index_frame][lh2x+4], csvData[index_frame][lh2x+5]);
                            lh2marker2.position.copy(lh2m2_pos);
                            lh2m3_pos = new THREE.Vector3(csvData[index_frame][lh2x+6], csvData[index_frame][lh2x+7], csvData[index_frame][lh2x+8]);
                            lh2marker3.position.copy(lh2m3_pos);
                            lh2m4_pos = new THREE.Vector3(csvData[index_frame][lh2x+9], csvData[index_frame][lh2x+10], csvData[index_frame][lh2x+11]);
                            lh2marker4.position.copy(lh2m4_pos);

                            // Connect markers with a line
                            lh2linegeo.vertices[0].set(csvData[index_frame][lh2x], csvData[index_frame][lh2x+1], csvData[index_frame][lh2x+2]);
                            lh2linegeo.vertices[1].set(csvData[index_frame][lh2x+3], csvData[index_frame][lh2x+4], csvData[index_frame][lh2x+5]);
                            lh2linegeo.vertices[2].set(csvData[index_frame][lh2x+9], csvData[index_frame][lh2x+10], csvData[index_frame][lh2x+11]);
                            lh2linegeo.vertices[3].set(csvData[index_frame][lh2x+6], csvData[index_frame][lh2x+7], csvData[index_frame][lh2x+8]);
                            lh2linegeo.vertices[4].set(csvData[index_frame][lh2x], csvData[index_frame][lh2x+1], csvData[index_frame][lh2x+2]);
                            lh2linegeo.verticesNeedUpdate = true;
                        }
                        else {
                            // Console log position and rotation (unknown)
                            //console.log("Hand Marker Position: Unknown");
                        }

                        // Right Hand 2
                        var rh2x = 56;
                        // Check if the Right Hand 2 row has values or not
                        if (csvData[index_frame][rh2x]) { // x from object position
                            // Set the object's markers
                            rh2m1_pos = new THREE.Vector3(csvData[index_frame][rh2x], csvData[index_frame][rh2x+1], csvData[index_frame][rh2x+2]);
                            rh2marker1.position.copy(rh2m1_pos);
                            rh2m2_pos = new THREE.Vector3(csvData[index_frame][rh2x+3], csvData[index_frame][rh2x+4], csvData[index_frame][rh2x+5]);
                            rh2marker2.position.copy(rh2m2_pos);
                            rh2m3_pos = new THREE.Vector3(csvData[index_frame][rh2x+6], csvData[index_frame][rh2x+7], csvData[index_frame][rh2x+8]);
                            rh2marker3.position.copy(rh2m3_pos);
                            rh2m4_pos = new THREE.Vector3(csvData[index_frame][rh2x+9], csvData[index_frame][rh2x+10], csvData[index_frame][rh2x+11]);
                            rh2marker4.position.copy(rh2m4_pos);

                            // Connect markers with a line
                            rh2linegeo.vertices[0].set(csvData[index_frame][rh2x], csvData[index_frame][rh2x+1], csvData[index_frame][rh2x+2]);
                            rh2linegeo.vertices[1].set(csvData[index_frame][rh2x+3], csvData[index_frame][rh2x+4], csvData[index_frame][rh2x+5]);
                            rh2linegeo.vertices[2].set(csvData[index_frame][rh2x+6], csvData[index_frame][rh2x+7], csvData[index_frame][rh2x+8]);
                            rh2linegeo.vertices[3].set(csvData[index_frame][rh2x+9], csvData[index_frame][rh2x+10], csvData[index_frame][rh2x+11]);
                            rh2linegeo.vertices[4].set(csvData[index_frame][rh2x], csvData[index_frame][rh2x+1], csvData[index_frame][rh2x+2]);
                            rh2linegeo.verticesNeedUpdate = true;
                        }
                        else {
                            // Console log position and rotation (unknown)
                            //console.log("Hand Marker Position: Unknown");
                        }

                        // // Screen
                        // var sx = 77;
                        // // Check if the Screen row has values or not
                        // if (csvData[index_frame][sx]) { // x from object position
                        //     // Set the object's markers
                        //     sm1_pos = new THREE.Vector3(csvData[6][sx], csvData[6][sx+1], csvData[6][sx+2]);
                        //     smarker1.position.copy(sm1_pos);
                        //     sm2_pos = new THREE.Vector3(csvData[6][sx+6], csvData[6][sx+7], csvData[6][sx+8]);
                        //     smarker2.position.copy(sm2_pos);
                        //     sm3_pos = new THREE.Vector3(csvData[6][sx+9], csvData[6][sx+10], csvData[6][sx+11]);
                        //     smarker3.position.copy(sm3_pos);
                        //     sm4_pos = new THREE.Vector3(csvData[6][sx+12], csvData[6][sx+13], csvData[6][sx+14]);
                        //     smarker4.position.copy(sm4_pos);
                        //
                        //     // Connect markers with a line
                        //     slinegeo.vertices[0].set(csvData[6][sx], csvData[6][sx+1], csvData[6][sx+2]);
                        //     slinegeo.vertices[1].set(csvData[6][sx+6], csvData[6][sx+7], csvData[6][sx+8]);
                        //     slinegeo.vertices[2].set(csvData[6][sx+9], csvData[6][sx+10], csvData[6][sx+11]);
                        //     slinegeo.vertices[3].set(csvData[6][sx+12], csvData[6][sx+13], csvData[6][sx+14]);
                        //     slinegeo.vertices[4].set(csvData[6][sx], csvData[6][sx+1], csvData[6][sx+2]);
                        //     slinegeo.verticesNeedUpdate = true;
                        // }
                        // else {
                        //     // Console log position and rotation (unknown)
                        //     //console.log("Screen Position: Unknown");
                        // }

                        // Screen (hardcoded take only first line)
                        // Set the object's markers
                        sm1_pos = new THREE.Vector3(csvData[6][77], csvData[6][78], csvData[6][79]);
                        smarker1.position.copy(sm1_pos);
                        sm2_pos = new THREE.Vector3(csvData[6][80], csvData[6][81], csvData[6][82]);
                        smarker2.position.copy(sm2_pos);
                        sm3_pos = new THREE.Vector3(csvData[6][83], csvData[6][84], csvData[6][85]);
                        smarker3.position.copy(sm3_pos);
                        sm4_pos = new THREE.Vector3(csvData[6][86], csvData[6][87], csvData[6][88]);
                        smarker4.position.copy(sm4_pos);

                        // Screen central marker
                        sm_pos = new THREE.Vector3((csvData[6][80] + csvData[6][86]) / 2, (csvData[6][81] + csvData[6][87]) / 2, (csvData[6][82] + csvData[6][88]) / 2);
                        smarker.position.copy(sm_pos);

                        // Connect markers with a line
                        slinegeo.vertices[0].set(csvData[6][77], csvData[6][78], csvData[6][79]);
                        slinegeo.vertices[1].set(csvData[6][80], csvData[6][81], csvData[6][82]);
                        slinegeo.vertices[2].set(csvData[6][83], csvData[6][84], csvData[6][85]);
                        slinegeo.vertices[3].set(csvData[6][86], csvData[6][87], csvData[6][88]);
                        slinegeo.vertices[4].set(csvData[6][77], csvData[6][78], csvData[6][79]);
                        slinegeo.verticesNeedUpdate = true;

                        // Gaze GP3 Glasses 1
                        var g1gp3x = 131;
                        // Check if the Gaze GP3 first row has values or not
                        if (!csvData[index_frame][g1gp3x]) { // x from object position
                            // Set the object's markers
                            gp3_pos1 = new THREE.Vector3(0, 0, 0);
                            gp3marker1.position.copy(gp3_pos1);

                            // Console log position and rotation
                            //console.log("No gp3 for glasses 1 found");
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
                        else {
                            // Console log position and rotation (unknown)
                            //console.log("GP3 Glasses 1 Position: Unknown");
                        }

                        // Gaze GP3 Glasses 2
                        var g2gp3x = 143;
                        // Check if the Gaze GP3 first row has values or not
                        if (!csvData[index_frame][g2gp3x]) { // x from object position
                            // Set the object's markers
                            gp3_pos2 = new THREE.Vector3(0, 0, 0);
                            gp3marker2.position.copy(gp3_pos2);

                            // Console log position and rotation
                            //console.log("No gp3 for glasses 2 found");
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
                        else {
                            // Console log position and rotation (unknown)
                            //console.log("GP3 Glasses 2 Position: Unknown");
                        }

                        // Gaze GP3 Glasses 3
                        var g3gp3x = 155;
                        // Check if the Gaze GP3 first row has values or not
                        if (!csvData[index_frame][g3gp3x]) { // x from object position
                            // Set the object's markers
                            gp3_pos3 = new THREE.Vector3(0, 0, 0);
                            gp3marker3.position.copy(gp3_pos3);

                            // Console log position and rotation
                            //console.log("No gp3 for glasses 3 found");
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
                        else {
                            // Console log position and rotation (unknown)
                            //console.log("GP3 Glasses 3 Position: Unknown");
                        }

                        // Head pose
                        if (headposevis == 'yes'){
                            // Gaze Head pose Glasses 1
                            var g1hpx = 134;
                            // Check if the Gaze Headpose first row has values or not
                            if (!csvData[index_frame][g1hpx]) { // x from object position
                                // Set the object's markers
                                hp_pos1 = new THREE.Vector3(0, 0, 0);
                                hpmarker1.position.copy(hp_pos1);
                            }
                            // Check if the Gaze Headpose row has values or not
                            else if (csvData[index_frame][g1hpx]) { // x from marker position
                                // Set the object's markers
                                hp_pos1 = new THREE.Vector3(csvData[index_frame][g1hpx], csvData[index_frame][g1hpx+1], csvData[index_frame][g1hpx+2]);
                                hpmarker1.position.copy(hp_pos1);

                                // Connect markers with a line
                                hplinegeo1.vertices[0].set(csvData[index_frame][g1hpx], csvData[index_frame][g1hpx+1], csvData[index_frame][g1hpx+2]);
                                hplinegeo1.vertices[1].set(g1mc_x, g1mc_y, g1mc_z);
                                hplinegeo1.verticesNeedUpdate = true;
                            }

                            // Gaze Head pose Glasses 2
                            var g2hpx = 146;
                            // Check if the Gaze Headpose first row has values or not
                            if (!csvData[index_frame][g2hpx]) { // x from object position
                                // Set the object's markers
                                hp_pos2 = new THREE.Vector3(0, 0, 0);
                                hpmarker2.position.copy(hp_pos2);
                            }
                            // Check if the Gaze Headpose row has values or not
                            else if (csvData[index_frame][g2hpx]) { // x from marker position
                                // Set the object's markers
                                hp_pos2 = new THREE.Vector3(csvData[index_frame][g2hpx], csvData[index_frame][g2hpx+1], csvData[index_frame][g2hpx+2]);
                                hpmarker2.position.copy(hp_pos2);

                                // Connect markers with a line
                                hplinegeo2.vertices[0].set(csvData[index_frame][g2hpx], csvData[index_frame][g2hpx+1], csvData[index_frame][g2hpx+2]);
                                hplinegeo2.vertices[1].set(g2mc_x, g2mc_y, g2mc_z);
                                hplinegeo2.verticesNeedUpdate = true;
                            }

                            // Gaze Head pose Glasses 3
                            var g3hpx = 158;
                            // Check if the Gaze Headpose first row has values or not
                            if (!csvData[index_frame][g3hpx]) { // x from object position
                                // Set the object's markers
                                hp_pos3 = new THREE.Vector3(0, 0, 0);
                                hpmarker3.position.copy(hp_pos3);
                            }
                            // Check if the Gaze Headpose row has values or not
                            else if (csvData[index_frame][g3hpx]) { // x from marker position
                                // Set the object's markers
                                hp_pos3 = new THREE.Vector3(csvData[index_frame][g3hpx], csvData[index_frame][g3hpx+1], csvData[index_frame][g3hpx+2]);
                                hpmarker3.position.copy(hp_pos3);

                                // Connect markers with a line
                                hplinegeo3.vertices[0].set(csvData[index_frame][g3hpx], csvData[index_frame][g3hpx+1], csvData[index_frame][g3hpx+2]);
                                hplinegeo3.vertices[1].set(g3mc_x, g3mc_y, g3mc_z);
                                hplinegeo3.verticesNeedUpdate = true;
                            }
                        }

                        // Reference point
                        if (refvis != '0'){
                            // Update reference point if no_app and to a human
                            if (refvis != '0' && appvis == 'no') {
                                // Refpoint x, y, z
                                if (refvis == 'm') {
                                    var refx = g1mc_x;
                                    var refy = g1mc_y;
                                    var refz = g1mc_z;
                                }
                                else if (refvis == 'p1') {
                                    var refx = g3mc_x;
                                    var refy = g3mc_y;
                                    var refz = g3mc_z;
                                }
                                else if (refvis == 'p2') {
                                    var refx = g2mc_x;
                                    var refy = g2mc_y;
                                    var refz = g2mc_z;
                                }
                            }

                            // Refpoint Glasses 1
                            // Connect glasses marker and screen marker with a line
                            reflinegeo1.vertices[0].set(refx, refy, refz);
                            reflinegeo1.vertices[1].set(g1mc_x, g1mc_y, g1mc_z);
                            reflinegeo1.verticesNeedUpdate = true;

                            // Refpoint Glasses 2
                            // Connect glasses marker and screen marker with a line
                            reflinegeo2.vertices[0].set(refx, refy, refz);
                            reflinegeo2.vertices[1].set(g2mc_x, g2mc_y, g2mc_z);
                            reflinegeo2.verticesNeedUpdate = true;

                            // Refpoint Glasses 3
                            // Connect glasses marker and screen marker with a line
                            reflinegeo3.vertices[0].set(refx, refy, refz);
                            reflinegeo3.vertices[1].set(g3mc_x, g3mc_y, g3mc_z);
                            reflinegeo3.verticesNeedUpdate = true;
                        }

                        // Calculate angles
                        if (refvis != '0'){
                            // Glasses 1
                            // Vector glasses 1 to refpoint
                            vgr1 = [refx - g1mc_x, refy - g1mc_y, refz - g1mc_z];
                            // The dot product of vgr and vgh is a function of the cosine of the angle between them
                            // (it's scaled by the product of their magnitudes). So first normalise vgr and vgh
                            vgr1mag = Math.sqrt((vgr1[0] * vgr1[0]) + (vgr1[1] * vgr1[1]) + (vgr1[2] * vgr1[2]));
                            vgr1norm = [vgr1[0] / vgr1mag, vgr1[1] / vgr1mag, vgr1[2] / vgr1mag];

                            // Head pose 1 to reference point
                            // Head pose x, y, z
                            var hp1x = csvData[index_frame][g1hpx];
                            var hp1y = csvData[index_frame][g1hpx+1];
                            var hp1z = csvData[index_frame][g1hpx+2];
                            // Vector glasses to head pose
                            vgh1 = [hp1x - g1mc_x, hp1y - g1mc_y, hp1z - g1mc_z];
                            // The dot product of vgr and vgh is a function of the cosine of the angle between them
                            // (it's scaled by the product of their magnitudes). So first normalise vgr and vgh
                            vgh1mag = Math.sqrt((vgh1[0] * vgh1[0]) + (vgh1[1] * vgh1[1]) + (vgh1[2] * vgh1[2]));
                            vgh1norm = [vgh1[0] / vgh1mag, vgh1[1] / vgh1mag, vgh1[2] / vgh1mag];
                            // Then calculate the dot product
                            resh1 = (vgr1norm[0] * vgh1norm[0]) + (vgr1norm[1] * vgh1norm[1]) + (vgr1norm[2] * vgh1norm[2]);
                            // Recover the angle
                            angleh1 = Math.acos(resh1);
                            // Angle in degrees
                            angleh1deg = angleh1 * (180 / Math.PI);

                            // Gaze 1 to reference point
                            // Gaze x, y, z
                            var gr1x = csvData[index_frame][g1gp3x];
                            var gr1y = csvData[index_frame][g1gp3x+1];
                            var gr1z = csvData[index_frame][g1gp3x+2];
                            // Vector glasses to gp3
                            vgg1 = [gr1x - g1mc_x, gr1y - g1mc_y, gr1z - g1mc_z];
                            // The dot product of vgr and vgh is a function of the cosine of the angle between them
                            // (it's scaled by the product of their magnitudes). So first normalise vgr and vgh
                            vgg1mag = Math.sqrt((vgg1[0] * vgg1[0]) + (vgg1[1] * vgg1[1]) + (vgg1[2] * vgg1[2]));
                            vgg1norm = [vgg1[0] / vgg1mag, vgg1[1] / vgg1mag, vgg1[2] / vgg1mag];
                            // Then calculate the dot product
                            resg1 = (vgr1norm[0] * vgg1norm[0]) + (vgr1norm[1] * vgg1norm[1]) + (vgr1norm[2] * vgg1norm[2]);
                            // Recover the angle
                            angleg1 = Math.acos(resg1);
                            // Angle in degrees
                            angleg1deg = angleg1 * (180 / Math.PI);


                            // Glasses 2
                            // Vector glasses 2 to refpoint
                            vgr2 = [refx - g2mc_x, refy - g2mc_y, refz - g2mc_z];
                            // The dot product of vgr and vgh is a function of the cosine of the angle between them
                            // (it's scaled by the product of their magnitudes). So first normalise vgr and vgh
                            vgr2mag = Math.sqrt((vgr2[0] * vgr2[0]) + (vgr2[1] * vgr2[1]) + (vgr2[2] * vgr2[2]));
                            vgr2norm = [vgr2[0] / vgr2mag, vgr2[1] / vgr2mag, vgr2[2] / vgr2mag];

                            // Head pose 2 to reference point
                            // Head pose x, y, z
                            var hp2x = csvData[index_frame][g2hpx];
                            var hp2y = csvData[index_frame][g2hpx+1];
                            var hp2z = csvData[index_frame][g2hpx+2];
                            // Vector glasses to head pose
                            vgh2 = [hp2x - g2mc_x, hp2y - g2mc_y, hp2z - g2mc_z];
                            // The dot product of vgr and vgh is a function of the cosine of the angle between them
                            // (it's scaled by the product of their magnitudes). So first normalise vgr and vgh
                            vgh2mag = Math.sqrt((vgh2[0] * vgh2[0]) + (vgh2[1] * vgh2[1]) + (vgh2[2] * vgh2[2]));
                            vgh2norm = [vgh2[0] / vgh2mag, vgh2[1] / vgh2mag, vgh2[2] / vgh2mag];
                            // Then calculate the dot product
                            resh2 = (vgr2norm[0] * vgh2norm[0]) + (vgr2norm[1] * vgh2norm[1]) + (vgr2norm[2] * vgh2norm[2]);
                            // Recover the angle
                            angleh2 = Math.acos(resh2);
                            // Angle in degrees
                            angleh2deg = angleh2 * (180 / Math.PI);

                            // Gaze 2 to reference point
                            // Gaze x, y, z
                            var gr2x = csvData[index_frame][g2gp3x];
                            var gr2y = csvData[index_frame][g2gp3x+1];
                            var gr2z = csvData[index_frame][g2gp3x+2];
                            // Vector glasses to gp3
                            vgg2 = [gr2x - g2mc_x, gr2y - g2mc_y, gr2z - g2mc_z];
                            // The dot product of vgr and vgh is a function of the cosine of the angle between them
                            // (it's scaled by the product of their magnitudes). So first normalise vgr and vgh
                            vgg2mag = Math.sqrt((vgg2[0] * vgg2[0]) + (vgg2[1] * vgg2[1]) + (vgg2[2] * vgg2[2]));
                            vgg2norm = [vgg2[0] / vgg2mag, vgg2[1] / vgg2mag, vgg2[2] / vgg2mag];
                            // Then calculate the dot product
                            resg2 = (vgr2norm[0] * vgg2norm[0]) + (vgr2norm[1] * vgg2norm[1]) + (vgr2norm[2] * vgg2norm[2]);
                            // Recover the angle
                            angleg2 = Math.acos(resg2);
                            // Angle in degrees
                            angleg2deg = angleg2 * (180 / Math.PI);


                            // Glasses 3
                            // Vector glasses 3 to refpoint
                            vgr3 = [refx - g3mc_x, refy - g3mc_y, refz - g3mc_z];
                            // The dot product of vgr and vgh is a function of the cosine of the angle between them
                            // (it's scaled by the product of their magnitudes). So first normalise vgr and vgh
                            vgr3mag = Math.sqrt((vgr3[0] * vgr3[0]) + (vgr3[1] * vgr3[1]) + (vgr3[2] * vgr3[2]));
                            vgr3norm = [vgr3[0] / vgr3mag, vgr3[1] / vgr3mag, vgr3[2] / vgr3mag];

                            // Head pose 3 to reference point
                            // Head pose x, y, z
                            var hp3x = csvData[index_frame][g3hpx];
                            var hp3y = csvData[index_frame][g3hpx+1];
                            var hp3z = csvData[index_frame][g3hpx+2];
                            // Vector glasses to head pose
                            vgh3 = [hp3x - g3mc_x, hp3y - g3mc_y, hp3z - g3mc_z];
                            // The dot product of vgr and vgh is a function of the cosine of the angle between them
                            // (it's scaled by the product of their magnitudes). So first normalise vgr and vgh
                            vgh3mag = Math.sqrt((vgh3[0] * vgh3[0]) + (vgh3[1] * vgh3[1]) + (vgh3[2] * vgh3[2]));
                            vgh3norm = [vgh3[0] / vgh3mag, vgh3[1] / vgh3mag, vgh3[2] / vgh3mag];
                            // Then calculate the dot product
                            resh3 = (vgr3norm[0] * vgh3norm[0]) + (vgr3norm[1] * vgh3norm[1]) + (vgr3norm[2] * vgh3norm[2]);
                            // Recover the angle
                            angleh3 = Math.acos(resh3);
                            // Angle in degrees
                            angleh3deg = angleh3 * (180 / Math.PI);

                            // Gaze 3 to reference point
                            // Gaze x, y, z
                            var gr3x = csvData[index_frame][g3gp3x];
                            var gr3y = csvData[index_frame][g3gp3x+1];
                            var gr3z = csvData[index_frame][g3gp3x+2];
                            // Vector glasses to gp3
                            vgg3 = [gr3x - g3mc_x, gr3y - g3mc_y, gr3z - g3mc_z];
                            // The dot product of vgr and vgh is a function of the cosine of the angle between them
                            // (it's scaled by the product of their magnitudes). So first normalise vgr and vgh
                            vgg3mag = Math.sqrt((vgg3[0] * vgg3[0]) + (vgg3[1] * vgg3[1]) + (vgg3[2] * vgg3[2]));
                            vgg3norm = [vgg3[0] / vgg3mag, vgg3[1] / vgg3mag, vgg3[2] / vgg3mag];
                            // Then calculate the dot product
                            resg3 = (vgr3norm[0] * vgg3norm[0]) + (vgr3norm[1] * vgg3norm[1]) + (vgr3norm[2] * vgg3norm[2]);
                            // Recover the angle
                            angleg3 = Math.acos(resg3);
                            // Angle in degrees
                            angleg3deg = angleg3 * (180 / Math.PI);

                            console.log("-------------------------------------");
                            console.log("Head pose 1 (M) angle: ", angleh1deg);
                            console.log("Gaze 1 (M) angle: ", angleg1deg);
                            console.log("Head pose 2 (P2) angle: ", angleh2deg);
                            console.log("Gaze 2 (P2) angle: ", angleg2deg);
                            console.log("Head pose 3 (P1) angle: ", angleh3deg);
                            console.log("Gaze 3 (P1) angle: ", angleg3deg);
                        }
                    }
                    // Incrementing to next frame (skipping one)
                    index_frame++;
                    csv_frame = csvData[index_frame][0];
                    //console.log("-------------------");
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
