<!--
	An elastic lattice that bends around the pointer; holding inverts its
	polarity. Canvas 2D, no dependencies. Engineering notes:
	  · node positions live in preallocated typed arrays — zero allocation per frame
	  · lines are batched into a handful of alpha buckets → ~6 strokes per frame
	  · the loop sleeps when off-screen, when the tab is hidden, and when settled
	  · colours are read from design tokens and follow the active theme
	  · reduced motion: no ambient wave; frames render only in response to input
-->
<script lang="ts">
	import { onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let inverted = $state(false);
	let active = $state(false);

	let wake = () => {};
	$effect(() => {
		void inverted;
		wake();
	});

	const BUCKETS = 5;
	const RADIUS = 220;
	const FORCE = 56;

	onMount(() => {
		const ctx = canvas.getContext('2d', { alpha: false });
		if (!ctx) return;

		const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
		let reduced = motionQuery.matches;

		let width = 0;
		let height = 0;
		let cols = 0;
		let rows = 0;
		let spacing = 40;
		let xs = new Float32Array(0);
		let ys = new Float32Array(0);
		let energy = new Float32Array(0);
		let polarity = 1; // eased towards target for a smooth flip
		let frame = 0;
		let visible = false;
		let time = 0;
		let last = 0;

		const pointer = { x: -1e4, y: -1e4, tx: -1e4, ty: -1e4 };
		const colors = { bg: '#000', line: '#888', hot: '#00f' };

		const readColors = () => {
			const style = getComputedStyle(canvas);
			colors.bg = style.getPropertyValue('--bg-raised').trim() || '#f5f5f6';
			colors.line = style.getPropertyValue('--fg-3').trim() || '#6e6f76';
			colors.hot = style.getPropertyValue('--accent').trim() || '#2450e6';
			request();
		};

		const resize = () => {
			const rect = canvas.getBoundingClientRect();
			const dpr = Math.min(devicePixelRatio || 1, 2);
			width = rect.width;
			height = rect.height;
			canvas.width = Math.round(width * dpr);
			canvas.height = Math.round(height * dpr);
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			spacing = width < 640 ? 30 : 40;
			cols = Math.ceil(width / spacing) + 1;
			rows = Math.ceil(height / spacing) + 1;
			xs = new Float32Array(cols * rows);
			ys = new Float32Array(cols * rows);
			energy = new Float32Array(cols * rows);
			request();
		};

		const simulate = () => {
			// Without a pointer (keyboard, or the button), the press acts on the centre.
			const hasPointer = pointer.tx > -1e3;
			const tx = hasPointer ? pointer.tx : inverted ? width / 2 : -1e4;
			const ty = hasPointer ? pointer.ty : inverted ? height / 2 : -1e4;
			if (tx < -1e3 || pointer.x < -1e3) {
				pointer.x = tx;
				pointer.y = ty;
			} else {
				// Critically-damped follow so the field never snaps to the cursor.
				pointer.x += (tx - pointer.x) * 0.2;
				pointer.y += (ty - pointer.y) * 0.2;
			}
			polarity += ((inverted ? -1 : 1) - polarity) * 0.14;

			const wave = reduced ? 0 : 1;
			for (let r = 0; r < rows; r++) {
				for (let c = 0; c < cols; c++) {
					const i = r * cols + c;
					const bx = c * spacing;
					const by = r * spacing;
					const dx = bx - pointer.x;
					const dy = by - pointer.y;
					const dist = Math.hypot(dx, dy) || 1;
					const influence = Math.max(0, 1 - dist / RADIUS);
					const push = influence * influence * FORCE * polarity;
					xs[i] = bx + (dx / dist) * push + Math.sin(c * 0.37 + r * 0.24 + time * 1.6) * 1.6 * wave;
					ys[i] = by + (dy / dist) * push + Math.cos(r * 0.31 + time * 1.3) * 1.4 * wave;
					energy[i] = influence;
				}
			}
		};

		const draw = () => {
			ctx.fillStyle = colors.bg;
			ctx.fillRect(0, 0, width, height);
			ctx.lineWidth = 1;

			// Bucket every segment by the energy of its origin node.
			for (let b = 0; b < BUCKETS; b++) {
				const lo = b / BUCKETS;
				const hi = (b + 1) / BUCKETS;
				ctx.beginPath();
				for (let r = 0; r < rows; r++) {
					for (let c = 0; c < cols; c++) {
						const i = r * cols + c;
						const e = energy[i];
						if (e < lo || (e >= hi && b < BUCKETS - 1)) continue;
						if (c < cols - 1) {
							ctx.moveTo(xs[i], ys[i]);
							ctx.lineTo(xs[i + 1], ys[i + 1]);
						}
						if (r < rows - 1) {
							ctx.moveTo(xs[i], ys[i]);
							ctx.lineTo(xs[i + cols], ys[i + cols]);
						}
					}
				}
				ctx.strokeStyle = b === 0 ? colors.line : colors.hot;
				ctx.globalAlpha = b === 0 ? 0.32 : 0.25 + (b / (BUCKETS - 1)) * 0.75;
				ctx.stroke();
			}

			// Nodes: only the energised ones, as crisp 2px squares.
			ctx.fillStyle = colors.hot;
			for (let i = 0; i < energy.length; i++) {
				const e = energy[i];
				if (e < 0.08) continue;
				ctx.globalAlpha = e;
				ctx.fillRect(xs[i] - 1, ys[i] - 1, 2, 2);
			}
			ctx.globalAlpha = 1;
		};

		const settled = () =>
			(pointer.tx < -1e3 || (Math.abs(pointer.tx - pointer.x) < 0.1 && Math.abs(pointer.ty - pointer.y) < 0.1)) &&
			Math.abs((inverted ? -1 : 1) - polarity) < 0.01;

		const loop = (now: number) => {
			frame = 0;
			const dt = last ? Math.min(now - last, 50) : 16;
			last = now;
			if (!reduced) time += dt / 1000;
			simulate();
			draw();
			// Ambient motion keeps the loop alive; otherwise sleep once settled.
			if (visible && !document.hidden && (!reduced || !settled())) request();
			else last = 0;
		};

		function request() {
			if (!frame) frame = requestAnimationFrame(loop);
		}
		wake = request;

		const toLocal = (event: PointerEvent) => {
			const rect = canvas.getBoundingClientRect();
			pointer.tx = event.clientX - rect.left;
			pointer.ty = event.clientY - rect.top;
			active = true;
			request();
		};

		const leave = () => {
			pointer.tx = pointer.ty = pointer.x = pointer.y = -1e4;
			active = false;
			inverted = false;
			request();
		};

		const press = (event: PointerEvent) => {
			toLocal(event);
			inverted = true;
		};
		const release = () => {
			inverted = false;
			request();
		};

		const onMotionChange = () => {
			reduced = motionQuery.matches;
			request();
		};

		const resizeObserver = new ResizeObserver(resize);
		const viewObserver = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting;
			if (visible) request();
		});
		const themeObserver = new MutationObserver(readColors);
		const schemeQuery = matchMedia('(prefers-color-scheme: dark)');

		resizeObserver.observe(canvas);
		viewObserver.observe(canvas);
		themeObserver.observe(document.documentElement, { attributeFilter: ['data-theme'] });
		schemeQuery.addEventListener('change', readColors);
		motionQuery.addEventListener('change', onMotionChange);
		document.addEventListener('visibilitychange', request);
		canvas.addEventListener('pointermove', toLocal);
		canvas.addEventListener('pointerdown', press);
		canvas.addEventListener('pointerleave', leave);
		window.addEventListener('pointerup', release);
		readColors();

		return () => {
			wake = () => {};
			cancelAnimationFrame(frame);
			resizeObserver.disconnect();
			viewObserver.disconnect();
			themeObserver.disconnect();
			schemeQuery.removeEventListener('change', readColors);
			motionQuery.removeEventListener('change', onMotionChange);
			document.removeEventListener('visibilitychange', request);
			canvas.removeEventListener('pointermove', toLocal);
			canvas.removeEventListener('pointerdown', press);
			canvas.removeEventListener('pointerleave', leave);
			window.removeEventListener('pointerup', release);
		};
	});

	function onKey(event: KeyboardEvent, down: boolean) {
		if (event.key !== ' ' && event.key !== 'Enter') return;
		event.preventDefault();
		if (!event.repeat) inverted = down;
	}
