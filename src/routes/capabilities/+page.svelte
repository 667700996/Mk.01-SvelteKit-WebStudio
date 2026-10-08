<script lang="ts">
	import CtaBand from '$lib/components/ui/CtaBand.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import { pad } from '$lib/utils/format';

	const capabilitySets = [
		{
			title: 'Strategy & positioning',
			items: ['Vision workshops', 'Narrative mapping', 'Content architecture', 'Measurement plans']
		},
		{
			title: 'Experience design',
			items: ['Interaction design', 'Design systems', 'Accessibility audits', 'Design tokens']
		},
		{
			title: 'Engineering',
			items: ['SvelteKit builds', 'WebGL & shaders', 'Edge deployments', 'Automation suites']
		},
		{
			title: 'Launch & growth',
			items: ['Launch playbooks', 'Motion specs', 'Knowledge bases', 'Enablement sessions']
		}
	];
</script>

<PageHeader
	label="Capabilities"
	title="A full-stack studio blending strategy, design, motion, and engineering."
	lead="Our engagements flex to your stage: discovery sprints, product redesigns, launch campaigns, and experimentation programs."
/>

<section class="wrap matrix" aria-label="Capability matrix">
	{#each capabilitySets as set, index (set.title)}
		<div class="column" data-reveal>
			<p class="label">{pad(index + 1)}</p>
			<h2 class="h4">{set.title}</h2>
			<ul role="list">
				{#each set.items as item (item)}
					<li>{item}</li>
				{/each}
			</ul>
		</div>
	{/each}
</section>

<CtaBand title="Shape the engagement around the problem.">
	{#snippet actions()}
		<a class="button" href="/services">See engagement models</a>
		<a class="button button--quiet" href="/contact">Start a project</a>
	{/snippet}
</CtaBand>

<style>
	.matrix {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		column-gap: var(--gutter);
		row-gap: var(--space-8);
	}

	.column {
		padding-top: var(--space-5);
		border-top: var(--hairline) solid var(--fg);
	}

	h2 {
		margin-block: var(--space-6) var(--space-5);
		min-height: 2.5em;
	}

	li {
		padding-block: var(--space-3);
		border-top: var(--hairline) solid var(--line);
		color: var(--fg-2);
	}

	@media (max-width: 63.99rem) {
		.matrix {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}
	}

	@media (max-width: 47.99rem) {
		.matrix {
			grid-template-columns: 1fr;
		}

		h2 {
			min-height: 0;
		}
	}
</style>
