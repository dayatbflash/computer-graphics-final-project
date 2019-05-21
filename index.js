"use strict";

var canvas, gl, program, shadowProgram;

var cubeNumVertices = 36; //(6 faces)(2 triangles/face)(3 vertices/triangle)
var pyramidNumVertices = 18;
var textureFlag = true;

var cubeVertices = [
    vec4(-0.5, -0.5,  0.5, 1.0),
    vec4(-0.5,  0.5,  0.5, 1.0),
    vec4(0.5,  0.5,  0.5, 1.0),
    vec4(0.5, -0.5,  0.5, 1.0),
    vec4(-0.5, -0.5, -0.5, 1.0),
    vec4(-0.5,  0.5, -0.5, 1.0),
    vec4(0.5,  0.5, -0.5, 1.0),
    vec4(0.5, -0.5, -0.5, 1.0)
];

var pyramidVertices = [
    vec4(-0.5, -0.5,  0.5, 1.0),
    vec4(0.5, -0.5,  0.5, 1.0),
    vec4(-0.5, -0.5, -0.5, 1.0),
    vec4(0.5, -0.5, -0.5, 1.0),
    vec4(0.0, 0.5, 0.0, 1.0)
]

var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];

// Shader transformation matrices

var modelViewMatrix, projectionMatrix, modelViewMatrixLoc;

// === Object 1 (Hand) ===
// Default parameters

var thetaHand = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

// Array of rotation angles (in degrees) for each rotation axis

var PalmY = 0;
var PalmZ = 1;
var LowerPinkie = 2;
var UpperPinkie = 3;
var LowerRing = 4;
var UpperRing = 5;
var LowerMiddle = 6;
var UpperMiddle = 7;
var LowerIndex = 8;
var UpperIndex = 9;
var LowerThumb = 10;
var UpperThumb = 11;

// Parameters controlling the size of the Arm and Fingers

var HAND_SCALE = 0.6;

var PALM_HEIGHT = 3.0 * HAND_SCALE;
var PALM_WIDTH = 4.0 * HAND_SCALE;
var HAND_DEPTH = 0.7 * HAND_SCALE;
var LOWER_FINGER_HEIGHT = 1.7 * HAND_SCALE;
var LOWER_FINGER_WIDTH = 0.7 * HAND_SCALE;
var UPPER_FINGER_WIDTH = 0.6 * HAND_SCALE;
var PINKIE_HEIGHT = 1.5 * HAND_SCALE;
var RING_HEIGHT = 1.7 * HAND_SCALE;
var MIDDLE_HEIGHT = 1.9 * HAND_SCALE;
var INDEX_HEIGHT = 1.7 * HAND_SCALE;
var THUMB_WIDTH = 1.2 * HAND_SCALE;
var LOWER_THUMB_HEIGHT = 0.7 * HAND_SCALE;
var UPPER_THUMB_HEIGHT = 0.6 * HAND_SCALE;

// Parameters controlling the position of fingers

var PINKIE_X = -1.55 * HAND_SCALE;
var RING_X = -0.55 * HAND_SCALE;
var MIDDLE_X = 0.55 * HAND_SCALE;
var INDEX_X = 1.55 * HAND_SCALE;
var THUMB_Y = 1.0 * HAND_SCALE;
var THUMB_X = 0.6 * HAND_SCALE;

// Animation
var handAnimationFlag = false;
var state = 1;

var RIGHT_LEFT = 1;
var directionRL = -1;
var countRL = 0;

var FIST = 2;
var directionFist = 1;
var countFist = 0;

var thetaHandNonAnimation = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var thetaHandAnimation = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

// === Object 2 (Robot) ===
// angle of each rotation, the order is according to the identifier above

var thetaRobot = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

// Identifier of each object parts

var torsoId = 0;
var head1Id = 1;
var leftUpperArmId = 2;
var leftLowerArmId = 3;
var rightUpperArmId = 4;
var rightLowerArmId = 5;
var leftUpperLegId = 6;
var leftLowerLegId = 7;
var rightUpperLegId = 8;
var rightLowerLegId = 9;
var head2Id = 10;

// The size of object parts

var robotScale = 0.6;

var torsoHeight = 5.0 * robotScale;
var torsoWidth = 3.0 * robotScale;
var torsoDepth = 1.0 * robotScale;
var headHeight = 1.5 * robotScale;
var headWidth = 1.3 * robotScale;
var headDepth = 1.5 * robotScale;
var upperArmHeight = 2.4 * robotScale;
var upperArmWidth  = 0.7 * robotScale;
var lowerArmHeight = 2.6 * robotScale;
var lowerArmWidth  = 0.7 * robotScale;
var upperLegHeight = 2.2 * robotScale;
var upperLegWidth  = 0.9 * robotScale;
var lowerLegHeight = 2.8 * robotScale;
var lowerLegWidth  = 0.9 * robotScale;

// Animation

var robotAnimationFlag = false;
var torsoFlag = 0;

// angle that is used for animation
var angle = 0;

var thetaRobotNonAnimation = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var thetaRobotAnimation = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

// Object 3 (Dino)
// angle of each rotation, the order is according to the identifier

var thetaDino = [0,0,0,0,0,0,0,0,0];

// Identifier of each object parts

var dinoTorsoId = 0;
var dinoHeadId = 1;
var dinoLeftUpperLegId = 2;
var dinoLeftLowerLegId = 3;
var dinoRightUpperLegId = 4;
var dinoRightLowerLegId = 5;
var dinoTail1Id = 6;
var dinoTail2Id = 7;
var dinoTail3Id = 8;

// The size of object parts
var dinoScale = 2;

var dinoTorsoWidth = dinoScale * 1.4;
var dinoTorsoHeight = dinoScale * 0.8;
var dinoTorsoDepth = dinoScale * 0.7;
var dinoHeadWidth = dinoScale * 1;
var dinoHeadHeight = dinoScale * 0.75;
var dinoHeadDepth = dinoScale * 0.8;
var dinoUpperLegWidth = dinoScale * 0.5;
var dinoUpperLegHeight = dinoScale * 0.7;
var dinoUpperLegDepth = dinoScale * 0.4;
var dinoLowerLegWidth = dinoScale * 0.5;
var dinoLowerLegHeight = dinoScale * 0.6;
var dinoLowerLegDepth = dinoScale * 0.4;
var dinoTail1Width = dinoScale * 0.7;
var dinoTail1Height = dinoScale * 0.4;
var dinoTail1Depth = dinoScale * 0.45;
var dinoTail2Width = dinoScale * 0.5;
var dinoTail2Height = dinoScale * 0.25;
var dinoTail2Depth = dinoScale * 0.33;
var dinoTail3Width = dinoScale * 0.35;
var dinoTail3Height = dinoScale * 0.15;
var dinoTail3Depth = dinoScale * 0.2;

// Animation
var thetaDinoAnimation = [0,0,0,0,0,0,0,0,0];
var thetaDinoNonAnimation = [0,0,0,0,0,0,0,0,0];

var dinoAnimationFlag = false;

// === Object 4 (Cube) ===
// angle of each rotation, the order is according to the identifier above

var thetaCube = [0, 0, 0];

// Identifier of each object parts

var cubeX = 0;
var cubeY = 1;
var cubeZ = 2;

// Animation
var cubeAnimationFlag = 0;
var thetaCubeNonAnimation = [0, 0, 0];
var thetaCubeAnimation = [0, 0, 0];

// === Object 5 (Pyramid) ===
// angle of each rotation, the order is according to the identifier above

