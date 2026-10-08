<!--
	A project "plate": a precise, resolution-independent drawing standing in for
	cover imagery. Each project has one idea, drawn with the same line weight,
	the same neutral ink, and a single accent mark.
-->
<script lang="ts" module>
	export type PlateKind = 'orbital' | 'signal' | 'monolith';

	export const plateForProject: Record<string, PlateKind> = {
		'neon-metropolis': 'orbital',
		'atlas-labs': 'signal',
		flowstate: 'monolith'
	};

	// Signal: a field of waveforms whose amplitude swells toward the centre.
	const W = 400;
	const H = 300;
	const signalPaths = Array.from({ length: 11 }, (_, row) => {
		const y0 = 60 + row * 18;
		let d = '';
		for (let x = 24; x <= W - 24; x += 4) {
			const t = (x - W / 2) / 90;
			const envelope = Math.exp(-t * t);
			const y = y0 + Math.sin(x * 0.075 + row * 0.55) * 16 * envelope * (1 - Math.abs(row - 5) / 7);
			d += `${x === 24 ? 'M' : 'L'}${x} ${y.toFixed(2)}`;
		}
		return d;
	});

	const dots = Array.from({ length: 9 * 7 }, (_, i) => ({ x: 40 + (i % 9) * 40, y: 30 + Math.floor(i / 9) * 40 }));
</script>

<script lang="ts">
	let {
		kind,
		caption = '',
		index = '',
		ratio = '4 / 3'
	}: { kind: PlateKind; caption?: string; index?: string; ratio?: string } = $props();
</script>

<figure class="plate plate--{kind}" style:aspect-ratio={ratio} aria-hidden="true">
	<svg viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid meet">
		{#if kind === 'orbital'}
			<g class="ink-faint">
				{#each dots as dot}
					<circle cx={dot.x} cy={dot.y} r="0.9" />
				{/each}
			</g>
			<g class="orbit orbit--a"><ellipse cx="200" cy="150" rx="132" ry="44" /></g>
			<g class="orbit orbit--b"><ellipse cx="200" cy="150" rx="118" ry="62" /></g>
			<g class="orbit orbit--c">
				<ellipse cx="200" cy="150" rx="96" ry="96" stroke-dasharray="2 5" />
				<circle class="accent" cx="296" cy="150" r="4" />
			</g>
			<circle class="solid" cx="200" cy="150" r="30" />
		{:else if kind === 'signal'}
			<g class="ink-faint">
				<path d="M200 24V276" stroke-dasharray="2 4" />
				<path d="M24 150H376" stroke-dasharray="2 4" />
			</g>
			<g class="waves">
				{#each signalPaths as d, i}
					<path {d} style:--i={i} />
				{/each}
			</g>
			<circle class="accent" cx="200" cy="150" r="4" />
		{:else}
			<g class="ink-faint">
				{#each dots as dot}
					<circle cx={dot.x} cy={dot.y} r="0.9" />
				{/each}
			</g>
			<rect class="solid block block--a" x="118" y="58" width="72" height="184" />
			<rect class="block block--b" x="198" y="98" width="84" height="144" />
			<circle class="block block--c" cx="240" cy="98" r="42" />
			<rect class="accent block block--d" x="118" y="250" width="164" height="3" />
		{/if}
	</svg>

	{#if caption || index}
		<figcaption class="label">
			<span>{index}</span>
			<span>{caption}</span>
		</figcaption>
	{/if}
</figure>

<style>
	.plate {
		position: relative;
		width: 100%;
		border-radius: var(--radius-l);
		background: var(--bg-raised);
		color: var(--fg);
		overflow: hidden;
		isolation: isolate;
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
		vector-effect: non-scaling-stroke;
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
	}

	/* Motion: idle is still. Hovering the owning `.plate-host` sets the system moving. */
	.orbit,
	.waves path,
	.block {
		transform-box: view-box;
		transform-origin: 200px 150px;
		transition: transform var(--duration-4) var(--ease-out);
	}

	.orbit--a {
		transform: rotate(-18deg);
	}

	.orbit--b {
		transform: rotate(28deg);
	}

	.orbit--c {
		transform: rotate(0deg);
	}

	.waves path {
		stroke-dasharray: 520;
		stroke-dashoffset: 0;
		transition: stroke-dashoffset 1.4s var(--ease-out);
		transition-delay: calc(var(--i) * 25ms);
	}

	@media (prefers-reduced-motion: no-preference) {
		:global(.plate-host:is(:hover, :focus-visible)) .orbit--a {
			transform: rotate(-4deg);
		}

		:global(.plate-host:is(:hover, :focus-visible)) .orbit--b {
			transform: rotate(48deg);
		}

		:global(.plate-host:is(:hover, :focus-visible)) .orbit--c {
			transform: rotate(-60deg);
		}

		:global(.plate-host:is(:hover, :focus-visible)) .waves path {
			stroke-dashoffset: 1040;
		}

		:global(.plate-host:is(:hover, :focus-visible)) .block--a {
			transform: translateY(-10px);
		}

		:global(.plate-host:is(:hover, :focus-visible)) .block--b {
			transform: translateX(8px);
		}

		:global(.plate-host:is(:hover, :focus-visible)) .block--c {
			transform: translate(16px, -6px);
		}
	}
</style>
