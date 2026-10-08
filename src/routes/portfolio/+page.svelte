<script lang="ts">
	import CtaBand from '$lib/components/ui/CtaBand.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import Plate, { plateForProject } from '$lib/components/ui/Plate.svelte';
	import { pad } from '$lib/utils/format';

	let { data } = $props();
</script>

<PageHeader
	label="Portfolio"
	title="A curated library of Mk.01 case studies and immersive launches."
	lead="Explore narrative websites, design systems, and R&D experiments that shipped for partners across entertainment, fintech, wellness, and more."
/>

<section class="wrap" aria-label="Case studies">
	<ul class="library" role="list">
		{#each data.projects as project, index (project.slug)}
			<li data-reveal>
				<a class="entry plate-host" href="/work/{project.slug}">
					<Plate
						kind={plateForProject[project.slug] ?? 'orbital'}
						index="MK / Case {pad(index + 1)}"
						caption="Case study"
						ratio="4 / 5"
					/>
					<p class="label meta">
						<span>{pad(index + 1)}</span>
						<span>{project.industry}</span>
						<span class="year">{project.year}</span>
					</p>
					<h2 class="h3">{project.title}</h2>
					<p class="secondary">{project.summary}</p>
					<p class="label tags">{project.tags.join(' / ')}</p>
					<span class="open">View case study <span class="arrow" aria-hidden="true">→</span></span>
				</a>
			</li>
		{/each}
	</ul>
</section>

<CtaBand
	title="Need a bespoke build?"
	copy="Share your brief and we’ll assemble the right squad—strategy, motion, WebGL, and engineering—to ship it."
>
	{#snippet actions()}
		<a class="button" href="/contact">Start a scope</a>
		<a class="button button--quiet" href="/capabilities">View capabilities</a>
	{/snippet}
</CtaBand>

<style>
	.library {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		column-gap: var(--gutter);
		row-gap: var(--space-9);
	}

	.entry {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.entry :global(.plate) {
		transition: transform var(--duration-4) var(--ease-out);
	}

	.entry:hover :global(.plate) {
		transform: scale(0.99);
	}

	.meta {
		display: flex;
		gap: var(--space-4);
		margin-top: var(--space-5);
		padding-bottom: var(--space-4);
		border-bottom: var(--hairline) solid var(--line);
	}

	.year {
		margin-left: auto;
	}

	h2 {
		margin-top: var(--space-5);
	}

	.entry .secondary {
		margin-top: var(--space-3);
		max-width: 28em;
	}

	.tags {
		margin-top: var(--space-4);
	}

	.open {
		margin-top: auto;
		padding-top: var(--space-5);
		font-weight: 520;
		transition: color var(--duration-2) var(--ease-out);
	}

	.entry:hover .open {
		color: var(--accent);
	}

	@media (max-width: 63.99rem) {
		.library {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 47.99rem) {
		.library {
			grid-template-columns: 1fr;
			row-gap: var(--space-8);
		}
	}
</style>