var thetaPyramid = [0, 0, 0];

// Identifier of each object parts

var pyramidX = 0;
var pyramidY = 1;
var pyramidZ = 2;

// Animation
var pyramidAnimationFlag = 0;
var thetaPyramidNonAnimation = [0, 0, 0];
var thetaPyramidAnimation = [0, 0, 0];

// Parameters to control the material and lighting

var lightPosition = vec4(0.5, 0.5, 15.0, 0.0);
var lightAmbient = vec4(0.2, 0.2, 0.2, 1.0);
var lightDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var lightSpecular = vec4(1.0, 1.0, 1.0, 1.0);

var materialAmbient = vec4(1.0, 1.0, 1.0, 1.0);
var materialDiffuse = vec4(1.0, 1.0, 1.0, 1.0);
var materialSpecular = vec4(1.0, 1.0, 1.0, 1.0);
var materialShininess = 100.0;

// Parameters for texture and image

var jeansImage;
var lowerFingerImage;
var metalicImage;
var woolImage;
var wallImage;
var texture;
var redTexture;

// Parameters for GL Buffer

var vBuffer;
var points = [];
var normals = [];
var texCoords = [];

function quad(a, b, c, d) {
    var t1 = subtract(cubeVertices[b], cubeVertices[a]);
    var t2 = subtract(cubeVertices[c], cubeVertices[b]);
    var normal = cross(t1, t2);
    var normal = vec3(normal);

    points.push(cubeVertices[a]);
    normals.push(normal);
    texCoords.push(texCoord[0]);

    points.push(cubeVertices[b]);
    normals.push(normal);
    texCoords.push(texCoord[1]);

    points.push(cubeVertices[c]);
    normals.push(normal);
    texCoords.push(texCoord[2]);

    points.push(cubeVertices[a]);
    normals.push(normal);
    texCoords.push(texCoord[0]);

    points.push(cubeVertices[c]);
    normals.push(normal);
    texCoords.push(texCoord[2]);

    points.push(cubeVertices[d]);
    normals.push(normal);
    texCoords.push(texCoord[3]);
}

function colorCube() {
    quad(1, 0, 3, 2);
    quad(2, 3, 7, 6);
    quad(3, 0, 4, 7);
    quad(6, 5, 1, 2);
    quad(4, 5, 6, 7);
    quad(5, 4, 0, 1);
}

function scale4(a, b, c) {
    var result = mat4();
    result[0][0] = a;
    result[1][1] = b;
    result[2][2] = c;
    return result;
}

function triad(a, b, c) {
    var t1 = subtract(pyramidVertices[b], pyramidVertices[a]);
    var t2 = subtract(pyramidVertices[c], pyramidVertices[b]);
    var normal = cross(t1, t2);
    var normal = vec3(normal);

    points.push(pyramidVertices[a]);
    normals.push(normal);
    texCoords.push(texCoord[0]);

    points.push(pyramidVertices[b]);
    normals.push(normal);
    texCoords.push(texCoord[1]);

    points.push(pyramidVertices[c]);
    normals.push(normal);
    texCoords.push(texCoord[2]);
}

function quadPyramid(a, b, c, d) {
    var t1 = subtract(pyramidVertices[b], pyramidVertices[a]);
    var t2 = subtract(pyramidVertices[c], pyramidVertices[b]);
    var normal = cross(t1, t2);
    var normal = vec3(normal);

    points.push(pyramidVertices[a]);
    normals.push(normal);
    texCoords.push(texCoord[0]);

    points.push(pyramidVertices[b]);
    normals.push(normal);
    texCoords.push(texCoord[1]);

    points.push(pyramidVertices[c]);
    normals.push(normal);
    texCoords.push(texCoord[2]);

    points.push(pyramidVertices[a]);
    normals.push(normal);
    texCoords.push(texCoord[0]);

    points.push(pyramidVertices[c]);
    normals.push(normal);
    texCoords.push(texCoord[2]);

    points.push(pyramidVertices[d]);
    normals.push(normal);
    texCoords.push(texCoord[3]);
}

function colorPyramid() {
    quadPyramid(1, 0, 2, 3);
    triad(0, 1, 4);
    triad(0, 2, 4);
    triad(2, 3, 4);
    triad(1, 3, 4);
}

function configureTexture(image) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    if (textureFlag) {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    } else {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, redTexture);
    }
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}

function forcedConfigureTexture(image) {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}

