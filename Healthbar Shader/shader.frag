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
	float limit = float(0.2);
	vec3 green = vec3(0,1,0);
	vec3 red = vec3(1,0,0);
	vec3 light_red = vec3(0.5,0.2,0.2);
	vec3 grey = vec3(0.6,0.6,0.6);
	float time_step = 0.5*sin(float(3)*u_time)+0.5;
	outColor.w = 1.0;
	if(distance(uv, vec2(0.5,0.5))>0.5)
		discard;
	else if(distance(uv, vec2(0.5,0.5))>0.49)
		outColor.xyz=vec3(1,1,1);
	else if (uv.y>u_slider)
		if (u_slider<limit)
			outColor.xyz=mix(grey, light_red, time_step);
		else
			outColor.xyz = grey;
	else
		outColor.xyz = mix(red,green,u_slider);
	
	//instead of outColor.xyzw, you can also write outColor.rgba
}
