<!--
	The case-study hero: each project's plate as a working system rather than a
	picture of one. Same geometry and ink as <Plate>, driven by the pointer.
	  · Kinesis (orbital)  — the pointer steers the orbits; a satellite keeps time
	  · Aether  (signal)   — the pointer moves the signal's centre and gain
	  · Mono/R  (monolith) — tap to set a tempo; the composition breathes to it
	Springs are integrated per frame; the loop sleeps when off-screen, in a
	hidden tab, or — under reduced motion — as soon as it settles.
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import type { PlateKind } from './Plate.svelte';

	let {
		kind,
		name,
		index = ''
	}: { kind: PlateKind; name?: string; index?: string } = $props();

	const W = 400;
	const H = 300;
	const dots = Array.from({ length: 9 * 7 }, (_, i) => ({
		x: 40 + (i % 9) * 40,
		y: 30 + Math.floor(i / 9) * 40
	}));

	let figure: HTMLElement;
	let px = $state(0); // smoothed pointer, −1…1
	let py = $state(0);
	let t = $state(0); // seconds of ambient time
	let gain = $state(0); // 0…1, eases up while the pointer is engaged
	let bpm = $state(72);
	let beat = $state(0); // 0…1 envelope that peaks on each beat
	let reduced = $state(false);

	const hint = {
		orbital: 'Move to steer the orbits',
		signal: 'Move to tune the signal',
		monolith: 'Tap to set the rhythm'
	}[kind];

	const description = {
		orbital: 'An orbital identity system: three rings around a solid core, steered by the pointer.',
		signal: 'A field of waveforms whose centre and amplitude follow the pointer.',
		monolith: 'A composition of blocks that pulses to a tempo you tap.'
	}[kind];

	onMount(() => {
		const motion = matchMedia('(prefers-reduced-motion: reduce)');
		reduced = motion.matches;
		const target = { x: 0, y: 0, engaged: false };
		const taps: number[] = [];
		let frame = 0;
		let last = 0;
		let visible = false;
		let phase = 0;

		const settled = () =>
			Math.abs(target.x - px) < 0.001 &&
			Math.abs(target.y - py) < 0.001 &&
			Math.abs((target.engaged ? 1 : 0) - gain) < 0.001;

		const loop = (now: number) => {
			frame = 0;
			const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
			last = now;
			// Exponential smoothing, frame-rate independent.
			const k = 1 - Math.exp(-dt * 7);
			px += (target.x - px) * k;
			py += (target.y - py) * k;
			gain += ((target.engaged ? 1 : 0) - gain) * (1 - Math.exp(-dt * 4));
			if (!reduced) {
				t += dt;
				phase = (phase + dt * (bpm / 60)) % 1;
				beat = Math.pow(1 - phase, 3);
			}
			if (visible && !document.hidden && (!reduced || !settled())) request();
			else last = 0;
		};

		function request() {
			if (!frame) frame = requestAnimationFrame(loop);
		}

		const move = (event: PointerEvent) => {
			const rect = figure.getBoundingClientRect();
			target.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
			target.y = ((event.clientY - rect.top) / rect.height) * 2 - 1;
			target.engaged = true;
			request();
		};

		const leave = () => {
			target.x = target.y = 0;
			target.engaged = false;
			request();
		};

		const tap = (event: PointerEvent) => {
			move(event);
			if (kind !== 'monolith') return;
			const now = performance.now();
			if (taps.length && now - taps[taps.length - 1] > 2000) taps.length = 0;
			taps.push(now);
			if (taps.length > 5) taps.shift();
			if (taps.length >= 2) {
				const span = (taps[taps.length - 1] - taps[0]) / (taps.length - 1);
				bpm = Math.round(Math.min(180, Math.max(40, 60000 / span)));
			}
			phase = 0; // land the beat on the tap
			beat = 1;
		};

		const onMotion = () => {
			reduced = motion.matches;
			request();
		};

		const observer = new IntersectionObserver(([entry]) => {
			visible = entry.isIntersecting;
			if (visible) request();
		});
		observer.observe(figure);
		figure.addEventListener('pointermove', move);
		figure.addEventListener('pointerdown', tap);
		figure.addEventListener('pointerleave', leave);
		motion.addEventListener('change', onMotion);
		document.addEventListener('visibilitychange', request);

		return () => {
			cancelAnimationFrame(frame);
			observer.disconnect();
			figure.removeEventListener('pointermove', move);
			figure.removeEventListener('pointerdown', tap);
			figure.removeEventListener('pointerleave', leave);
			motion.removeEventListener('change', onMotion);
			document.removeEventListener('visibilitychange', request);
		};
	});

	// Orbital ---------------------------------------------------------------
	const satellite = $derived.by(() => {
		const angle = (t * 36 + px * 40) * (Math.PI / 180);
		return { x: 200 + Math.cos(angle) * 96, y: 150 + Math.sin(angle) * 96 };
	});

	// Signal ----------------------------------------------------------------
	const signalPaths = $derived.by(() => {
		const centre = W / 2 + px * 110;
		const amplitude = 16 * (1 + gain * 0.55 - py * 0.35);
		const paths: string[] = [];
		for (let row = 0; row < 11; row++) {
			const y0 = 60 + row * 18;
			const falloff = 1 - Math.abs(row - 5) / 7;
			let d = '';
			for (let x = 24; x <= W - 24; x += 4) {
				const u = (x - centre) / 90;
				const y = y0 + Math.sin(x * 0.075 + row * 0.55 - t * 1.6) * amplitude * Math.exp(-u * u) * falloff;
				d += `${x === 24 ? 'M' : 'L'}${x} ${y.toFixed(1)}`;
			}
			paths.push(d);
		}
		return paths;
	});
