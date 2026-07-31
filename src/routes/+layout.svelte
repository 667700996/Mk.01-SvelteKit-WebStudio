<script lang="ts">
	import '../app.css';
	import AppShell from '$lib/components/layout/AppShell.svelte';
	import SmoothScroll from '$lib/components/layout/SmoothScroll.svelte';
	import LiquidCursor from '$lib/components/experience/LiquidCursor.svelte';
	import ScrollProgress from '$lib/components/ui/ScrollProgress.svelte';
	import { siteConfig } from '$lib/config/site';
	import { buildSeo, type SeoResult } from '$lib/utils/seo';
	import { page } from '$app/stores';

	function serializeJsonLd(payload: Record<string, unknown> | null) {
		if (!payload) return '';
		return JSON.stringify(payload).replace(/</g, '\\u003C');
	}

	$: currentSeo =
		($page.data as { seo?: SeoResult })?.seo ?? buildSeo({ path: $page.url.pathname });
	$: jsonLdMarkup =
		currentSeo?.jsonLd != null
			? `<script type="application/ld+json">${serializeJsonLd(currentSeo.jsonLd)}<\/script>`
			: '';
</script>

<svelte:head>
	<title>{currentSeo.title}</title>
	<meta name="description" content={currentSeo.description} />
	<link rel="canonical" href={currentSeo.canonical} />
	{#if currentSeo.robots}
		<meta name="robots" content={currentSeo.robots} />
	{/if}
	<meta name="author" content={siteConfig.name} />
	{#each currentSeo.meta as meta}
		<meta name={meta.name} content={meta.content} />
	{/each}
	{#each currentSeo.openGraph as og}
		<meta property={og.property} content={og.content} />
	{/each}
	{#each currentSeo.twitter as twitter}
		<meta name={twitter.name} content={twitter.content} />
	{/each}
	<!-- eslint-disable-next-line svelte/no-at-html-tags -->
	{@html jsonLdMarkup}
</svelte:head>

<ScrollProgress />
<SmoothScroll>
	<LiquidCursor />
	<AppShell>
		<slot />
	</AppShell>
</SmoothScroll>
