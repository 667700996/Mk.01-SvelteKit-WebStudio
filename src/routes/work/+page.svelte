<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import '../../styles/home.css';

	export let data: PageData;

	const visualTypes: Record<string, string> = {
		'neon-metropolis': 'orbital',
		'atlas-labs': 'signal',
		flowstate: 'monolith'
	};

	let ready = false;

	onMount(() => {
		ready = true;
	});
</script>

<article class:ready class="work-index">
	<header class="work-index__hero">
		<div class="work-index__meta">
			<span>Selected systems / 2024—2026</span>
			<span>Art direction × Interaction × Code</span>
		</div>
		<p class="work-index__eyebrow">A compact archive of things made to move.</p>
		<h1>
			<span>Selected</span>
			<span>systems.</span>
		</h1>
		<div class="work-index__intro">
			<p>
				Three case studies showing the work behind the spectacle: the decisions, systems, and
				performance discipline that make expressive interfaces hold together.
			</p>
			<a href="#project-index">Open index ↓</a>
		</div>
	</header>

	<section class="work-index__projects" id="project-index" aria-label="Selected projects">
		{#each data.projects as project, index}
			<a href="/work/{project.slug}" class="archive-project">
				<div class="archive-project__meta">
					<span>0{index + 1}</span>
					<span>{project.industry}</span>
					<span>{project.year}</span>
				</div>
				<div class="archive-project__visual">
					<div class="project-art project-art--{visualTypes[project.slug]} active" aria-hidden="true">
						{#if visualTypes[project.slug] === 'orbital'}
							<div class="orbital__core"></div>
							<div class="orbital__ring orbital__ring--a"></div>
							<div class="orbital__ring orbital__ring--b"></div>
							<div class="orbital__ring orbital__ring--c"></div>
						{:else if visualTypes[project.slug] === 'signal'}
							<div class="signal__beam"></div>
							<div class="signal__disc"></div>
							<div class="signal__grid"></div>
						{:else}
							<div class="monolith__block monolith__block--a"></div>
							<div class="monolith__block monolith__block--b"></div>
							<div class="monolith__type">R</div>
						{/if}
					</div>
					<span class="archive-project__open">View case ↗</span>
				</div>
				<div class="archive-project__copy">
					<h2>{project.title}</h2>
					<p>{project.summary}</p>
					<div>
						{#each project.tags as tag}
							<span>{tag}</span>
						{/each}
					</div>
				</div>
			</a>
		{/each}
	</section>

	<section class="work-index__note">
		<p>Different surfaces.<br />One standard of care.</p>
		<div>
			<span>Looking for the experiments?</span>
			<a href="/#lab">Enter the live lab ↗</a>
		</div>
	</section>

	<section class="work-index__contact">
		<p>Have a difficult idea?</p>
		<a href="mailto:studio@mk1.dev?subject=Portfolio%20conversation">
			Let’s make<br />it tangible. <span>↗</span>
		</a>
	</section>
</article>

<style>
	.work-index {
		--gutter: clamp(18px, 3vw, 50px);
		overflow: clip;
		background: #080907;
		color: #f0f0e8;
	}

	.work-index__hero {
		position: relative;
		display: flex;
		min-height: 100svh;
		flex-direction: column;
		justify-content: flex-end;
		padding: 125px var(--gutter) 32px;
		border-bottom: 1px solid rgba(240, 240, 232, 0.15);
		background:
			linear-gradient(to right, rgba(240, 240, 232, 0.045) 1px, transparent 1px),
			#080907;
		background-size: calc((100vw - var(--gutter) * 2) / 12) 100%;
	}

	.work-index__meta {
		position: absolute;
		inset: 96px var(--gutter) auto;
		display: flex;
		justify-content: space-between;
		color: rgba(240, 240, 232, 0.42);
		font-family: 'JetBrains Mono', monospace;
		font-size: 8px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.work-index__eyebrow {
		margin: 0 0 28px;
		color: #d7ff55;
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		opacity: 0;
		transform: translateY(20px);
		transition: 0.8s 0.2s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.work-index h1 {
		margin: 0;
		font-family: 'Syne', sans-serif;
		font-size: clamp(96px, 16.8vw, 285px);
		font-weight: 600;
		letter-spacing: -0.095em;
		line-height: 0.63;
		text-transform: uppercase;
	}

	.work-index h1 span {
		display: block;
		width: fit-content;
		opacity: 0;
		transform: translateY(0.35em);
		transition: 1s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.work-index h1 span:last-child {
		margin-left: 0.16em;
		color: transparent;
		-webkit-text-stroke: 1.5px #f0f0e8;
		transition-delay: 80ms;
	}

	.ready .work-index__eyebrow,
	.ready h1 span {
		opacity: 1;
		transform: translateY(0);
	}

	.work-index__intro {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		margin-top: clamp(60px, 9vh, 105px);
		border-top: 1px solid rgba(240, 240, 232, 0.15);
		padding-top: 18px;
	}

	.work-index__intro p {
		max-width: 500px;
		margin: 0;
		color: rgba(240, 240, 232, 0.62);
		font-size: 14px;
		line-height: 1.6;
	}

	.work-index__intro a {
		border-bottom: 1px solid rgba(240, 240, 232, 0.35);
		padding-bottom: 7px;
		color: #f0f0e8;
		font-family: 'JetBrains Mono', monospace;
		font-size: 8px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.work-index__projects {
		padding: clamp(110px, 15vw, 220px) var(--gutter);
		background: #f0f0e8;
	}

	.archive-project {
		display: grid;
		grid-template-columns: minmax(130px, 0.25fr) minmax(0, 1fr) minmax(280px, 0.52fr);
		gap: clamp(24px, 4vw, 70px);
		border-top: 1px solid rgba(8, 9, 7, 0.2);
		padding: clamp(60px, 8vw, 120px) 0;
		color: #080907;
	}

	.archive-project:last-child {
		border-bottom: 1px solid rgba(8, 9, 7, 0.2);
	}

	.archive-project__meta {
		display: flex;
		flex-direction: column;
		gap: 12px;
		font-family: 'JetBrains Mono', monospace;
		font-size: 8px;
		letter-spacing: 0.09em;
		text-transform: uppercase;
	}

	.archive-project__meta span:first-child {
		margin-bottom: auto;
		color: rgba(8, 9, 7, 0.35);
	}

	.archive-project__visual {
		position: relative;
		aspect-ratio: 1.24;
		overflow: hidden;
		background: #090a08;
	}

	.archive-project__visual .project-art {
		transition: transform 0.9s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.archive-project:hover .project-art {
		transform: scale(1.04);
	}

	.archive-project__open {
		position: absolute;
		right: 16px;
		bottom: 16px;
		z-index: 8;
		padding: 10px 13px;
		border-radius: 999px;
		background: #d7ff55;
		color: #080907;
		font-family: 'JetBrains Mono', monospace;
		font-size: 7px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		transform: translateY(10px);
		opacity: 0;
		transition: 300ms ease;
	}

	.archive-project:hover .archive-project__open {
		opacity: 1;
		transform: translateY(0);
	}

	.archive-project__copy {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
	}

	.archive-project__copy h2 {
		margin: 0 0 22px;
		color: #080907;
		font-family: 'Syne', sans-serif;
		font-size: clamp(58px, 7vw, 120px);
		font-weight: 600;
		letter-spacing: -0.08em;
		line-height: 0.76;
	}

	.archive-project__copy p {
		max-width: 400px;
		margin: 0 0 45px;
		color: rgba(8, 9, 7, 0.58);
		font-size: 14px;
		line-height: 1.55;
	}

	.archive-project__copy > div {
		display: flex;
		flex-wrap: wrap;
		gap: 7px;
	}

	.archive-project__copy > div span {
		border: 1px solid rgba(8, 9, 7, 0.22);
		border-radius: 999px;
		padding: 7px 10px;
		font-family: 'JetBrains Mono', monospace;
		font-size: 7px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.work-index__note {
		display: grid;
		grid-template-columns: 1fr 0.5fr;
		gap: 50px;
		padding: clamp(120px, 16vw, 250px) var(--gutter);
	}

	.work-index__note > p {
		margin: 0;
		font-family: 'Syne', sans-serif;
		font-size: clamp(64px, 9vw, 155px);
		font-weight: 500;
		letter-spacing: -0.075em;
		line-height: 0.87;
	}

	.work-index__note > div {
		align-self: end;
		display: flex;
		flex-direction: column;
		gap: 18px;
		font-family: 'JetBrains Mono', monospace;
		font-size: 8px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.work-index__note a {
		width: fit-content;
		color: #d7ff55;
	}

	.work-index__contact {
		padding: 80px var(--gutter) 40px;
		background: #d7ff55;
		color: #080907;
	}

	.work-index__contact p {
		margin: 0 0 80px;
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.work-index__contact a {
		position: relative;
		display: block;
		color: #080907;
		font-family: 'Syne', sans-serif;
		font-size: clamp(78px, 15vw, 250px);
		font-weight: 600;
		letter-spacing: -0.09em;
		line-height: 0.72;
		text-transform: uppercase;
	}

	.work-index__contact a span {
		position: absolute;
		right: 0;
		bottom: 0;
		font-size: 0.35em;
	}

	@media (max-width: 900px) {
		.archive-project {
			grid-template-columns: 70px 1fr;
		}

		.archive-project__copy {
			grid-column: 2;
		}

		.archive-project__meta {
			grid-row: 1 / 3;
		}

		.work-index__note {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 600px) {
		.work-index__hero {
			min-height: 750px;
		}

		.work-index__meta span:last-child {
			display: none;
		}

		.work-index h1 {
			font-size: clamp(72px, 24vw, 130px);
			line-height: 0.71;
		}

		.work-index h1 span:last-child {
			margin-left: 0;
			-webkit-text-stroke-width: 1px;
		}

		.work-index__intro {
			display: block;
		}

		.work-index__intro p {
			font-size: 12px;
		}

		.work-index__intro a {
			display: inline-block;
			margin-top: 25px;
		}

		.archive-project {
			display: block;
		}

		.archive-project__meta {
			flex-direction: row;
			justify-content: space-between;
			margin-bottom: 20px;
		}

		.archive-project__meta span:first-child {
			margin: 0;
		}

		.archive-project__copy {
			margin-top: 35px;
		}

		.archive-project__copy h2 {
			font-size: 62px;
		}

		.archive-project__copy p {
			margin-bottom: 30px;
		}

		.work-index__note > p {
			font-size: 56px;
		}
	}
</style>
