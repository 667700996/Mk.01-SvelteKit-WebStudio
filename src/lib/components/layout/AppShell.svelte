<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import GlobalNav from '$lib/components/layout/GlobalNav.svelte';
	import CommandPalette from '$components/composition/CommandPalette.svelte';
	import SiteFooter from './SiteFooter.svelte';

	onMount(() => {
		document.documentElement.dataset.theme = 'studio-dark';
	});
</script>

<div data-theme="studio-dark" class="app-shell">
	<a href="#page-content" class="skip-link">Skip to content</a>
	<GlobalNav />
	<main id="page-content" tabindex="-1">
		<slot />
	</main>
	{#if $page.url.pathname !== '/'}
		<SiteFooter />
	{/if}
	<CommandPalette />
</div>

<style>
	.app-shell {
		min-height: 100vh;
		background: #080907;
		color: #f0f0e8;
	}

	main {
		min-height: 100vh;
		outline: none;
	}
</style>
