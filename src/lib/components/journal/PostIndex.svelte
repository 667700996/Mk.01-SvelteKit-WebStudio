<!--
	The journal index: one hairline-separated row per entry, read left to right
	like a ledger — date, category, title + summary, reading time.
-->
<script lang="ts">
	import type { Post } from '$lib/server/content';
	import { formatDate } from '$lib/utils/format';

	let {
		posts,
		headingLevel = 3
	}: { posts: Pick<Post, 'slug' | 'title' | 'date' | 'description' | 'category' | 'readingTime'>[]; headingLevel?: 2 | 3 } =
		$props();
</script>

<ol class="index" role="list">
	{#each posts as post (post.slug)}
		<li class="row grid">
			<time class="label date" datetime={post.date}>{formatDate(post.date, 'short')}</time>
			<p class="label category">{post.category}</p>
			<div class="body">
				<svelte:element this={`h${headingLevel}`} class="h4 title">
					<a href="/blog/{post.slug}">{post.title}</a>
				</svelte:element>
				{#if post.description}
					<p class="secondary description">{post.description}</p>
				{/if}
			</div>
			<p class="label time tabular">{post.readingTime} min <span class="arrow" aria-hidden="true">→</span></p>
		</li>
	{/each}
</ol>

<style>
	.index {
		border-top: var(--hairline) solid var(--line);
	}

	.row {
		position: relative;
		align-items: baseline;
		row-gap: var(--space-2);
		padding-block: var(--space-5);
		border-bottom: var(--hairline) solid var(--line);
	}

	.date {
		grid-column: 1 / span 2;
	}

	.category {
		grid-column: 3 / span 2;
	}

	.body {
		grid-column: 5 / span 6;
	}

	.time {
		grid-column: 11 / -1;
		justify-self: end;
		white-space: nowrap;
	}

	.title {
		transition: color var(--duration-2) var(--ease-out);
	}

	/* The whole row is the hit area; the title stays the accessible link. */
	.title a::after {
		content: '';
		position: absolute;
		inset: 0;
	}

	.title a:focus-visible {
		outline: none;
	}

	.row:has(a:focus-visible) {
		outline: 2px solid var(--accent);
		outline-offset: 2px;
		border-radius: var(--radius-s);
	}

	.row:hover .title {
		color: var(--accent);
	}

	.row:hover .arrow {
		transform: translateX(3px);
	}

	.description {
		max-width: 34em;
		margin-top: var(--space-2);
	}

	@media (max-width: 63.99rem) {
		.date {
			grid-column: 1 / span 3;
		}

		.category {
			grid-column: 4 / span 3;
		}

		.body {
			grid-column: 1 / span 10;
			grid-row: 2;
		}

		.time {
			grid-column: 7 / -1;
			grid-row: 1;
		}
	}

	@media (max-width: 47.99rem) {
		.date {
			grid-column: 1 / span 6;
		}

		.category {
			grid-column: 7 / -1;
			justify-self: end;
		}

		.body {
			grid-column: 1 / -1;
		}

		.time {
			display: none;
		}
	}
</style>
