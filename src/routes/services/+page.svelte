<script lang="ts">
	import CtaBand from '$lib/components/ui/CtaBand.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import SectionHead from '$lib/components/ui/SectionHead.svelte';
	import { pad } from '$lib/utils/format';

	const serviceLines = [
		{
			title: 'Discovery & positioning',
			lede: 'Strategy sprints that align outcomes, audiences, and measurement before a single pixel moves.',
			items: [
				'Stakeholder labs & co-creation',
				'Product narrative mapping',
				'Content architecture & IA',
				'Opportunity prototypes'
			]
		},
		{
			title: 'Design systems & product',
			lede: 'Systemic design across web and product surfaces—tokens, components, accessibility, and motion.',
			items: [
				'Design system blueprints',
				'Token architecture & theming',
				'Motion language & specs',
				'Accessibility audits'
			]
		},
		{
			title: 'Engineering & WebGL',
			lede: 'SvelteKit builds with WebGL storytelling, edge deployments, and performance tuned for launch.',
			items: [
				'SvelteKit + Vite delivery',
				'WebGL & shader development',
				'Edge/CDN pipelines',
				'QA & automation'
			]
		},
		{
			title: 'Launch & enablement',
			lede: 'Runway for go-live: content choreography, playbooks, and teams trained to operate the system.',
			items: [
				'Content & SEO choreography',
				'Motion/interaction handoff',
				'Launch playbooks',
				'Team enablement'
			]
		}
	];

	const engagementModels = [
		{
			name: 'Sprint',
			description:
				'2–4 weeks of concentrated discovery and prototyping to define direction and validate risk.',
			bestFor: ['Early-stage teams', 'Positioning a new product', 'Validating motion or WebGL concepts']
		},
		{
			name: 'Embedded squad',
			description:
				'Cross-functional pod (strategy, design, engineering) shipping end-to-end experiences on a roadmap.',
			bestFor: ['Rebuilds & rebrands', 'Design system rollouts', 'Complex product launches']
		},
		{
			name: 'Retainer',
			description:
				'Continuous evolution, experiments, and governance with monthly capacity you can depend on.',
			bestFor: ['Ongoing growth', 'Labs & R&D tracks', 'Governance & QA rituals']
		}
	];
</script>

<PageHeader
	label="Services"
	title="From zero to launch: strategy, design systems, WebGL, and engineering."
	lead="Choose the engagement model that fits your stage. We choreograph motion, content, and code to ship cinematic experiences with rigor."
>
	{#snippet actions()}
		<a class="button" href="/contact">Start a project</a>
		<a class="button button--quiet" href="/capabilities">See capability matrix</a>
	{/snippet}
</PageHeader>

<section class="wrap" aria-labelledby="lines-title">
	<h2 class="sr-only" id="lines-title">Service lines</h2>
	<ol class="lines" role="list">
		{#each serviceLines as line, index (line.title)}
			<li class="grid line" data-reveal>
				<p class="label index">{pad(index + 1)} <span>Core</span></p>
				<div class="summary">
					<h3 class="h3">{line.title}</h3>
					<p class="secondary">{line.lede}</p>
				</div>
				<ul class="items" role="list">
					{#each line.items as item (item)}
						<li>{item}</li>
					{/each}
				</ul>
			</li>
		{/each}
	</ol>
</section>

<section class="section wrap" aria-labelledby="models-title">
	<SectionHead
		index="02"
		label="Engagement models"
		title="Pick the pace. We calibrate the team."
		id="models-title"
	/>
	<div class="models">
		{#each engagementModels as model, index (model.name)}
			<article class="model" data-reveal>
				<p class="label">{pad(index + 1)}</p>
				<h3 class="h3">{model.name}</h3>
				<p class="secondary">{model.description}</p>
				<h4 class="label best">Best for</h4>
				<ul role="list">
					{#each model.bestFor as item (item)}
						<li>{item}</li>
					{/each}
				</ul>
			</article>
		{/each}
	</div>
</section>

<CtaBand
	title="Tell us what you’re building."
	copy="Send a short brief or call for pitch. We’ll respond with a tailored squad and a clear path to launch."
>
	{#snippet actions()}
		<a class="button" href="/contact">Contact the studio</a>
		<a class="button button--quiet" href="/work">View recent work</a>
	{/snippet}
</CtaBand>

<style>
	.lines {
		border-bottom: var(--hairline) solid var(--line);
	}

	.line {
		row-gap: var(--space-4);
		padding-block: var(--space-6) var(--space-7);
		border-top: var(--hairline) solid var(--line);
	}

	.line:first-child {
		border-top-color: var(--fg);
	}

	.index {
		grid-column: 1 / span 2;
		display: flex;
		gap: var(--space-4);
		padding-top: 0.55em;
	}

	.index span {
		color: var(--accent);
	}

	.summary {
		grid-column: 3 / span 6;
	}

	.summary p {
		max-width: 30em;
		margin-top: var(--space-3);
	}

	.items {
		grid-column: 9 / -1;
		padding-top: 0.4em;
	}

	.items li {
		padding-block: var(--space-2);
		color: var(--fg-2);
	}

	.items li + li {
		border-top: var(--hairline) solid var(--line);
	}

	.models {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--gutter);
	}

	.model {
		display: flex;
		flex-direction: column;
		padding-top: var(--space-5);
		border-top: var(--hairline) solid var(--fg);
	}

	.model h3 {
		margin-block: var(--space-6) var(--space-4);
	}

	.best {
		margin-block: var(--space-6) var(--space-3);
	}

	.model li {
		padding-block: var(--space-2);
		border-top: var(--hairline) solid var(--line);
	}

	@media (max-width: 63.99rem) {
		.index,
		.summary,
		.items {
			grid-column: 1 / -1;
		}

		.models {
			grid-template-columns: 1fr;
			row-gap: var(--space-8);
		}
	}
</style>