window.onload = function init() {

    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) { alert("WebGL isn't available"); }

    gl.viewport(0, 0, canvas.width, canvas.height);

    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    // Load shaders and initialize attribute buffers

    program = initShaders(gl, "vertex-shader", "fragment-shader");

    shadowProgram = initShaders(gl, "vertex-shadow", "fragment-shadow");

    gl.useProgram(program);

    colorCube();
    colorPyramid();

    // Create and initialize buffer objects

    var nBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(normals), gl.STATIC_DRAW);

    var vNormal = gl.getAttribLocation(program, "vNormal");
    gl.vertexAttribPointer(vNormal, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vNormal);

    vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW);

    var vPosition = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(vPosition, 4, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vPosition);

    var tBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, tBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW);

    var vTexCoord = gl.getAttribLocation(program, "vTexCoord");
    gl.vertexAttribPointer(vTexCoord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(vTexCoord);

    var ambientProduct = mult(lightAmbient, materialAmbient);
    var diffuseProduct = mult(lightDiffuse, materialDiffuse);
    var specularProduct = mult(lightSpecular, materialSpecular);

    modelViewMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");

    gl.uniform4fv(gl.getUniformLocation(program, "ambientProduct"), flatten(ambientProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "diffuseProduct"), flatten(diffuseProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "specularProduct"), flatten(specularProduct));
    gl.uniform4fv(gl.getUniformLocation(program, "lightPosition"), flatten(lightPosition));

    gl.uniform1f(gl.getUniformLocation(program, "shininess"), materialShininess);

    projectionMatrix = ortho(-10, 10, -10, 10, -10, 10);
    gl.uniformMatrix4fv(gl.getUniformLocation(program, "projectionMatrix"),  false, flatten(projectionMatrix));

    jeansImage = document.getElementById("jeans-texture");
    lowerFingerImage = document.getElementById("lower-finger-texture");
    metalicImage = document.getElementById("metalic-texture");
    woolImage = document.getElementById("wool-texture");
    wallImage = document.getElementById("wall-texture");
    redTexture = document.getElementById("red-texture")

    // Slider for Object 1 (Hand)

    document.getElementById("PalmYSlider").onchange = function(event) {
        thetaHand[PalmY] = event.target.value;
    };

    document.getElementById("PalmZSlider").onchange = function(event) {
        thetaHand[PalmZ] = event.target.value;
    };

    document.getElementById("LowerPinkieSlider").onchange = function(event) {
        thetaHand[LowerPinkie] = event.target.value;
    };

    document.getElementById("UpperPinkieSlider").onchange = function(event) {
        thetaHand[UpperPinkie] =  event.target.value;
    };

    document.getElementById("LowerRingSlider").onchange = function(event) {
        thetaHand[LowerRing] = event.target.value;
    };

    document.getElementById("UpperRingSlider").onchange = function(event) {
        thetaHand[UpperRing] =  event.target.value;
    };

    document.getElementById("LowerMiddleSlider").onchange = function(event) {
        thetaHand[LowerMiddle] = event.target.value;
    };

    document.getElementById("UpperMiddleSlider").onchange = function(event) {
        thetaHand[UpperMiddle] =  event.target.value;
    };

    document.getElementById("LowerIndexSlider").onchange = function(event) {
        thetaHand[LowerIndex] = event.target.value;
    };

    document.getElementById("UpperIndexSlider").onchange = function(event) {
        thetaHand[UpperIndex] =  event.target.value;
    };

    document.getElementById("LowerThumbSlider").onchange = function(event) {
        thetaHand[LowerThumb] =  event.target.value;
    };

    document.getElementById("UpperThumbSlider").onchange = function(event) {
        thetaHand[UpperThumb] =  event.target.value;
    };

    // Slider for Object 2 (Robot)

    document.getElementById("slider0").onchange = function(event) {
        thetaRobot[torsoId ] = parseInt(event.target.value);
    };

    document.getElementById("slider1").onchange = function(event) {
        thetaRobot[head1Id] = parseInt(event.target.value);
    };

    document.getElementById("slider2").onchange = function(event) {
        thetaRobot[leftUpperArmId] = parseInt(event.target.value);
    };

    document.getElementById("slider3").onchange = function(event) {
        thetaRobot[leftLowerArmId] =  parseInt(event.target.value);
    };

    document.getElementById("slider4").onchange = function(event) {
        thetaRobot[rightUpperArmId] = parseInt(event.target.value);
    };

    document.getElementById("slider5").onchange = function(event) {
        thetaRobot[rightLowerArmId] =  parseInt(event.target.value);
    };

    document.getElementById("slider6").onchange = function(event) {
        thetaRobot[leftUpperLegId] = parseInt(event.target.value);
    };

    document.getElementById("slider7").onchange = function(event) {
        thetaRobot[leftLowerLegId] = parseInt(event.target.value);
    };

    document.getElementById("slider8").onchange = function(event) {
        thetaRobot[rightUpperLegId] = parseInt(event.target.value);
    };

    document.getElementById("slider9").onchange = function(event) {
        thetaRobot[rightLowerLegId] = parseInt(event.target.value);
    };

    document.getElementById("slider10").onchange = function(event) {
        thetaRobot[head2Id] = parseInt(event.target.value);
    };

    document.getElementById("dinoTorso").onchange = function (event) {
        thetaDino[dinoTorsoId] = parseInt(event.target.value);
    };

    document.getElementById("dinoHead").onchange = function (event) {
        thetaDino[dinoHeadId] = parseInt(event.target.value);
    };

    document.getElementById("dinoLeftUpperLeg").onchange = function (event) {
        thetaDino[dinoLeftUpperLegId] = parseInt(event.target.value);
    };

    document.getElementById("dinoLeftLowerLeg").onchange = function (event) {
        thetaDino[dinoLeftLowerLegId] = parseInt(event.target.value);
    };

    document.getElementById("dinoRightUpperLeg").onchange = function (event) {
        thetaDino[dinoRightUpperLegId] = parseInt(event.target.value);
    };

    document.getElementById("dinoRightLowerLeg").onchange = function (event) {
        thetaDino[dinoRightLowerLegId] = parseInt(event.target.value);
    };

    document.getElementById("dinoTail1").onchange = function (event) {
        thetaDino[dinoTail1Id] = parseInt(event.target.value);
    };

    document.getElementById("dinoTail2").onchange = function (event) {
        thetaDino[dinoTail2Id] = parseInt(event.target.value);
    };

    document.getElementById("dinoTail3").onchange = function (event) {
        thetaDino[dinoTail3Id] = parseInt(event.target.value);
    };

    document.getElementById("CubeXSlider").onchange = function(event) {
        thetaCube[cubeX] = parseInt(event.target.value);
    };

    document.getElementById("CubeYSlider").onchange = function(event) {
        thetaCube[cubeY] = parseInt(event.target.value);
    };

    document.getElementById("CubeZSlider").onchange = function(event) {
        thetaCube[cubeZ] = parseInt(event.target.value);
    };

    document.getElementById("PyramidXSlider").onchange = function(event) {
        thetaPyramid[pyramidX] = parseInt(event.target.value);
    };

    document.getElementById("PyramidYSlider").onchange = function(event) {
        thetaPyramid[pyramidY] = parseInt(event.target.value);
    };

    document.getElementById("PyramidZSlider").onchange = function(event) {
        thetaPyramid[pyramidZ] = parseInt(event.target.value);
    };

    document.getElementById("animateButton1").onclick = function() {
        if (handAnimationFlag) {
            thetaHandAnimation = thetaHand.slice();
            thetaHand = thetaHandNonAnimation.slice();
        } else {
            thetaHandNonAnimation = thetaHand.slice();
            thetaHand = thetaHandAnimation.slice();
        }
        handAnimationFlag = !handAnimationFlag;
        toggleHandSlider(handAnimationFlag);
    };

    document.getElementById("animateButton2").onclick = function () {
        if (robotAnimationFlag) {
            thetaRobotAnimation = thetaRobot.slice();
            thetaRobot = thetaRobotNonAnimation.slice();
        } else {
            thetaRobotNonAnimation = thetaRobot.slice();
            thetaRobot = thetaRobotAnimation.slice();
        }
        robotAnimationFlag = !robotAnimationFlag;
        toggleRobotSlider(robotAnimationFlag);
    };

    document.getElementById("animateButton3").onclick = function () {
        if (dinoAnimationFlag) {
            thetaDinoAnimation = thetaDino.slice();
            thetaDino = thetaDinoNonAnimation.slice();
        } else {
            thetaDinoNonAnimation = thetaDino.slice();
            thetaDino = thetaDinoAnimation.slice();
        }
        dinoAnimationFlag = !dinoAnimationFlag;
        toggleDinoSlider(dinoAnimationFlag);
    }

    document.getElementById("animateButton4").onclick = function () {
        if (cubeAnimationFlag) {
            thetaCubeAnimation = thetaCube.slice();
            thetaCube = thetaCubeNonAnimation.slice();
        } else {
            thetaCubeNonAnimation = thetaCube.slice();
            thetaCube = thetaCubeAnimation.slice();
        }
        cubeAnimationFlag = !cubeAnimationFlag;
        toggleCubeSlider(cubeAnimationFlag);
    };

    document.getElementById("animateButton5").onclick = function () {
        if (pyramidAnimationFlag) {
            thetaPyramidAnimation = thetaPyramid.slice();
            thetaPyramid = thetaPyramidNonAnimation.slice();
            togglePyramidSlider(false);
        } else {
            thetaPyramidNonAnimation = thetaPyramid.slice();
            thetaPyramid = thetaPyramidAnimation.slice();
            togglePyramidSlider(true);
        }
        pyramidAnimationFlag = !pyramidAnimationFlag;
    };

    document.getElementById("textureButton").onclick = function () {
        textureFlag = !textureFlag;
    }

    texture = gl.createTexture();

    render();
}

function toggleHandSlider(state) {
    document.getElementById("PalmYSlider").disabled = state;
    document.getElementById("PalmZSlider").disabled = state;
    document.getElementById("LowerPinkieSlider").disabled = state;
    document.getElementById("UpperPinkieSlider").disabled = state;
    document.getElementById("LowerRingSlider").disabled = state;
    document.getElementById("UpperRingSlider").disabled = state;
    document.getElementById("LowerMiddleSlider").disabled = state;
    document.getElementById("UpperMiddleSlider").disabled = state;
    document.getElementById("LowerIndexSlider").disabled = state;
    document.getElementById("UpperIndexSlider").disabled = state;
    document.getElementById("LowerThumbSlider").disabled = state;
    document.getElementById("UpperThumbSlider").disabled = state;
}

