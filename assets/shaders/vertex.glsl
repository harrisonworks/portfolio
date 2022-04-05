uniform float u_time;
			uniform vec2 u_randomisePosition;

			// testing if these variables cause performance problems
			 uniform float x_turbulence;
			 uniform float y_turbulence;

			varying float vDistortion;
			varying float xDistortion;
			varying vec2 vUv;

			void main() {
			    vUv = uv;

					// vDistortion controls the wavvyness of the effect

			    vDistortion = snoise(vUv.xx * x_turbulence - u_randomisePosition * 0.15);
			    xDistortion = snoise(vUv.yy * y_turbulence - u_randomisePosition * 0.05);
			    vec3 pos = position;
			    pos.z += (vDistortion * 25.);
			    pos.x += (xDistortion * 15.);

			    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
			}