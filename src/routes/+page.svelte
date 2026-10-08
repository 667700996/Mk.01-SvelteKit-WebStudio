<script lang="ts">
	import { siteConfig } from '$lib/config/site';
	import EngineeringRecord from '$lib/components/home/EngineeringRecord.svelte';
	import SignalField from '$lib/components/home/SignalField.svelte';
	import LocalTime from '$lib/components/ui/LocalTime.svelte';
	import Plate, { type PlateKind } from '$lib/components/ui/Plate.svelte';
	import SectionHead from '$lib/components/ui/SectionHead.svelte';

	const projects: {
		index: string;
		title: string;
		slug: string;
		discipline: string;
		statement: string;
		metric: string;
		metricLabel: string;
		type: PlateKind;
	}[] = [
		{
			index: '01',
			title: 'Kinesis',
			slug: 'neon-metropolis',
			discipline: 'Spatial identity / WebGL / Generative motion',
			statement: 'A living identity that behaves less like a logo and more like a force of nature.',
			metric: '60 FPS',
			metricLabel: 'on-device motion',
			type: 'orbital'
		},
		{
			index: '02',
			title: 'Aether',
			slug: 'atlas-labs',
			discipline: 'Product narrative / Data / Interaction',
			statement: 'Invisible infrastructure translated into a precise, cinematic product experience.',
			metric: '1.1 s',
			metricLabel: 'largest paint',
			type: 'signal'
		},
		{
			index: '03',
			title: 'Mono/R',
			slug: 'flowstate',
			discipline: 'Product design / Adaptive motion / Prototyping',
			statement: 'An adaptive focus system where motion responds to human rhythm.',
			metric: '72',
			metricLabel: 'motion tokens',
			type: 'monolith'
		}
	];

	const disciplines = [
		{
			title: 'Direction',
			copy: 'Positioning, visual systems, and a singular idea strong enough to govern every decision.'
		},
		{
			title: 'Experience',
			copy: 'Narrative UX, interaction choreography, and motion with an editorial sense of timing.'
		},
		{
			title: 'Technology',
			copy: 'Svelte, shaders, WebGL, creative coding, and performant systems built for the real world.'
		},
		{
			title: 'Launch',
			copy: 'Production, accessibility, measurement, and the last ten percent that people remember.'
		}
	];

	const practice = ['Strategy', 'Interaction', 'WebGL', 'Motion', 'Systems'];

	// The hero's 12-column grid answers the pointer: the column underneath lights
	// up and reports its index. Mouse and pen only; one rect read per move.
	let columns = $state<HTMLElement>();
	let activeColumn = $state<number | null>(null);

	function trackColumn(event: PointerEvent) {
		if (event.pointerType === 'touch' || !columns) return;
		const spans = columns.children;
		activeColumn = null;
		for (let i = 0; i < spans.length; i++) {
			const rect = spans[i].getBoundingClientRect();
			if (rect.width && event.clientX >= rect.left && event.clientX < rect.right) {
				activeColumn = i;
				break;
			}
		}
	}
</script>

<!-- Hero ------------------------------------------------------------------>
<section
	class="hero"
	aria-labelledby="hero-title"
	onpointermove={trackColumn}
	onpointerleave={() => (activeColumn = null)}