function toggleRobotSlider(state) {
    document.getElementById("slider0").disabled = state;
    document.getElementById("slider1").disabled = state;
    document.getElementById("slider2").disabled = state;
    document.getElementById("slider3").disabled = state;
    document.getElementById("slider4").disabled = state;
    document.getElementById("slider5").disabled = state;
    document.getElementById("slider6").disabled = state;
    document.getElementById("slider7").disabled = state;
    document.getElementById("slider8").disabled = state;
    document.getElementById("slider9").disabled = state;
    document.getElementById("slider10").disabled = state;
}

function toggleDinoSlider(state) {
    document.getElementById("dinoTorso").disabled = state;
    document.getElementById("dinoHead").disabled = state;
    document.getElementById("dinoLeftUpperLeg").disabled = state;
    document.getElementById("dinoLeftLowerLeg").disabled = state;
    document.getElementById("dinoRightUpperLeg").disabled = state;
    document.getElementById("dinoRightLowerLeg").disabled = state;
    document.getElementById("dinoTail1").disabled = state;
    document.getElementById("dinoTail2").disabled = state;
    document.getElementById("dinoTail3").disabled = state;
}

function toggleCubeSlider(state) {
    document.getElementById("CubeXSlider").disabled = state;
    document.getElementById("CubeYSlider").disabled = state;
    document.getElementById("CubeZSlider").disabled = state;
}

function togglePyramidSlider(state) {
    document.getElementById("PyramidXSlider").disabled = state;
    document.getElementById("PyramidYSlider").disabled = state;
    document.getElementById("PyramidZSlider").disabled = state;
}

// Instantiate Object Parts for Object1 (Hand)

function palm() {
    var s = scale4(PALM_WIDTH, PALM_HEIGHT, HAND_DEPTH);
    var instanceMatrix = mult(translate(0.0, 0.5 * PALM_HEIGHT, 0.0), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t));
    if (textureFlag) {
        gl.drawArrays(gl.TRIANGLES, 0, cubeNumVertices);
    } else {
        for(var i=0; i<cubeNumVertices; i+=3) gl.drawArrays(gl.LINE_LOOP, i, 3);
    }
}

function lowerPinkie() {
    var s = scale4(LOWER_FINGER_WIDTH, LOWER_FINGER_HEIGHT, HAND_DEPTH);
    var instanceMatrix = mult(translate(PINKIE_X, 0.5 * LOWER_FINGER_HEIGHT, 0.0), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t));
    if (textureFlag) {
        gl.drawArrays(gl.TRIANGLES, 0, cubeNumVertices);
    } else {
        for(var i=0; i<cubeNumVertices; i+=3) gl.drawArrays(gl.LINE_LOOP, i, 3);
    }
}

function upperPinkie() {
    var s = scale4(UPPER_FINGER_WIDTH, PINKIE_HEIGHT, HAND_DEPTH);
    var instanceMatrix = mult(translate(PINKIE_X, 0.5 * PINKIE_HEIGHT, 0.0),s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t));
    if (textureFlag) {
        gl.drawArrays(gl.TRIANGLES, 0, cubeNumVertices);
    } else {
        for(var i=0; i<cubeNumVertices; i+=3) gl.drawArrays(gl.LINE_LOOP, i, 3);
    }
}

function lowerRing() {
    var s = scale4(LOWER_FINGER_WIDTH, LOWER_FINGER_HEIGHT, HAND_DEPTH);
    var instanceMatrix = mult(translate(RING_X, 0.5 * LOWER_FINGER_HEIGHT, 0.0), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t));
    if (textureFlag) {
        gl.drawArrays(gl.TRIANGLES, 0, cubeNumVertices);
    } else {
        for(var i=0; i<cubeNumVertices; i+=3) gl.drawArrays(gl.LINE_LOOP, i, 3);
    }
}

function upperRing() {
    var s = scale4(UPPER_FINGER_WIDTH, RING_HEIGHT, HAND_DEPTH);
    var instanceMatrix = mult(translate(RING_X, 0.5 * RING_HEIGHT, 0.0),s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t));
    if (textureFlag) {
        gl.drawArrays(gl.TRIANGLES, 0, cubeNumVertices);
    } else {
        for(var i=0; i<cubeNumVertices; i+=3) gl.drawArrays(gl.LINE_LOOP, i, 3);
    }
}

function lowerMiddle() {
    var s = scale4(LOWER_FINGER_WIDTH, LOWER_FINGER_HEIGHT, HAND_DEPTH);
    var instanceMatrix = mult(translate(MIDDLE_X, 0.5 * LOWER_FINGER_HEIGHT, 0.0), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t));
    if (textureFlag) {
        gl.drawArrays(gl.TRIANGLES, 0, cubeNumVertices);
    } else {
        for(var i=0; i<cubeNumVertices; i+=3) gl.drawArrays(gl.LINE_LOOP, i, 3);
    }
}

function upperMiddle() {
    var s = scale4(UPPER_FINGER_WIDTH, MIDDLE_HEIGHT, HAND_DEPTH);
    var instanceMatrix = mult(translate(MIDDLE_X, 0.5 * MIDDLE_HEIGHT, 0.0),s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t));
    if (textureFlag) {
        gl.drawArrays(gl.TRIANGLES, 0, cubeNumVertices);
    } else {
        for(var i=0; i<cubeNumVertices; i+=3) gl.drawArrays(gl.LINE_LOOP, i, 3);
    }
}

function lowerIndex() {
    var s = scale4(LOWER_FINGER_WIDTH, LOWER_FINGER_HEIGHT, HAND_DEPTH);
    var instanceMatrix = mult(translate(INDEX_X, 0.5 * LOWER_FINGER_HEIGHT, 0.0), s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t));
    if (textureFlag) {
        gl.drawArrays(gl.TRIANGLES, 0, cubeNumVertices);
    } else {
        for(var i=0; i<cubeNumVertices; i+=3) gl.drawArrays(gl.LINE_LOOP, i, 3);
    }
}

function upperIndex() {
    var s = scale4(UPPER_FINGER_WIDTH, MIDDLE_HEIGHT, HAND_DEPTH);
    var instanceMatrix = mult(translate(INDEX_X, 0.5 * INDEX_HEIGHT, 0.0),s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t));
    if (textureFlag) {
        gl.drawArrays(gl.TRIANGLES, 0, cubeNumVertices);
    } else {
        for(var i=0; i<cubeNumVertices; i+=3) gl.drawArrays(gl.LINE_LOOP, i, 3);
    }
}

function lowerThumb() {
    var s = scale4(THUMB_WIDTH, LOWER_THUMB_HEIGHT, HAND_DEPTH);
    var instanceMatrix = mult(translate(THUMB_X, THUMB_Y, 0.0),s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t));
    if (textureFlag) {
        gl.drawArrays(gl.TRIANGLES, 0, cubeNumVertices);
    } else {
        for(var i=0; i<cubeNumVertices; i+=3) gl.drawArrays(gl.LINE_LOOP, i, 3);
    }
}

function upperThumb() {
    var s = scale4(THUMB_WIDTH, UPPER_THUMB_HEIGHT, HAND_DEPTH);
    var instanceMatrix = mult(translate(2*THUMB_X, THUMB_Y, 0.0),s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t));
    if (textureFlag) {
        gl.drawArrays(gl.TRIANGLES, 0, cubeNumVertices);
    } else {
        for(var i=0; i<cubeNumVertices; i+=3) gl.drawArrays(gl.LINE_LOOP, i, 3);
    }
}

