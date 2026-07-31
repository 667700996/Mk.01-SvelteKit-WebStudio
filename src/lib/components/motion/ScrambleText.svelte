<script lang="ts">
	import { onMount } from 'svelte';
	import { experienceStore } from '$services/experience';
	import { get } from 'svelte/store';

	export let text: string;
	export let active = false;
	export let speed = 30; // ms per char update
	
	let display = text;
	let interval: ReturnType<typeof setInterval> | undefined;
	let iterations = 0;
	let mounted = false;
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';

	function scramble() {
		if (interval) clearInterval(interval);
		iterations = 0;

		if (get(experienceStore).isPerformanceMode) {
			display = text; // Show full text immediately
			return;
		}

		interval = setInterval(() => {
			display = text
				.split('')
				.map((char, index) => {
					if (index < iterations) {
						return text[index];
					}
					return chars[Math.floor(Math.random() * chars.length)];
				})
				.join('');

			if (iterations >= text.length) {
				clearInterval(interval);
			}

			iterations += 1 / 3;
		}, speed);
	}

	$: if (mounted && active) scramble();

	// Auto-scramble on mount if no external trigger
	onMount(() => {
		mounted = true;
		if (!active) scramble();

		return () => {
			if (interval) clearInterval(interval);
		};
	});
</script>

<span 
	class="scramble-text inline-block font-mono" 
	on:mouseenter={scramble}
	role="none"
>
	{display}
</span>

<style>
	.scramble-text {
		cursor: default;
	}
</style>
