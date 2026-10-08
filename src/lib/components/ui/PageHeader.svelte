<script lang="ts">
	import type { Snippet } from 'svelte';

	let {
		label,
		title,
		lead,
		actions,
		children
	}: {
		label: string;
		title: string;
		lead?: string;
		actions?: Snippet;
		children?: Snippet;
	} = $props();
</script>

<header class="wrap page-header">
	<p class="label eyebrow">{label}</p>
	<h1 class="h1">{title}</h1>
	{#if lead}
		<p class="lead">{lead}</p>
	{/if}
	{#if actions}
		<div class="actions">{@render actions()}</div>
	{/if}
	{@render children?.()}
</header>

<style>
	.page-header {
		padding-block: clamp(4rem, 2rem + 8vw, 9rem) clamp(3rem, 2rem + 4vw, 6rem);
	}

	.eyebrow {
		margin-bottom: var(--space-5);
	}

	h1 {
		max-width: 15ch;
		animation: rise var(--duration-4) var(--ease-out) both;
	}

	.lead {
		max-width: 34em;
		margin-top: var(--space-6);
		animation: rise var(--duration-4) var(--ease-out) 80ms both;
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		margin-top: var(--space-6);
		animation: rise var(--duration-4) var(--ease-out) 140ms both;
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(0.75rem);
		}
	}
</style>