// Instantiate Object Parts for Object2 (Robot)

function torso() {
    var s = scale4(torsoWidth, torsoHeight, torsoDepth);
    var instanceMatrix = mult(translate(0.0, 0.5*torsoHeight, 0.0),s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t));
    if (textureFlag) {
        gl.drawArrays(gl.TRIANGLES, 0, cubeNumVertices);
    } else {
        for(var i=0; i<cubeNumVertices; i+=3) gl.drawArrays(gl.LINE_LOOP, i, 3);
    }
}

function head() {
    var s = scale4(headWidth, headHeight, headDepth);
    var instanceMatrix = mult(translate(0.0, 0.5 * headHeight, 0.0),s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t));
    if (textureFlag) {
        gl.drawArrays(gl.TRIANGLES, 0, cubeNumVertices);
    } else {
        for(var i=0; i<cubeNumVertices; i+=3) gl.drawArrays(gl.LINE_LOOP, i, 3);
    }
}

function leftUpperArm() {
    var s = scale4(upperArmWidth, upperArmHeight, upperArmWidth);
    var instanceMatrix = mult(translate(0.5 * upperArmWidth, 0.5 * upperArmHeight, 0.0),s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t));
    if (textureFlag) {
        gl.drawArrays(gl.TRIANGLES, 0, cubeNumVertices);
    } else {
        for(var i=0; i<cubeNumVertices; i+=3) gl.drawArrays(gl.LINE_LOOP, i, 3);
    }
}

function leftLowerArm() {
    var s = scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth);
    var instanceMatrix = mult(translate(0.5 * lowerArmWidth, 0.5 * lowerArmHeight, 0.0),s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t));
    if (textureFlag) {
        gl.drawArrays(gl.TRIANGLES, 0, cubeNumVertices);
    } else {
        for(var i=0; i<cubeNumVertices; i+=3) gl.drawArrays(gl.LINE_LOOP, i, 3);
    }
}

function rightUpperArm() {
    var s = scale4(upperArmWidth, upperArmHeight, upperArmWidth);
    var instanceMatrix = mult(translate(-0.5 * upperArmWidth, 0.5 * upperArmHeight, 0.0),s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t));
    if (textureFlag) {
        gl.drawArrays(gl.TRIANGLES, 0, cubeNumVertices);
    } else {
        for(var i=0; i<cubeNumVertices; i+=3) gl.drawArrays(gl.LINE_LOOP, i, 3);
    }
}

function rightLowerArm() {
    var s = scale4(lowerArmWidth, lowerArmHeight, lowerArmWidth);
    var instanceMatrix = mult(translate(-0.5 * lowerArmWidth, 0.5 * lowerArmHeight, 0.0),s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t));
    if (textureFlag) {
        gl.drawArrays(gl.TRIANGLES, 0, cubeNumVertices);
    } else {
        for(var i=0; i<cubeNumVertices; i+=3) gl.drawArrays(gl.LINE_LOOP, i, 3);
    }
}

function leftUpperLeg() {
    var s = scale4(upperLegWidth, upperLegHeight, upperLegWidth);
    var instanceMatrix = mult(translate(0.0, 0.6 * upperLegHeight, 0.0),s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t));
    if (textureFlag) {
        gl.drawArrays(gl.TRIANGLES, 0, cubeNumVertices);
    } else {
        for(var i=0; i<cubeNumVertices; i+=3) gl.drawArrays(gl.LINE_LOOP, i, 3);
    }
}

function leftLowerLeg() {
    var s = scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth);
    var instanceMatrix = mult(translate(0.0, 0.5 * lowerLegHeight, 0.0),s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t));
    if (textureFlag) {
        gl.drawArrays(gl.TRIANGLES, 0, cubeNumVertices);
    } else {
        for(var i=0; i<cubeNumVertices; i+=3) gl.drawArrays(gl.LINE_LOOP, i, 3);
    }
}

function rightUpperLeg() {
    var s = scale4(upperLegWidth, upperLegHeight, upperLegWidth);
    var instanceMatrix = mult(translate(0.0, 0.6 * upperLegHeight, 0.0),s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t));
    if (textureFlag) {
        gl.drawArrays(gl.TRIANGLES, 0, cubeNumVertices);
    } else {
        for(var i=0; i<cubeNumVertices; i+=3) gl.drawArrays(gl.LINE_LOOP, i, 3);
    }
}

function rightLowerLeg() {
    var s = scale4(lowerLegWidth, lowerLegHeight, lowerLegWidth);
    var instanceMatrix = mult(translate(0.0, 0.5 * lowerLegHeight, 0.0),s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t));
    if (textureFlag) {
        gl.drawArrays(gl.TRIANGLES, 0, cubeNumVertices);
    } else {
        for(var i=0; i<cubeNumVertices; i+=3) gl.drawArrays(gl.LINE_LOOP, i, 3);
    }
}

// Instantiate Object Parts for Object3 (Dino)

function dinoTorso() {
    var s = scale4(dinoTorsoWidth, dinoTorsoHeight, dinoTorsoDepth);
    var instanceMatrix = mult(translate(0.0, 0.5*dinoTorsoHeight, 0.0),s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t));
    if (textureFlag) {
        gl.drawArrays(gl.TRIANGLES, 0, cubeNumVertices);
    } else {
        for(var i=0; i<cubeNumVertices; i+=3) gl.drawArrays(gl.LINE_LOOP, i, 3);
    }
}

function dinoHead() {
    var s = scale4(dinoHeadWidth, dinoHeadHeight, dinoHeadDepth);
    var instanceMatrix = mult(translate(0.9*dinoHeadWidth, dinoTorsoHeight, 0.0),s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t));
    if (textureFlag) {
        gl.drawArrays(gl.TRIANGLES, 0, cubeNumVertices);
    } else {
        for(var i=0; i<cubeNumVertices; i+=3) gl.drawArrays(gl.LINE_LOOP, i, 3);
    }
}

function dinoLeftUpperLeg() {
    var s = scale4(dinoUpperLegWidth, dinoUpperLegHeight, dinoUpperLegDepth);
    var t = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t));
    if (textureFlag) {
        gl.drawArrays(gl.TRIANGLES, 0, cubeNumVertices);
    } else {
        for(var i=0; i<cubeNumVertices; i+=3) gl.drawArrays(gl.LINE_LOOP, i, 3);
    }
}

function dinoLeftLowerLeg() {
    var s = scale4(dinoLowerLegWidth, dinoLowerLegHeight, dinoLowerLegDepth);
    var instanceMatrix = mult(translate(0, 0.5*dinoLowerLegHeight, 0.0),s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t));
    if (textureFlag) {
        gl.drawArrays(gl.TRIANGLES, 0, cubeNumVertices);
    } else {
        for(var i=0; i<cubeNumVertices; i+=3) gl.drawArrays(gl.LINE_LOOP, i, 3);
    }
}

function dinoRightUpperLeg() {
    var s = scale4(dinoUpperLegWidth, dinoUpperLegHeight, dinoUpperLegDepth);
    var t = mult(modelViewMatrix, s);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t));
    if (textureFlag) {
        gl.drawArrays(gl.TRIANGLES, 0, cubeNumVertices);
    } else {
        for(var i=0; i<cubeNumVertices; i+=3) gl.drawArrays(gl.LINE_LOOP, i, 3);
    }
}

