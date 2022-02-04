<template>
	<a class="col-lg-6 px-3 py-3" @click="pressed()">
		<figure
			:ref="`item${index}`"
			class="item notSelected"
			@mouseenter="enter()"
			@mouseleave="leave()"
		>
			<img
				class="featureImage"
				:src="featureImage.url"
				:alt="featureImage.alt"
			/>

			<figcaption class="caption">
				<h2 class="title">
					{{ post.title.rendered }}
				</h2>
				<h6 class="skills">
					{{ post.acf.skills }}
				</h6>
				<p class="description">
					{{ post.acf.subheading }}
				</p>
			</figcaption>
		</figure>
	</a>
</template>

<script>
export default {
	props: {
		post: { type: Object, required: true },
		index: {
			type: Number,
			required: true,
		},
	},
	data() {
		return {
			hoverTimelineDefaults: { duration: 1, ease: 'expo' },
		}
	},
	computed: {
		featureImage() {
			return this.post.acf.feature_image
		},
		elementItems() {
			return {
				image: this.$refs[`item${this.index}`].querySelector('.featureImage'),
				title: this.$refs[`item${this.index}`].querySelector('.title'),
				skills: this.$refs[`item${this.index}`].querySelector('.skills'),
				description:
					this.$refs[`item${this.index}`].querySelector('.description'),
			}
		},
	},
	mounted() {},
	methods: {
		enter() {
			this.$gsap
				.timeline({ defaults: this.hoverTimelineDefaults })
				.to(Object.values(this.elementItems), {
					y: (pos) => pos * 8 - 4,
				})
		},
		leave() {
			this.$gsap
				.timeline({ defaults: this.hoverTimelineDefaults })
				.to(Object.values(this.elementItems), {
					y: 0,
				})
		},
		pressed() {
			// maybe bring back some complex animation for the clicked one
			this.$router.push({
				name: 'project-slug',
				params: { slug: this.post.slug, id: this.post.id, fromHome: true },
			})
		},
	},
}
</script>

<style scoped>
a {
	cursor: pointer;
}

figcaption > * {
	overflow: hidden;
}

img {
	object-fit: cover;
	height: 16rem;
	width: 100%;
}
</style>
