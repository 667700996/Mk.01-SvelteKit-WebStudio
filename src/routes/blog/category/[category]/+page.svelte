<script lang="ts">
	import PostIndex from '$lib/components/journal/PostIndex.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const count = $derived(
		`${data.posts.length} ${data.posts.length === 1 ? 'entry' : 'entries'} in this category.`
	);
</script>

<PageHeader label="Journal / Category" title={data.category.name} lead={count} />

<div class="wrap">
	<nav class="categories" aria-label="Categories">
		<ul role="list">
			<li><a href="/blog">All</a></li>
			{#each data.categories as entry (entry.slug)}
				<li>
					<a
						href="/blog/category/{entry.slug}"
						aria-current={entry.slug === data.category.slug ? 'page' : undefined}
					>
						{entry.name}
						<span class="count tabular">{entry.count}</span>
					</a>
				</li>
			{/each}
		</ul>
	</nav>

	<PostIndex posts={data.posts} headingLevel={2} />

	<p class="back">
		<a class="link" href="/blog"><span class="arrow" aria-hidden="true">←</span> Back to the journal</a>
	</p>
</div>

<style>
	.categories {
		padding-block: var(--space-3);
		margin-bottom: var(--space-7);
		border-top: var(--hairline) solid var(--fg);
		border-bottom: var(--hairline) solid var(--line);
	}

	.categories ul {
		display: flex;
		gap: var(--space-1);
		margin-left: calc(var(--space-3) * -1);
		overflow-x: auto;
		scrollbar-width: none;
		padding-right: var(--space-6);
		mask-image: linear-gradient(to right, #000 calc(100% - 2.5rem), transparent);
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
		white-space: nowrap;
		transition: color var(--duration-2) var(--ease-out);
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

	.back {
		margin-top: var(--space-7);
	}

	.back a:hover .arrow {
		transform: translateX(-3px);
	}
</style>
