<script lang="ts">
	import '$lib/styles/prose.css';
	import { siteConfig } from '$lib/config/site';
	import PostIndex from '$lib/components/journal/PostIndex.svelte';
	import { formatDate } from '$lib/utils/format';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const post = $derived(data.post);
	const Body = $derived(data.Body);
	const subject = $derived(encodeURIComponent(`Re: ${post.title}`));
</script>

<article class="wrap article" aria-labelledby="article-title">
	<header class="grid head">
		<a class="label back" href="/blog">
			<span class="arrow" aria-hidden="true">←</span> Journal
		</a>
		<div class="title-block">
			<p class="label kicker">
				<a href="/blog/category/{post.category.toLowerCase()}">{post.category}</a>
				<span aria-hidden="true">/</span>
				<time datetime={post.date}>{formatDate(post.date)}</time>
			</p>
			<h1 id="article-title" class="h1">{post.title}</h1>
			{#if post.description}
				<p class="lead">{post.description}</p>
			{/if}
		</div>
	</header>

	<div class="grid layout">
		<aside class="meta" aria-label="Entry details">
			<dl>
				<div>
					<dt class="label">Published</dt>
					<dd><time datetime={post.date}>{formatDate(post.date)}</time></dd>
				</div>
				<div>
					<dt class="label">Reading time</dt>
					<dd class="tabular">{post.readingTime} min · {post.wordCount} words</dd>
				</div>
				<div>
					<dt class="label">Author</dt>
					<dd>{post.author}</dd>
				</div>
				{#if post.tags.length}
					<div>
						<dt class="label">Tags</dt>
						<dd>
							<ul role="list" class="tags">
								{#each post.tags as tag (tag)}
									<li>
										<a class="tag" href="/blog?tag={encodeURIComponent(tag.toLowerCase())}">#{tag}</a>
									</li>
								{/each}
							</ul>
						</dd>
					</div>
				{/if}
			</dl>
		</aside>

		<div class="prose body">
			<Body />
		</div>
	</div>
</article>

{#if data.related.length}
	<section class="wrap related" aria-labelledby="related-title">
		<div class="grid related-head">
			<h2 id="related-title" class="label">Related entries</h2>
		</div>
		<PostIndex posts={data.related} />
	</section>
{/if}

<section class="wrap cta" aria-labelledby="cta-title">
	<div class="grid">
		<p class="label cta-label">Continue the conversation</p>
		<div class="cta-body">
			<h2 id="cta-title" class="h2">Thoughts, questions, or a project in mind?</h2>
			<p class="secondary">
				Send a note. It is always good to hear how these explorations land.
			</p>
			<div class="actions">
				<a class="button" href="mailto:{siteConfig.contactEmail}?subject={subject}">
					Email the studio
				</a>
				<a class="button button--quiet" href="/blog">
					Browse the journal <span class="arrow" aria-hidden="true">→</span>
				</a>
			</div>
		</div>
	</div>
</section>

<style>
	.article {
		padding-top: clamp(3rem, 1.5rem + 5vw, 6rem);
	}

	.head {
		row-gap: var(--space-6);
		padding-bottom: clamp(3rem, 2rem + 4vw, 6rem);
		border-bottom: var(--hairline) solid var(--line);
	}

	.back {
		grid-column: 1 / span 3;
		align-self: start;
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		min-height: 2.75rem;
		margin-top: -0.85rem;
		width: fit-content;
		transition: color var(--duration-2) var(--ease-out);
	}

	.back:hover {
		color: var(--fg);
	}

	.back:hover .arrow {
		transform: translateX(-3px);
	}

	.title-block {
		grid-column: 4 / -1;
	}

	.kicker {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		margin-bottom: var(--space-5);
	}

	.kicker a {
		color: var(--accent);
	}

	.kicker a:hover {
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}

	h1 {
		max-width: 18ch;
		animation: rise var(--duration-4) var(--ease-out) both;
	}

	.title-block .lead {
		max-width: 32em;
		margin-top: var(--space-6);
		animation: rise var(--duration-4) var(--ease-out) 80ms both;
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(0.75rem);
		}
	}

	.layout {
		padding-top: var(--space-8);
	}

	.meta {
		grid-column: 1 / span 3;
	}

	.meta dl {
		position: sticky;
		top: calc(var(--nav-height) + var(--space-6));
		display: flex;
		flex-direction: column;
		gap: var(--space-5);
	}

	dd {
		margin-top: var(--space-1);
		font-size: var(--text-small);
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-1) var(--space-3);
	}

	.tag {
		color: var(--fg-2);
		transition: color var(--duration-2) var(--ease-out);
	}

	.tag:hover {
		color: var(--accent);
	}

	.body {
		grid-column: 4 / span 7;
		min-width: 0;
	}

	.related {
		padding-top: var(--section);
	}

	.related-head {
		padding-bottom: var(--space-4);
	}

	.related-head h2 {
		grid-column: 1 / -1;
	}

	.cta {
		padding-top: var(--section);
	}

	.cta-label {
		grid-column: 1 / span 3;
		padding-top: 0.75em;
	}

	.cta-body {
		grid-column: 4 / -1;
	}

	.cta h2 {
		max-width: 16ch;
	}

	.cta .secondary {
		margin-top: var(--space-4);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		margin-top: var(--space-6);
	}

	@media (max-width: 63.99rem) {
		.back,
		.title-block,
		.meta,
		.body,
		.cta-label,
		.cta-body {
			grid-column: 1 / -1;
		}

		.meta dl {
			position: static;
			flex-direction: row;
			flex-wrap: wrap;
			gap: var(--space-4) var(--space-6);
			padding-bottom: var(--space-6);
			margin-bottom: var(--space-6);
			border-bottom: var(--hairline) solid var(--line);
		}

		.cta-body {
			margin-top: var(--space-4);
		}
	}
</style>
