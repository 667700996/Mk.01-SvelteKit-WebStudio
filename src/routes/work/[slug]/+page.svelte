<script lang="ts">
	import Plate, { plateForProject } from '$lib/components/ui/Plate.svelte';
	import { figure, pad } from '$lib/utils/format';

	let { data } = $props();

	const presentation: Record<
		string,
		{ eyebrow: string; thesis: string; role: string; duration: string }
	> = {
		'neon-metropolis': {
			eyebrow: 'A living spatial identity',
			thesis: 'What if a brand did not have a fixed form—only a recognisable way of behaving?',
			role: 'Creative direction, interaction, WebGL',
			duration: '7 weeks'
		},
		'atlas-labs': {
			eyebrow: 'Making infrastructure visible',
			thesis:
				'How do you make a complex technical system feel precise before the first word is read?',
			role: 'Product narrative, systems, frontend',
			duration: '9 weeks'
		},
		flowstate: {
			eyebrow: 'An interface with a pulse',
			thesis:
				'Can motion respond to a human rhythm without becoming distracting or decorative?',
			role: 'Product design, motion, prototyping',
			duration: '8 weeks'
		}
	};

	const systemSpec = [
		'Progressive enhancement before spectacle.',
		'Motion tokens shared across code and design.',
		'Adaptive quality for real devices, not demo machines.',
		'Reduced-motion behavior designed from the start.'
	];

	const project = $derived(data.project);
	const content = $derived(project.content);
	const view = $derived(presentation[project.slug] ?? presentation['neon-metropolis']);
	const kind = $derived(plateForProject[project.slug] ?? 'orbital');
</script>

