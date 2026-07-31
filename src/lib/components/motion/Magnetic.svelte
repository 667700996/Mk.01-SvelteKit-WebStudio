<script lang="ts">
	import { spring } from 'svelte/motion';

	let element: HTMLElement;
	let coords = spring({ x: 0, y: 0 }, {
		stiffness: 0.15,
		damping: 0.25
	});

	function handleMouseMove(e: MouseEvent) {
		const { clientX, clientY } = e;
		const { left, top, width, height } = element.getBoundingClientRect();
		const centerX = left + width / 2;
		const centerY = top + height / 2;
		
		const x = (clientX - centerX) * 0.35; // Strength of pull
		const y = (clientY - centerY) * 0.35;

		coords.set({ x, y });
	}

	function handleMouseLeave() {
		coords.set({ x: 0, y: 0 });
	}
</script>

<div
	bind:this={element}
	on:mousemove={handleMouseMove}
	on:mouseleave={handleMouseLeave}
	style:transform={`translate3d(${$coords.x}px, ${$coords.y}px, 0)`}
	class="magnetic-wrap inline-block will-change-transform"
	role="none"
>
	<slot />
</div>
