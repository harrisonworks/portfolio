<template>
	<main class="container-lg">
		<div class="post">
			<div class="d-flex">
				<h1 id="header" style="overflow: hidden" class="subheading m-0 h5">
					{{ post.title.rendered }}
				</h1>

				<div id="links" class="ms-auto">
					<a
						v-if="websiteLink()"
						style="overflow: hidden"
						class="mb-0 h6"
						:href="websiteLink()"
						target="_blank"
						rel="noopener noreferrer"
						>Website</a
					>
					<a
						v-if="githubLink()"
						style="overflow: hidden"
						class="ms-3 mb-0 h6"
						:href="githubLink()"
						target="_blank"
						rel="noopener noreferrer"
						>GitHub</a
					>
				</div>
			</div>
			<hr />
			<div id="content" v-html="post.content.rendered"></div>
		</div>
	</main>
</template>

<script>
import SplitType from 'split-type'

export default {
	name: 'ProjectPage',
	transition: {
		name: 'project',
		appear: true,
		css: true,
		enter(el, done) {
			const heading = new SplitType('#header', {
				types: 'words',
			})
			const border = el.querySelector('hr')

			const links = el.querySelector('#links').children
			console.log(links)
			const postElements = el.querySelector('#content').children
			this.$gsap
				.timeline({ onComplete: done })
				.from(postElements, {
					opacity: 0,
					y: '-10%',
					duration: 1,
					ease: 'expo',
					stagger: { amount: 0.1 },
				})
				.from(
					border,
					{
						opacity: 0,
						duration: 0.6,
						ease: 'expo',
					},
					'-=20%'
				)
				.from(
					links,
					{
						opacity: 0,
						y: '-100%',
						duration: 0.3,
						ease: 'power2.out',
						stagger: { amount: 0.05 },
					},
					'>'
				)
				.from(
					heading.words,
					{
						opacity: 0,
						y: '-50%',
						duration: 0.6,
						ease: 'power2.out',
						stagger: { amount: 0.05 },
					},
					'>'
				)
		},
		leave(el, done) {
			const heading = new SplitType('#header', {
				types: 'words',
			})
			const border = el.querySelector('hr')
			const postElements = el.querySelector('#content').children

			this.$gsap
				.timeline({ onComplete: done })
				.to(heading.words, {
					opacity: 0,
					y: '-50%',
					duration: 0.6,
					ease: 'expo',
					stagger: { amount: 0.05 },
				})

				.to(
					border,
					{
						opacity: 0,
						duration: 0.6,
						ease: 'power2.out',
					},
					'<'
				)
				.to(
					postElements,
					{
						opacity: 0,
						y: '-4%',
						duration: 0.6,
						ease: 'power2.out',
						stagger: { amount: 0.2 },
					},
					'<'
				)
		},
	},
	asyncData({ route }) {
		// make params ready immediately so can sort from store
		return { slug: route.params.slug }
	},

	// this slug is now defined in async data
	// data() {
	// 	return {
	// 		slug: this.$route.params.slug,
	// 	}
	// },
	// dynamic headers
	head() {
		return {
			title: `Harrison McEwen | ${this.post.title.rendered} - ${this.post.acf.subheading}`,
			meta: [
				{
					hid: 'og:title',
					property: 'og:title',
					content: `Harrison McEwen | ${this.post.title.rendered} - ${this.post.acf.subheading}`,
				},
				{
					hid: 'apple-mobile-web-app-title',
					property: 'apple-mobile-web-app-title',
					content: `Harrison McEwen | ${this.post.title.rendered} - ${this.post.acf.subheading}`,
				},
				{
					hid: 'og:image',
					property: 'og:image',
					content: this.post.acf.feature_image.sizes.large,
				},
				{
					hid: 'og:url',
					property: 'og:url',
					content: `https://harrison.works${this.$route.fullPath}`,
				},

				{
					hid: 'twitter:card',
					property: 'twitter:card',
					content: this.post.acf.feature_image.sizes.large,
				},
				{
					hid: 'twitter:image',
					property: 'twitter:image',
					content: this.post.acf.feature_image.sizes.large,
				},
			],
		}
	},
	computed: {
		posts() {
			return this.$store.state.posts
		},
		post() {
			const post = this.posts.find((el) => el.slug === this.slug)
			return post
		},
	},
	methods: {
		websiteLink() {
			if (
				typeof this.post.acf.website_link !== 'undefined' &&
				this.post.acf.website_link
			) {
				return this.post.acf.website_link
			} else {
				return false
			}
		},
		githubLink() {
			if (
				typeof this.post.acf.github_link !== 'undefined' &&
				this.post.acf.github_link
			) {
				return this.post.acf.github_link
			} else {
				return false
			}
		},
	},
}
</script>

<style scoped>
main {
	min-height: calc(100vh - 12rem);
	margin-bottom: 4rem;
}
</style>