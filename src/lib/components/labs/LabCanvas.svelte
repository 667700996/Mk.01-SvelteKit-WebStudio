<!--
	The live viewport for a Labs entry. Every parameter is wired to the render:
	  intensity  → displacement amplitude and line opacity
	  colorShift → hue spread around the theme accent
	  speed      → time scale
	  bloom      → glow via shadowBlur on the (few) batched strokes
	  mode       → Cartesian waveforms / Polar rings / Isometric lattice
	Each layer is a single path, so a frame is ~20 strokes regardless of size.
	Sleeps off-screen and in hidden tabs; under reduced motion it renders one
	still frame per parameter change.
-->
<script lang="ts" module>
	export type GridMode = 'cartesian' | 'polar' | 'iso';

	export interface LabParams {
		intensity: number;
		colorShift: number;
		speed: number;
		bloom: boolean;
		mode: GridMode;
	}

	export const defaultParams: LabParams = {
		intensity: 0.8,
		colorShift: 0.2,
		speed: 1.5,
		bloom: true,
		mode: 'polar'
	};

	function toHsl(color: string): [number, number, number] {
		const hex = color.trim().replace('#', '');
		if (!/^[0-9a-f]{6}$/i.test(hex)) return [228, 80, 52];
		const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		const l = (max + min) / 2;
		const d = max - min;
		if (!d) return [0, 0, l * 100];
		const s = d / (1 - Math.abs(2 * l - 1));
		const h =
			max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
		return [(h * 60 + 360) % 360, s * 100, l * 100];
	}
</script>

