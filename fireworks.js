function WebGL(CID, VID, FID){
	var canvas = document.getElementById(CID);
	this.GL = canvas.getContext("webgl");
	if(!this.GL){
		alert("Your browser does not support WebGL");
	}else{
		var vertextShaderSource = document.getElementById(VID).text;
		var fragmentShaderSource = document.getElementById(FID).text;
		var vertexShader = createShader(this.GL, this.GL.VERTEX_SHADER, vertextShaderSource);
		var fragmentShader = createShader(this.GL, this.GL.FRAGMENT_SHADER, fragmentShaderSource);

		var program = createProgram(this.GL, vertexShader, fragmentShader);
	}

	this.drawScene = function(){
		this.GL.useProgram(program);
		resize(canvas);
		prepareData(this.GL);
		this.GL.clearColor(0, 0, 0, 1);
		this.GL.clear(this.GL.COLOR_BUFFER_BIT);
		this.GL.viewport(0, 0, canvas.width, canvas.height);
		this.GL.drawArrays(this.GL.TRIANGLES, 0, 6);
	}

	function prepareData(gl){
		var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
		gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);

		var positonBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positonBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
		var positonAttributeLocation = gl.getAttribLocation(program, "a_position");
		gl.vertexAttribPointer(positonAttributeLocation, 2, gl.FLOAT, false, 0, 0);
		gl.enableVertexAttribArray(positonAttributeLocation);


	}
	function createShader(gl, type, source){
		var shader = gl.createShader(type);
		gl.shaderSource(shader, source);
		gl.compileShader(shader);
		var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
		if(success){
			return shader;
		}
	}

	function createProgram(gl, VShader, FShader){
		var program = gl.createProgram();
		gl.attachShader(program, VShader);
		gl.attachShader(program, FShader);
		gl.linkProgram(program);
		var success = gl.getProgramParameter(program, gl.LINK_STATUS);
		if(success){
			return program;
		}
	}

	function resize(canvas) {
	  var realToCSSPixels = window.devicePixelRatio;

	  // Lookup the size the browser is displaying the canvas in CSS pixels
	  // and compute a size needed to make our drawingbuffer match it in
	  // device pixels.
	  var displayWidth  = Math.floor(canvas.clientWidth  * realToCSSPixels);
	  var displayHeight = Math.floor(canvas.clientHeight * realToCSSPixels);

	  // Check if the canvas is not the same size.
	  if (canvas.width  !== displayWidth ||
	      canvas.height !== displayHeight) {

	    // Make the canvas the same size
	    canvas.width  = displayWidth;
	    canvas.height = displayHeight;
	  }
	}

	var positions = [
	  10, 20,
	  120, 20,
	  10, 80,
	  10, 80,
	  120, 20,
	  120, 80,
	];
}