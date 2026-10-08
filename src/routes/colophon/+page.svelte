<script lang="ts">
	import { onMount } from 'svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import SectionHead from '$lib/components/ui/SectionHead.svelte';
	import Kbd from '$lib/components/ui/Kbd.svelte';
	import { ui } from '$lib/state/ui.svelte';
	import { formatBytes, formatMs, rate, vitals, type Rating } from '$lib/state/vitals.svelte';
	import { formatDate } from '$lib/utils/format';

	let { data } = $props();

	// 01 · This visit ----------------------------------------------------------

	const ratingLabel: Record<Rating, string> = {
		good: 'Good',
		'needs-improvement': 'Needs work',
		poor: 'Poor'
	};

	const metrics = $derived([
		{
			name: 'Largest Contentful Paint',
			short: 'LCP',
			value: formatMs(vitals.lcp),
			rating: rate('lcp', vitals.lcp),
			note: 'When the largest element finished painting. Target ≤ 2.5 s.'
		},
		{
			name: 'Cumulative Layout Shift',
			short: 'CLS',
			value: vitals.cls.toFixed(3),
			rating: rate('cls', vitals.cls),
			note: 'How much the layout moved unexpectedly. Target ≤ 0.1.'
		},
		{
			name: 'Interaction to Next Paint',
			short: 'INP',
			value: formatMs(vitals.inp),
			rating: rate('inp', vitals.inp),
			note: vitals.inp === null
				? 'Appears after your first click or key press. Target ≤ 200 ms.'
				: 'Slowest response to your input so far. Target ≤ 200 ms.'
		},
		{
			name: 'First Contentful Paint',
			short: 'FCP',
			value: formatMs(vitals.fcp),
			rating: rate('fcp', vitals.fcp),
			note: 'When the first text or graphic appeared. Target ≤ 1.8 s.'
		},
		{
			name: 'Transferred',
			short: 'Weight',
			value: formatBytes(vitals.transfer),
			rating: null,
			note: `${vitals.requests} requests over the network this visit; cached files count as zero.`
		},
		{
			name: 'Last route change',
			short: 'Route',
			value: formatMs(vitals.navigation),
			rating: null,
			note: 'Client-side navigation, from click to rendered page. Navigate and come back.'
		}
	]);

	// 02 · Colour, read from the live tokens ------------------------------------

	const swatches = [
		{ token: '--fg', role: 'Primary text' },
		{ token: '--fg-2', role: 'Secondary text' },
		{ token: '--fg-3', role: 'Metadata' },
		{ token: '--accent', role: 'Accent' },
		{ token: '--line-control', role: 'Control borders' },
		{ token: '--line', role: 'Hairlines' }
	];

	let colors = $state<Record<string, { value: string; ratio: number }>>({});
	let background = $state('');

	function luminance(hex: string) {
		const channels = hex
			.replace('#', '')
			.match(/.{2}/g)!
			.map((part) => parseInt(part, 16) / 255)
			.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
		return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
	}

	function contrast(a: string, b: string) {
		const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
		return (hi + 0.05) / (lo + 0.05);
	}

	function readColors() {
		const style = getComputedStyle(document.documentElement);
		const read = (token: string) => style.getPropertyValue(token).trim();
		background = read('--bg');
		colors = Object.fromEntries(
			swatches.map(({ token }) => {
				const value = read(token);
				return [token, { value, ratio: /^#[0-9a-f]{6}$/i.test(value) ? contrast(value, background) : 0 }];
			})
		);
	}

	const grade = (ratio: number) => (ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA Large · UI' : '—');

	// 03 · Type, measured at this viewport --------------------------------------

	const scale = [
		{ token: '--text-display', label: 'Display', sample: 'Matter.', weight: 640, track: '--track-display' },
		{ token: '--text-h1', label: 'H1', sample: 'Engineered.', weight: 620, track: '--track-h1' },
		{ token: '--text-h2', label: 'H2', sample: 'One standard of care.', weight: 600, track: '--track-h2' },
		{ token: '--text-h3', label: 'H3', sample: 'Systems create freedom.', weight: 600, track: '--track-h3' },
		{ token: '--text-lead', label: 'Lead', sample: 'Every behavior earns its place.', weight: 400, track: '' },
		{ token: '--text-body', label: 'Body', sample: 'Every frame has a job.', weight: 400, track: '--track-body' }
	];

	let specimen = $state<HTMLElement>();
	let sizes = $state<number[]>([]);
	let viewport = $state(0);

	function measureType() {
		if (!specimen) return;
		viewport = window.innerWidth;
		sizes = [...specimen.querySelectorAll<HTMLElement>('[data-sample]')].map((el) =>
			parseFloat(getComputedStyle(el).fontSize)
		);
	}

	// 04 · Grid ------------------------------------------------------------------

	let probe = $state<HTMLElement>();
	let gridSection = $state<HTMLElement>();
	let grid = $state({ columns: 12, gutter: 0, margin: 0, width: 0 });

	function measureGrid() {
		if (!probe || !gridSection) return;
		const columns = getComputedStyle(probe);
		const container = getComputedStyle(gridSection);
		grid = {
			columns: columns.gridTemplateColumns.split(' ').length,
			gutter: Math.round(parseFloat(columns.columnGap)),
			margin: Math.round(parseFloat(container.paddingLeft)),
			width: Math.round(probe.getBoundingClientRect().width)
		};
	}

	onMount(() => {
		readColors();
		measureType();
		measureGrid();
		const onResize = () => {
			measureType();
			measureGrid();
		};
		const themeObserver = new MutationObserver(readColors);
		themeObserver.observe(document.documentElement, { attributeFilter: ['data-theme'] });
		const scheme = matchMedia('(prefers-color-scheme: dark)');
		scheme.addEventListener('change', readColors);
		window.addEventListener('resize', onResize);
		return () => {
			themeObserver.disconnect();
			scheme.removeEventListener('change', readColors);
			window.removeEventListener('resize', onResize);
		};
	});

	const engineering = [
		['Framework', `SvelteKit ${data.build.kit} with Svelte ${data.build.svelte} runes. Every page is prerendered to static HTML; only journal search and the contact form render on demand.`],
		['Dependencies', `${data.build.runtimeDependencies} runtime npm dependencies. No UI kit, no animation library, no 3D engine — canvas, SVG and CSS do the work.`],
		['Type', 'Inter (variable, optical size) and IBM Plex Mono, self-hosted and preloaded. No third-party font request blocks the first paint.'],
		['Motion', 'Scroll reveals are CSS scroll-driven animations with zero JavaScript. Route changes use the View Transitions API; plates and titles morph between pages.'],
		['Rendering', 'Canvas systems cap device-pixel ratio, allocate nothing per frame, sleep off-screen and in hidden tabs, and render on demand under reduced motion.'],
		['Search', 'A static index, prerendered at build, fetched on the first ⌘K. Ranking is a three-tier matcher: phrase, words, then subsequence with acronym support.'],
		['Resilience', 'The contact form validates on the server and works with JavaScript disabled. The theme resolves before first paint, so it never flashes.'],
		['Verification', 'Playwright runs every route on desktop and mobile, with axe accessibility audits in light and dark, plus palette, theme, form and keyboard tests.']
	];
</script>

<PageHeader
	label="Colophon"
	title="How this site is built."
	lead="A portfolio should prove its claims. The figures below are measured in your browser, right now; the rest is the system that produced them."
>
	{#snippet actions()}
		<button class="button button--quiet" type="button" onclick={() => ui.toggleHud()}>
			{ui.hudVisible ? 'Hide' : 'Show'} live metrics panel <Kbd keys={['P']} />
		</button>
	{/snippet}
</PageHeader>

<section class="wrap section first" aria-labelledby="visit-title">
	<SectionHead
		index="01"
		label="This visit"
		title="Measured, not claimed."
		intro="Field data from the browser’s own Performance APIs. Nothing on this panel is estimated or typed by hand."
		id="visit-title"
	/>
	<ul class="metrics" role="list">
		{#each metrics as metric (metric.short)}
			<li>
				<p class="label metric-head">
					<span>{metric.short}</span>
					{#if metric.rating}
						<span class="rating {metric.rating}">
							<span class="dot" aria-hidden="true"></span>{ratingLabel[metric.rating]}
						</span>
					{/if}
				</p>
				<p class="value tabular" aria-live="polite">{metric.value}</p>
				<p class="name">{metric.name}</p>
				<p class="secondary note">{metric.note}</p>
			</li>
		{/each}
	</ul>
</section>

<section class="wrap section" aria-labelledby="colour-title">
	<SectionHead
		index="02"
		label="Colour"
		title="One ramp, one accent."
		intro="Read from the live design tokens and checked against the current background. Switch the theme in the footer and watch the ratios update."
		id="colour-title"
	/>
	<ul class="swatches" role="list">
		{#each swatches as swatch (swatch.token)}
			{@const color = colors[swatch.token]}
			<li>
				<span class="chip" style:background="var({swatch.token})"></span>
				<p class="name">{swatch.role}</p>
				<p class="label">{swatch.token} · {color?.value ?? '—'}</p>
				<p class="ratio tabular">
					{color?.ratio ? `${color.ratio.toFixed(2)} : 1` : '—'}
					<span class="label">{color?.ratio ? grade(color.ratio) : ''}</span>
				</p>
			</li>
		{/each}
	</ul>
	<p class="label caption">Contrast against --bg ({background || '—'}). Hairlines are decorative and exempt by design.</p>
</section>

<section class="wrap section" aria-labelledby="type-title">
	<SectionHead
		index="03"
		label="Type"
		title="Fluid, never arbitrary."
		intro="Every size is a clamp() between a mobile and a desktop value. These are the sizes at your current viewport — resize the window."
		id="type-title"
	/>
	<ol class="specimen" role="list" bind:this={specimen}>
		{#each scale as step, i (step.token)}
			<li>
				<p class="label spec">
					<span>{step.label}</span>
					<span class="tabular">{sizes[i] ? `${Math.round(sizes[i])}px` : '—'}</span>
				</p>
				<p
					class="sample"
					data-sample
					style:font-size="var({step.token})"
					style:font-weight={step.weight}
					style:letter-spacing={step.track ? `var(${step.track})` : '-0.016em'}
				>
					{step.sample}
				</p>
			</li>
		{/each}
	</ol>
	<p class="label caption tabular">Viewport {viewport || '—'}px · Inter Variable with optical sizing · IBM Plex Mono for the system voice</p>
</section>

<section class="wrap section" aria-labelledby="grid-title" bind:this={gridSection}>
	<SectionHead
		index="04"
		label="Grid"
		title="Twelve columns, measured."
		id="grid-title"
	/>
	<div class="grid probe" bind:this={probe} aria-hidden="true">
		{#each { length: 12 } as _, i}
			<span><i class="label">{String(i + 1).padStart(2, '0')}</i></span>
		{/each}
	</div>
	<dl class="facts">
		<div><dt class="label">Columns</dt><dd class="tabular">{grid.columns}</dd></div>
		<div><dt class="label">Gutter</dt><dd class="tabular">{grid.gutter || '—'}px</dd></div>
		<div><dt class="label">Margin</dt><dd class="tabular">{grid.margin || '—'}px</dd></div>
		<div><dt class="label">Container</dt><dd class="tabular">{grid.width || '—'}px</dd></div>
	</dl>
	<p class="label caption">Press <Kbd keys={['G']} /> on any page to overlay this grid.</p>
</section>

<section class="wrap section" aria-labelledby="engineering-title">
	<SectionHead index="05" label="Engineering" title="Decisions under the surface." id="engineering-title" />
	<dl class="rows">
		{#each engineering as [term, detail]}
			<div class="grid row">
				<dt class="label">{term}</dt>
				<dd class="secondary">{detail}</dd>
			</div>
		{/each}
	</dl>
	<p class="label caption tabular">
		{data.build.routes} route templates · built {formatDate(data.build.builtAt)}
	</p>
</section>

<style>
	.first {
		padding-top: var(--space-8);
	}

	.caption {
		margin-top: var(--space-5);
	}

	/* Metrics -------------------------------------------------------------- */

	.metrics {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--space-8) var(--gutter);
	}

	.metrics li {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		padding-top: var(--space-4);
		border-top: var(--hairline) solid var(--fg);
	}

	.metric-head {
		display: flex;
		justify-content: space-between;
	}

	.rating {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
	}

	.dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--fg-3);
	}

	.good .dot {
		background: var(--accent);
	}

	.poor .dot {
		background: var(--danger);
	}

	.value {
		margin-top: var(--space-4);
		font-size: var(--text-h2);
		font-weight: 600;
		letter-spacing: var(--track-h2);
		line-height: 1;
	}

	.name {
		margin-top: var(--space-3);
		font-weight: 560;
	}

	.note {
		max-width: 26em;
		font-size: var(--text-small);
	}

	/* Swatches ------------------------------------------------------------- */

	.swatches {
		display: grid;
		grid-template-columns: repeat(6, 1fr);
		gap: var(--gutter);
	}

	.swatches li {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.chip {
		aspect-ratio: 1;
		margin-bottom: var(--space-3);
		border-radius: var(--radius-m);
		box-shadow: inset 0 0 0 var(--hairline) var(--line);
	}

	.ratio {
		display: flex;
		align-items: baseline;
		gap: var(--space-2);
		margin-top: var(--space-2);
		font-size: var(--text-h4);
		font-weight: 600;
		letter-spacing: -0.02em;
	}

	/* Specimen ------------------------------------------------------------- */

	.specimen li {
		display: grid;
		grid-template-columns: minmax(8rem, 3fr) 9fr;
		gap: var(--gutter);
		align-items: baseline;
		padding-block: var(--space-5);
		border-top: var(--hairline) solid var(--line);
	}

	.spec {
		display: flex;
		justify-content: space-between;
		gap: var(--space-4);
	}

	.sample {
		line-height: 1.05;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	/* Grid ----------------------------------------------------------------- */

	.probe {
		height: 9rem;
	}

	.probe span {
		position: relative;
		border-radius: var(--radius-s);
		background: var(--accent-soft);
	}

	.probe i {
		color: var(--fg-2);
		position: absolute;
		left: var(--space-2);
		bottom: var(--space-2);
		font-style: normal;
	}

	.facts {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: var(--gutter);
		margin-top: var(--space-6);
	}

	.facts div {
		padding-top: var(--space-4);
		border-top: var(--hairline) solid var(--line);
	}

	.facts dd {
		margin-top: var(--space-2);
		font-size: var(--text-h3);
		font-weight: 600;
		letter-spacing: var(--track-h3);
	}

	/* Engineering ---------------------------------------------------------- */

	.rows {
		border-top: var(--hairline) solid var(--fg);
	}

	.row {
		padding-block: var(--space-5);
		border-bottom: var(--hairline) solid var(--line);
		row-gap: var(--space-2);
	}

	.row dt {
		grid-column: 1 / span 3;
		padding-top: 0.3em;
	}

	.row dd {
		grid-column: 4 / span 7;
	}

	@media (max-width: 63.99rem) {
		.metrics {
			grid-template-columns: repeat(2, 1fr);
		}

		.swatches {
			grid-template-columns: repeat(3, 1fr);
			row-gap: var(--space-6);
		}

		.row dt,
		.row dd {
			grid-column: 1 / -1;
		}
	}

	@media (max-width: 47.99rem) {
		.metrics {
			grid-template-columns: 1fr;
		}

		.swatches {
			grid-template-columns: repeat(2, 1fr);
		}

		.specimen li {
			grid-template-columns: 1fr;
			gap: var(--space-3);
		}

		.facts {
			grid-template-columns: repeat(2, 1fr);
			row-gap: var(--space-5);
		}

		.probe span:nth-child(n + 5) {
			display: none;
		}

		.probe {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}
	}
</style>
