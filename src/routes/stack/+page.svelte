<script lang="ts">
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import { pad } from '$lib/utils/format';

	const layers = [
		{
			title: 'Frontend',
			tools: ['SvelteKit', 'TypeScript', 'Tailwind CSS', 'mdsvex', 'Motion One', 'GSAP']
		},
		{
			title: 'Rendering & visuals',
			tools: ['Three.js', 'GLSL', 'Spline', 'Rive', 'Lottie']
		},
		{
			title: 'Data & content',
			tools: ['Sanity', 'Contentful', 'GraphQL', 'Supabase', 'Contentlayer']
		},
		{
			title: 'Automation & ops',
			tools: ['Vercel', 'Netlify', 'Cloudflare', 'GitHub Actions', 'Playwright', 'Percy']
		}
	];
</script>

<PageHeader
	label="Studio stack"
	title="Tools and platforms powering Mk.01 experiences."
	lead="Every engagement selects the right combination of tools across strategy, design, motion, and engineering to deliver expressive yet performant products."
/>

<section class="wrap" aria-label="Stack layers">
	<div class="table">
		<div class="grid row head" aria-hidden="true">
			<span class="label">No.</span>
			<span class="label">Layer</span>
			<span class="label">Tools</span>
		</div>
		{#each layers as layer, index (layer.title)}
			<div class="grid row" data-reveal>
				<span class="label index">{pad(index + 1)}</span>
				<h2 class="h4">{layer.title}</h2>
				<ul class="tools" role="list" aria-label="{layer.title} tools">
					{#each layer.tools as tool (tool)}
						<li>{tool}</li>
					{/each}
				</ul>
			</div>
		{/each}
	</div>
</section>

<style>
	.table {
		border-bottom: var(--hairline) solid var(--line);
	}

	.row {
		align-items: baseline;
		row-gap: var(--space-3);
		padding-block: var(--space-5);
		border-top: var(--hairline) solid var(--line);
	}

	.head {
		padding-block: var(--space-3);
		border-top-color: var(--fg);
	}

	.row > :nth-child(1) {
		grid-column: 1 / span 2;
	}

	.row > :nth-child(2) {
		grid-column: 3 / span 4;
	}

	.row > :nth-child(3) {
		grid-column: 7 / -1;
	}

	.tools {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2) var(--space-5);
		padding: 0;
		list-style: none;
		color: var(--fg-2);
	}

	@media (max-width: 47.99rem) {
		.head {
			display: none;
		}

		.row > :nth-child(1) {
			grid-column: 1 / span 2;
		}

		.row > :nth-child(2) {
			grid-column: 3 / -1;
		}

		.row > :nth-child(3) {
			grid-column: 3 / -1;
		}
	}
</style>
