<script lang="ts">
	import { onMount } from 'svelte';

	export let fps = 0;
	let lastFrameTime = 0;
	let frameCount = 0;
	let frame = 0;

	function animate(currentTime: number) {
		frameCount++;
		if (currentTime > lastFrameTime + 1000) {
			fps = Math.round(frameCount * 1000 / (currentTime - lastFrameTime));
			lastFrameTime = currentTime;
			frameCount = 0;
		}
		frame = requestAnimationFrame(animate);
	}

	onMount(() => {
		lastFrameTime = performance.now();
		frame = requestAnimationFrame(animate);

		return () => cancelAnimationFrame(frame);
	});
</script>

<div class="fps-counter">
	FPS: {fps}
</div>

<style>
	.fps-counter {
		position: fixed;
		top: 1rem;
		left: 1rem;
		z-index: 99999;
		background: rgba(0, 0, 0, 0.6);
		color: #00fff9;
		padding: 0.2rem 0.5rem;
		border-radius: 4px;
		font-family: 'JetBrains Mono', monospace;
		font-size: 0.75rem;
		pointer-events: none;
		user-select: none;
	}
</style>
