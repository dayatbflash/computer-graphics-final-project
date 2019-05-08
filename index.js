window.onload = function init() {
    canvas = document.getElementById("gl-canvas");

    gl = WebGLUtils.setupWebGL( canvas );
    if (!gl) {
        alert("WebGL isn't available");
    }

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    // load common shaders
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    shadowProgram = initShaders(gl, "vertex-shadow", "fragment-shadow");

}