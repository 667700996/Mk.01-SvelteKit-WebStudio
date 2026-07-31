<script lang="ts">
	import { onMount } from 'svelte';
	import { getMotionPreset, motionCurves, type MotionPreset } from '../../../styles/tokens/motion';

	export let text = '';
	export let type: 'word' | 'char' = 'word';
	export let preset: MotionPreset['id'] | null = 'cascade';
	export let delay = 0;
	export let duration = 0.8;
	export let stagger = 0.03;
	export let blur = true;
	export let threshold = 0.2;

	let element: HTMLElement;

	onMount(async () => {
		if (!element) return;
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (prefersReducedMotion) {
			element.style.opacity = '1';
			return;
		}

		const { animate, inView } = await import('motion');

		const presetConfig = preset ? getMotionPreset(preset) : undefined;
		const finalDuration = presetConfig?.duration ?? duration;
		const finalDelay = presetConfig?.delay ?? delay;
		const finalStagger = presetConfig?.stagger ?? stagger;
		const finalEase = motionCurves[presetConfig?.ease ?? 'outExpo'];
		const finalOffset = presetConfig?.offset ?? { y: 16 };
		const finalBlur = blur || presetConfig?.blur;
		const targets = element.querySelectorAll('.reveal-unit');
		
		const stop = inView(
			element,
			() => {
				animate(
					targets,
					{
						opacity: [0, 1],
						y: [finalOffset.y ?? 0, 0],
						x: [finalOffset.x ?? 0, 0],
						filter: finalBlur ? ['blur(10px)', 'blur(0px)'] : undefined
					},
					{ 
						duration: finalDuration, 
						delay: (i) => finalDelay + i * finalStagger,
						easing: finalEase
					}
				);
			},
			{ amount: threshold }
		);

		return () => stop();
	});

	$: units = type === 'word' ? text.split(' ') : text.split('');
</script>

<span bind:this={element} class="inline-block">
	{#each units as unit, i}
		<span class="reveal-unit inline-block opacity-0 will-change-transform">
			{unit}{type === 'word' && i !== units.length - 1 ? '\u00A0' : ''}
		</span>
	{/each}
</span>
