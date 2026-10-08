<script lang="ts">
	import '@fontsource-variable/inter/opsz.css';
	import '@fontsource/ibm-plex-mono/400.css';
	import '@fontsource/ibm-plex-mono/500.css';
	import '$lib/styles/tokens.css';
	import '$lib/styles/base.css';

	import interLatin from '@fontsource-variable/inter/files/inter-latin-opsz-normal.woff2?url';
	import { onNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { siteConfig } from '$lib/config/site';
	import { buildSeo, type SeoResult } from '$lib/utils/seo';
	import CommandPalette from '$lib/components/layout/CommandPalette.svelte';
	import GridOverlay from '$lib/components/layout/GridOverlay.svelte';
	import SiteFooter from '$lib/components/layout/SiteFooter.svelte';
	import SiteHeader from '$lib/components/layout/SiteHeader.svelte';

	let { children } = $props();

	const seo = $derived(
		(page.data as { seo?: SeoResult }).seo ?? buildSeo({ path: page.url.pathname })
	);
	const jsonLd = $derived(
		seo.jsonLd
			? `<script type="application/ld+json">${JSON.stringify(seo.jsonLd).replace(/</g, '\\u003c')}</${'script'}>`
			: ''
	);

	// Cross-fade between routes with the View Transitions API where available.
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
		if (navigation.from?.url.pathname === navigation.to?.url.pathname) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<link rel="preload" href={interLatin} as="font" type="font/woff2" crossorigin="anonymous" />
	<title>{seo.title}</title>
	<meta name="description" content={seo.description} />
	<link rel="canonical" href={seo.canonical} />
	<meta name="robots" content={seo.robots} />
	<meta name="author" content={siteConfig.name} />
	{#each seo.meta as meta}
		<meta name={meta.name} content={meta.content} />
	{/each}
	{#each seo.openGraph as og}
		<meta property={og.property} content={og.content} />
	{/each}
	{#each seo.twitter as twitter}
		<meta name={twitter.name} content={twitter.content} />
	{/each}
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html jsonLd}
</svelte:head>

<a class="skip-link" href="#main">Skip to content</a>
<SiteHeader />
<main id="main" tabindex="-1">
	{@render children()}
</main>
<SiteFooter />
<CommandPalette />
<GridOverlay />

<style>
	main {
		outline: none;
	}
</style>
