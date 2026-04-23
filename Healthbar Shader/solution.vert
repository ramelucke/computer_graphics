#version 300 es

// uniform data, same value for every vertex -> "global data"
uniform float u_slider; // 0 to 1
uniform float u_time;

// attribute data
in vec2 a_position;

// varying data
out vec2 uv;

void main() {
	// *** 2. Scaling and Positioning ***
	// copy a_position to a local variable, a_position can't be modified
	vec2 pos = a_position;
	// scale the quad to make it smaller and a rectangle
	pos.x *= 0.8;
	pos.y *= 0.15;
	// move it to the top left of the screen
	pos.x -= 0.5;
	pos.y += 0.82;

	gl_Position = vec4(pos, 0.0, 1.0);

	uv = a_position.xy;

	// *** 1. Correct UVs ***
	uv += 0.5;
}
