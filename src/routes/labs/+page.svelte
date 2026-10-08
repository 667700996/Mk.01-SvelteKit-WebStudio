<script lang="ts">
	import { siteConfig } from '$lib/config/site';
	import { statusLabel } from '$modules/labs';
	import { pad } from '$lib/utils/format';
	import LabGlyph from '$lib/components/labs/LabGlyph.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';

	let { data } = $props();

	const counts = $derived(
		data.experiments.reduce(
			(acc, { status }) => ({ ...acc, [status]: (acc[status] ?? 0) + 1 }),
			{} as Record<string, number>
		)
	);
</script>

<PageHeader
	label="Mk.01 Labs — {pad(data.experiments.length)} experiments"
	title="Living web experiments."
	lead="The Labs are a playground for prototyping radical ideas. Some ship into production, others become open-source seeds; all of them teach how to build bolder products."
>
	{#snippet actions()}
		<a class="button" href="mailto:{siteConfig.contactEmail}?subject=R%26D%20collaboration">
			Collaborate on R&amp;D
		</a>
		<a class="button button--quiet" href="/work">
			See launched work <span class="arrow" aria-hidden="true">→</span>
		</a>
	{/snippet}
</PageHeader>

<section class="wrap index" aria-labelledby="experiments-title">
	<div class="summary label">
		<h2 id="experiments-title" class="label">Index</h2>
		<ul role="list" class="legend">
			{#each ['production', 'prototype', 'archived'] as status}
				<li>
					<span class="dot dot--{status}" aria-hidden="true"></span>
					{statusLabel[status as keyof typeof statusLabel]}
					<span class="tabular">{pad(counts[status] ?? 0)}</span>
				</li>
			{/each}
		</ul>
	</div>

	<ol class="experiments" role="list">
		{#each data.experiments as experiment, index (experiment.slug)}
			<li data-reveal>
				<a class="card plate-host" href="/labs/{experiment.slug}">
					<LabGlyph slug={experiment.slug} />
					<div class="meta label">
						<span class="tabular">{pad(index + 1)}</span>
						<span class="status">
							<span class="dot dot--{experiment.status}" aria-hidden="true"></span>
							{statusLabel[experiment.status]}
						</span>
					</div>
					<h3 class="h4">{experiment.title}</h3>
					<p class="secondary">{experiment.summary}</p>
					<p class="label tech">{experiment.tech.join(' · ')}</p>
					<span class="open">Open experiment <span class="arrow" aria-hidden="true">→</span></span>
				</a>
			</li>
		{/each}
	</ol>
</section>

<style>
	.summary {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: var(--space-5);
		padding-block: var(--space-4);
		margin-bottom: var(--space-7);
		border-top: var(--hairline) solid var(--fg);
	}

	.legend {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-5);
	}

	.legend li {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
	}

	.legend .tabular {
		color: var(--fg);
	}

	.experiments {
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: var(--space-9) var(--gutter);
	}

	.card {
		display: flex;
		flex-direction: column;
		height: 100%;
	}

	.card :global(.glyph) {
		transition: transform var(--duration-4) var(--ease-out);
	}

	.card:hover :global(.glyph) {
		transform: scale(0.99);
	}

	.meta {
		display: flex;
		justify-content: space-between;
		margin-top: var(--space-5);
		padding-bottom: var(--space-4);
		border-bottom: var(--hairline) solid var(--line);
	}

	.status {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
	}

	.dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: var(--fg);
	}

	.dot--production {
		background: var(--accent);
	}

	.dot--archived {
		background: transparent;
		box-shadow: inset 0 0 0 1px var(--fg-3);
	}

	h3 {
		margin-top: var(--space-5);
	}

	.card p.secondary {
		margin-top: var(--space-2);
		max-width: 28em;
	}

	.tech {
		margin-top: var(--space-4);
	}

	.open {
		margin-top: auto;
		padding-top: var(--space-5);
		font-size: var(--text-small);
		font-weight: 520;
		transition: color var(--duration-2) var(--ease-out);
	}

	.card:hover .open {
		color: var(--accent);
	}

	@media (max-width: 63.99rem) {
		.experiments {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 47.99rem) {
		.experiments {
			grid-template-columns: 1fr;
			row-gap: var(--space-8);
		}

		.summary {
			flex-direction: column;
			gap: var(--space-3);
		}
	}
</style>
