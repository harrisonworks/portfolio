<template>
	<main>
		<section class="container">
			<div style="height: 75vh" class="row align-content-center">
				<div class="col-lg-7">
					<div ref="description">
						<h1 id="header" style="overflow: hidden">
							Harrison is a designer, web developer, and creative coder.
						</h1>
						<h5 id="subheading">
							He has worked for large incumbents, small agencies, and
							medium-sized startups.
						</h5>
					</div>
				</div>
			</div>
		</section>
		<section class="container">
			<div class="row">
				<div class="col">
					<h2 class="h4 sectionHeading">Work</h2>
				</div>
			</div>
			<div class="row">
				<project-card
					v-for="(work, index) in works"
					:key="work.id"
					:index="index"
					:post="work"
				/>
			</div>
		</section>

		<section class="container">
			<div class="row">
				<div class="col">
					<h2 class="h4 sectionHeading">Experiments</h2>
				</div>
			</div>
			<div class="row">
				<project-card
					v-for="(experiment, index) in experiments"
					:key="experiment.id"
					:index="index"
					:post="experiment"
				/>
			</div>
		</section>
	</main>
</template>

<script>
import SplitType from 'split-type'
export default {
	name: 'HomePage',
	transition: {
		appear: true,
		css: true,
		enter(el, done) {
			// Title definitions
			const heading = new SplitType('#header', {
				types: 'words',
			})
			const subheading = new SplitType('#subheading', {
				types: 'words',
			})

			el.querySelector('#header').style.visibility = 'inherit'
			el.querySelector('#subheading').style.visibility = 'inherit'

			// Projects
			const projects = el.querySelectorAll('.notSelected')

			// Find elements of the projects
			const projectList = []
			projects.forEach((project) => {
				projectList.push({
					title: new SplitType(project.querySelector(':scope .title'), {
						types: 'words',
					}).words,
					skills: new SplitType(project.querySelector(':scope .skills'), {
						types: 'words',
					}).words,
					description: new SplitType(
						project.querySelector(':scope .description'),
						{ types: 'words' }
					).words,
					image: project.querySelector(':scope .featureImage'),
				})
			})

			// animation timeline for headers
			const headerTimeline = this.$gsap.timeline({ onComplete: done })
			headerTimeline
				.from(heading.words, {
					opacity: 0,
					y: '-50%',
					duration: 1,
					ease: 'power2.out',
					stagger: { amount: 0.1 },
				})
				.from(
					subheading.words,
					{
						opacity: 0,
						y: '-50%',
						duration: 1,
						ease: 'power2.out',
						stagger: { amount: 0.1 },
					},
					'<'
				)
				.from('.sectionHeading', {
					autoAlpha: 0,
					y: '-50%',
					duration: 1,
					ease: 'power2.out',
					stagger: { amount: 0.1 },
				})

			// registering every project with a scroll trigger
			projectList.forEach((project) => {
				this.$gsap
					.timeline({
						scrollTrigger: {
							trigger: project.image,
							start: 'top center+=20%',
							once: true,
							// markers: true,
						},
					})
					.from(
						[project.image, project.title, project.skills, project.description],
						{
							y: '-10%',
							autoAlpha: 0,
							duration: 1,
							ease: 'power2.out',
							stagger: { amount: 0.4 },
						}
					)
			})
		},
		leave(el, done) {
			// projects
			const projects = el.querySelectorAll('.notSelected')

			// Find elements of the projects
			const projectList = []
			projects.forEach((project) => {
				projectList.push({
					title: new SplitType(project.querySelector(':scope .title'), {
						types: 'words',
					}).words,
					skills: new SplitType(project.querySelector(':scope .skills'), {
						types: 'words',
					}).words,
					description: new SplitType(
						project.querySelector(':scope .description'),
						{ types: 'words' }
					).words,
					image: project.querySelector(':scope .featureImage'),
				})
			})

			projectList.forEach((project) => {
				this.$gsap
					.timeline({ onComplete: done })
					.to(
						[project.image, project.title, project.skills, project.description],
						{
							y: '-10%',
							opacity: 0,
							duration: 0.4,
							ease: 'power2.out',
							stagger: { amount: 0.2 },
						}
					)
			})
		},
	},
	async asyncData({ store }) {
		await store.dispatch('getPosts')
	},
	computed: {
		posts() {
			return this.$store.state.posts
		},
		works() {
			return this.posts.filter((post) => post.acf.category.includes('Work'))
		},
		experiments() {
			return this.posts.filter((post) =>
				post.acf.category.includes('Experiments')
			)
		},
	},
}
</script>

<style scoped>
#header,
#subheading {
	visibility: hidden;
}

main {
	margin-bottom: 4rem;
}
.sectionHeading {
	visibility: hidden;
	padding-bottom: 1.5rem;
	border-bottom: 1.25px solid rgba(100, 83, 89, 0.3);
}
</style>