<script lang="ts">
	import { onMount } from 'svelte';

	let { params, seed = 'lab' }: { params: LabParams; seed?: string } = $props();

	let canvas: HTMLCanvasElement;
	let fps = $state(0);
	let still = $state(false);
	let wake = () => {};

	// Any parameter change wakes the loop (and is the only trigger under reduced motion).
	$effect(() => {
		void [params.intensity, params.colorShift, params.speed, params.bloom, params.mode];
		wake();
	});

	const LAYERS = 18;
	const phase = [...seed].reduce((sum, char) => sum + char.charCodeAt(0), 0) % 628 / 100;

	onMount(() => {
		const ctx = canvas.getContext('2d', { alpha: false });
		if (!ctx) return;

		const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
		const schemeQuery = matchMedia('(prefers-color-scheme: dark)');
		let reduced = motionQuery.matches;
		still = reduced;

		let width = 0;
		let height = 0;
		let frame = 0;
		let visible = false;
		let time = phase;
		let last = 0;
		let frames = 0;
		let sampleStart = 0;
		const colors = { bg: '#f5f5f6', ink: '#6e6f76', accent: [228, 80, 52] as [number, number, number] };

		const readColors = () => {
			const style = getComputedStyle(canvas);
			colors.bg = style.getPropertyValue('--bg-raised').trim() || colors.bg;
			colors.ink = style.getPropertyValue('--fg-3').trim() || colors.ink;
			colors.accent = toHsl(style.getPropertyValue('--accent'));
			request();
		};

		const resize = () => {
			const rect = canvas.getBoundingClientRect();
			const dpr = Math.min(devicePixelRatio || 1, 2);
			width = rect.width;
			height = rect.height;
			canvas.width = Math.max(1, Math.round(width * dpr));
			canvas.height = Math.max(1, Math.round(height * dpr));
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			request();
		};

		const layerColor = (layer: number) => {
			const [h, s, l] = colors.accent;
			const t = layer / (LAYERS - 1);
			const hue = (h + params.colorShift * 300 * t + 360) % 360;
			return `hsl(${hue.toFixed(1)} ${s.toFixed(1)}% ${l.toFixed(1)}%)`;
		};

		const beginLayer = (layer: number) => {
			const color = layerColor(layer);
			ctx.strokeStyle = color;
			ctx.globalAlpha = (0.25 + 0.75 * params.intensity) * (0.35 + 0.65 * (layer / (LAYERS - 1)));
			ctx.shadowColor = color;
			ctx.shadowBlur = params.bloom ? 6 + params.intensity * 14 : 0;
			ctx.beginPath();
		};

		const cartesian = (t: number) => {
			const amp = Math.min(width, height) * 0.09 * params.intensity;
			const top = height * 0.26;
			const gap = (height * 0.6) / (LAYERS - 1);
			for (let layer = 0; layer < LAYERS; layer++) {
				beginLayer(layer);
				const y0 = top + layer * gap;
				for (let x = 0; x <= width; x += 6) {
					const u = (x / width - 0.5) * 2;
					const envelope = Math.exp(-u * u * 2.4);
					const y = y0 - Math.abs(Math.sin(x * 0.018 + layer * 0.45 + t) * Math.cos(x * 0.007 - t * 0.6)) * amp * 1.8 * envelope;
					if (x === 0) ctx.moveTo(x, y);
					else ctx.lineTo(x, y);
				}
				ctx.stroke();
			}
		};

		const polar = (t: number) => {
			const cx = width / 2;
			const cy = height / 2;
			const maxR = Math.min(width, height) * 0.44;
			for (let layer = 0; layer < LAYERS; layer++) {
				beginLayer(LAYERS - 1 - layer);
				const base = maxR * (0.12 + (0.88 * layer) / (LAYERS - 1));
				const lobes = 3 + (layer % 4);
				for (let step = 0; step <= 120; step++) {
					const a = (step / 120) * Math.PI * 2;
					const r = base * (1 + Math.sin(a * lobes + t * (1 + layer * 0.08)) * 0.08 * params.intensity * (1 - layer / LAYERS / 2));
					const x = cx + Math.cos(a) * r;
					const y = cy + Math.sin(a) * r;
					if (step === 0) ctx.moveTo(x, y);
					else ctx.lineTo(x, y);
				}
				ctx.closePath();
				ctx.stroke();
			}
		};

		const iso = (t: number) => {
			const n = LAYERS;
			const size = Math.min(width / (n * 1.15), height / (n * 0.62));
			const ox = width / 2;
			const oy = height / 2 - (n * size * 0.5) / 2;
			const amp = size * 2.4 * params.intensity;
			const project = (i: number, j: number) => {
				const di = i - (n - 1) / 2;
				const dj = j - (n - 1) / 2;
				const z = Math.sin(Math.hypot(di, dj) * 0.7 - t * 1.4) * amp * Math.exp(-(di * di + dj * dj) / (n * 6));
				return [ox + (i - j) * size * 0.866 * 0.62, oy + (i + j) * size * 0.25 - z] as const;
			};
			// Faint cross-hatching in neutral ink as one path…
			ctx.globalAlpha = 0.35;
			ctx.shadowBlur = 0;
			ctx.strokeStyle = colors.ink;
			ctx.beginPath();
			for (let j = 0; j < n; j++) {
				for (let i = 0; i < n; i++) {
					const [x, y] = project(i, j);
					if (i === 0) ctx.moveTo(x, y);
					else ctx.lineTo(x, y);
				}
			}
			ctx.stroke();
			// …and the coloured rows on top, one path per layer.
			for (let i = 0; i < n; i++) {
				beginLayer(i);
				for (let j = 0; j < n; j++) {
					const [x, y] = project(i, j);
					if (j === 0) ctx.moveTo(x, y);
					else ctx.lineTo(x, y);
				}
				ctx.stroke();
			}
		};

		const draw = () => {
			ctx.shadowBlur = 0;
			ctx.globalAlpha = 1;
			ctx.fillStyle = colors.bg;
			ctx.fillRect(0, 0, width, height);
			ctx.lineWidth = 1.25;
			ctx.lineJoin = 'round';
			if (params.mode === 'cartesian') cartesian(time);
			else if (params.mode === 'iso') iso(time);
			else polar(time);
			ctx.shadowBlur = 0;
			ctx.globalAlpha = 1;
		};

		const loop = (now: number) => {
			frame = 0;
			const dt = last ? Math.min(now - last, 50) : 16;
			last = now;
			if (!reduced) time += (dt / 1000) * params.speed;
			draw();

			frames += 1;
			if (now - sampleStart > 500) {
				fps = Math.round((frames * 1000) / (now - sampleStart));
				frames = 0;
				sampleStart = now;
			}

			if (!reduced && visible && !document.hidden) request();
			else last = 0;
		};

		function request() {
			if (!frame) frame = requestAnimationFrame(loop);
		}
		wake = request;

		const onMotion = () => {
			reduced = motionQuery.matches;
			still = reduced;
			request();
		};

		const resizeObserver = new ResizeObserver(resize);
		const viewObserver = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting;
			if (visible) request();
		});
		const themeObserver = new MutationObserver(readColors);

		resizeObserver.observe(canvas);
		viewObserver.observe(canvas);
		themeObserver.observe(document.documentElement, { attributeFilter: ['data-theme'] });
		schemeQuery.addEventListener('change', readColors);
		motionQuery.addEventListener('change', onMotion);
		document.addEventListener('visibilitychange', request);
		readColors();

		return () => {
			wake = () => {};
			cancelAnimationFrame(frame);
			resizeObserver.disconnect();
			viewObserver.disconnect();
			themeObserver.disconnect();
			schemeQuery.removeEventListener('change', readColors);
			motionQuery.removeEventListener('change', onMotion);
			document.removeEventListener('visibilitychange', request);
		};
	});
</script>

<div class="viewport">
	<canvas bind:this={canvas} aria-hidden="true"></canvas>
	<p class="sr-only" aria-live="polite">Live render in {params.mode} mode.</p>
	<div class="hud label" aria-hidden="true">
		<span>Mode / {params.mode}</span>
		<span class="tabular">{still ? 'Static frame' : `${fps || '--'} fps`}</span>
	</div>
</div>

<style>
	.viewport {
		position: relative;
		aspect-ratio: 16 / 10;
		border-radius: var(--radius-l);
		background: var(--bg-raised);
		overflow: hidden;
	}

	canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
	}

	.hud {
		position: absolute;
		inset: var(--space-4) var(--space-5) auto;
		display: flex;
		justify-content: space-between;
		pointer-events: none;
	}
</style>