</script>

<div class="field" class:active>
	<canvas bind:this={canvas} aria-hidden="true"></canvas>

	<div class="hud label" aria-hidden="true">
		<span>Field / MK-01</span>
		<span class="tabular">Polarity {inverted ? '−1' : '+1'}</span>
	</div>

	<button
		type="button"
		class="control"
		aria-pressed={inverted}
		onpointerdown={() => (inverted = true)}
		onpointerup={() => (inverted = false)}
		onpointerleave={() => (inverted = false)}
		onkeydown={(event) => onKey(event, true)}
		onkeyup={(event) => onKey(event, false)}
		onblur={() => (inverted = false)}
	>
		<span class="dot" aria-hidden="true"></span>
		{inverted ? 'Release to restore' : 'Press and hold to invert'}
	</button>
</div>

<style>
	.field {
		position: relative;
		aspect-ratio: 16 / 8;
		min-height: 22rem;
		border-radius: var(--radius-l);
		overflow: hidden;
		background: var(--bg-raised);
		touch-action: pan-y;
		user-select: none;
		-webkit-user-select: none;
	}

	canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		cursor: crosshair;
	}

	.hud {
		position: absolute;
		inset: var(--space-5) var(--space-5) auto;
		display: flex;
		justify-content: space-between;
		pointer-events: none;
	}

	.control {
		position: absolute;
		left: 50%;
		bottom: var(--space-5);
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		min-height: 2.5rem;
		padding: 0 var(--space-4);
		border: var(--hairline) solid var(--line-strong);
		border-radius: 999px;
		background: var(--veil);
		-webkit-backdrop-filter: blur(12px);
		backdrop-filter: blur(12px);
		font-size: 0.8125rem;
		translate: -50% 0;
		transition:
			border-color var(--duration-2) var(--ease-out),
			transform var(--duration-1) var(--ease-out);
		touch-action: none;
	}

	.control:hover {
		border-color: var(--fg);
	}

	.control[aria-pressed='true'] {
		transform: scale(0.97);
	}

	.dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--fg-3);
		transition: background-color var(--duration-2) var(--ease-out);
	}

	.active .dot,
	.control[aria-pressed='true'] .dot {
		background: var(--accent);
	}

	@media (max-width: 47.99rem) {
		.field {
			aspect-ratio: 4 / 5;
		}
	}
</style>