function dinoRightLowerLeg() {
    var s = scale4(dinoLowerLegWidth, dinoLowerLegHeight, dinoLowerLegDepth);
    var instanceMatrix = mult(translate(0, 0.5*dinoLowerLegHeight, 0.0),s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t));
    if (textureFlag) {
        gl.drawArrays(gl.TRIANGLES, 0, cubeNumVertices);
    } else {
        for(var i=0; i<cubeNumVertices; i+=3) gl.drawArrays(gl.LINE_LOOP, i, 3);
    }
}

function dinoTail1() {
    var s = scale4(dinoTail1Width, dinoTail1Height, dinoTail1Depth);
    var instanceMatrix = mult(translate(0,0,0),s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t));
    if (textureFlag) {
        gl.drawArrays(gl.TRIANGLES, 0, cubeNumVertices);
    } else {
        for(var i=0; i<cubeNumVertices; i+=3) gl.drawArrays(gl.LINE_LOOP, i, 3);
    }
}

function dinoTail2() {
    var s = scale4(dinoTail2Width, dinoTail2Height, dinoTail2Depth);
    var instanceMatrix = mult(translate(0,0,0),s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t));
    if (textureFlag) {
        gl.drawArrays(gl.TRIANGLES, 0, cubeNumVertices);
    } else {
        for(var i=0; i<cubeNumVertices; i+=3) gl.drawArrays(gl.LINE_LOOP, i, 3);
    }
}

function dinoTail3() {
    var s = scale4(dinoTail3Width, dinoTail3Height, dinoTail3Depth);
    var instanceMatrix = mult(translate(0,0,0),s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t));
    if (textureFlag) {
        gl.drawArrays(gl.TRIANGLES, 0, cubeNumVertices);
    } else {
        for(var i=0; i<cubeNumVertices; i+=3) gl.drawArrays(gl.LINE_LOOP, i, 3);
    }
}

// Instantiate Object Parts for Object4 (Cube)

function cube() {
    var instanceMatrix = scale4(3, 3, 3);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t));
    if (textureFlag) {
        gl.drawArrays(gl.TRIANGLES, 0, cubeNumVertices);
    } else {
        for(var i=0; i<cubeNumVertices; i+=3) gl.drawArrays(gl.LINE_LOOP, i, 3);
    }
}

// Instantiate Object Parts for Object5 (Pyramid)

function pyramid() {
    var instanceMatrix = scale4(3, 3, 3);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t));
    if (textureFlag) {
        gl.drawArrays(gl.TRIANGLES, cubeNumVertices, pyramidNumVertices);
    } else {
        for(var i=cubeNumVertices; i<cubeNumVertices+pyramidNumVertices; i+=3) gl.drawArrays(gl.LINE_LOOP, i, 3);
    }
}

// Instantiate Object Parts for Room

function floor() {
    var s = scale4(30, 0.1, 20);
    var instanceMatrix = mult(translate(0.0, -7, 0.0),s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t));
    gl.drawArrays(gl.TRIANGLES, 0, cubeNumVertices);
}

function ceiling() {
    var s = scale4(30, 0.1, 20);
    var instanceMatrix = mult(translate(0.0, 7, 0.0),s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t));
    gl.drawArrays(gl.TRIANGLES, 0, cubeNumVertices);
}

function leftWall() {
    var s = scale4(20, 18, 0.1);
    var instanceMatrix = mult(translate(-7, 0.0, 0.0),s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t));
    gl.drawArrays(gl.TRIANGLES, 0, cubeNumVertices);
}

function rightWall() {
    var s = scale4(20, 18, 0.1);
    var instanceMatrix = mult(translate(7, 0.0, 0.0),s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t));
    gl.drawArrays(gl.TRIANGLES, 0, cubeNumVertices);
}

function backWall() {
    var s = scale4(30, 18, 0.1);
    var instanceMatrix = mult(translate(0.0, -7, 0.0),s);
    var t = mult(modelViewMatrix, instanceMatrix);
    gl.uniformMatrix4fv(modelViewMatrixLoc,  false, flatten(t));
    gl.drawArrays(gl.TRIANGLES, 0, cubeNumVertices);
}

function updateThetaFist(delta) {
    thetaHand[LowerPinkie] += delta;
    thetaHand[UpperPinkie] += delta;

    thetaHand[LowerRing] += delta;
    thetaHand[UpperRing] += delta;

    thetaHand[LowerMiddle] += delta;
    thetaHand[UpperMiddle] += delta;

    thetaHand[LowerIndex] += delta;
    thetaHand[UpperIndex] += delta;

    thetaHand[LowerThumb] += delta;
    thetaHand[UpperThumb] += delta;
}

function updateAnimation() {
    thetaHand[PalmY] += 1;
    switch (state) {
        case RIGHT_LEFT:
        if (thetaHand[PalmZ] == 0) {
            countRL++;

            if (countRL == 3) {
                state = FIST;
                countRL = 0;
                break;
            }
        }

        thetaHand[PalmZ] += directionRL;

        if (Math.abs(thetaHand[PalmZ]) == 45) {
            directionRL = -directionRL;
        }
        break;

        case FIST:
        if (thetaHand[LowerPinkie] == 0) {
            countFist++;

            if (countFist == 3) {
                state = RIGHT_LEFT;
                countFist = 0;
                break;
            }
        }

        updateThetaFist(directionFist);

        if (thetaHand[LowerPinkie] == 90 || thetaHand[LowerPinkie] == 0) {
            directionFist = -directionFist;
        }
        break;

        default:

        break;
    }
}

