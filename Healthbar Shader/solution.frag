#version 300 es

// fragment shaders don't have a default precision so we need
// to pick one. highp is a good default. It means "high precision"
precision highp float;

// uniform data, same value for every vertex -> "global data"
uniform float u_slider; // 0 to 1
uniform float u_time;

in vec2 uv;

out vec4 outColor;

void main() {
	// *** 3. Color depending on the Slider ***
	vec3 green = vec3(0.0, 1.0, 0.0);
	vec3 red = vec3(1.0, 0.0, 0.0);
	vec3 color = mix(red, green, u_slider);

	// *** 4. Display grey on the empty part of the Healthbar ***
	vec3 grey = vec3(0.2);
	if (uv.x > u_slider) {
		color = grey;
	}

	// *** 5. Flash at low health ***
	bool isFlashing = u_slider < 0.2;
	if (isFlashing) {
		float flashing = sin(u_time * 4.0);
		flashing = (flashing + 1.0) / 2.0; // remap from [-1;1] to [0;1]
		color += red * flashing * 0.25;
	}

	outColor.w = 1.0;
	outColor.xyz = color;
}