<article>
	<header class="wrap hero">
		<nav class="grid crumbs label" aria-label="Breadcrumb">
			<a href="/work"><span class="arrow back" aria-hidden="true">←</span> All systems</a>
			<span>Case study {pad(data.index + 1)} / {project.year}</span>
			<span>{project.industry}</span>
		</nav>

		<p class="kicker">{view.eyebrow}</p>
		<h1 class="display">{project.title}</h1>
		<p class="lead summary">{project.summary}</p>
	</header>

	<div class="wrap plate-host">
		<Plate {kind} index="MK.01 / {project.slug}" caption="Generative system" ratio="16 / 9" />
	</div>

	<!-- Facts: the spec sheet a reviewer scans first. -->
	<section class="wrap" aria-label="Project facts">
		<dl class="facts">
			<div>
				<dt class="label">Role</dt>
				<dd>{view.role}</dd>
			</div>
			<div>
				<dt class="label">Duration</dt>
				<dd>{view.duration}</dd>
			</div>
			<div>
				<dt class="label">Core stack</dt>
				<dd>{project.tags.join(' / ')}</dd>
			</div>
			{#if content.services?.length}
				<div>
					<dt class="label">Services</dt>
					<dd>{content.services.join(', ')}</dd>
				</div>
			{/if}
		</dl>
	</section>

	<section class="wrap section grid chapter" aria-labelledby="premise">
		<p class="label marker"><span>01</span><span>The premise</span></p>
		<h2 class="h2 body" id="premise" data-reveal>{view.thesis}</h2>
	</section>

	<section class="wrap section grid chapter" aria-labelledby="signal">
		<p class="label marker"><span>02</span><span id="signal">Signal before surface</span></p>
		<div class="body" data-reveal>
			<p class="h3">{content.hero.headline}</p>
			<p class="lead copy">{content.hero.subheadline}</p>
		</div>
	</section>

	{#if content.kpis?.length}
		<section class="wrap section" aria-label="Outcomes in numbers">
			<ul class="kpis" role="list">
				{#each content.kpis as kpi, index}
					<li data-reveal>
						<span class="label">{pad(index + 1)}</span>
						<strong class="tabular">{figure(kpi.value)}</strong>
						<span class="secondary">{kpi.label}{kpi.description ? ` — ${kpi.description}` : ''}</span>
					</li>
				{/each}
			</ul>
		</section>
	{/if}

	<section class="wrap section" aria-labelledby="process">
		<div class="grid chapter">
			<p class="label marker"><span>03—05</span><span>From intent to system</span></p>
			<h2 class="h2 body" id="process" data-reveal>Three moves.<br />One coherent idea.</h2>
		</div>

		<ol class="rows" role="list">
			{#each content.chapters as chapter, index (chapter.id)}
				<li class="grid row" data-reveal>
					<span class="label row-index">{pad(index + 1)}</span>
					<div class="row-title">
						<p class="label">{chapter.id}</p>
						<h3 class="h4">{chapter.title}</h3>
					</div>
					<p class="secondary row-copy">{chapter.description}</p>
				</li>
			{/each}
		</ol>
	</section>

	{#if content.timeline?.length}
		<section class="wrap section" aria-labelledby="timeline">
			<div class="grid chapter">
				<p class="label marker"><span>—</span><span>Timeline</span></p>
				<h2 class="h3 body" id="timeline" data-reveal>How the work unfolded.</h2>
			</div>
			<ol class="timeline" role="list">
				{#each content.timeline as step}
					<li data-reveal>
						<span class="label">{figure(step.timeframe ?? '')}</span>
						<h3 class="h4">{step.title}</h3>
						<p class="secondary">{step.summary}</p>
						{#if step.metric}
							<p class="label metric">{figure(step.metric)}</p>
						{/if}
					</li>
				{/each}
			</ol>
		</section>
	{/if}

	<section class="wrap section" aria-labelledby="system">
		<div class="system">
			<div class="system-copy" data-reveal>
				<p class="label">Built as a system, not a scene.</p>
				<h2 class="h2" id="system">
					Every expressive choice has a quieter technical decision beneath it.
				</h2>
			</div>
			<ol class="system-spec" role="list">
				{#each systemSpec as line, index}
					<li data-reveal>
						<span class="label">{pad(index + 1)}</span>
						<p>{line}</p>
					</li>
				{/each}
			</ol>
		</div>
	</section>

	<section class="wrap section grid chapter" aria-labelledby="outcomes">
		<p class="label marker"><span>06</span><span id="outcomes">What moved</span></p>
		<ol class="body outcomes" role="list">
			{#each content.outcomes as outcome, index}
				<li data-reveal>
					<span class="label">{pad(index + 1)}</span>
					<p class="h4">{outcome}</p>
				</li>
			{/each}
		</ol>
	</section>

	<nav class="wrap section" aria-label="Next case study">
		<a class="next plate-host" href="/work/{data.next.slug}">
			<span class="label">Next system</span>
			<span class="display next-title">
				{data.next.title}<span class="arrow" aria-hidden="true">→</span>
			</span>
			<span class="secondary">{data.next.summary}</span>
		</a>
	</nav>
</article>

<style>
	.hero {
		padding-block: var(--space-6) var(--space-8);
	}

	.crumbs > * {
		grid-column: span 4;
	}

	.crumbs > :last-child {
		text-align: right;
	}

	.crumbs a {
		color: var(--fg);
		transition: color var(--duration-2) var(--ease-out);
	}

	.crumbs a:hover {
		color: var(--accent);
	}

	a:hover > .back {
		transform: translateX(-3px);
	}

	.kicker {
		margin-top: clamp(4rem, 2rem + 7vw, 9rem);
		color: var(--fg-2);
		font-size: var(--text-lead);
		letter-spacing: -0.016em;
	}

	h1 {
		margin-top: var(--space-3);
	}

	.summary {
		max-width: 30em;
		margin-top: var(--space-6);
		animation: rise var(--duration-4) var(--ease-out) 80ms both;
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(1rem);
		}
	}

	/* Facts ---------------------------------------------------------------- */

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
		color: var(--fg);
	}

	/* Chapters ------------------------------------------------------------- */

	.chapter {
		row-gap: var(--space-5);
	}

	.marker {
		grid-column: 1 / span 3;
		display: flex;
		gap: var(--space-4);
		padding-top: 0.6em;
	}

	.body {
		grid-column: 4 / -1;
	}

	h2.body {
		max-width: 20ch;
	}

	.copy {
		max-width: 34em;
		margin-top: var(--space-5);
	}

	.kpis {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--gutter);
	}

	.kpis li {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		padding-top: var(--space-5);
		border-top: var(--hairline) solid var(--fg);
	}

	.kpis strong {
		font-size: var(--text-h2);
		font-weight: 600;
		letter-spacing: var(--track-h2);
		line-height: 1;
	}

	.rows {
		margin-top: var(--space-8);
		border-top: var(--hairline) solid var(--line);
	}

	.row {
		padding-block: var(--space-6);
		border-bottom: var(--hairline) solid var(--line);
		row-gap: var(--space-3);
	}

	.row-index {
		grid-column: 1 / span 3;
		padding-top: 0.35em;
	}

	.row-title {
		grid-column: 4 / span 4;
	}

	.row-title .label {
		margin-bottom: var(--space-2);
	}

	.row-copy {
		grid-column: 8 / -1;
	}

	.timeline {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: var(--gutter);
		margin-top: var(--space-8);
	}

	.timeline li {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		padding-top: var(--space-5);
		border-top: var(--hairline) solid var(--line);
	}

	.timeline li::before {
		content: '';
		position: absolute;
		top: -4px;
		left: 0;
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--fg);
	}

	.timeline li:last-child::before {
		background: var(--accent);
	}

	.metric {
		margin-top: auto;
		padding-top: var(--space-3);
		color: var(--fg);
	}

	/* System --------------------------------------------------------------- */

	.system {
		padding: clamp(2rem, 1rem + 4vw, 5rem);
		border-radius: var(--radius-l);
		background: var(--bg-raised);
	}

	.system-copy h2 {
		max-width: 18ch;
		margin-top: var(--space-5);
	}

	.system-spec {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: var(--gutter);
		margin-top: var(--space-9);
	}

	.system-spec li {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		padding-top: var(--space-4);
		border-top: var(--hairline) solid var(--line-strong);
	}

	.outcomes li {
		display: grid;
		grid-template-columns: 3rem 1fr;
		align-items: baseline;
		padding-block: var(--space-5);
		border-bottom: var(--hairline) solid var(--line);
	}

	.outcomes li:first-child {
		border-top: var(--hairline) solid var(--line);
	}

	.outcomes .h4 {
		font-weight: 500;
	}

	/* Next ----------------------------------------------------------------- */

	.next {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		padding-top: var(--space-6);
		border-top: var(--hairline) solid var(--fg);
	}

	.next-title {
		display: flex;
		align-items: baseline;
		gap: 0.15em;
		transition: color var(--duration-3) var(--ease-out);
	}

	.next-title .arrow {
		font-size: 0.5em;
		font-weight: 400;
	}

	.next:hover .next-title {
		color: var(--accent);
	}

	.next:hover .next-title .arrow {
		transform: translateX(0.15em);
	}

	@media (max-width: 63.99rem) {
		.facts {
			grid-template-columns: repeat(2, 1fr);
			row-gap: var(--space-5);
		}

		.marker,
		.body,
		.row-index,
		.row-title,
		.row-copy {
			grid-column: 1 / -1;
		}

		.kpis,
		.timeline {
			grid-template-columns: 1fr;
			row-gap: var(--space-6);
		}

		.system-spec {
			grid-template-columns: repeat(2, 1fr);
			row-gap: var(--space-6);
		}
	}

	@media (max-width: 47.99rem) {
		.crumbs > :not(:first-child) {
			display: none;
		}

		.crumbs > :first-child {
			grid-column: 1 / -1;
		}

		.facts,
		.system-spec {
			grid-template-columns: 1fr;
		}
	}
</style>
