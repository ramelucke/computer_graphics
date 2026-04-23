const timeAtProgramStart = new Date().getTime();
// updated when a solution is selected from the dropdown
let program;
// this data is set in createAttributes() and used in render()
let vaoQuad;

const solutionSelection = document.querySelector("#solution-selection");
const canvas = document.querySelector("canvas");
// get WebGL2RenderingContext - everytime we talk to WebGL we use this object
const gl = canvas.getContext("webgl2");

main();

async function main() {
	await initialize();
	// start the render loop
	renderLoop();
}

async function initialize() {
	if (!gl) { console.error("Your browser does not support WebGL2"); }
	// set the resolution of the canvas html element
	canvas.width = 500;
	canvas.height = 500;
	// tell WebGL the resolution
	gl.viewport(0, 0, canvas.width, canvas.height);

	await updateProgram();
	solutionSelection.onchange = updateProgram;

	createAttributes();
}

function renderLoop() {
	render();
	requestAnimationFrame(renderLoop);
}

async function updateProgram() {
	// set shader paths depending on dropdown
	let fragmentShaderPath;
	let vertexShaderPath;
	switch (solutionSelection.options[solutionSelection.options.selectedIndex].value) {
		case "No": fragmentShaderPath = "shader.frag"; vertexShaderPath = "shader.vert"; break;
		case "Solution 1-5": fragmentShaderPath = "solution.frag"; vertexShaderPath = "solution.vert"; break;
		case "Solution 6-8": fragmentShaderPath = "solution_6_7_8.frag"; vertexShaderPath = "solution_6_7_8.vert"; break;
		default: console.error("Option not implemented"); break;
	};

	// compile GLSL shaders
	const vertexShader = createShader(gl, gl.VERTEX_SHADER, await loadTextResource(vertexShaderPath));
	const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, await loadTextResource(fragmentShaderPath));

	// link the two shaders - create a program that uses both shaders
	program = createProgram(gl, vertexShader, fragmentShader);
}

function createAttributes() {
	// create a vertex array object (vao)
	// any subsequent vertex attribute calls and bind buffer calls will be stored inside the vao
	// affected functions: "enableVertexAttribArray" "vertexAttribPointer" "bindBuffer"
	vaoQuad = gl.createVertexArray();
	// make it the one we're currently working with
	gl.bindVertexArray(vaoQuad);

	// create a buffer on the GPU - a buffer is just a place in memory where we can put our data
	const positionBuffer = gl.createBuffer();

	// tell WebGL that we now want to use the positionBuffer
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	// Put our data into the buffer we created on the GPU
	// Float32Array arranges the data in a way the GPU can understand
	// with STATIC_DRAW we tell WebGPU that we are not going to update the data,
	// which allows for optimizations
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexList), gl.STATIC_DRAW);

	// this function searches for a variable called "a_position" in the vertex shader code
	const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

	gl.enableVertexAttribArray(positionAttributeLocation);

	// Tell the attribute how to get data out of the positionBuffer
	const size = 2;          // one position has 2 components (vec2)
	const type = gl.FLOAT;   // our data is in 32bit floats
	const normalize = false; // this parameter is only important for integer data
	// stride and offset tell WebGL about the memory layout
	const stride = 0;        // 0 will automatically set the correct stride
	                         // manual stride calculation: size * sizeof(float): 2 * 4 Bytes = 8 Bytes
	const offset = 0;        // for our memory layout (one buffer per attribute), this can always set to 0
	                         // this is only important, if you create one buffer that contains multiple attributes
	gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

	const indexBuffer = gl.createBuffer();
	// we tell WebGL that this buffer should be treated as indices
	// by using gl.ELEMENT_ARRAY_BUFFER instead of gl.ARRAY_BUFFER
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexList), gl.STATIC_DRAW);

	// unbind vao and buffers to avoid accidental modification
	gl.bindVertexArray(null);
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
}

function render() {
	// Clear the canvas with a single color
	//            r  g  b  a
	gl.clearColor(0, 0, 0, 1);
	gl.clear(gl.COLOR_BUFFER_BIT);

	// Tell it to use our program (consists of vertex shader and fragment shader)
	gl.useProgram(program);

	const slider_value = document.querySelector("#slider").value / 100.0;
	let sliderLocation = gl.getUniformLocation(program, "u_slider");
	gl.uniform1fv(sliderLocation, [slider_value]);

	const timeMilliseconds = new Date().getTime() - timeAtProgramStart;
	const timeSeconds = timeMilliseconds * 0.001;

	// if we would have multiple objects, we would do this for every one of them
	const numVertices = indexList.length;
	renderObject(vaoQuad, numVertices);
	let timeLocation = gl.getUniformLocation(program, "u_time");
	gl.uniform1fv(timeLocation, [timeSeconds]);


	// unbind vao and program to avoid accidental modification
	gl.bindVertexArray(null);
	gl.useProgram(null);
}

function renderObject(vao, numVertices) {
	// Specify which attribute data we use by binding the vertex array object.
	// This executes all vertex attribute calls and bind buffer calls we made when
	// initializing, so we don't have to do them manually everytime we render
	gl.bindVertexArray(vao);

	const primitiveType = gl.TRIANGLES; // some other primitive types are POINTS, LINES, TRIANGLE_STRIP, TRIANGLE_FAN
	const first = 0;
	const indexType = gl.UNSIGNED_SHORT;
	gl.drawElements(primitiveType, numVertices, indexType, first);
}