</script>

<figure
	class="plate plate--{kind}"
	style:view-transition-name={name}
	bind:this={figure}
	role="img"
	aria-label={description}
>
	<svg viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
		<g class="ink-faint">
			{#if kind === 'signal'}
				<path d="M{200 + px * 110} 24V276" stroke-dasharray="2 4" />
				<path d="M24 150H376" stroke-dasharray="2 4" />
			{:else}
				{#each dots as dot}
					<circle cx={dot.x} cy={dot.y} r="0.9" />
				{/each}
			{/if}
		</g>

		{#if kind === 'orbital'}
			<g transform="rotate({-18 + px * 16} 200 150)">
				<ellipse cx="200" cy="150" rx="132" ry={44 * (1 + py * 0.4)} />
			</g>
			<g transform="rotate({28 - px * 12} 200 150)">
				<ellipse cx="200" cy="150" rx="118" ry={62 * (1 - py * 0.3)} />
			</g>
			<ellipse cx="200" cy="150" rx="96" ry="96" stroke-dasharray="2 5" />
			<circle class="accent" cx={satellite.x} cy={satellite.y} r="4" />
			<circle class="solid" cx={200 + px * 6} cy={150 + py * 6} r={30 + gain * 2} />
		{:else if kind === 'signal'}
			{#each signalPaths as d}
				<path {d} />
			{/each}
			<circle class="accent" cx={200 + px * 110} cy="150" r={4 + gain * 1.5} />
		{:else}
			<rect class="solid" x={118 - px * 8} y={58 - beat * 6} width="72" height={184 + beat * 6} />
			<rect x={198 + px * 6} y={98 + py * 4} width="84" height="144" />
			<circle cx={240 + px * 10} cy={98 - beat * 14 + py * 4} r="42" />
			<rect
				class="accent"
				x="118"
				y="250"
				width="164"
				height="3"
				transform="translate({118 + 82} 0) scale({0.55 + beat * 0.45} 1) translate({-(118 + 82)} 0)"
			/>
		{/if}
	</svg>

	<figcaption class="label">
		<span>{index}</span>
		<span class="tabular">{kind === 'monolith' ? `${hint} · ${bpm} BPM` : hint}</span>
	</figcaption>
</figure>

<style>
	.plate {
		position: relative;
		width: 100%;
		aspect-ratio: 16 / 9;
		border-radius: var(--radius-l);
		background: var(--bg-raised);
		color: var(--fg);
		overflow: hidden;
		isolation: isolate;
		cursor: crosshair;
		touch-action: pan-y;
		user-select: none;
		-webkit-user-select: none;
		container-type: inline-size;
	}

	svg {
		position: absolute;
		inset: 8%;
		width: 84%;
		height: 84%;
		overflow: visible;
		fill: none;
		stroke: currentColor;
		stroke-width: 1;
	}

	svg :global(*) {
		vector-effect: non-scaling-stroke;
	}

	.ink-faint {
		stroke: var(--fg-3);
		fill: var(--fg-3);
		opacity: 0.55;
	}

	.solid {
		fill: currentColor;
		stroke: none;
	}

	.accent {
		fill: var(--accent);
		stroke: none;
	}

	figcaption {
		position: absolute;
		inset: auto var(--space-5) var(--space-4);
		display: flex;
		justify-content: space-between;
		gap: var(--space-4);
		pointer-events: none;
	}

	@container (max-width: 26rem) {
		figcaption span:first-child {
			display: none;
		}
	}
</style>
