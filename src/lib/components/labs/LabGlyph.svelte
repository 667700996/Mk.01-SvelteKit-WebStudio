<!--
	A deterministic drawing per experiment, standing in for thumbnails. Same
	language as Plate: neutral ink, hairline strokes, a single accent mark.
	Geometry is seeded from the slug, so it is stable across server and client.
-->
<script lang="ts" module>
	const W = 400;
	const H = 250;

	function seeded(key: string) {
		let h = 2166136261;
		for (const char of key) h = Math.imul(h ^ char.charCodeAt(0), 16777619);
		return () => {
			h = Math.imul(h ^ (h >>> 15), 2246822507);
			h = Math.imul(h ^ (h >>> 13), 3266489909);
			return ((h ^= h >>> 16) >>> 0) / 4294967296;
		};
	}

	type Mark = { d: string; accent?: boolean; fill?: boolean; faint?: boolean };

	const disc = (x: number, y: number, r: number) =>
		`M${x - r} ${y}a${r} ${r} 0 1 0 ${r * 2} 0a${r} ${r} 0 1 0 ${-r * 2} 0`;

	const round = (n: number) => Math.round(n * 10) / 10;

	function orbit(rand: () => number): Mark[] {
		const marks: Mark[] = [];
		for (let ring = 1; ring <= 5; ring++) {
			const r = ring * 22;
			const count = ring * 9;
			const phase = rand() * Math.PI;
			for (let i = 0; i < count; i++) {
				const a = phase + (i / count) * Math.PI * 2;
				const x = round(200 + Math.cos(a) * r * 1.35);
				const y = round(125 + Math.sin(a) * r * 0.82);
				marks.push({ d: `M${x} ${y}h.01`, faint: ring % 2 === 0 });
			}
		}
		marks.push({ d: disc(200, 125, 6), fill: true });
		marks.push({ d: disc(round(200 + 5 * 22 * 1.35), 125, 3.5), accent: true, fill: true });
		return marks;
	}

	function cascade(rand: () => number): Mark[] {
		const marks: Mark[] = [];
		const count = 34;
		for (let i = 0; i < count; i++) {
			const x = round(40 + (i * (W - 80)) / (count - 1));
			const t = i / (count - 1);
			const len = 40 + Math.sin(t * Math.PI) * 120 + rand() * 18;
			marks.push({ d: `M${x} 40V${round(40 + len)}`, faint: i % 3 !== 0 });
		}
		marks.push({ d: 'M40 40H360', faint: true });
		marks.push({ d: disc(round(40 + (17 * (W - 80)) / 33), 214, 3.5), accent: true, fill: true });
		return marks;
	}

	function glyphs(rand: () => number): Mark[] {
		const marks: Mark[] = [];
		const size = 34;
		const cols = 7;
		const rows = 4;
		const ox = (W - cols * size - (cols - 1) * 10) / 2;
		const oy = (H - rows * size - (rows - 1) * 10) / 2;
		const pick = Math.floor(rand() * cols * rows);
		for (let r = 0; r < rows; r++) {
			for (let c = 0; c < cols; c++) {
				const x = round(ox + c * (size + 10));
				const y = round(oy + r * (size + 10));
				const v = Math.floor(rand() * 4);
				const shapes = [
					`M${x} ${y + size}A${size} ${size} 0 0 1 ${x + size} ${y}`,
					`M${x} ${y}H${x + size}V${y + size}`,
					`M${x} ${y}L${x + size} ${y + size}M${x + size} ${y}L${x} ${y + size}`,
					`M${x + size / 2} ${y}V${y + size}M${x} ${y + size / 2}H${x + size}`
				];
				const index = r * cols + c;
				marks.push({ d: shapes[v], accent: index === pick });
				marks.push({ d: `M${x} ${y}h${size}v${size}h-${size}z`, faint: true });
			}
		}
		return marks;
	}

	function network(rand: () => number): Mark[] {
		const marks: Mark[] = [];
		const nodes: [number, number][] = [];
		for (let r = 0; r < 5; r++) for (let c = 0; c < 9; c++) nodes.push([60 + c * 35, 55 + r * 35]);
		nodes.forEach(([x, y], i) => {
			const right = nodes[i + 1];
			const below = nodes[i + 9];
			if (right && i % 9 !== 8 && rand() > 0.5) marks.push({ d: `M${x} ${y}L${right[0]} ${right[1]}` });
			if (below && rand() > 0.55) marks.push({ d: `M${x} ${y}L${below[0]} ${below[1]}` });
			marks.push({ d: `M${x} ${y}h.01` });
		});
		const [ax, ay] = nodes[Math.floor(rand() * nodes.length)];
		marks.push({ d: disc(ax, ay, 4.5), accent: true, fill: true });
		return marks;
	}

	function documents(rand: () => number): Mark[] {
		const marks: Mark[] = [];
		for (const ox of [70, 215]) {
			marks.push({ d: `M${ox} 40h115v170h-115z`, faint: true });
			for (let i = 0; i < 11; i++) {
				const w = round(30 + rand() * 65);
				const y = 58 + i * 13;
				marks.push({ d: `M${ox + 12} ${y}h${w}`, faint: i % 4 === 0 });
			}
		}
		marks.push({ d: 'M227 188v12', accent: true });
		return marks;
	}

	function spectrum(rand: () => number): Mark[] {
		const marks: Mark[] = [];
		const count = 48;
		const peak = Math.floor(rand() * count);
		for (let i = 0; i < count; i++) {
			const x = round(48 + (i * (W - 96)) / (count - 1));
			const h = round(12 + Math.pow(rand(), 1.6) * 130);
			marks.push({ d: `M${x} ${205}V${round(205 - h)}`, accent: i === peak, faint: i % 2 === 1 });
		}
		marks.push({ d: 'M40 212H360', faint: true });
		return marks;
	}

	const drawings: Record<string, (rand: () => number) => Mark[]> = {
		'sonic-orbit': orbit,
		'holo-cascade': cascade,
		'glyph-suite': glyphs,
		'sense-grid': network,
		'quantum-docs': documents,
		'flicker-field': spectrum
	};

	export function glyphFor(slug: string): Mark[] {
		return (drawings[slug] ?? network)(seeded(slug));
	}
