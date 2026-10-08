<script lang="ts">
	import { siteConfig } from '$lib/config/site';
	import Plate, { plateForProject } from '$lib/components/ui/Plate.svelte';
	import { pad } from '$lib/utils/format';

	let { data } = $props();
</script>

<header class="wrap intro">
	<div class="grid meta label">
		<p>Selected systems / 2024—2026</p>
		<p>Art direction × Interaction × Code</p>
	</div>
	<p class="kicker">A compact archive of things made to move.</p>
	<h1 class="display">Selected systems.</h1>
	<div class="grid foot">
		<p class="lead">
			Three case studies showing the work behind the spectacle: the decisions, systems, and
			performance discipline that make expressive interfaces hold together.
		</p>
		<a class="jump" href="#project-index">
			Open index <span class="arrow arrow--down" aria-hidden="true">↓</span>
		</a>
	</div>
</header>

<!-- A spec-sheet index first: scannable in one glance, like a table of contents. -->
<section class="wrap" id="project-index" aria-labelledby="index-title">
	<h2 class="sr-only" id="index-title">Project index</h2>
	<table class="index">
		<thead class="label">
			<tr>
				<th scope="col">No.</th>
				<th scope="col">Project</th>
				<th scope="col" class="hide-s">Industry</th>
				<th scope="col" class="hide-m">Focus</th>
				<th scope="col" class="year">Year</th>
			</tr>
		</thead>
		<tbody>
			{#each data.projects as project, index (project.slug)}
				<tr>
					<td class="label">{pad(index + 1)}</td>
					<th scope="row"><a href="#{project.slug}">{project.title}</a></th>
					<td class="hide-s secondary">{project.industry}</td>
					<td class="hide-m secondary">{project.tags.join(', ')}</td>
					<td class="year tabular secondary">{project.year}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</section>

<section class="wrap projects" aria-label="Case studies">
	{#each data.projects as project, index (project.slug)}
		<article class="project" id={project.slug} aria-labelledby="{project.slug}-title">
			<a class="plate-host plate-link" href="/work/{project.slug}" tabindex="-1" aria-hidden="true">
				<Plate
					kind={plateForProject[project.slug] ?? 'orbital'}
					index="Case {pad(index + 1)}"
					caption={project.industry}
					ratio="16 / 9"
					name="plate-{project.slug}"
				/>
			</a>
			<div class="grid info" data-reveal>
				<p class="label number">{pad(index + 1)}</p>
				<div class="title">
					<h2 class="h2" id="{project.slug}-title">
						<a
							class="plate-host"
							href="/work/{project.slug}"
							style:view-transition-name="title-{project.slug}">{project.title}</a
						>
					</h2>
					<p class="label">{project.year} · {project.industry}</p>
				</div>
				<div class="body">
					<p class="lead">{project.summary}</p>
					<ul class="tags label" role="list">
						{#each project.tags as tag}
							<li>{tag}</li>
						{/each}
					</ul>
					<a class="open" href="/work/{project.slug}">
						Read the case study <span class="arrow" aria-hidden="true">→</span>
						<span class="sr-only">: {project.title}</span>
					</a>
				</div>
			</div>
		</article>
	{/each}
</section>

<section class="wrap section note" aria-label="More">
	<div class="grid">
		<p class="h1 statement" data-reveal>
			Different surfaces.<br /><span class="muted">One standard of care.</span>
		</p>
		<div class="aside" data-reveal>
			<p class="label">Looking for the experiments?</p>
			<a class="link" href="/#lab">Enter the live lab</a>
			<a class="link" href="/labs">Browse all labs</a>
		</div>
	</div>
</section>

<section class="wrap section closing" aria-labelledby="closing-title">
	<p class="label">Have a difficult idea?</p>
	<h2 class="display" id="closing-title">
		<a href="mailto:{siteConfig.contactEmail}?subject=Portfolio%20conversation">
			Let’s make it tangible.<span class="arrow arrow--diagonal" aria-hidden="true">↗</span>
		</a>
	</h2>
</section>

<style>
	.intro {
		padding-block: var(--space-6) var(--space-9);
	}

	.meta p:first-child {
		grid-column: 1 / span 6;
	}

	.meta p:last-child {
		grid-column: 7 / -1;
		text-align: right;
	}

	.kicker {
		margin-top: clamp(4rem, 2rem + 8vw, 10rem);
		color: var(--fg-2);
		font-size: var(--text-lead);
		letter-spacing: -0.016em;
	}

	h1 {
		margin-top: var(--space-4);
	}


	.foot {
		align-items: end;
		row-gap: var(--space-5);
		margin-top: var(--space-8);
		padding-top: var(--space-5);
		border-top: var(--hairline) solid var(--line);
	}

	.foot .lead {
		grid-column: 1 / span 6;
		max-width: 30em;
	}

	.jump {
		grid-column: 10 / -1;
		justify-self: end;
		font-weight: 520;
	}

	/* Index table ---------------------------------------------------------- */

	.index {
		width: 100%;
		border-collapse: collapse;
		font-variant-numeric: tabular-nums;
	}

	.index th,
	.index td {
		padding: var(--space-4) var(--space-4) var(--space-4) 0;
		border-bottom: var(--hairline) solid var(--line);
		text-align: left;
		font-weight: inherit;
		vertical-align: baseline;
	}

	thead th {
		padding-block: var(--space-3);
		border-bottom-color: var(--fg);
	}

	tbody th {
		font-size: var(--text-h4);
		font-weight: 600;
		letter-spacing: -0.02em;
	}

	tbody th a {
		transition: color var(--duration-2) var(--ease-out);
	}

	tbody tr:hover th a {
		color: var(--accent);
	}

	.index .year {
		padding-right: 0;
		text-align: right;
	}

	/* Projects ------------------------------------------------------------- */

	.projects {
		display: flex;
		flex-direction: column;
		gap: var(--space-10);
		padding-top: var(--space-10);
	}

	.plate-link {
		display: block;
	}

	.plate-link :global(.plate) {
		transition: transform var(--duration-4) var(--ease-out);
	}

	.plate-link:hover :global(.plate) {
		transform: scale(0.995);
	}

	.info {
		row-gap: var(--space-4);
		margin-top: var(--space-6);
	}

	.number {
		grid-column: 1 / span 1;
		padding-top: 0.9em;
	}

	.title {
		grid-column: 2 / span 5;
	}

	.title .label {
		margin-top: var(--space-3);
	}

	.body {
		grid-column: 8 / -1;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-2) var(--space-4);
		margin-top: var(--space-5);
	}

	.open {
		display: inline-block;
		margin-top: var(--space-6);
		font-weight: 520;
		transition: color var(--duration-2) var(--ease-out);
	}

	.open:hover {
		color: var(--accent);
	}

	/* Closing -------------------------------------------------------------- */

	.statement {
		grid-column: 1 / span 8;
	}

	.aside {
		grid-column: 10 / -1;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		justify-content: flex-end;
		gap: var(--space-2);
	}

	.aside .label {
		margin-bottom: var(--space-2);
	}

	.closing h2 {
		margin-top: var(--space-6);
	}

	.closing a {
		transition: color var(--duration-3) var(--ease-out);
	}

	.closing a:hover {
		color: var(--accent);
	}

	.closing .arrow {
		font-size: 0.45em;
		font-weight: 400;
		vertical-align: 0.9em;
		margin-left: 0.1em;
	}

	@media (max-width: 63.99rem) {
		.hide-m {
			display: none;
		}

		.number {
			display: none;
		}

		.title,
		.body,
		.statement,
		.aside {
			grid-column: 1 / -1;
		}

		.aside {
			margin-top: var(--space-6);
		}
	}

	@media (max-width: 47.99rem) {
		.hide-s,
		.meta p:last-child {
			display: none;
		}

		.meta p:first-child,
		.foot .lead,
		.jump {
			grid-column: 1 / -1;
			justify-self: start;
		}

		.projects {
			gap: var(--space-9);
		}
	}
</style>