var render = function() {

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Background
    forcedConfigureTexture(wallImage);
    // Floor
    modelViewMatrix = rotate(20,1,0,0);
    floor();

    // Ceiling
    modelViewMatrix = rotate(-20,1,0,0);
    ceiling();

    // Left Wall
    modelViewMatrix = translate(-5,1,-10,0);
    modelViewMatrix = mult(modelViewMatrix,rotate(60,0,1,0));
    leftWall();

    // Right Wall
    modelViewMatrix = translate(5,1,-10,0);
    modelViewMatrix = mult(modelViewMatrix,rotate(-60,0,1,0));
    rightWall();

    // Back Wall
    modelViewMatrix = translate(0,11.5,-10,0);
    backWall();

    // Object 1 (Hand)

    if (handAnimationFlag) {
        updateAnimation();
    }

    var temp;

    // Palm
    configureTexture(woolImage);
    modelViewMatrix = translate(-6, 3, 0, 0);
    modelViewMatrix = mult(modelViewMatrix, rotate(thetaHand[PalmY], 0, 1, 0));
    modelViewMatrix = mult(modelViewMatrix, rotate(thetaHand[PalmZ], 0, 0, 1));
    temp = modelViewMatrix;
    palm();

    // Index Finger
    configureTexture(lowerFingerImage);
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, PALM_HEIGHT, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(thetaHand[LowerPinkie], 1, 0, 0));
    lowerPinkie();

    configureTexture(metalicImage);
    modelViewMatrix  = mult(modelViewMatrix, translate(0.0, LOWER_FINGER_HEIGHT, 0.0));
    modelViewMatrix  = mult(modelViewMatrix, rotate(thetaHand[UpperPinkie], 1, 0, 0));
    upperPinkie();

    // Ring Finger
    modelViewMatrix = temp;

    configureTexture(lowerFingerImage);
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, PALM_HEIGHT, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(thetaHand[LowerRing], 1, 0, 0));
    lowerRing();

    configureTexture(metalicImage);
    modelViewMatrix  = mult(modelViewMatrix, translate(0.0, LOWER_FINGER_HEIGHT, 0.0));
    modelViewMatrix  = mult(modelViewMatrix, rotate(thetaHand[UpperRing], 1, 0, 0));
    upperRing();

    // Middle Finger
    modelViewMatrix = temp;

    configureTexture(lowerFingerImage);
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, PALM_HEIGHT, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(thetaHand[LowerMiddle], 1, 0, 0));
    lowerMiddle();

    configureTexture(metalicImage);
    modelViewMatrix  = mult(modelViewMatrix, translate(0.0, LOWER_FINGER_HEIGHT, 0.0));
    modelViewMatrix  = mult(modelViewMatrix, rotate(thetaHand[UpperMiddle], 1, 0, 0));
    upperMiddle();

    // Index Finger
    modelViewMatrix = temp;

    configureTexture(lowerFingerImage);
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, PALM_HEIGHT, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(thetaHand[LowerIndex], 1, 0, 0));
    lowerIndex();

    configureTexture(metalicImage);
    modelViewMatrix  = mult(modelViewMatrix, translate(0.0, LOWER_FINGER_HEIGHT, 0.0));
    modelViewMatrix  = mult(modelViewMatrix, rotate(thetaHand[UpperIndex], 1, 0, 0));
    upperIndex();

    // Thumb
    modelViewMatrix = temp;

    configureTexture(lowerFingerImage);
    modelViewMatrix  = mult(modelViewMatrix, translate(0.5 * PALM_WIDTH, 0.0, 0.0));
    modelViewMatrix  = mult(modelViewMatrix, rotate(-thetaHand[LowerThumb], 0, 1, 0));
    lowerThumb();

    configureTexture(metalicImage);
    modelViewMatrix  = mult(modelViewMatrix, translate(0.5 * THUMB_WIDTH, 0.0, 0.0));
    modelViewMatrix  = mult(modelViewMatrix, rotate(-thetaHand[UpperThumb], 0, 1, 0));
    upperThumb();

    // Object 2 (Robot)

    if (robotAnimationFlag){
        thetaRobot[torsoId] += 1;
        thetaRobot[leftUpperArmId] += 0.1;
        thetaRobot[leftLowerArmId] += 0.1;
        thetaRobot[rightUpperArmId] += 0.1;
        thetaRobot[rightLowerArmId] += 0.1;
        thetaRobot[leftUpperLegId] += 0.1;
        thetaRobot[leftLowerLegId] += 0.1;
        thetaRobot[rightUpperLegId] += 0.1;
        thetaRobot[rightLowerLegId] += 0.1;
    }

    // Torso
    configureTexture(woolImage);
    modelViewMatrix = translate(0, 3, 0, 0);
    modelViewMatrix = mult(modelViewMatrix, rotate(thetaRobot[torsoId], 0, 1, 0));
    temp = modelViewMatrix;
    torso();

    // Head
    configureTexture(metalicImage);
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, torsoHeight+0.5*headHeight, 0.0));
    modelViewMatrix = mult(modelViewMatrix, rotate(-thetaRobot[head1Id], 1, 0, 0));
    modelViewMatrix = mult(modelViewMatrix, rotate(thetaRobot[head2Id], 0, 1, 0));
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, -0.5*headHeight, 0.0));
    head();

    // LeftArm
    modelViewMatrix = temp;

    configureTexture(woolImage);
    modelViewMatrix = mult(modelViewMatrix, translate(-(0.5*torsoWidth + upperArmWidth), 0.9*torsoHeight, 0.0));
    if (robotAnimationFlag) {
        modelViewMatrix = mult(modelViewMatrix, rotate(180 - 15*Math.sin(thetaRobot[leftUpperArmId]), 1, 0, 0));
    } else {
        modelViewMatrix = mult(modelViewMatrix, rotate(180 - thetaRobot[leftUpperArmId], 1, 0, 0));
    }
    leftUpperArm();

    configureTexture(metalicImage);
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, upperArmHeight, 0.0));
    if (robotAnimationFlag) {
        modelViewMatrix = mult(modelViewMatrix, rotate(-Math.abs(10*Math.sin(thetaRobot[leftLowerArmId])), 1, 0, 0));
    } else {
        modelViewMatrix = mult(modelViewMatrix, rotate(-thetaRobot[leftLowerArmId], 1, 0, 0));
    }
    leftLowerArm();

    // RightArm
    modelViewMatrix = temp;

    configureTexture(woolImage);
    modelViewMatrix = mult(modelViewMatrix, translate(0.5*torsoWidth + upperArmWidth, 0.9*torsoHeight, 0.0));
    if (robotAnimationFlag) {
        modelViewMatrix = mult(modelViewMatrix, rotate(180 + 15*Math.sin(thetaRobot[rightUpperArmId]), 1, 0, 0));
    } else {
        modelViewMatrix = mult(modelViewMatrix, rotate(180 - thetaRobot[rightUpperArmId], 1, 0, 0));
    }
    rightUpperArm();

    configureTexture(metalicImage);
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, upperArmHeight, 0.0));
    if (robotAnimationFlag) {
        modelViewMatrix = mult(modelViewMatrix, rotate(-Math.abs(10*Math.sin(thetaRobot[rightLowerArmId])), 1, 0, 0));
    } else {
        modelViewMatrix = mult(modelViewMatrix, rotate(-thetaRobot[rightLowerArmId], 1, 0, 0));
    }
    rightLowerArm();

    // LeftLeg
    modelViewMatrix = temp;

    configureTexture(jeansImage);
    modelViewMatrix = mult(modelViewMatrix, translate(-(0.3*torsoWidth), 0.1*upperLegHeight, 0.0));
    if (robotAnimationFlag) {
        modelViewMatrix = mult(modelViewMatrix, rotate(180 + 10*Math.sin(thetaRobot[leftUpperLegId]), 1, 0, 0));
    } else {
        modelViewMatrix = mult(modelViewMatrix, rotate(180 - thetaRobot[leftUpperLegId], 1, 0, 0));
    }
    leftUpperLeg();

    configureTexture(metalicImage);
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, upperLegHeight, 0.0));
    if (robotAnimationFlag) {
        modelViewMatrix = mult(modelViewMatrix, rotate(Math.abs(10 + 20*Math.sin(thetaRobot[leftLowerLegId])), 1, 0, 0));
    } else {
        modelViewMatrix = mult(modelViewMatrix, rotate(thetaRobot[leftLowerLegId], 1, 0, 0));
    }
    leftLowerLeg();

    // RightLeg
    modelViewMatrix = temp;

    configureTexture(jeansImage);
    modelViewMatrix = mult(modelViewMatrix, translate(0.3*torsoWidth, 0.1*upperLegHeight, 0.0));
    if (robotAnimationFlag) {
        modelViewMatrix = mult(modelViewMatrix, rotate(180 - 10*Math.sin(thetaRobot[rightUpperLegId]), 1, 0, 0));
    } else {
        modelViewMatrix = mult(modelViewMatrix, rotate(180 - thetaRobot[rightUpperLegId], 1, 0, 0));
    }
    rightUpperLeg();

    configureTexture(metalicImage);
    modelViewMatrix = mult(modelViewMatrix, translate(0.0, upperLegHeight, 0.0));
    if (robotAnimationFlag) {
        modelViewMatrix = mult(modelViewMatrix, rotate(Math.abs(10 - 20*Math.sin(thetaRobot[rightLowerLegId])), 1, 0, 0));
    } else {
        modelViewMatrix = mult(modelViewMatrix, rotate(thetaRobot[rightLowerLegId], 1, 0, 0));
    }
    rightLowerLeg();

    // Object 3 (Dino)

    if (dinoAnimationFlag) {
        thetaDino[dinoTorsoId] += 1;
        thetaDino[dinoHeadId] += 0.03;
        thetaDino[dinoLeftUpperLegId] += 0.03;
        thetaDino[dinoLeftLowerLegId] += 0.03;
        thetaDino[dinoRightUpperLegId] += 0.03;
        thetaDino[dinoRightLowerLegId] += 0.03;
        thetaDino[dinoTail1Id] += 0.02;
        thetaDino[dinoTail2Id] += 0.02;
        thetaDino[dinoTail3Id] += 0.02;
    }

    // Torso
    modelViewMatrix = translate(6, 3, 0, 0);
    modelViewMatrix = mult(modelViewMatrix, rotate(thetaDino[dinoTorsoId] - 90, 0, 1, 0));
    temp = modelViewMatrix;
    modelViewMatrix = mult(modelViewMatrix, rotate(15, 0, 0, 1));
    dinoTorso();

    // Head
    modelViewMatrix = temp;
    if (dinoAnimationFlag) {
        modelViewMatrix = mult(modelViewMatrix, rotate(45 * Math.sin(thetaDino[dinoHeadId]), 0, 1, 0));
    } else {
        modelViewMatrix = mult(modelViewMatrix, rotate(thetaDino[dinoHeadId], 0, 1, 0));
    }
    dinoHead();

    // LeftLeg
    modelViewMatrix = temp;
    modelViewMatrix = mult(modelViewMatrix, translate(0, 0, 0.5*dinoTorsoDepth + 0.5 * dinoUpperLegDepth));
    modelViewMatrix = mult(modelViewMatrix, translate(-3/14*dinoTorsoWidth, 0, 0));
    if (dinoAnimationFlag) {
        modelViewMatrix = mult(modelViewMatrix, rotate(25 + 30 * Math.sin(thetaDino[dinoLeftUpperLegId]), 0, 0, 1));
    } else {
        modelViewMatrix = mult(modelViewMatrix, rotate(25 + thetaDino[dinoLeftUpperLegId], 0, 0, 1));
    }
    dinoLeftUpperLeg();

    modelViewMatrix = mult(modelViewMatrix, translate(0, -0.4*dinoUpperLegHeight, 0));
    if (dinoAnimationFlag) {
        modelViewMatrix = mult(modelViewMatrix, rotate(160 - Math.abs(10 * Math.cos(thetaDino[dinoLeftLowerLegId])), 0, 0, 1))
    } else {
        modelViewMatrix = mult(modelViewMatrix, rotate(150 - thetaDino[dinoLeftLowerLegId], 0, 0, 1))
    }
    dinoLeftLowerLeg();

    // RightLeg
    modelViewMatrix = temp;
    modelViewMatrix = mult(modelViewMatrix, translate(0, 0, -0.5*dinoTorsoDepth - 0.5 * dinoUpperLegDepth));
    modelViewMatrix = mult(modelViewMatrix, translate(-3/14*dinoTorsoWidth, 0, 0));
    if (dinoAnimationFlag) {
        modelViewMatrix = mult(modelViewMatrix, rotate(25 - 30 * Math.sin(thetaDino[dinoRightUpperLegId]), 0, 0, 1));
    } else {
        modelViewMatrix = mult(modelViewMatrix, rotate(25 + thetaDino[dinoRightUpperLegId], 0, 0, 1));
    }
    dinoRightUpperLeg();

    modelViewMatrix = mult(modelViewMatrix, translate(0, -0.4*dinoUpperLegHeight, 0));
    if (dinoAnimationFlag) {
        modelViewMatrix = mult(modelViewMatrix, rotate(160 - Math.abs(10 * Math.cos(thetaDino[dinoRightLowerLegId])), 0, 0, 1));
    } else {
        modelViewMatrix = mult(modelViewMatrix, rotate(150 - thetaDino[dinoRightLowerLegId], 0, 0, 1));
    }
    dinoRightLowerLeg();

    // Tail
    modelViewMatrix = temp;
    modelViewMatrix = mult(modelViewMatrix, rotate(20, 0, 0, 1));
    if (dinoAnimationFlag) {
        modelViewMatrix = mult(modelViewMatrix, rotate(20 * Math.sin(thetaDino[dinoTail1Id]), 0, 1, 0));
    } else {
        modelViewMatrix = mult(modelViewMatrix, rotate(thetaDino[dinoTail1Id], 0, 1, 0));
    }
    modelViewMatrix = mult(modelViewMatrix, translate(-0.7*dinoTorsoWidth, 0, 0.0));
    modelViewMatrix = mult(modelViewMatrix, translate(0, 0.5*dinoTorsoHeight + 0.5*dinoTail1Height, 0.0));
    dinoTail1();

    if (dinoAnimationFlag) {
        modelViewMatrix = mult(modelViewMatrix, rotate(15 * Math.sin(thetaDino[dinoTail2Id]), 0, 1, 0));
    } else {
        modelViewMatrix = mult(modelViewMatrix, rotate(thetaDino[dinoTail2Id], 0, 1, 0));
    }
    modelViewMatrix = mult(modelViewMatrix, translate(-0.8*dinoTail1Width, -0.1*dinoTail2Height, 0.0));
    dinoTail2();

    modelViewMatrix = mult(modelViewMatrix, rotate(3, 0, 0, 1));
    if (dinoAnimationFlag) {
        modelViewMatrix = mult(modelViewMatrix, rotate(10 * Math.sin(thetaDino[dinoTail3Id]), 0, 1, 0));
    } else {
        modelViewMatrix = mult(modelViewMatrix, rotate(thetaDino[dinoTail3Id], 0, 1, 0));
    }
    modelViewMatrix = mult(modelViewMatrix, translate(-0.8*dinoTail2Width, -0.1*dinoTail3Height, 0.0));
    dinoTail3();

    // Object 4 (Cube)
    if (cubeAnimationFlag) {
        thetaCube[cubeX] += 1;
        thetaCube[cubeY] += 1;
        thetaCube[cubeZ] += 1;
    }
    modelViewMatrix = translate(-3,-3,0,0);
    modelViewMatrix = mult(modelViewMatrix,rotate(thetaCube[cubeX],1,0,0));
    modelViewMatrix = mult(modelViewMatrix,rotate(thetaCube[cubeY],0,1,0));
    modelViewMatrix = mult(modelViewMatrix,rotate(thetaCube[cubeZ],0,0,1));
    cube();

    // Object 5 (Pyramid)
    if (pyramidAnimationFlag) {
        thetaPyramid[pyramidX] += 1;
        thetaPyramid[pyramidY] += 1;
        thetaPyramid[pyramidZ] += 1;
    }
    modelViewMatrix = translate(3,-3,0,0);
    modelViewMatrix = mult(modelViewMatrix,rotate(thetaPyramid[pyramidX],1,0,0));
    modelViewMatrix = mult(modelViewMatrix,rotate(thetaPyramid[pyramidY],0,1,0));
    modelViewMatrix = mult(modelViewMatrix,rotate(thetaPyramid[pyramidZ],0,0,1));
    pyramid();

    requestAnimFrame(render);
}
