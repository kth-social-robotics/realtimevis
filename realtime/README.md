# README #

### Overview ###

This is a pilot visualisation application to test motion capture and eye tracking data in real time. The application is written in Javascript using the WebGL framework and you can run in on a web browser.

The data pre-processing is done using the multisensory architecture (hosted in GitHub) where the coordinate system of the tobii trackers (local) is transposed to the motion capture system (world) and the trajectories of the gaze target are described in world coordinates.

### Setup ###

<!-- For the data handling you need to run main.m in matlab using the motion capture and gaze data and sync files and by defining the marker variables and appropriate labelling. -->

For the visualisation you need the following libraries to have installed on top of WebGL (not included in this repository - check path dependencies). The application is tested on a web server (localhost using MAMP) using the latest versions (pulled from GitHub repositories) of the libraries below:

* ThreeJS
* StatsJS
* PapaParse

If a library or framework is not mentioned here, it is included in the js/lib folder.

### Data ###

The data streams from mocap and eye trackers are processed in the multisensory architecture and the visualisation applications is receiveing the data streams through RabbitMQ.

### Models ###

The 3D models are designed in Blender, an open-source 3D design cross-platform application.

### Application ###

The application runs locally using a simple web server.

### Contact ###

* For questions contact Dimos (diko@kth.se).
