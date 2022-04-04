<template>
	<div>
		<transition name="slide-down" mode="in-out">
			<div v-show="show" id="container" ref="container">
				<div :style="`height:${scrollHeight}px;`" class="overlay"></div>
			</div>
		</transition>
		<script id="snoise-function" type="x-shader/x-vertex">
			vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
			vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
			vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

			float snoise(vec2 v) {
			    const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
			                        0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
			                        -0.577350269189626,  // -1.0 + 2.0 * C.x
			                        0.024390243902439); // 1.0 / 41.0
			    vec2 i  = floor(v + dot(v, C.yy) );
			    vec2 x0 = v -   i + dot(i, C.xx);
			    vec2 i1;
			    i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
			    vec4 x12 = x0.xyxy + C.xxzz;
			    x12.xy -= i1;
			    // i = mod289(i); // Avoid truncation effects in permutation
			    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
			        + i.x + vec3(0.0, i1.x, 1.0 ));

			    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
			    m = m*m ;
			    m = m*m ;
			    vec3 x = 2.0 * fract(p * C.www) - 1.0;
			    vec3 h = abs(x) - 0.5;
			    vec3 ox = floor(x + 0.5);
			    vec3 a0 = x - ox;
			    m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
			    vec3 g;
			    g.x  = a0.x  * x0.x  + h.x  * x0.y;
			    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
			    return 130.0 * dot(m, g);
			}
		</script>
		<script id="vertex-shader" type="x-shader/x-vertex">
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
		</script>

		<script id="fragment-shader" type="x-shader/x-fragment">

			vec3 rgb(float r, float g, float b) {
			    return vec3(r / 255., g / 255., b / 255.);
			}

			// vec3 rgb(float c) {
			//    return vec3(c / 255., c / 255., c / 255.);
			//	}

			uniform vec3 u_bg;
			uniform vec3 u_bgMain;
			uniform vec3 u_color1;
			uniform vec3 u_color2;
			uniform float u_time;

			varying vec2 vUv;
			varying float vDistortion;

			void main() {
			    vec3 bg = rgb(u_bg.r, u_bg.g, u_bg.b);
			    vec3 c1 = rgb(u_color1.r, u_color1.g, u_color1.b);
			    vec3 c2 = rgb(u_color2.r, u_color2.g, u_color2.b);
			    vec3 bgMain = rgb(u_bgMain.r, u_bgMain.g, u_bgMain.b);

			    float noise1 = snoise(vUv + u_time * 0.08);
			    float noise2 = snoise(vUv * 2. + u_time * 0.1);

			    vec3 color = bg;
			    color = mix(color, c1, noise1 * 0.6);
			    color = mix(color, c2, noise2 * .9);

			    color = mix(color, mix(c1, c2, vUv.x), vDistortion);

			    float border = smoothstep(0.0, 0.1, vUv.x);

			    color = mix(color, bgMain, 0.001 -border);

			    gl_FragColor = vec4(color, 1.0);
			}
		</script>
	</div>
</template>

<script>
import * as Three from 'three'

