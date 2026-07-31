<script lang="ts">
	import { onMount } from 'svelte';

	export let accent = '#7cf7ff';
	export let glow = '#ff6bcb';
	export let speed = 1;

	let canvas: HTMLCanvasElement | null = null;
	let raf = 0;
	let pointer = { x: 0.5, y: 0.5 };

	onMount(() => {
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		const resize = () => {
			if (!canvas) return;
			const rect = canvas.getBoundingClientRect();
			canvas.width = rect.width * dpr;
			canvas.height = rect.height * dpr;
			ctx.scale(dpr, dpr);
		};
		resize();

		const gradient = ctx.createLinearGradient(0, 0, 0, 200);
		gradient.addColorStop(0, accent + '80');
		gradient.addColorStop(1, 'rgba(6,12,30,0)');

		const draw = (t: number) => {
			const time = t * 0.001 * speed;
			const { width, height } = canvas!.getBoundingClientRect();
			ctx.clearRect(0, 0, width, height);

			// background mist
			ctx.fillStyle = 'rgba(6,10,22,0.7)';
			ctx.fillRect(0, 0, width, height);

			// grid waves
			for (let i = 0; i < 6; i++) {
				ctx.beginPath();
				const phase = time * (0.8 + i * 0.12) + pointer.x * 2;
				for (let x = 0; x <= width; x += 12) {
					const y =
						height * 0.6 +
						Math.sin(x * 0.02 + phase) * 18 +
						Math.sin(x * 0.04 - phase * 0.9) * 12 -
						i * 12 +
						(pointer.y - 0.5) * 18;
					if (x === 0) ctx.moveTo(x, y);
					else ctx.lineTo(x, y);
				}
				ctx.strokeStyle = `${accent}${Math.max(10, 70 - i * 10).toString(16).padStart(2, '0')}`;
				ctx.lineWidth = 1 + i * 0.15;
				ctx.stroke();
			}

			// pulse orbs
			for (let i = 0; i < 18; i++) {
				const orbX =
					((i * 43 + time * 60) % (width + 60)) - 30 + Math.sin(time + i) * 12 * pointer.x;
				const orbY =
					height * 0.35 +
					Math.sin(time * 0.8 + i) * 22 +
					Math.cos(time * 1.3 - i) * 12 +
					(pointer.y - 0.5) * 24;
				const radius = 3 + Math.sin(time * 1.4 + i) * 1.8;
				const g = ctx.createRadialGradient(orbX, orbY, 0, orbX, orbY, radius * 4);
				g.addColorStop(0, glow + 'a8');
				g.addColorStop(1, 'rgba(255,255,255,0)');
				ctx.fillStyle = g;
				ctx.beginPath();
				ctx.arc(orbX, orbY, radius, 0, Math.PI * 2);
				ctx.fill();
			}

			raf = requestAnimationFrame(draw);
		};

		const onPointer = (event: PointerEvent) => {
			const rect = canvas!.getBoundingClientRect();
			pointer.x = (event.clientX - rect.left) / rect.width;
			pointer.y = (event.clientY - rect.top) / rect.height;
		};

		canvas.addEventListener('pointermove', onPointer, { passive: true });
		window.addEventListener('resize', resize);
		raf = requestAnimationFrame(draw);

		return () => {
			cancelAnimationFrame(raf);
			canvas?.removeEventListener('pointermove', onPointer);
			window.removeEventListener('resize', resize);
		};
	});
</script>

<canvas bind:this={canvas} class="lab-preview" aria-hidden="true"></canvas>

<style>
	.lab-preview {
		width: 100%;
		height: 100%;
		display: block;
		border-radius: 1.2rem;
		overflow: hidden;
	}
</style>
