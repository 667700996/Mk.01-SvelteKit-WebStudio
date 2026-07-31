<script lang="ts">
	import { onMount } from 'svelte';
	import { getMotionPreset, motionCurves, type MotionPreset } from '../../../styles/tokens/motion';

	export let type: 'fade' | 'slide' | 'blur' | 'scale' = 'fade';
	export let preset: MotionPreset['id'] | null = null;
	export let delay = 0;
	export let duration = 0.8;
	export let threshold = 0.2;
	export let once = true;
	export let offset: { x?: number; y?: number } = { y: 20 };
	export let blur = false;

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
		const finalEase = motionCurves[presetConfig?.ease ?? 'outExpo'];
		const finalOffset = presetConfig?.offset ?? offset;
		const finalBlur = blur || presetConfig?.blur;

		let animation: Record<string, (number | string)[] | undefined>;

		if (type === 'fade') {
			animation = {
				opacity: [0, 1],
				y: [finalOffset.y ?? 0, 0],
				x: [finalOffset.x ?? 0, 0],
				filter: finalBlur ? ['blur(10px)', 'blur(0px)'] : undefined
			};
		} else if (type === 'slide') {
			animation = {
				x: [finalOffset.x ?? -20, 0],
				y: [finalOffset.y ?? 0, 0],
				opacity: [0, 1]
			};
		} else if (type === 'blur') {
			animation = {
				opacity: [0, 1],
				filter: ['blur(12px)', 'blur(0px)'],
				scale: [0.96, 1],
				y: [finalOffset.y ?? 0, 0]
			};
		} else if (type === 'scale') {
			animation = { scale: [0.9, 1], opacity: [0, 1], y: [finalOffset.y ?? 0, 0] };
		}

		const stop = inView(
			element,
			(target) => {
				animate(
					target,
					animation,
					{
						delay: finalDelay,
						duration: finalDuration,
						easing: finalEase
					}
				);
				if (!once) return () => animate(target, { opacity: 0 }, { duration: 0.25 });
			},
			{ amount: threshold }
		);

		return () => stop();
	});
</script>

<div bind:this={element} class="will-change-transform">
	<slot />
</div>
