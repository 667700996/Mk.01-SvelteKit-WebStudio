<script lang="ts">
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import PostIndex from '$lib/components/journal/PostIndex.svelte';
	import { formatDate } from '$lib/utils/format';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const filtered = $derived(Boolean(data.search || data.category || data.tag));
	const showFeature = $derived(!filtered && data.pageNumber === 1 && data.posts.length > 0);
	const featured = $derived(showFeature ? data.posts[0] : null);
	const listed = $derived(showFeature ? data.posts.slice(1) : data.posts);
	const activeCategory = $derived(data.categories.find((entry) => entry.slug === data.category));

	/** Builds a journal URL from the current filters, overriding the given keys. */
	function journalHref(overrides: Record<string, string | number | null>) {
		const params = new URLSearchParams();
		const merged: Record<string, string | number | null> = {
			search: data.search || null,
			category: data.category || null,
			tag: data.tag || null,
			page: null,
			...overrides
		};
		for (const [key, value] of Object.entries(merged)) {
			if (value !== null && value !== '' && !(key === 'page' && value === 1)) {
				params.set(key, String(value));
			}
		}
		const query = params.toString();
		return query ? `/blog?${query}` : '/blog';
	}

	const summary = $derived.by(() => {
		const count = `${data.total} ${data.total === 1 ? 'entry' : 'entries'}`;
		const parts = [count];
		if (data.search) parts.push(`matching “${data.search}”`);
		if (activeCategory) parts.push(`in ${activeCategory.name}`);
		if (data.tag) parts.push(`tagged #${data.tag}`);
		return parts.join(' ');
	});
</script>

<PageHeader
	label="Journal"
	title="Thoughts on code, craft, and chaos."
	lead="Field notes from the edge of web engineering. Design systems, shader experiments, and the business of building digital products."
/>

