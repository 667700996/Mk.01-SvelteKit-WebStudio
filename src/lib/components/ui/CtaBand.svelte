<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		title,
		copy,
		actions
	}: {
		title: string;
		copy?: string;
		actions: Snippet;
	} = $props();
</script>

<section class="section wrap" aria-labelledby="cta-title">
	<div class="grid cta" data-reveal>
		<h2 class="h2" id="cta-title">{title}</h2>
		<div class="body">
			{#if copy}<p class="secondary">{copy}</p>{/if}
			<div class="actions">{@render actions()}</div>
		</div>
	</div>
</section>

<style>
	.cta {
		row-gap: var(--space-6);
		padding-top: var(--space-6);
		border-top: var(--hairline) solid var(--fg);
	}

	h2 {
		grid-column: 1 / span 7;
		max-width: 14ch;
	}

	.body {
		grid-column: 9 / -1;
		display: flex;
		flex-direction: column;
		gap: var(--space-5);
		padding-top: 0.5em;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
	}

	@media (max-width: 63.99rem) {
		h2,
		.body {
			grid-column: 1 / -1;
		}
	}
</style>