import { map, lerp, randomInteger } from '~/assets/js/utils.js'
export default {
	data() {
		return {
			colors: null,
			renderer: null,
			camera: null,
			scene: null,
			material: null,
			mesh: null,
			// baseColorVal: 192,
			// colorVariation: 63,
			baseColorVal: 250,
			colorVariation: 5,
			x: randomInteger(0, 32),
			y: randomInteger(0, 32),
			t: 0,
			j: 0,
			vCheck: false,
			xEased: 0,
			yEased: 0,
			targetX: 0,
			targetY: 0,
			loaded: false,
			show: false,
			x_turbulence_devation: null,
			sphereMesh: null,
		}
	},
	computed: {
		scrollHeight() {
			return this.$store.state.windowHeight
		},
	},
	watch: {
		scrollHeight() {
			this.onWindowResize()
		},
		$route(to, from) {
			this.notHome(from, to)
		},
	},
	mounted() {
		// height is defined here
		this.$store.commit('updateHeight', window.innerHeight)

		if (this.$device.isMobile) {
			window.addEventListener('orientationchange', this.onWindowResize, false)
		} else {
			window.addEventListener('resize', this.onWindowResize, false)
		}
		window.addEventListener('mousemove', this.onMouseMove, false)
		this.getColor()
		this.init()
		this.animate()
	},
	methods: {
		notHome(from, to) {
			if (to.path !== '/' && this.loaded) {
				this.show = false
			} else {
				this.show = true
				console.log(this.show)
			}
		},
		getColor() {
			if (
				window.matchMedia &&
				window.matchMedia('(prefers-color-scheme: dark)').matches
			) {
				this.x_turbulence_devation = {
					min: 4.5,
					max: 5,
					start: 5.5,
				}

				this.colors = {
					bg: [42, 9, 68],
					main: [59, 24, 95],
					color1: [161, 37, 104],
					color2: [175, 53, 30],
				}
			} else {
				this.x_turbulence_devation = {
					min: 9,
					max: 11,
					start: 15,
				}
				this.colors = {
					bg: [243, 243, 243],
					main: [200, 250, 255],
					color1: [250, 240, 255],
					color2: [160, 240, 253],

					// 250, 240, 255
					// 150, 240, 253
					// 202, 253, 253
				}
			}
		},
		rgb(r, g, b) {
			return new Three.Vector3(r, g, b)
		},
		R(x, y, t) {
			return Math.floor(
				this.baseColorVal +
					this.colorVariation * Math.cos((x * x - y * y) / 300 + t)
			)
		},
		G(x, y, t) {
			return Math.floor(
				this.baseColorVal +
					this.colorVariation *
						Math.sin((x * x * Math.cos(t / 4) + y * y * Math.sin(t / 3)) / 300)
			)
		},
		B(x, y, t) {
			return Math.floor(
				this.baseColorVal +
					this.colorVariation *
						Math.sin(
							5 * Math.sin(t / 9) +
								((x - 100) * (x - 100) + (y - 100) * (y - 100)) / 1100
						)
			)
		},
		onMouseMove(event) {
			// update the values here only
			this.targetX = event.clientX
			this.targetY = event.clientY
		},
		onWindowResize() {
			// only resize on the home screen
			if (this.show === true) {
				const container = document.getElementById('container')
				if (container.clientWidth === 0) return
				this.camera.aspect = container.clientWidth / this.scrollHeight
				this.camera.updateProjectionMatrix()
				this.renderer.setSize(container.clientWidth, this.scrollHeight)
				console.log('resized to', container.clientWidth, this.scrollHeight)
			}
		},
		init() {
			const container = document.getElementById('container')
			const overlay = document.getElementsByClassName('overlay')[0]
			this.renderer = new Three.WebGLRenderer()

			// removed this as it doubles the number of pixels on screen
			// this.renderer.setPixelRatio(window.devicePixelRatio)
			// only on mobile add this

			// better solution is just to hide scrollbars with css
			// bye for now
			// let scrollBarOffset = 15
			// if (this.$device.isMobile) {
			// 	scrollBarOffset = 0
			// 	this.renderer.setPixelRatio(window.devicePixelRatio)
			// }

			this.renderer.setSize(window.innerWidth, this.scrollHeight)
			// container.appendChild(this.renderer.domElement)
			container.insertBefore(this.renderer.domElement, overlay)

			this.scene = new Three.Scene()
			this.camera = new Three.PerspectiveCamera(
				75,
				window.innerWidth / this.scrollHeight,
				0.1,
				1000
			)

			this.camera.position.z = 50

			const randomisePosition = new Three.Vector2(1, 2)

			const sNoise = document.querySelector('#snoise-function').textContent
			const geometry = new Three.PlaneGeometry(
				window.innerWidth / 2,
				400,
				100,
				100
			)

			// this is where the mesh colors are defined
			this.material = new Three.ShaderMaterial({
				uniforms: {
					u_bg: { type: 'v3', value: this.rgb(...this.colors.bg) },
					u_bgMain: { type: 'v3', value: this.rgb(...this.colors.main) },
					u_color1: { type: 'v3', value: this.rgb(...this.colors.color1) },
					u_color2: { type: 'v3', value: this.rgb(...this.colors.color2) },
					u_time: { type: 'f', value: 0 },
					u_randomisePosition: { type: 'v2', value: randomisePosition },
					x_turbulence: { type: 'f', value: this.x_turbulence_devation.start },
					y_turbulence: { type: 'f', value: 1 },
				},
				fragmentShader:
					sNoise + document.querySelector('#fragment-shader').textContent,
				vertexShader:
					sNoise + document.querySelector('#vertex-shader').textContent,
			})

			this.mesh = new Three.Mesh(geometry, this.material)
			this.mesh.position.set(0, 140, -280)
			this.mesh.scale.multiplyScalar(5)
			this.mesh.rotationX = -1.0
			this.mesh.rotationY = 0.0
			this.mesh.rotationZ = 0.1
			this.scene.add(this.mesh)

			// const material1 = new Three.MeshPhysicalMaterial({
			// 	roughness: 0.01,
			// 	transmission: 1,
			// 	thickness: 3,
			// 	metalness: 0,
			// 	color: '0xffffff',
			// })

			// const spGeom = new Three.SphereGeometry(20, 20, 20)
			// this.sphereMesh = new Three.Mesh(spGeom, material1)
			// this.sphereMesh.position.set(0, 0, 3)
			// this.scene.add(this.sphereMesh)

			// const dirLight = new Three.DirectionalLight(0xffffff, 1)
			// this.scene.add(dirLight)

			this.renderer.render(this.scene, this.camera)
		},
		animate() {
			requestAnimationFrame(this.animate)
			this.renderer.render(this.scene, this.camera)
			this.mesh.material.uniforms.u_randomisePosition.value = new Three.Vector2(
				this.j,
				this.j
			)

			this.mesh.material.uniforms.u_color1.value = new Three.Vector3(
				this.R(this.x, this.y, this.t / 2),
				this.G(this.x, this.y, this.t / 2),
				this.B(this.x, this.y, this.t / 2)
			)

			this.mesh.material.uniforms.u_time.value = this.t

			// Easing animation calcualted here
			this.xEased = lerp(this.xEased, this.targetX, 0.01)
			this.yEased = lerp(this.yEased, this.targetY, 0.01)
			// console.log(this.xEased)

			// camera recalculation
			const zValue = map(this.xEased, 0, window.innerWidth, 50, 51)

			const targetCamera = new Three.Vector3(0, 0, zValue)

			this.camera.position.lerp(targetCamera, 1)

			// const xValue = map(this.xEased, 0, window.innerWidth, -30, 30)
			// const yValue = map(this.yEased, 0, window.innerHeight, 30, -30)
			// const targetSphere = new Three.Vector3(xValue, yValue, 0)
			// this.sphereMesh.position.lerp(targetSphere, 1)

			// Color recacluation
			// const newColor = map(this.xEased, 0, window.innerWidth, 140, 180)
			// this.colors.color2[0] = newColor
			// to update a color
			// this.mesh.material.uniforms.u_color2.value = this.rgb(
			// 	...this.colors.color2
			// )

			// Turbulence Adjustment
			this.mesh.material.uniforms.x_turbulence.value = map(
				this.xEased,
				0,
				window.innerWidth,
				this.x_turbulence_devation.min,
				this.x_turbulence_devation.max
			)

			this.mesh.material.uniforms.y_turbulence.value = map(
				this.yEased,
				0,
				window.innerHeight,
				0.9,
				1.5
			)

			if (this.t % 0.1 === 0) {
				if (this.vCheck === false) {
					this.x -= 1
					if (this.x <= 0) {
						this.vCheck = true
					}
				} else {
					this.x += 1
					if (this.x >= 32) {
						this.vCheck = false
					}
				}
			}

			// Increase t by a certain value every frame
			this.j = this.j + 0.01
			this.t = this.t + 0.02

			// if not loaded status and if on the home page
			if (this.loaded === false && this.$route.path === '/') {
				this.loaded = true
				this.show = true
			}
		},
	},
}
</script>

<style>
#container {
	position: absolute;

	width: 100%;
	height: 100vh;
}

#canvas,
canvas {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	/* padding: 2rem; */
	/* border: 2rem solid var(--color-text); */
}

.overlay {
	position: absolute;
	top: 0px;
	left: 0px;
	width: 100%;
	/* height: 100%; */
	background: linear-gradient(
		0deg,
		rgba(var(--color-bg-num), 1) 0%,
		rgba(var(--color-bg-num), 0) 30%
	);
}
@media only screen and (max-width: 768px) {
	.overlay {
		position: absolute;
		top: 0px;
		left: 0px;
		width: 100%;

		/* height: 100%; */
		background: linear-gradient(
			0deg,
			rgba(var(--color-bg-num), 1) 0%,
			rgba(var(--color-bg-num), 0) 20%
		);
	}
}

.slide-down-enter-active {
	transition: all 0.4s ease;
}
.slide-down-leave-active {
	transition: all 0.4s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-down-enter,
.slide-down-leave-to {
	opacity: 0;
}
</style>