<div class="wrap">
	<div class="toolbar">
		<nav class="categories" aria-label="Categories">
			<ul role="list">
				<li>
					<a
						href={journalHref({ category: null })}
						aria-current={!data.category ? 'page' : undefined}>All</a
					>
				</li>
				{#each data.categories as entry (entry.slug)}
					<li>
						<a
							href={journalHref({ category: entry.slug })}
							aria-current={data.category === entry.slug ? 'page' : undefined}
						>
							{entry.name}
							<span class="count tabular">{entry.count}</span>
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<form class="search" method="get" action="/blog" role="search" data-sveltekit-keepfocus>
			<label for="journal-search" class="sr-only">Search the journal</label>
			<svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
				<circle cx="7" cy="7" r="4.75" />
				<path d="M10.5 10.5 14 14" />
			</svg>
			<input
				id="journal-search"
				type="search"
				name="search"
				value={data.search}
				placeholder="Search the journal"
				autocomplete="off"
			/>
			{#if data.category}<input type="hidden" name="category" value={data.category} />{/if}
			{#if data.tag}<input type="hidden" name="tag" value={data.tag} />{/if}
			<button type="submit" class="sr-only">Search</button>
		</form>
	</div>

	<div class="status label" role="status">
		<span>{summary}</span>
		{#if filtered}
			<a class="link clear" href="/blog">Clear filters</a>
		{/if}
	</div>
</div>

{#if featured}
	<section class="wrap feature-wrap" aria-labelledby="featured-title">
		<a class="feature grid" href="/blog/{featured.slug}">
			<p class="label feature-meta">
				<span>Latest</span>
				<time datetime={featured.date}>{formatDate(featured.date)}</time>
			</p>
			<div class="feature-body">
				<h2 id="featured-title" class="h1">{featured.title}</h2>
				{#if featured.description}
					<p class="lead">{featured.description}</p>
				{/if}
				<p class="label feature-foot">
					<span>{featured.category}</span>
					<span>{featured.readingTime} min read</span>
					<span class="read">Read entry <span class="arrow" aria-hidden="true">→</span></span>
				</p>
			</div>
		</a>
	</section>
{/if}

<section class="wrap list-wrap" aria-label={showFeature ? 'Earlier entries' : 'Entries'}>
	{#if listed.length}
		{#if showFeature}
			<h2 class="label list-title">Earlier entries</h2>
		{/if}
		<PostIndex posts={listed} />
	{:else if data.total === 0}
		<div class="empty">
			<p class="h3">Nothing matches that yet.</p>
			<p class="secondary">Try a broader term, or browse every entry.</p>
			<a class="button button--quiet" href="/blog">Show all entries</a>
		</div>
	{/if}

	{#if data.totalPages > 1}
		<nav class="pagination" aria-label="Pagination">
			{#if data.pageNumber > 1}
				<a class="button button--quiet" href={journalHref({ page: data.pageNumber - 1 })} rel="prev">
					<span class="arrow" aria-hidden="true">←</span> Newer
				</a>
			{:else}
				<span></span>
			{/if}
			<span class="label tabular">Page {data.pageNumber} of {data.totalPages}</span>
			{#if data.pageNumber < data.totalPages}
				<a class="button button--quiet" href={journalHref({ page: data.pageNumber + 1 })} rel="next">
					Older <span class="arrow" aria-hidden="true">→</span>
				</a>
			{:else}
				<span></span>
			{/if}
		</nav>
	{/if}
</section>

<style>
	.toolbar {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-4) var(--space-6);
		padding-block: var(--space-3);
		border-top: var(--hairline) solid var(--fg);
		border-bottom: var(--hairline) solid var(--line);
	}

	.categories ul {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-1);
		margin-left: calc(var(--space-3) * -1);
	}

	.categories a {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		min-height: 2.75rem;
		padding: 0 var(--space-3);
		border-radius: 999px;
		color: var(--fg-2);
		font-size: var(--text-small);
		transition:
			color var(--duration-2) var(--ease-out),
			background-color var(--duration-2) var(--ease-out);
	}

	.categories a:hover {
		color: var(--fg);
	}

	.categories a[aria-current='page'] {
		background: var(--bg-raised);
		color: var(--fg);
		box-shadow: inset 0 0 0 var(--hairline) var(--line);
	}

	.count {
		color: var(--fg-3);
		font-family: var(--font-mono);
		font-size: var(--text-label);
	}

	.search {
		position: relative;
		display: flex;
		align-items: center;
		flex: 0 1 18rem;
	}

	.search svg {
		position: absolute;
		left: var(--space-4);
		fill: none;
		stroke: var(--fg-3);
		stroke-width: 1.5;
		stroke-linecap: round;
		pointer-events: none;
	}

	.search input {
		width: 100%;
		height: 2.75rem;
		padding: 0 var(--space-4) 0 2.5rem;
		border: var(--hairline) solid var(--line-control);
		border-radius: 999px;
		background: transparent;
		font-size: var(--text-small);
		transition: border-color var(--duration-2) var(--ease-out);
	}

	.search input::placeholder {
		color: var(--fg-3);
	}

	.search input:hover {
		border-color: var(--fg-2);
	}

	.search input:focus-visible {
		outline: 2px solid var(--accent);
		outline-offset: 1px;
		border-color: transparent;
	}

	.status {
		display: flex;
		justify-content: space-between;
		gap: var(--space-4);
		padding-block: var(--space-4);
	}

	.clear {
		text-transform: none;
		letter-spacing: 0;
		font-family: var(--font-sans);
		font-size: var(--text-small);
		color: var(--fg);
	}

	/* Featured entry ------------------------------------------------------- */

	.feature-wrap {
		padding-top: var(--space-8);
	}

	.feature {
		row-gap: var(--space-5);
		padding-bottom: var(--space-9);
	}

	.feature-meta {
		grid-column: 1 / span 3;
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
		padding-top: 0.9em;
	}

	.feature-meta span {
		color: var(--accent);
	}

	.feature-body {
		grid-column: 4 / -1;
	}

	.feature h2 {
		max-width: 16ch;
		transition: color var(--duration-3) var(--ease-out);
	}

	.feature:hover h2 {
		color: var(--fg-2);
	}

	.feature .lead {
		max-width: 32em;
		margin-top: var(--space-5);
	}

	.feature-foot {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2) var(--space-5);
		margin-top: var(--space-6);
	}

	.read {
		color: var(--fg);
	}

	/* Index ---------------------------------------------------------------- */

	.list-wrap {
		padding-top: var(--space-6);
	}

	.list-title {
		padding-bottom: var(--space-4);
	}

	.empty {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--space-4);
		padding-block: var(--space-9);
	}

	.pagination {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: var(--space-4);
		margin-top: var(--space-7);
	}

	@media (max-width: 63.99rem) {
		.feature-meta,
		.feature-body {
			grid-column: 1 / -1;
		}

		.feature-meta {
			flex-direction: row;
			gap: var(--space-4);
			padding-top: 0;
		}
	}

	@media (max-width: 47.99rem) {
		.search {
			flex-basis: 100%;
		}

		.categories ul {
			flex-wrap: nowrap;
			overflow-x: auto;
			scrollbar-width: none;
		}

		.categories {
			max-width: 100%;
		}
	}
</style>
