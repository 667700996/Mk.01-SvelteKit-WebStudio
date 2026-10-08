<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		index,
		label,
		title,
		intro,
		id
	}: {
		index: string;
		label: string;
		title: string | Snippet;
		intro?: string;
		id?: string;
	} = $props();
</script>

<header class="grid head">
	<p class="label meta" data-reveal>
		<span>{index}</span>
		<span>{label}</span>
	</p>
	<div class="body" data-reveal>
		<h2 class="h2" {id}>
			{#if typeof title === 'string'}{title}{:else}{@render title()}{/if}
		</h2>
		{#if intro}
			<p class="lead">{intro}</p>
		{/if}
	</div>
</header>

<style>
	.head {
		row-gap: var(--space-5);
		margin-bottom: var(--space-9);
	}

	.meta {
		grid-column: 1 / span 3;
		display: flex;
		gap: var(--space-4);
		padding-top: 0.6em;
	}

	.body {
		grid-column: 4 / -1;
	}

	h2 {
		max-width: 16ch;
	}

	.lead {
		max-width: 34em;
		margin-top: var(--space-5);
	}

	@media (max-width: 63.99rem) {
		.meta,
		.body {
			grid-column: 1 / -1;
		}

		.head {
			margin-bottom: var(--space-8);
		}
	}
</style>
