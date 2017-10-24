// RotatingTranslatedTriangle.js (c) 2012 matsuda
// Vertex shader program
var vshader_source = load_source("vsource");

// Fragment shader program
var fshader_source = load_source("fsource");

// Rotation angle (degrees/second)
var ANGLE_STEP = 360;

// Fireworks vertices
var vertices = [];

// The location of the firework
var coord_x = 0
var coord_y = 0

function main() {
  // Retrieve <canvas> element
  var canvas = document.getElementById('webgl');

  canvas.onmousedown = function(ev){ click(ev, gl, canvas) }

  // Get the rendering context for WebGL
  var gl = getWebGLContext(canvas);
  if (!gl) {
    console.log('Failed to get the rendering context for WebGL');
    return;
  }
  // Initialize shaders
  if (!initShaders(gl, vshader_source, fshader_source)) {
    console.log('Failed to intialize shaders.');
    return;
  }

  // Write the positions of vertices to a vertex shader
  var n = initVertexBuffers(gl, "trajectory");
  if (n < 0) {
    console.log('Failed to set the positions of the vertices');
    return;
  }

  console.log("clearColor");
  // Specify the color for clearing <canvas>
  gl.clearColor(0, 0, 0, 1);

  // Get storage location of u_ModelMatrix
  var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
  if (!u_ModelMatrix) { 
    console.log('Failed to get the storage location of u_ModelMatrix');
    return;
  }
  // Get storage location of u_color
  var u_Color = gl.getUniformLocation(gl.program, 'u_color');
  if (!u_ModelMatrix) { 
    console.log('Failed to get the storage location of u_color');
    return;
  }
  var currentAngle = 0.0;
  var currentColor = new Float32Array([0.0, 0.0, 0.0, 1.0]);
  var currentScale = new Float32Array([0.2, 0.2, 1.0]);
  var modelMatrix = new Matrix4();

  function click(ev, gl, canvas) {
    let x = ev.clientX;
    let y = ev.clientY;
    cord_to_clip(x, y, canvas);
    currentColor = new Float32Array([1.0, 1.0, 1.0, 1.0]);
    currentScale = new Float32Array([0.2, 0.2, 1.0])

  }
  // Start drawing
  var tick = function() {
    currentAngle = rotate(currentAngle);  // Update the rotation angle
    currentColor = fadeOut(currentColor); // Update the color
    currentScale = scaleUp(currentScale);
    draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix, coord_x, coord_y, currentColor, u_Color, currentScale);   // Draw the triangle
    requestAnimationFrame(tick, canvas); // Request that the browser ?calls tick
  };
  tick();
}

function initVertexBuffers(gl) {

    var n = gen_vertices();
 
  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // Assign the buffer object to a_Position variable
  var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
  if(a_Position < 0) {
    console.log('Failed to get the storage location of a_Position');
    return -1;
  }
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  return n;
}

function draw(gl, n, currentAngle, modelMatrix, u_ModelMatrix, coord_x, coord_y, currentColor, u_Color, currentScale) {
  
  // Set the rotation matrix
  modelMatrix.setTranslate(coord_x, coord_y, 0);
  modelMatrix.scale(currentScale[0],currentScale[1],currentScale[2]);
  modelMatrix.rotate(currentAngle, 0, 0, 1);

  // Pass the rotation matrix to the vertex shader
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  // Pass the rotation matrix to the vertex shader
  gl.uniform4fv(u_Color, currentColor);

  // Clear <canvas>
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the rectangle
  gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
}

// Last time that this function was called
var g_last = Date.now();
function rotate(angle) {
  // Calculate the elapsed time
  var now = Date.now();
  var elapsed = now - g_last;
  g_last = now;
  // Update the current rotation angle (adjusted by the elapsed time)
  var newAngle = angle + (ANGLE_STEP * elapsed) / 1000.0;
  return newAngle %= 360;
}

var f_last = Date.now();
function fadeOut(color) {
  // Calculate the elapsed time
  var now = Date.now();
  var elapsed = now - f_last;
  f_last = now;
  // Update the current rotation angle (adjusted by the elapsed time)
  var newcolor = color[0] - (elapsed / 1500.0);
  if (newcolor > 0){
      return new Float32Array([newcolor, newcolor, newcolor, 1.0]);
  }else {
    return new Float32Array([0.0,0.0,0.0,1.0]);
  }
}

var s_last = Date.now();
function scaleUp(scale) {
  // Calculate the elapsed time
  var now = Date.now();
  var elapsed = now - s_last;
  s_last = now;
  var newScale = scale[0] + (elapsed / 300);
    if (newScale < 3) {
        return new Float32Array([newScale, newScale, 1.0]);
    }else {
        return new Float32Array([5.0, 5.0, 5.0]);
    }
}
// Load source from the index.html
function load_source(sid){
    let shader = document.getElementById(sid);
    let shader_source = shader.textContent;
    return shader_source;
}
// Generate a set of vertices for emulating the firworks shape
function gen_vertices(){
    var limit = 2 * Math.PI;
    var theta = 0;
    var length = 0;
    let scp1 = 64;
    let scp2 = 6;
    var r = ((Math.abs(Math.cos(theta * scp1)) + (0.25 - (Math.cos((theta * scp1) + (Math.PI/2))) * 6))/(2 + (Math.abs(Math.cos((theta * scp2) + (Math.PI / 2)))) * 1.2));
    vertices.push(0.0, 0.0);

    for(theta; theta <= limit; theta = theta + 0.001) {
        let x = (((Math.abs(Math.cos(theta * scp1)) + (0.25 - (Math.cos((theta * scp1) + (Math.PI/2))) * 6))/(2 + (Math.abs(Math.cos((theta * scp2) + (Math.PI / 2)))) * 1.2))) * Math.cos(theta);
        vertices.push(x / 10);
        let y = (((Math.abs(Math.cos(theta * scp1)) + (0.25 - (Math.cos((theta * scp1) + (Math.PI/2))) * 6))/(2 + (Math.abs(Math.cos((theta * scp2) + (Math.PI / 2)))) * 1.2))) * Math.sin(theta)
        vertices.push(y / 10);
        length = length + 1;
    }

    return length+1;
}

function cord_to_clip(x, y, canvas){
  coord_x = ((x / canvas.width) * 2) - 1;
  coord_y = -(((y / canvas.height) * 2) -1);
}
