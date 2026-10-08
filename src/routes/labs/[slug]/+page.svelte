<script lang="ts">
	import { statusLabel } from '$modules/labs';
	import { pad } from '$lib/utils/format';
	import LabCanvas, { defaultParams, type GridMode, type LabParams } from '$lib/components/labs/LabCanvas.svelte';

	let { data } = $props();

	const experiment = $derived(data.experiment);

	let params = $state<LabParams>({ ...defaultParams });

	const modes: { value: GridMode; label: string }[] = [
		{ value: 'cartesian', label: 'Cartesian' },
		{ value: 'polar', label: 'Polar' },
		{ value: 'iso', label: 'Iso' }
	];

	const ranges = [
		{ key: 'intensity', label: 'Intensity', min: 0, max: 1, step: 0.01, digits: 2 },
		{ key: 'colorShift', label: 'Color shift', min: 0, max: 1, step: 0.01, digits: 2 },
		{ key: 'speed', label: 'Speed', min: 0.1, max: 5, step: 0.1, digits: 1 }
	] as const;

	const isDefault = $derived(
		(Object.keys(defaultParams) as (keyof LabParams)[]).every(
			(key) => params[key] === defaultParams[key]
		)
	);

	function reset() {
		Object.assign(params, defaultParams);
	}

	const fill = (value: number, min: number, max: number) => `${((value - min) / (max - min)) * 100}%`;
</script>