>
	<div class="hero-columns wrap grid" aria-hidden="true" bind:this={columns}>
		{#each { length: 12 } as _, i}
			<span style:--i={i} class:active={activeColumn === i} data-col={String(i + 1).padStart(2, '0')}
			></span>
		{/each}
	</div>

	<div class="wrap hero-inner">
		<div class="grid hero-meta label">
			<p>Creative technologist × Product engineer</p>
			<p>Seoul / Global — 37.5665° N, 126.9780° E</p>
			<p>Portfolio / Selected systems</p>
		</div>

		<div class="hero-title">
			<p class="kicker">We make technology feel inevitable.</p>
			<h1 id="hero-title" class="display">
				<span class="line">Digital matter,</span>
				<span class="line">engineered<em>.</em></span>
			</h1>
		</div>

		<div class="grid hero-foot">
			<p class="lead">
				MK.01 is the practice of a design engineer building digital products, identities, and
				interactive systems where concept and code become one material.
			</p>
			<a class="cta" href="#work">
				Explore selected work <span class="arrow arrow--down" aria-hidden="true">↓</span>
			</a>
		</div>
	</div>
</section>

<!-- Manifesto ------------------------------------------------------------->
<section class="section wrap manifesto" aria-labelledby="manifesto-title">
	<div class="grid">
		<p class="label meta" data-reveal><span>00</span><span>Manifesto</span></p>
		<div class="statement">
			<h2 id="manifesto-title" class="h1" data-reveal>
				The screen is not a canvas. <span class="muted">It is a material.</span>
			</h2>
			<div class="support" data-reveal>
				<p class="lead">
					Strategy, interface, motion, and engineering are treated as one continuous practice. Every
					behavior earns its place; every frame has a job.
				</p>
				<p class="label">
					The work must earn attention,<br />reward curiosity, and survive reality.
				</p>
			</div>
		</div>
	</div>

	<ol class="practice" role="list" aria-label="Practice" data-reveal>
		{#each practice as item, index}
			<li><span class="label">0{index + 1}</span>{item}</li>
		{/each}
	</ol>
</section>

<!-- Selected work --------------------------------------------------------->
<section class="section wrap work" id="work" aria-labelledby="work-title">
	<SectionHead
		index="01—03"
		label="Selected work"
		title="Built to be felt, not scrolled past."
		intro="Three systems where concept, craft, and computation became inseparable."
		id="work-title"
	/>

	<ol class="projects" role="list">
		{#each projects as project (project.slug)}
			<li>
				<a class="project grid plate-host" href="/work/{project.slug}" data-reveal>
					<div class="project-plate">
						<Plate
							kind={project.type}
							index="MK / Case {project.index}"
							caption="Live system"
							name="plate-{project.slug}"
						/>
					</div>
					<div class="project-info">
						<p class="label project-meta">
							<span>{project.index}</span>
							<span>{project.discipline}</span>
						</p>
						<h3 class="h2" style:view-transition-name="title-{project.slug}">{project.title}</h3>
						<p class="secondary project-statement">{project.statement}</p>
						<p class="metric">
							<strong class="h3 tabular">{project.metric}</strong>
							<span class="label">{project.metricLabel}</span>
						</p>
						<span class="open">
							View case study <span class="arrow" aria-hidden="true">→</span>
						</span>
					</div>
				</a>
			</li>
		{/each}
	</ol>
</section>

<!-- Live experiment ------------------------------------------------------->
<section class="section wrap lab" id="lab" aria-labelledby="lab-title">
	<SectionHead
		index="04"
		label="Live experiment"
		title="Touch the signal field."
		intro="A real-time kinetic system. Move through the field and hold to reverse its polarity. No video. No illusion. Just the browser."
		id="lab-title"
	/>
	<div data-reveal>
		<SignalField />
		<div class="caption label">
			<span>Experiment 08 / Elastic topology</span>
			<span>Pointer, touch, keyboard, reduced-motion aware</span>
		</div>
	</div>
</section>

<EngineeringRecord />

<!-- Method ---------------------------------------------------------------->
<section class="section wrap method" id="method" aria-labelledby="method-title">
	<SectionHead
		index="06"
		label="One continuous practice"
		title="Thinking and making belong in the same room."
		id="method-title"
	/>

	<ol class="disciplines" role="list">
		{#each disciplines as discipline, index}
			<li data-reveal>
				<span class="label">0{index + 1}</span>
				<h3 class="h4">{discipline.title}</h3>
				<p class="secondary">{discipline.copy}</p>
			</li>
		{/each}
	</ol>

	<figure class="grid principle" data-reveal>
		<figcaption class="label">The Mk.01 principle</figcaption>
		<blockquote class="h1">
			<p>Use less technology.<br /><span class="muted">Make it matter more.</span></p>
		</blockquote>
	</figure>
</section>

<!-- Contact --------------------------------------------------------------->
<section class="contact" id="contact" aria-labelledby="contact-title">
	<div class="wrap">
		<div class="grid contact-meta label">
			<p>Building something that should feel inevitable?</p>
			<p>Open to exceptional teams and selected commissions / 2026</p>
		</div>
		<h2 id="contact-title" class="display contact-title">
			<a href="mailto:{siteConfig.contactEmail}?subject=New%20project%20with%20Mk.01">
				Make it matter.<span class="arrow arrow--diagonal" aria-hidden="true">↗</span>
			</a>
		</h2>
		<div class="contact-foot">
			<a class="link" href="mailto:{siteConfig.contactEmail}">{siteConfig.contactEmail}</a>
			<p class="label">Seoul <LocalTime /></p>
		</div>
	</div>
</section>

<style>
	/* Hero ----------------------------------------------------------------- */

	.hero {
		position: relative;
		min-height: calc(100svh - var(--nav-height));
		display: flex;
		overflow: hidden;
	}

	.hero-columns {
		position: absolute;
		inset: 0;
		left: 50%;
		translate: -50% 0;
		pointer-events: none;
	}

	.hero-columns span {
		border-left: var(--hairline) solid color-mix(in oklab, var(--line) 70%, transparent);
		transform-origin: top;
		animation: column-in 1.2s var(--ease-out) both;
		animation-delay: calc(var(--i) * 40ms);
		mask-image: linear-gradient(to bottom, #000 0%, transparent 92%);
	}

	.hero-columns span {
		position: relative;
		transition: background-color var(--duration-3) var(--ease-out);
	}

	.hero-columns span.active {
		background: color-mix(in oklab, var(--fg) 3.5%, transparent);
		transition-duration: var(--duration-1);
	}

	.hero-columns span::after {
		content: attr(data-col);
		position: absolute;
		top: var(--space-2);
		left: var(--space-2);
		color: var(--fg-3);
		font-family: var(--font-mono);
		font-size: 0.625rem;
		letter-spacing: var(--track-label);
		opacity: 0;
		transition: opacity var(--duration-2) var(--ease-out);
	}

	.hero-columns span.active::after {
		opacity: 1;
	}

	.hero-columns span:last-child {
		border-right: var(--hairline) solid color-mix(in oklab, var(--line) 70%, transparent);
	}

	.hero-title h1 {
		font-size: clamp(3.25rem, 0.9rem + 11.6vw, 13.5rem);
	}

	@keyframes column-in {
		from {
			transform: scaleY(0);
		}
	}

	.hero-inner {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		gap: var(--space-8);
		padding-block: var(--space-6) var(--space-7);
	}

	.hero-meta p {
		grid-column: span 4;
	}

	.hero-meta p:last-child {
		text-align: right;
	}

	.kicker {
		margin-bottom: var(--space-5);
		color: var(--fg-2);
		font-size: var(--text-lead);
		letter-spacing: -0.016em;
		animation: rise var(--duration-4) var(--ease-out) 0.25s both;
	}

	/* The headline is the LCP element: it paints at once, never animated in. */
	h1 .line {
		display: block;
	}

	h1 em {
		font-style: normal;
		color: var(--accent);
	}

	@keyframes rise {
		from {
			opacity: 0;
			transform: translateY(0.75rem);
		}
	}

	.hero-foot {
		align-items: end;
		row-gap: var(--space-5);
		padding-top: var(--space-5);
		border-top: var(--hairline) solid var(--line);
		animation: rise var(--duration-4) var(--ease-out) 0.4s both;
	}

	.hero-foot .lead {
		grid-column: 1 / span 6;
		max-width: 30em;
	}

	.cta {
		grid-column: 10 / -1;
		justify-self: end;
		font-weight: 520;
	}

	/* Manifesto ------------------------------------------------------------ */

	.meta {
		grid-column: 1 / span 3;
		display: flex;
		gap: var(--space-4);
		padding-top: 0.75em;
	}

	.statement {
		grid-column: 4 / -1;
	}

	.statement h2 {
		max-width: 14ch;
	}

	.support {
		display: grid;
		grid-template-columns: 2fr 1fr;
		gap: var(--gutter);
		align-items: end;
		margin-top: var(--space-8);
	}

	.practice {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		margin-top: var(--space-10);
		border-top: var(--hairline) solid var(--line);
		border-bottom: var(--hairline) solid var(--line);
	}

	.practice li {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		padding: var(--space-5) var(--space-4);
		font-size: var(--text-h4);
		font-weight: 560;
		letter-spacing: -0.02em;
	}

	.practice li:first-child {
		padding-left: 0;
	}

	.practice li + li {
		border-left: var(--hairline) solid var(--line);
	}

	/* Work ----------------------------------------------------------------- */

	.projects {
		display: flex;
		flex-direction: column;
		gap: var(--space-9);
	}

	.project {
		align-items: stretch;
		row-gap: var(--space-6);
	}

	.project-plate {
		grid-column: 1 / span 7;
	}

	.project-plate :global(.plate) {
		transition: transform var(--duration-4) var(--ease-out);
	}

	.project:hover .project-plate :global(.plate) {
		transform: scale(0.992);
	}

	.project-info {
		grid-column: 9 / -1;
		display: flex;
		flex-direction: column;
	}

	.project-meta {
		display: flex;
		gap: var(--space-4);
		padding-bottom: var(--space-5);
		margin-bottom: var(--space-6);
		border-bottom: var(--hairline) solid var(--line);
	}

	.project-statement {
		max-width: 24em;
		margin-top: var(--space-4);
		font-size: var(--text-lead);
		letter-spacing: -0.016em;
		line-height: 1.4;
	}

	.metric {
		display: flex;
		align-items: baseline;
		gap: var(--space-3);
		margin-top: auto;
		padding-top: var(--space-7);
	}

	.open {
		margin-top: var(--space-5);
		padding-top: var(--space-4);
		border-top: var(--hairline) solid var(--line);
		font-weight: 520;
	}

	.project:hover .open {
		color: var(--accent);
	}

	/* Lab ------------------------------------------------------------------ */

	.caption {
		display: flex;
		justify-content: space-between;
		gap: var(--space-4);
		margin-top: var(--space-4);
	}

	/* Method --------------------------------------------------------------- */

	.disciplines {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: var(--gutter);
	}

	.disciplines li {
		display: flex;
		flex-direction: column;
		gap: var(--space-3);
		padding-top: var(--space-5);
		border-top: var(--hairline) solid var(--fg);
	}

	.disciplines h3 {
		margin-top: var(--space-6);
	}

	.principle {
		margin-top: var(--section);
	}

	.principle figcaption {
		grid-column: 1 / span 3;
		padding-top: 0.75em;
	}

	.principle blockquote {
		grid-column: 4 / -1;
	}

	/* Contact -------------------------------------------------------------- */

	.contact {
		margin-top: var(--section);
		padding-block: var(--space-9) var(--space-8);
		border-top: var(--hairline) solid var(--line);
	}

	.contact-meta p:first-child {
		grid-column: 1 / span 6;
	}

	.contact-meta p:last-child {
		grid-column: 7 / -1;
		text-align: right;
	}

	.contact-title {
		margin-block: var(--space-8);
	}

	.contact-title a {
		display: inline-flex;
		align-items: flex-start;
		gap: 0.08em;
		transition: color var(--duration-3) var(--ease-out);
	}

	.contact-title a:hover {
		color: var(--accent);
	}

	.contact-title .arrow {
		font-size: 0.45em;
		font-weight: 400;
		margin-top: 0.12em;
	}

	.contact-foot {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: var(--space-4);
		font-size: var(--text-lead);
	}

	/* Responsive ----------------------------------------------------------- */

	@media (max-width: 63.99rem) {
		.hero-meta p {
			grid-column: span 6;
		}

		.hero-meta p:nth-child(2) {
			display: none;
		}

		.meta,
		.statement,
		.principle figcaption,
		.principle blockquote {
			grid-column: 1 / -1;
		}

		.statement {
			margin-top: var(--space-5);
		}

		.principle blockquote {
			margin-top: var(--space-5);
		}

		.project-plate,
		.project-info {
			grid-column: 1 / -1;
		}

		.metric {
			padding-top: var(--space-6);
		}

		.disciplines {
			grid-template-columns: repeat(2, 1fr);
			row-gap: var(--space-7);
		}
	}

	@media (max-width: 47.99rem) {
		.hero-columns {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}

		.hero-columns span:nth-child(n + 5) {
			display: none;
		}

		.hero-columns span:nth-child(4) {
			border-right: var(--hairline) solid color-mix(in oklab, var(--line) 70%, transparent);
		}

		.hero-meta p:first-child {
			grid-column: 1 / -1;
		}

		.hero-meta p:last-child {
			display: none;
		}

		.hero-foot .lead,
		.cta {
			grid-column: 1 / -1;
			justify-self: start;
		}

		.support {
			grid-template-columns: 1fr;
		}

		.practice {
			grid-template-columns: 1fr;
		}

		.practice li {
			flex-direction: row;
			align-items: baseline;
			padding: var(--space-4) 0;
		}

		.practice li + li {
			border-left: 0;
			border-top: var(--hairline) solid var(--line);
		}

		.disciplines {
			grid-template-columns: 1fr;
		}

		.disciplines h3 {
			margin-top: var(--space-2);
		}

		.caption {
			flex-direction: column;
			gap: var(--space-1);
		}

		.contact-meta p:first-child,
		.contact-meta p:last-child {
			grid-column: 1 / -1;
			text-align: left;
		}

		.contact-meta p:last-child {
			margin-top: var(--space-2);
		}

		.contact-foot {
			flex-direction: column;
		}
	}
</style>
