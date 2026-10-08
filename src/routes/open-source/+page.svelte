<script lang="ts">
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import { pad } from '$lib/utils/format';

	const repositories = [
		{
			name: 'mk1-motion-kit',
			description: 'Motion presets, scroll choreography, and utilities for Svelte projects.',
			stars: '1.2k',
			url: 'https://github.com/your-handle/mk1-motion-kit',
			tags: ['Svelte', 'Motion', 'Open Source']
		},
		{
			name: 'aurora-shaders',
			description:
				'GLSL shader collection powering atmospheric hero sections and background loops.',
			stars: '870',
			url: 'https://github.com/your-handle/aurora-shaders',
			tags: ['GLSL', 'WebGL', 'Visuals']
		},
		{
			name: 'mk1-content-studio',
			description: 'MDX-first authoring experience integrating with SvelteKit + Contentlayer.',
			stars: '640',
			url: 'https://github.com/your-handle/mk1-content-studio',
			tags: ['Content', 'MDX', 'SvelteKit']
		}
	];
</script>

<PageHeader
	label="Open source"
	title="Sharing tools and learnings with the community."
	lead="Mk.01 believes in teaching through building. Explore the libraries, starters, and experiments we maintain for the creative web community."
/>

<section class="wrap" aria-label="Repositories">
	<ul class="repos" role="list">
		{#each repositories as repo, index (repo.name)}
			<li data-reveal>
				<a class="grid repo" href={repo.url} target="_blank" rel="noreferrer">
					<span class="label">{pad(index + 1)}</span>
					<span class="name">
						<span class="h4">{repo.name}</span>
						<span class="arrow arrow--diagonal" aria-hidden="true">↗</span>
						<span class="sr-only">(GitHub, opens in a new tab)</span>
					</span>
					<span class="secondary description">{repo.description}</span>
					<span class="label tags">{repo.tags.join(' / ')}</span>
					<span class="label stars tabular">
						<span aria-hidden="true">★</span>
						{repo.stars}<span class="sr-only"> stars</span>
					</span>
				</a>
			</li>
		{/each}
	</ul>
</section>

<style>
	.repos {
		border-bottom: var(--hairline) solid var(--line);
	}

	.repos li:first-child .repo {
		border-top-color: var(--fg);
	}

	.repo {
		align-items: baseline;
		row-gap: var(--space-2);
		padding-block: var(--space-6);
		border-top: var(--hairline) solid var(--line);
	}

	.repo > .label:first-child {
		grid-column: 1 / span 1;
	}

	.name {
		grid-column: 2 / span 4;
		display: inline-flex;
		align-items: baseline;
		gap: var(--space-2);
		font-family: var(--font-mono);
	}

	.name .h4 {
		font-family: var(--font-mono);
		font-weight: 500;
		letter-spacing: -0.02em;
	}

	.description {
		grid-column: 6 / span 4;
		max-width: 30em;
	}

	.tags {
		grid-column: 10 / span 2;
	}

	.stars {
		grid-column: 12 / -1;
		justify-self: end;
		white-space: nowrap;
	}

	.repo:hover .name {
		color: var(--accent);
	}

	@media (max-width: 63.99rem) {
		.name {
			grid-column: 2 / -1;
		}

		.description,
		.tags {
			grid-column: 2 / span 9;
		}

		.stars {
			grid-column: 11 / -1;
			grid-row: 1;
		}
	}

	@media (max-width: 47.99rem) {
		.repo > .label:first-child {
			grid-column: 1 / span 2;
		}

		.name {
			grid-column: 3 / span 8;
		}

		.description,
		.tags {
			grid-column: 3 / -1;
		}

		.stars {
			grid-column: 11 / -1;
		}
	}
</style>
