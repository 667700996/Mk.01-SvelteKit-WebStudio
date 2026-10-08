<script lang="ts">
	import { page } from '$app/state';

	const notFound = $derived(page.status === 404);
</script>

<svelte:head>
	<title>{page.status} · MK.01</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<section class="wrap error">
	<p class="label">Error {page.status} — {notFound ? 'Signal lost' : 'System fault'}</p>
	<h1 class="h1">
		{notFound ? 'Target coordinates not found.' : 'Something went wrong on our side.'}
	</h1>
	<p class="lead">
		{#if notFound}
			The requested page does not exist, or has moved. Check the address, or search the index.
		{:else}
			{page.error?.message ?? 'An unexpected error occurred.'}
		{/if}
	</p>
	<div class="actions">
		<a class="button" href="/">Return home</a>
		<a class="button button--quiet" href="/contact">Report an issue</a>
	</div>
	<p class="label path tabular" aria-hidden="true">{page.url.pathname}</p>
</section>

<style>
	.error {
		display: flex;
		flex-direction: column;
		justify-content: center;
		min-height: calc(100svh - var(--nav-height) - 12rem);
		padding-block: var(--space-9);
	}

	h1 {
		max-width: 14ch;
		margin-top: var(--space-5);
	}

	.lead {
		max-width: 30em;
		margin-top: var(--space-5);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		margin-top: var(--space-6);
	}

	.path {
		margin-top: var(--space-8);
		padding-top: var(--space-4);
		border-top: var(--hairline) solid var(--line);
		overflow-wrap: anywhere;
	}
</style>
