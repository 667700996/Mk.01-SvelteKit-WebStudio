<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let polarity = 1;
	let engaged = false;

	function setEngaged(value: boolean) {
		engaged = value;
		polarity = value ? -1 : 1;
	}

	onMount(() => {
		const context = canvas.getContext('2d');
		if (!context) return;

		const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const pointer = { x: -1000, y: -1000 };
		let width = 0;
		let height = 0;
		let dpr = 1;
		let frame = 0;
		let time = 0;
		let inView = true;

		const resize = () => {
			const bounds = canvas.getBoundingClientRect();
			width = bounds.width;
			height = bounds.height;
			dpr = Math.min(window.devicePixelRatio, 1.5);
			canvas.width = Math.max(1, Math.floor(width * dpr));
			canvas.height = Math.max(1, Math.floor(height * dpr));
			context.setTransform(dpr, 0, 0, dpr, 0, 0);
		};

		const updatePointer = (event: PointerEvent) => {
			const bounds = canvas.getBoundingClientRect();
			pointer.x = event.clientX - bounds.left;
			pointer.y = event.clientY - bounds.top;
		};

		const releasePointer = () => {
			pointer.x = -1000;
			pointer.y = -1000;
			setEngaged(false);
		};

		const render = () => {
			if (!inView) return;
			time += reduceMotion ? 0 : 0.012;
			context.clearRect(0, 0, width, height);
			context.fillStyle = '#090a08';
			context.fillRect(0, 0, width, height);

			const spacing = width < 700 ? 31 : 42;
			const columns = Math.ceil(width / spacing) + 1;
			const rows = Math.ceil(height / spacing) + 1;
			const nodes: Array<Array<{ x: number; y: number; energy: number }>> = [];

			for (let row = 0; row < rows; row += 1) {
				nodes[row] = [];
				for (let column = 0; column < columns; column += 1) {
					const baseX = column * spacing;
					const baseY = row * spacing;
					const dx = baseX - pointer.x;
					const dy = baseY - pointer.y;
					const distance = Math.sqrt(dx * dx + dy * dy);
					const influence = Math.max(0, 1 - distance / 230);
					const safeDistance = Math.max(distance, 1);
					const wave = Math.sin(column * 0.37 + row * 0.24 + time * 2.4) * 2.2;
					const force = influence * influence * 60 * polarity;
					nodes[row][column] = {
						x: baseX + (dx / safeDistance) * force + wave,
						y: baseY + (dy / safeDistance) * force + Math.cos(row * 0.3 + time * 2) * 1.8,
						energy: influence
					};
				}
			}

			context.lineWidth = 0.7;
			for (let row = 0; row < rows; row += 1) {
				for (let column = 0; column < columns; column += 1) {
					const point = nodes[row][column];
					const alpha = 0.11 + point.energy * 0.58;
					context.strokeStyle = `rgba(205, 255, 82, ${alpha})`;
					context.beginPath();
					if (column < columns - 1) {
						context.moveTo(point.x, point.y);
						context.lineTo(nodes[row][column + 1].x, nodes[row][column + 1].y);
					}
					if (row < rows - 1) {
						context.moveTo(point.x, point.y);
						context.lineTo(nodes[row + 1][column].x, nodes[row + 1][column].y);
					}
					context.stroke();

					context.fillStyle = `rgba(226, 255, 125, ${0.2 + point.energy * 0.8})`;
					context.fillRect(point.x - 0.75, point.y - 0.75, 1.5, 1.5);
				}
			}

			const gradient = context.createRadialGradient(
				pointer.x,
				pointer.y,
				0,
				pointer.x,
				pointer.y,
				190
			);
			gradient.addColorStop(0, engaged ? 'rgba(217,255,94,.15)' : 'rgba(217,255,94,.08)');
			gradient.addColorStop(1, 'rgba(217,255,94,0)');
			context.fillStyle = gradient;
			context.fillRect(0, 0, width, height);

			if (!reduceMotion) frame = requestAnimationFrame(render);
		};

		const resizeObserver = new ResizeObserver(resize);
		resizeObserver.observe(canvas);
		const viewObserver = new IntersectionObserver(
			(entries) => {
				const next = entries[0]?.isIntersecting ?? false;
				if (next && !inView && !reduceMotion) {
					inView = true;
					frame = requestAnimationFrame(render);
				} else {
					inView = next;
					if (!next) cancelAnimationFrame(frame);
				}
			},
			{ rootMargin: '120px' }
		);
		viewObserver.observe(canvas);
		canvas.addEventListener('pointermove', updatePointer);
		canvas.addEventListener('pointerleave', releasePointer);
		canvas.addEventListener('pointerdown', () => setEngaged(true));
		window.addEventListener('pointerup', () => setEngaged(false));
		resize();
		render();

		return () => {
			cancelAnimationFrame(frame);
			resizeObserver.disconnect();
			viewObserver.disconnect();
			canvas.removeEventListener('pointermove', updatePointer);
			canvas.removeEventListener('pointerleave', releasePointer);
		};
	});
</script>

<div class="field-console" class:is-engaged={engaged}>
	<canvas bind:this={canvas} aria-label="Interactive signal field"></canvas>
	<div class="field-console__hud" aria-hidden="true">
		<span>FIELD / MK-01</span>
		<span>{engaged ? 'POLARITY — NEGATIVE' : 'POLARITY — POSITIVE'}</span>
	</div>
	<button
		type="button"
		class="field-console__control"
		on:pointerdown={() => setEngaged(true)}
		on:pointerup={() => setEngaged(false)}
		on:pointerleave={() => setEngaged(false)}
	>
		<span class="field-console__control-dot"></span>
		{engaged ? 'Release field' : 'Press + hold to invert'}
	</button>
</div>

<style>
	.field-console {
		position: relative;
		width: 100%;
		height: min(70vh, 760px);
		min-height: 500px;
		overflow: hidden;
		background: #090a08;
		border: 1px solid rgba(226, 255, 125, 0.18);
		cursor: crosshair;
	}

	canvas {
		display: block;
		width: 100%;
		height: 100%;
		touch-action: none;
	}

	.field-console__hud {
		position: absolute;
		inset: 22px 24px auto;
		display: flex;
		justify-content: space-between;
		color: rgba(234, 255, 171, 0.62);
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.12em;
		pointer-events: none;
	}

	.field-console__control {
		position: absolute;
		right: 24px;
		bottom: 24px;
		display: inline-flex;
		align-items: center;
		gap: 10px;
		padding: 12px 16px;
		border: 1px solid rgba(226, 255, 125, 0.32);
		border-radius: 999px;
		background: rgba(8, 9, 7, 0.72);
		color: #e6f7b7;
		font-family: 'JetBrains Mono', monospace;
		font-size: 10px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		backdrop-filter: blur(14px);
		transition:
			background 180ms ease,
			color 180ms ease,
			transform 180ms ease;
		cursor: pointer;
	}

	.field-console__control:hover,
	.is-engaged .field-console__control {
		background: #d7ff55;
		color: #090a08;
		transform: translateY(-2px);
	}

	.field-console__control-dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: currentColor;
		box-shadow: 0 0 12px currentColor;
	}

	@media (max-width: 700px) {
		.field-console {
			height: 62vh;
			min-height: 430px;
		}

		.field-console__hud {
			inset: 16px 16px auto;
			font-size: 8px;
		}

		.field-console__hud span:last-child {
			display: none;
		}

		.field-console__control {
			right: 16px;
			bottom: 16px;
		}
	}
</style>
