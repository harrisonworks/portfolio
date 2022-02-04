<template>
	<nav class="container-lg">
		<div class="row w-auto align-content-center">
			<transition mode="out-in" name="slide-fade">
				<nuxt-link
					v-if="notHome()"
					:to="{
						name: 'index',
						params: { goingHome: true },
					}"
				>
					<div class="back-button">
						<back-arrow />
						<h6 style="line-height: 2rem" class="d-inline">back</h6>
					</div></nuxt-link
				>
			</transition>
		</div>
	</nav>
</template>

<script>
export default {
	methods: {
		notHome() {
			if (this.$route.path !== '/') return true
		},
	},
}
</script>

<style scoped>
nav {
	position: relative;
}

.back-button,
a.nuxt-link-active {
	display: inline-block !important;
}

.back-button > .back {
	fill: var(--color-text);
	margin-left: 0.6rem;
	margin-right: 0rem;
	transition: margin-right 0.4s, margin-left 0.4s, fill 0.4s;
}

.back-button:hover > .back {
	fill: var(--color-link-hover);
	margin-left: 0rem;
	margin-right: 0.6rem;
}

nav .row {
	height: 8rem;

	/* position: absolute; */
}
.slide-fade-enter-active {
	transition: all 0.4s ease;
}
.slide-fade-leave-active {
	transition: all 0.4s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
	transform: translateX(-25px);
	opacity: 0;
}
</style>
