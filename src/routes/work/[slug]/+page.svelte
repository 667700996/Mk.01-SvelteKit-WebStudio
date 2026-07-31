<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import '../../../styles/home.css';

	export let data: PageData;

	const presentation: Record<
		string,
		{ type: string; eyebrow: string; thesis: string; role: string; duration: string }
	> = {
		'neon-metropolis': {
			type: 'orbital',
			eyebrow: 'A living spatial identity',
			thesis:
				'What if a brand did not have a fixed form—only a recognisable way of behaving?',
			role: 'Creative direction, interaction, WebGL',
			duration: '7 weeks'
		},
		'atlas-labs': {
			type: 'signal',
			eyebrow: 'Making infrastructure visible',
			thesis:
				'How do you make a complex technical system feel precise before the first word is read?',
			role: 'Product narrative, systems, frontend',
			duration: '9 weeks'
		},
		flowstate: {
			type: 'monolith',
			eyebrow: 'An interface with a pulse',
			thesis:
				'Can motion respond to a human rhythm without becoming distracting or decorative?',
			role: 'Product design, motion, prototyping',
			duration: '8 weeks'
		}
	};

	const project = data.project;
	const content = project.content;
	const view = presentation[project.slug] ?? presentation['neon-metropolis'];
	const kpis = content.kpis ?? [];
	const nextProject = data.related[0];

	let ready = false;

	onMount(() => {
		ready = true;
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('is-visible');
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
		);
		document.querySelectorAll('[data-case-reveal]').forEach((element) => observer.observe(element));
		return () => observer.disconnect();
	});
</script>

