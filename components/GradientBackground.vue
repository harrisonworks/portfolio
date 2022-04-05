<template>
	<div>
		<transition name="slide-down" mode="in-out">
			<div v-show="show" id="container" ref="container">
				<div :style="`height:${scrollHeight}px;`" class="overlay"></div>
			</div>
		</transition>
	</div>
</template>

<script>
import * as Three from 'three'

import { map, lerp, randomInteger } from '~/assets/js/utils.js'
import snoise from '~/assets/shaders/snoise.glsl'
import vertex from '~/assets/shaders/vertex.glsl'
import fragment from '~/assets/shaders/fragment.glsl'

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
			this.renderer.setSize(window.innerWidth, this.scrollHeight)
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

			const sNoise = snoise
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
				fragmentShader: sNoise + fragment,
				vertexShader: sNoise + vertex,
			})

			this.mesh = new Three.Mesh(geometry, this.material)
			this.mesh.position.set(0, 140, -280)
			this.mesh.scale.multiplyScalar(5)
			this.mesh.rotationX = -1.0
			this.mesh.rotationY = 0.0
			this.mesh.rotationZ = 0.1
			this.scene.add(this.mesh)

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