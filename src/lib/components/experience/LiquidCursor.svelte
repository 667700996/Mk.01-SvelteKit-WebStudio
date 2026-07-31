<script lang="ts">
	import { onMount } from 'svelte';
	import { spring } from 'svelte/motion';
	import { experienceStore } from '$services/experience';

	let coords = spring({ x: -100, y: -100 }, {
		stiffness: 0.1,
		damping: 0.25
	});

	let size = spring(10, {
		stiffness: 0.1,
		damping: 0.2
	});

	let isHovering = false;
	let isClicking = false;
	let isHidden = false;
	let reducedMotion = true;

	onMount(() => {
		reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reducedMotion) return;

		const onMouseMove = (e: MouseEvent) => {
			coords.set({ x: e.clientX, y: e.clientY });
		};

		const onMouseDown = () => {
			isClicking = true;
			size.set(8);
		};

		const onMouseUp = () => {
			isClicking = false;
			size.set(isHovering ? 24 : 10);
		};

		// Delegate hover detection for performance
		const onMouseOver = (e: MouseEvent) => {
			const target = e.target as HTMLElement;
			
			// Hide on text inputs
			if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
				isHidden = true;
				isHovering = false;
				return;
			}
			isHidden = false;

			if (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button')) {
				isHovering = true;
				size.set(24);
			} else {
				isHovering = false;
				size.set(10);
			}
		};

		window.addEventListener('mousemove', onMouseMove);
		window.addEventListener('mousedown', onMouseDown);
		window.addEventListener('mouseup', onMouseUp);
		document.addEventListener('mouseover', onMouseOver);

		return () => {
			window.removeEventListener('mousemove', onMouseMove);
			window.removeEventListener('mousedown', onMouseDown);
			window.removeEventListener('mouseup', onMouseUp);
			document.removeEventListener('mouseover', onMouseOver);
		};
	});
</script>

{#if !$experienceStore.isPerformanceMode && !reducedMotion}
<div 
	class="liquid-cursor"
	style:transform={`translate3d(${$coords.x}px, ${$coords.y}px, 0)`}
>
	<div 
		class="cursor-blob" 
		class:hovering={isHovering}
		class:clicking={isClicking}
		class:hidden={isHidden}
		style:width={`${$size}px`}
		style:height={`${$size}px`}
	></div>
</div>
{/if}

<style>
	.liquid-cursor {
		position: fixed;
		top: 0;
		left: 0;
		pointer-events: none;
		z-index: 9999;
		will-change: transform;
		mix-blend-mode: difference;
	}

	.cursor-blob {
		background: white;
		border-radius: 50%;
		transform: translate(-50%, -50%);
		transition: opacity 0.3s ease, width 0.3s ease, height 0.3s ease;
		box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
	}

	.cursor-blob.hidden {
		opacity: 0;
		width: 0 !important;
		height: 0 !important;
	}

	.hovering {
		background: rgba(255, 255, 255, 0.2);
		border: 1px solid white;
		box-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
	}

	.clicking {
		background: rgba(255, 100, 100, 0.8);
		box-shadow: 0 0 15px rgba(255, 100, 100, 0.6);
	}

	@media (pointer: coarse) {
		.liquid-cursor {
			display: none;
		}
	}
</style>