<article class:ready class="case">
	<header class="case-hero">
		<div class="case-hero__top">
			<a href="/work">← All systems</a>
			<span>Case study / {project.year}</span>
			<span>{project.industry}</span>
		</div>
		<div class="case-hero__title">
			<p>{view.eyebrow}</p>
			<h1>{project.title}</h1>
		</div>
		<div class="case-hero__bottom">
			<p>{project.summary}</p>
			<div>
				<span>Scroll to deconstruct</span>
				<i>↓</i>
			</div>
		</div>
	</header>

	<section class="case-art" aria-label="{project.title} visual system">
		<div class="project-art project-art--{view.type} active" aria-hidden="true">
			{#if view.type === 'orbital'}
				<div class="orbital__core"></div>
				<div class="orbital__ring orbital__ring--a"></div>
				<div class="orbital__ring orbital__ring--b"></div>
				<div class="orbital__ring orbital__ring--c"></div>
			{:else if view.type === 'signal'}
				<div class="signal__beam"></div>
				<div class="signal__disc"></div>
				<div class="signal__grid"></div>
			{:else}
				<div class="monolith__block monolith__block--a"></div>
				<div class="monolith__block monolith__block--b"></div>
				<div class="monolith__type">R</div>
			{/if}
			<div class="project-art__label">
				<span>MK.01 / {project.slug}</span>
				<span>GENERATIVE SYSTEM</span>
			</div>
		</div>
	</section>

	<section class="case-overview" data-case-reveal>
		<div class="case-section-label">
			<span>( 01 )</span>
			<span>The premise</span>
		</div>
		<div class="case-overview__body">
			<h2>{view.thesis}</h2>
			<div class="case-overview__meta">
				<div>
					<span>Role</span>
					<p>{view.role}</p>
				</div>
				<div>
					<span>Duration</span>
					<p>{view.duration}</p>
				</div>
				<div>
					<span>Core stack</span>
					<p>{project.tags.join(' / ')}</p>
				</div>
			</div>
		</div>
	</section>

	<section class="case-challenge" data-case-reveal>
		<div class="case-section-label">
			<span>( 02 )</span>
			<span>Signal before surface</span>
		</div>
		<div>
			<p class="case-challenge__lead">{content.hero.headline}</p>
			<p class="case-challenge__copy">{content.hero.subheadline}</p>
		</div>
	</section>

	<section class="case-metrics" aria-label="Project outcomes">
		{#each kpis as kpi, index}
			<article data-case-reveal>
				<span>0{index + 1}</span>
				<strong>{kpi.value}</strong>
				<p>{kpi.label} {kpi.description ?? ''}</p>
			</article>
		{/each}
	</section>

	<section class="case-process">
		<header data-case-reveal>
			<div class="case-section-label">
				<span>( 03—05 )</span>
				<span>From intent to system</span>
			</div>
			<h2>Three moves.<br />One coherent idea.</h2>
		</header>

		<div class="case-process__chapters">
			{#each content.chapters as chapter, index}
				<article data-case-reveal>
					<div class="case-process__index">
						<span>0{index + 1}</span>
						<i></i>
					</div>
					<div>
						<p>{chapter.id}</p>
						<h3>{chapter.title}</h3>
					</div>
					<p>{chapter.description}</p>
				</article>
			{/each}
		</div>
	</section>

	<section class="case-system" data-case-reveal>
		<div class="case-system__grid" aria-hidden="true">
			{#each Array(48) as _, index}
				<i style:opacity={(index % 7) / 8 + 0.12}></i>
			{/each}
		</div>
		<div class="case-system__copy">
			<p>Built as a system, not a scene.</p>
			<h2>Every expressive choice has a quieter technical decision beneath it.</h2>
		</div>
		<div class="case-system__spec">
			<div><span>01</span><p>Progressive enhancement before spectacle.</p></div>
			<div><span>02</span><p>Motion tokens shared across code and design.</p></div>
			<div><span>03</span><p>Adaptive quality for real devices, not demo machines.</p></div>
			<div><span>04</span><p>Reduced-motion behavior designed from the start.</p></div>
		</div>
	</section>

	<section class="case-outcomes" data-case-reveal>
		<div class="case-section-label">
			<span>( 06 )</span>
			<span>What moved</span>
		</div>
		<div class="case-outcomes__list">
			{#each content.outcomes as outcome, index}
				<p><span>0{index + 1}</span>{outcome}</p>
			{/each}
		</div>
	</section>

	{#if nextProject}
		<a class="case-next" href="/work/{nextProject.slug}">
			<span>Next system</span>
			<strong>{nextProject.title}</strong>
			<i>↗</i>
		</a>
	{/if}
</article>

<style>
	.case {
		--gutter: clamp(18px, 3vw, 50px);
		overflow: clip;
		background: #080907;
		color: #f0f0e8;
	}

	[data-case-reveal] {
		opacity: 0;
		transform: translateY(46px);
		transition:
			opacity 1s cubic-bezier(0.16, 1, 0.3, 1),
			transform 1s cubic-bezier(0.16, 1, 0.3, 1);
	}

	[data-case-reveal].is-visible {
		opacity: 1;
		transform: none;
	}

	.case-hero {
		display: flex;
		min-height: max(720px, 100svh);
		flex-direction: column;
		justify-content: flex-end;
		padding: 94px var(--gutter) 28px;
		background:
			linear-gradient(to right, rgba(240, 240, 232, 0.045) 1px, transparent 1px),
			#080907;
		background-size: calc((100vw - var(--gutter) * 2) / 12) 100%;
	}

	.case-hero__top {
		position: absolute;
		inset: 92px var(--gutter) auto;
		display: grid;
		grid-template-columns: 1fr 1fr auto;
		gap: 30px;
		font-family: 'JetBrains Mono', monospace;
		font-size: 8px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.case-hero__top a {
		width: fit-content;
		color: #f0f0e8;
	}

	.case-hero__top span {
		color: rgba(240, 240, 232, 0.42);
	}

	.case-hero__title p {
		margin: 0 0 24px 0.5vw;
		color: #d7ff55;
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		opacity: 0;
		transform: translateY(20px);
		transition: 0.8s 0.1s ease;
	}

	.case-hero h1 {
		margin: 0;
		color: #f0f0e8;
		font-family: 'Syne', sans-serif;
		font-size: clamp(126px, 23.5vw, 400px);
		font-weight: 600;
		letter-spacing: -0.11em;
		line-height: 0.62;
		text-transform: uppercase;
		opacity: 0;
		transform: translateY(0.3em);
		transition: 1.1s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.ready .case-hero h1,
	.ready .case-hero__title p {
		opacity: 1;
		transform: none;
	}

	.case-hero__bottom {
		display: grid;
		grid-template-columns: minmax(280px, 0.7fr) 1fr auto;
		gap: 40px;
		align-items: end;
		margin-top: clamp(80px, 10vh, 120px);
		border-top: 1px solid rgba(240, 240, 232, 0.15);
		padding-top: 18px;
	}

	.case-hero__bottom > p {
		max-width: 460px;
		margin: 0;
		color: rgba(240, 240, 232, 0.62);
		font-size: 14px;
		line-height: 1.55;
	}

	.case-hero__bottom > div {
		grid-column: 3;
		display: flex;
		align-items: center;
		gap: 18px;
		font-family: 'JetBrains Mono', monospace;
		font-size: 8px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.case-hero__bottom i {
		color: #d7ff55;
		font-size: 16px;
		font-style: normal;
	}

	.case-art {
		position: relative;
		height: min(86vw, 1040px);
		min-height: 560px;
		margin: 0 var(--gutter);
		overflow: hidden;
		background: #090a08;
	}

	.case-art .project-art {
		inset: 0;
	}

	.case-art .orbital__core {
		width: 19%;
	}

	.case-art .project-art__label {
		font-size: 9px;
	}

	.case-section-label {
		display: grid;
		grid-template-columns: minmax(120px, 0.45fr) 1fr;
		gap: 24px;
		color: rgba(240, 240, 232, 0.42);
		font-family: 'JetBrains Mono', monospace;
		font-size: 8px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.case-overview {
		padding: clamp(130px, 18vw, 280px) var(--gutter);
	}

	.case-overview__body {
		display: grid;
		grid-template-columns: minmax(0, 1.5fr) minmax(260px, 0.5fr);
		gap: clamp(70px, 10vw, 180px);
		margin-top: clamp(80px, 10vw, 150px);
	}

	.case-overview h2 {
		max-width: 1100px;
		margin: 0;
		font-family: 'Syne', sans-serif;
		font-size: clamp(56px, 8vw, 138px);
		font-weight: 500;
		letter-spacing: -0.075em;
		line-height: 0.91;
	}

	.case-overview__meta {
		align-self: end;
	}

	.case-overview__meta > div {
		border-top: 1px solid rgba(240, 240, 232, 0.15);
		padding: 16px 0 25px;
	}

	.case-overview__meta span {
		color: rgba(240, 240, 232, 0.38);
		font-family: 'JetBrains Mono', monospace;
		font-size: 8px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.case-overview__meta p {
		margin: 9px 0 0;
		color: rgba(240, 240, 232, 0.76);
		font-size: 13px;
		line-height: 1.5;
	}

	.case-challenge {
		display: grid;
		grid-template-columns: minmax(240px, 0.45fr) 1.55fr;
		gap: 50px;
		padding: clamp(100px, 14vw, 220px) var(--gutter);
		background: #f0f0e8;
		color: #080907;
	}

	.case-challenge .case-section-label {
		color: rgba(8, 9, 7, 0.45);
	}

	.case-challenge__lead {
		max-width: 1100px;
		margin: 0 0 70px;
		font-family: 'Syne', sans-serif;
		font-size: clamp(54px, 7.2vw, 124px);
		font-weight: 500;
		letter-spacing: -0.07em;
		line-height: 0.91;
	}

	.case-challenge__copy {
		max-width: 630px;
		margin: 0 0 0 auto;
		color: rgba(8, 9, 7, 0.58);
		font-size: clamp(16px, 1.5vw, 22px);
		line-height: 1.55;
	}

	.case-metrics {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		background: #d7ff55;
		color: #080907;
	}

	.case-metrics article {
		min-height: 420px;
		border-right: 1px solid rgba(8, 9, 7, 0.26);
		padding: 30px var(--gutter);
	}

	.case-metrics article:last-child {
		border-right: none;
	}

	.case-metrics article > span {
		font-family: 'JetBrains Mono', monospace;
		font-size: 8px;
	}

	.case-metrics strong {
		display: block;
		margin-top: 130px;
		font-family: 'Syne', sans-serif;
		font-size: clamp(50px, 6vw, 104px);
		font-weight: 600;
		letter-spacing: -0.07em;
		line-height: 0.85;
	}

	.case-metrics p {
		margin: 18px 0 0;
		font-family: 'JetBrains Mono', monospace;
		font-size: 8px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.case-process {
		padding: clamp(130px, 18vw, 280px) var(--gutter);
		background: #080907;
	}

	.case-process > header {
		display: grid;
		grid-template-columns: minmax(240px, 0.45fr) 1.55fr;
		gap: 50px;
		margin-bottom: clamp(100px, 14vw, 200px);
	}

	.case-process h2 {
		margin: 0;
		font-family: 'Syne', sans-serif;
		font-size: clamp(62px, 9vw, 152px);
		font-weight: 500;
		letter-spacing: -0.08em;
		line-height: 0.84;
	}

	.case-process__chapters {
		border-top: 1px solid rgba(240, 240, 232, 0.16);
	}

	.case-process__chapters article {
		display: grid;
		grid-template-columns: minmax(100px, 0.2fr) 0.72fr minmax(300px, 0.6fr);
		gap: 40px;
		align-items: start;
		border-bottom: 1px solid rgba(240, 240, 232, 0.16);
		padding: clamp(50px, 6vw, 90px) 0;
	}

	.case-process__index {
		display: flex;
		align-items: center;
		gap: 16px;
		color: #d7ff55;
		font-family: 'JetBrains Mono', monospace;
		font-size: 8px;
	}

	.case-process__index i {
		width: 40px;
		height: 1px;
		background: rgba(215, 255, 85, 0.4);
	}

	.case-process__chapters article > div:nth-child(2) p {
		margin: 0 0 18px;
		color: rgba(240, 240, 232, 0.35);
		font-family: 'JetBrains Mono', monospace;
		font-size: 8px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.case-process h3 {
		margin: 0;
		font-family: 'Syne', sans-serif;
		font-size: clamp(34px, 4vw, 66px);
		font-weight: 500;
		letter-spacing: -0.06em;
		line-height: 0.95;
	}

	.case-process__chapters article > p {
		max-width: 500px;
		margin: 0;
		color: rgba(240, 240, 232, 0.55);
		font-size: 14px;
		line-height: 1.65;
	}

	.case-system {
		position: relative;
		display: grid;
		grid-template-columns: 1.15fr 0.85fr;
		gap: 70px;
		min-height: 900px;
		padding: clamp(100px, 13vw, 200px) var(--gutter);
		background: #11120f;
	}

	.case-system__grid {
		position: absolute;
		inset: 0;
		display: grid;
		grid-template-columns: repeat(8, 1fr);
		grid-template-rows: repeat(6, 1fr);
		opacity: 0.18;
		pointer-events: none;
	}

	.case-system__grid i {
		border-right: 1px solid #d7ff55;
		border-bottom: 1px solid #d7ff55;
	}

	.case-system__copy {
		position: relative;
		z-index: 1;
	}

	.case-system__copy > p {
		color: #d7ff55;
		font-family: 'JetBrains Mono', monospace;
		font-size: 8px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.case-system__copy h2 {
		max-width: 900px;
		margin: 70px 0 0;
		font-family: 'Syne', sans-serif;
		font-size: clamp(50px, 6.4vw, 110px);
		font-weight: 500;
		letter-spacing: -0.07em;
		line-height: 0.9;
	}

	.case-system__spec {
		position: relative;
		z-index: 1;
		align-self: end;
	}

	.case-system__spec > div {
		display: grid;
		grid-template-columns: 40px 1fr;
		gap: 20px;
		border-top: 1px solid rgba(240, 240, 232, 0.19);
		padding: 20px 0 28px;
	}

	.case-system__spec span {
		color: #d7ff55;
		font-family: 'JetBrains Mono', monospace;
		font-size: 8px;
	}

	.case-system__spec p {
		margin: 0;
		color: rgba(240, 240, 232, 0.7);
		font-size: 13px;
		line-height: 1.5;
	}

	.case-outcomes {
		display: grid;
		grid-template-columns: minmax(240px, 0.45fr) 1.55fr;
		gap: 50px;
		padding: clamp(130px, 17vw, 260px) var(--gutter);
	}

	.case-outcomes__list {
		border-top: 1px solid rgba(240, 240, 232, 0.16);
	}

	.case-outcomes__list p {
		display: grid;
		grid-template-columns: 55px 1fr;
		gap: 24px;
		margin: 0;
		border-bottom: 1px solid rgba(240, 240, 232, 0.16);
		padding: 34px 0;
		font-family: 'Syne', sans-serif;
		font-size: clamp(24px, 3vw, 49px);
		letter-spacing: -0.045em;
		line-height: 1.15;
	}

	.case-outcomes__list span {
		padding-top: 7px;
		color: #d7ff55;
		font-family: 'JetBrains Mono', monospace;
		font-size: 8px;
		letter-spacing: 0;
	}

	.case-next {
		position: relative;
		display: block;
		overflow: hidden;
		padding: clamp(100px, 14vw, 210px) var(--gutter) 50px;
		background: #d7ff55;
		color: #080907;
	}

	.case-next > span {
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.case-next strong {
		display: block;
		margin-top: 70px;
		font-family: 'Syne', sans-serif;
		font-size: clamp(100px, 22vw, 360px);
		font-weight: 600;
		letter-spacing: -0.1em;
		line-height: 0.64;
		text-transform: uppercase;
	}

	.case-next i {
		position: absolute;
		right: var(--gutter);
		bottom: 45px;
		font-size: clamp(45px, 7vw, 100px);
		font-style: normal;
		transition: transform 400ms cubic-bezier(0.16, 1, 0.3, 1);
	}

	.case-next:hover i {
		transform: rotate(45deg);
	}

	@media (max-width: 820px) {
		.case-overview__body,
		.case-challenge,
		.case-process > header,
		.case-system,
		.case-outcomes {
			grid-template-columns: 1fr;
		}

		.case-overview__meta {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			gap: 20px;
		}

		.case-process__chapters article {
			grid-template-columns: 60px 1fr;
		}

		.case-process__chapters article > p {
			grid-column: 2;
		}

		.case-system {
			min-height: auto;
		}

		.case-system__spec {
			margin-top: 100px;
		}
	}

	@media (max-width: 600px) {
		.case-hero {
			min-height: 720px;
		}

		.case-hero__top {
			grid-template-columns: 1fr auto;
		}

		.case-hero__top span:last-child {
			display: none;
		}

		.case-hero h1 {
			font-size: clamp(104px, 32vw, 180px);
			line-height: 0.68;
		}

		.case-hero__bottom {
			display: block;
		}

		.case-hero__bottom > p {
			font-size: 12px;
		}

		.case-hero__bottom > div {
			margin-top: 24px;
		}

		.case-art {
			height: 72svh;
			min-height: 490px;
		}

		.case-overview h2,
		.case-challenge__lead {
			font-size: 50px;
		}

		.case-overview__meta {
			grid-template-columns: 1fr;
		}

		.case-metrics {
			grid-template-columns: 1fr;
		}

		.case-metrics article {
			min-height: 270px;
			border-right: none;
			border-bottom: 1px solid rgba(8, 9, 7, 0.26);
		}

		.case-metrics strong {
			margin-top: 70px;
		}

		.case-process h2 {
			font-size: 58px;
		}

		.case-process__chapters article {
			display: block;
		}

		.case-process__index {
			margin-bottom: 30px;
		}

		.case-process__chapters article > p {
			margin-top: 32px;
		}

		.case-system__copy h2 {
			font-size: 48px;
		}

		.case-outcomes__list p {
			grid-template-columns: 34px 1fr;
			font-size: 24px;
		}

		.case-next strong {
			font-size: 96px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		[data-case-reveal] {
			opacity: 1;
			transform: none;
		}
	}
</style>
