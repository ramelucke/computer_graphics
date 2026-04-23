#version 300 es

// uniform data, same value for every vertex -> "global data"
uniform float u_slider; // 0 to 1
uniform float u_time;

// attribute data
in vec2 a_position;

// varying data
out vec2 uv;

void main() {
	vec2 scale = vec2(0.7, 0.15);
	vec2 new_position = a_position*scale;
	vec2 move = vec2(-0.5,0.8);
	new_position+=move;

	gl_Position = vec4(new_position, 0.0, 1.0);

	uv = a_position.xy+vec2(0.5);
}