</script>

<script lang="ts">
	let { slug, caption = '' }: { slug: string; caption?: string } = $props();

	const marks = $derived(glyphFor(slug));
</script>

<figure class="glyph" aria-hidden="true">
	<svg viewBox="0 0 {W} {H}" preserveAspectRatio="xMidYMid meet">
		<g class="ink">
			{#each marks as mark}
				<path
					d={mark.d}
					class:faint={mark.faint}
					class:accent={mark.accent}
					class:fill={mark.fill}
				/>
			{/each}
		</g>
	</svg>
	{#if caption}
		<figcaption class="label">{caption}</figcaption>
	{/if}
</figure>

<style>
	.glyph {
		position: relative;
		aspect-ratio: 16 / 10;
		border-radius: var(--radius-l);
		background: var(--bg-raised);
		color: var(--fg);
		overflow: hidden;
	}

	svg {
		position: absolute;
		inset: 6%;
		width: 88%;
		height: 88%;
		overflow: visible;
	}

	path {
		fill: none;
		stroke: currentColor;
		stroke-width: 1;
		stroke-linecap: round;
		vector-effect: non-scaling-stroke;
	}

	/* Zero-length round-capped paths render as dots. */
	path[d$='h.01'] {
		stroke-width: 2.5;
	}

	.faint {
		stroke: var(--fg-3);
		opacity: 0.6;
	}

	.fill {
		fill: currentColor;
		stroke: none;
	}

	.accent {
		stroke: var(--accent);
		stroke-width: 2;
		opacity: 1;
	}

	.accent.fill {
		fill: var(--accent);
		stroke: none;
	}

	.ink {
		transform-origin: 200px 125px;
		transform-box: view-box;
		transition: transform var(--duration-4) var(--ease-out);
	}

	figcaption {
		position: absolute;
		inset: auto var(--space-4) var(--space-3);
	}

	@media (prefers-reduced-motion: no-preference) {
		:global(.plate-host:is(:hover, :focus-visible)) .ink {
			transform: scale(1.04);
		}
	}
</style>
