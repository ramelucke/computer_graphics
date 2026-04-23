#version 300 es

// uniform data, same value for every vertex -> "global data"
uniform float u_slider; // 0 to 1
uniform float u_time;

// attribute data
in vec2 a_position;

// varying data
out vec2 uv;

void main() {
	gl_Position = vec4(a_position, 0.0, 1.0);

	uv = a_position.xy;

	// *** 1. Correct UVs ***
	uv += 0.5;
}
