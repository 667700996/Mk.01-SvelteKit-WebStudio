<script lang="ts">
	import { onMount } from 'svelte';
	import { spring } from 'svelte/motion';

	let progress = spring(0, {
		stiffness: 0.1,
		damping: 0.3
	});

	onMount(() => {
		const updateProgress = () => {
			const scrollTotal = document.documentElement.scrollHeight - window.innerHeight;
			if (scrollTotal <= 0) {
				progress.set(0);
			} else {
				progress.set(window.scrollY / scrollTotal);
			}
		};

		window.addEventListener('scroll', updateProgress, { passive: true });
		updateProgress();

		return () => {
			window.removeEventListener('scroll', updateProgress);
		};
	});
</script>

<div class="scroll-progress-container">
	<div class="scroll-progress-bar" style:transform="scaleX({$progress})"></div>
</div>

<style>
	.scroll-progress-container {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		height: 2px;
		z-index: 120;
		pointer-events: none;
		background: transparent;
	}

	.scroll-progress-bar {
		height: 100%;
		background: #d7ff55;
		transform-origin: 0 50%;
		width: 100%;
		box-shadow: 0 0 10px rgba(215, 255, 85, 0.45);
	}
</style>