<article class="wrap lab">
	<header class="head">
		<nav class="crumbs label" aria-label="Breadcrumb">
			<a href="/labs"><span class="arrow back" aria-hidden="true">←</span> Labs</a>
			<span class="tabular">Experiment {pad(data.index + 1)} / {pad(data.count)}</span>
		</nav>
		<h1 class="h1">{experiment.title}</h1>
		<p class="lead">{experiment.summary}</p>
	</header>

	<section class="instrument" aria-label="Interactive viewport">
		<div class="stage">
			<LabCanvas {params} seed={experiment.slug} />
		</div>

		<form class="panel" onsubmit={(event) => event.preventDefault()} aria-labelledby="params-title">
			<div class="panel-head">
				<h2 id="params-title" class="label">Parameters</h2>
				<button type="button" class="reset label" onclick={reset} disabled={isDefault}>Reset</button>
			</div>

			{#each ranges as range (range.key)}
				<div class="control">
					<div class="control-row">
						<label for="param-{range.key}">{range.label}</label>
						<output for="param-{range.key}" class="label tabular">
							{params[range.key].toFixed(range.digits)}
						</output>
					</div>
					<input
						id="param-{range.key}"
						type="range"
						min={range.min}
						max={range.max}
						step={range.step}
						bind:value={params[range.key]}
						style:--fill={fill(params[range.key], range.min, range.max)}
					/>
				</div>
			{/each}

			<div class="control control-row">
				<label for="param-bloom">Bloom</label>
				<input id="param-bloom" class="switch" type="checkbox" role="switch" bind:checked={params.bloom} />
			</div>

			<fieldset class="control">
				<legend>Grid mode</legend>
				<div class="segmented">
					{#each modes as mode (mode.value)}
						<label>
							<input type="radio" name="mode" value={mode.value} bind:group={params.mode} />
							<span>{mode.label}</span>
						</label>
					{/each}
				</div>
			</fieldset>
		</form>
	</section>

	<dl class="details grid">
		<div class="detail detail--wide">
			<dt class="label">Concept</dt>
			<dd class="h4">{experiment.highlight}</dd>
		</div>
		<div class="detail">
			<dt class="label">Status</dt>
			<dd>
				<span class="dot dot--{experiment.status}" aria-hidden="true"></span>
				{statusLabel[experiment.status]}
			</dd>
		</div>
		<div class="detail">
			<dt class="label">Stack</dt>
			<dd>
				<ul role="list">
					{#each experiment.tech as tech}
						<li>{tech}</li>
					{/each}
				</ul>
			</dd>
		</div>
		<div class="detail">
			<dt class="label">Links</dt>
			<dd>
				<ul role="list">
					{#if experiment.links.demo}
						<li>
							<a class="link" href={experiment.links.demo} target="_blank" rel="noreferrer">
								Live demo<span class="sr-only"> (opens in a new tab)</span>
								<span class="arrow arrow--diagonal" aria-hidden="true">↗</span>
							</a>
						</li>
					{/if}
					{#if experiment.links.source}
						<li>
							<a class="link" href={experiment.links.source} target="_blank" rel="noreferrer">
								Source code<span class="sr-only"> (opens in a new tab)</span>
								<span class="arrow arrow--diagonal" aria-hidden="true">↗</span>
							</a>
						</li>
					{/if}
				</ul>
			</dd>
		</div>
	</dl>

	<nav class="pager" aria-label="More experiments">
		<a href="/labs/{data.previous.slug}" rel="prev">
			<span class="label">Previous</span>
			<span class="h4"><span class="arrow back" aria-hidden="true">←</span> {data.previous.title}</span>
		</a>
		<a href="/labs/{data.next.slug}" rel="next" class="next">
			<span class="label">Next</span>
			<span class="h4">{data.next.title} <span class="arrow" aria-hidden="true">→</span></span>
		</a>
	</nav>
</article>

<style>
	.head {
		padding-block: clamp(3rem, 2rem + 5vw, 7rem) var(--space-8);
	}

	.crumbs {
		display: flex;
		justify-content: space-between;
		gap: var(--space-4);
		margin-bottom: var(--space-6);
	}

	.crumbs a {
		color: var(--fg-2);
		transition: color var(--duration-2) var(--ease-out);
	}

	.crumbs a:hover {
		color: var(--fg);
	}

	.crumbs a:hover .back {
		transform: translateX(-3px);
	}

	h1 {
		max-width: 14ch;
	}

	.lead {
		max-width: 32em;
		margin-top: var(--space-5);
	}

	/* Instrument ------------------------------------------------------------ */

	.instrument {
		display: grid;
		grid-template-columns: minmax(0, 1fr) 20rem;
		gap: var(--gutter);
		align-items: start;
	}

	.panel {
		display: flex;
		flex-direction: column;
		border: var(--hairline) solid var(--line);
		border-radius: var(--radius-l);
	}

	.panel-head {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: var(--space-4) var(--space-5);
		border-bottom: var(--hairline) solid var(--line);
	}

	.reset {
		padding: var(--space-1) var(--space-3);
		border: var(--hairline) solid var(--line-strong);
		border-radius: 999px;
		background: none;
		color: var(--fg);
		transition: border-color var(--duration-2) var(--ease-out), opacity var(--duration-2) var(--ease-out);
	}

	.reset:hover:not(:disabled) {
		border-color: var(--fg);
	}

	.reset:disabled {
		opacity: 0.4;
		cursor: default;
	}

	.control {
		padding: var(--space-4) var(--space-5);
		border: 0;
		border-bottom: var(--hairline) solid var(--line);
		min-inline-size: 0;
	}

	.control:last-child {
		border-bottom: 0;
	}

	.control-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: var(--space-3);
	}

	label,
	legend {
		font-size: var(--text-small);
		font-weight: 520;
	}

	legend {
		float: left;
		width: 100%;
		margin-bottom: var(--space-3);
	}

	output {
		color: var(--fg);
	}

	/* Range: hairline track, filled to the value, a crisp thumb. */
	input[type='range'] {
		--track: 2px;
		width: 100%;
		height: 1.5rem;
		margin: var(--space-2) 0 0;
		background: transparent;
		appearance: none;
		-webkit-appearance: none;
		cursor: pointer;
	}

	input[type='range']::-webkit-slider-runnable-track {
		height: var(--track);
		border-radius: 1px;
		background: linear-gradient(to right, var(--fg) var(--fill), var(--line-strong) var(--fill));
	}

	input[type='range']::-moz-range-track {
		height: var(--track);
		border-radius: 1px;
		background: linear-gradient(to right, var(--fg) var(--fill), var(--line-strong) var(--fill));
	}

	input[type='range']::-webkit-slider-thumb {
		width: 1rem;
		height: 1rem;
		margin-top: calc((var(--track) - 1rem) / 2);
		border: var(--hairline) solid var(--line-control);
		border-radius: 50%;
		background: var(--bg);
		box-shadow: 0 1px 3px rgb(0 0 0 / 0.15);
		-webkit-appearance: none;
		transition: transform var(--duration-1) var(--ease-out);
	}

	input[type='range']::-moz-range-thumb {
		width: 1rem;
		height: 1rem;
		border: var(--hairline) solid var(--line-control);
		border-radius: 50%;
		background: var(--bg);
		box-shadow: 0 1px 3px rgb(0 0 0 / 0.15);
	}

	input[type='range']:active::-webkit-slider-thumb {
		transform: scale(1.15);
	}

	input[type='range']:focus-visible {
		outline-offset: 2px;
	}

	/* Switch */
	.switch {
		position: relative;
		width: 2.5rem;
		height: 1.5rem;
		margin: 0;
		border-radius: 999px;
		background: var(--line-control);
		appearance: none;
		-webkit-appearance: none;
		cursor: pointer;
		transition: background-color var(--duration-2) var(--ease-out);
	}

	.switch::after {
		content: '';
		position: absolute;
		top: 2px;
		left: 2px;
		width: calc(1.5rem - 4px);
		height: calc(1.5rem - 4px);
		border-radius: 50%;
		background: #fff;
		box-shadow: 0 1px 2px rgb(0 0 0 / 0.2);
		transition: translate var(--duration-3) var(--ease-spring);
	}

	.switch:checked {
		background: var(--fg);
	}

	.switch:checked::after {
		translate: 1rem 0;
		background: var(--bg);
	}

	/* Segmented control */
	.segmented {
		clear: both;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		padding: 2px;
		border: var(--hairline) solid var(--line);
		border-radius: 999px;
	}

	.segmented label {
		position: relative;
		font-weight: 400;
	}

	.segmented input {
		position: absolute;
		inset: 0;
		margin: 0;
		opacity: 0;
		cursor: pointer;
	}

	.segmented span {
		display: block;
		padding: var(--space-1) 0;
		border-radius: 999px;
		color: var(--fg-3);
		font-size: 0.8125rem;
		text-align: center;
		transition: background-color var(--duration-2) var(--ease-out), color var(--duration-2) var(--ease-out);
	}

	.segmented label:hover span {
		color: var(--fg);
	}

	.segmented input:checked + span {
		background: var(--bg-raised);
		box-shadow: inset 0 0 0 var(--hairline) var(--line);
		color: var(--fg);
	}

	.segmented input:focus-visible + span {
		outline: 2px solid var(--accent);
		outline-offset: 1px;
	}

	/* Details ---------------------------------------------------------------- */

	.details {
		margin-top: var(--space-9);
		row-gap: var(--space-6);
		padding-top: var(--space-5);
		border-top: var(--hairline) solid var(--fg);
	}

	.detail {
		grid-column: span 2;
	}

	.detail--wide {
		grid-column: span 6;
	}

	dd {
		margin-top: var(--space-3);
	}

	.detail--wide dd {
		max-width: 22em;
	}

	dd li + li {
		margin-top: var(--space-1);
	}

	.dot {
		display: inline-block;
		width: 7px;
		height: 7px;
		margin-right: var(--space-1);
		border-radius: 50%;
		background: var(--fg);
		vertical-align: 0.1em;
	}

	.dot--production {
		background: var(--accent);
	}

	.dot--archived {
		background: transparent;
		box-shadow: inset 0 0 0 1px var(--fg-3);
	}

	/* Pager ------------------------------------------------------------------ */

	.pager {
		display: grid;
		grid-template-columns: 1fr 1fr;
		margin-top: var(--space-9);
		border-top: var(--hairline) solid var(--line);
	}

	.pager a {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		padding-top: var(--space-5);
		transition: color var(--duration-2) var(--ease-out);
	}

	.pager a:hover .h4 {
		color: var(--accent);
	}

	.pager .next {
		align-items: flex-end;
		text-align: right;
	}

	.pager .h4 {
		transition: color var(--duration-2) var(--ease-out);
	}

	.pager a:hover .arrow {
		transform: translateX(3px);
	}

	.pager a:hover .arrow.back {
		transform: translateX(-3px);
	}

	@media (max-width: 63.99rem) {
		.instrument {
			grid-template-columns: 1fr;
		}

		.detail--wide {
			grid-column: 1 / -1;
		}

		.detail {
			grid-column: span 4;
		}
	}

	@media (max-width: 47.99rem) {
		.detail {
			grid-column: span 6;
		}

		.stage :global(.viewport) {
			aspect-ratio: 4 / 3;
		}
	}
</style>
