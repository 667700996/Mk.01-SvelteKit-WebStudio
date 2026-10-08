<script lang="ts">
	import { siteConfig } from '$lib/config/site';
	import SectionHead from '$lib/components/ui/SectionHead.svelte';
	import { pad } from '$lib/utils/format';

	const principles = [
		{
			title: 'Start with the feeling.',
			copy: 'The emotional target comes before the component tree. It becomes the filter for every visual and technical choice.'
		},
		{
			title: 'Prototype the unknown.',
			copy: 'The riskiest interaction is coded first. Real behavior reveals answers that a static frame never can.'
		},
		{
			title: 'Systems create freedom.',
			copy: 'Type, motion, spacing, and performance rules are constraints that let the expressive moments stay coherent.'
		},
		{
			title: 'Polish is a feature.',
			copy: 'Accessibility, edge cases, loading, and the final easing curve all shape how trustworthy an experience feels.'
		}
	];

	const range = [
		'Creative direction',
		'Interaction design',
		'Motion systems',
		'Svelte / TypeScript',
		'Three.js / GLSL',
		'Design systems',
		'Performance',
		'Prototyping'
	];
</script>

<header class="wrap hero">
	<div class="grid meta label">
		<p>Profile / MK.01</p>
		<p>Seoul, Republic of Korea</p>
	</div>
	<p class="kicker">Designer in the code. Engineer in the concept.</p>
	<h1 class="title">
		<span>I design the system</span>
		<span class="muted">and build the magic.</span>
	</h1>
	<div class="grid foot">
		<p class="lead">
			MK.01 is the working identity of a hybrid creative developer and designer focused on
			high-craft digital experiences.
		</p>
		<a class="jump" href="#profile">
			Read the profile <span class="arrow arrow--down" aria-hidden="true">↓</span>
		</a>
	</div>
</header>

<section class="wrap section grid profile" id="profile" aria-labelledby="profile-title">
	<figure class="mark" aria-hidden="true" data-reveal>
		<div class="glyphs">
			<span>M</span>
			<i>+</i>
			<span>K</span>
		</div>
		<figcaption class="label">One practice<br />Two disciplines</figcaption>
	</figure>

	<div class="copy">
		<p class="label" data-reveal>01 / Profile</p>
		<h2 class="h2" id="profile-title" data-reveal>
			Working where visual judgment and technical depth become the same skill.
		</h2>
		<div class="columns" data-reveal>
			<p class="secondary">
				I care about the exact moment an interface stops feeling assembled and starts feeling
				alive. That means thinking through hierarchy, language, motion, rendering, and runtime as
				one connected problem.
			</p>
			<p class="secondary">
				My best work happens inside ambitious, multidisciplinary teams—close enough to the strategy
				to challenge the premise, and close enough to the code to protect the final pixel.
			</p>
		</div>
	</div>
</section>

<section class="wrap section" aria-labelledby="range-title">
	<SectionHead index="02" label="Working range" title="Eight disciplines, one practice." id="range-title" />
	<ol class="range" role="list">
		{#each range as item, index}
			<li data-reveal>
				<span class="label">{pad(index + 1)}</span>
				<span class="h4">{item}</span>
			</li>
		{/each}
	</ol>
</section>

<section class="wrap section" aria-labelledby="principles-title">
	<SectionHead index="03" label="Principles" id="principles-title">
		{#snippet title()}High standards.<br /><span class="muted">Low ego.</span>{/snippet}
	</SectionHead>
	<ol class="principles" role="list">
		{#each principles as principle, index}
			<li data-reveal>
				<span class="label">{pad(index + 1)}</span>
				<h3 class="h3">{principle.title}</h3>
				<p class="secondary">{principle.copy}</p>
			</li>
		{/each}
	</ol>
</section>

<section class="wrap section grid ideal" aria-labelledby="ideal-title">
	<p class="label marker"><span>04</span><span>The next room</span></p>
	<div class="ideal-body">
		<h2 class="h2" id="ideal-title" data-reveal>
			I am interested in teams where craft is not decoration—it is how the product thinks.
		</h2>
		<p class="lead" data-reveal>
			Brand, product, spatial computing, interactive storytelling, and the strange territory
			between them.
		</p>
	</div>
</section>

<section class="wrap section" aria-labelledby="talk-title">
	<div class="talk">
		<div class="now">
			<p class="label"><span class="dot" aria-hidden="true"></span>Currently</p>
			<p class="lead">Open to select creative technology and product design conversations.</p>
		</div>
		<h2 class="display" id="talk-title">
			<a href="mailto:{siteConfig.contactEmail}?subject=Let%27s%20talk">
				Let’s talk.<span class="arrow arrow--diagonal" aria-hidden="true">↗</span>
			</a>
		</h2>
	</div>
</section>

<style>
	/* Hero ----------------------------------------------------------------- */

	.hero {
		padding-block: var(--space-6) var(--space-6);
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

	.title {
		margin-top: var(--space-4);
		font-size: clamp(3rem, 1rem + 7.4vw, 8.75rem);
		font-weight: 630;
		letter-spacing: var(--track-display);
		line-height: 0.95;
	}

	.title span {
		display: block;
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

	/* Profile -------------------------------------------------------------- */

	.profile {
		row-gap: var(--space-7);
		align-items: start;
	}

	.mark {
		grid-column: 1 / span 4;
		position: relative;
		aspect-ratio: 1;
		border-radius: var(--radius-l);
		background: var(--bg-raised);
		display: grid;
		place-items: center;
	}

	.glyphs {
		display: flex;
		align-items: center;
		gap: 0.06em;
		font-size: clamp(4rem, 2rem + 6vw, 9rem);
		font-weight: 650;
		letter-spacing: -0.06em;
		line-height: 1;
	}

	.glyphs i {
		color: var(--accent);
		font-style: normal;
		font-weight: 300;
		font-size: 0.5em;
	}

	.mark figcaption {
		position: absolute;
		left: var(--space-5);
		bottom: var(--space-4);
	}

	.copy {
		grid-column: 6 / -1;
	}

	.copy h2 {
		max-width: 18ch;
		margin-top: var(--space-5);
	}

	.columns {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--gutter);
		margin-top: var(--space-7);
	}

	/* Range ---------------------------------------------------------------- */

	.range {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		border-top: var(--hairline) solid var(--fg);
	}

	.range li {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
		padding: var(--space-5) var(--space-4) var(--space-6) 0;
		border-bottom: var(--hairline) solid var(--line);
	}

	.range .h4 {
		font-weight: 560;
	}

	/* Principles ----------------------------------------------------------- */

	.principles {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: var(--space-8) var(--gutter);
	}

	.principles li {
		display: flex;
		flex-direction: column;
		gap: var(--space-4);
		padding-top: var(--space-5);
		border-top: var(--hairline) solid var(--line);
	}

	.principles h3 {
		margin-top: var(--space-4);
	}

	.principles p {
		max-width: 30em;
	}

	/* Ideal ---------------------------------------------------------------- */

	.ideal {
		row-gap: var(--space-5);
	}

	.marker {
		grid-column: 1 / span 3;
		display: flex;
		gap: var(--space-4);
		padding-top: 0.6em;
	}

	.ideal-body {
		grid-column: 4 / -1;
	}

	.ideal-body h2 {
		max-width: 20ch;
	}

	.ideal-body .lead {
		max-width: 30em;
		margin-top: var(--space-6);
	}

	/* Talk ----------------------------------------------------------------- */

	.talk {
		padding-top: var(--space-6);
		border-top: var(--hairline) solid var(--fg);
	}

	.now {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: baseline;
		gap: var(--space-4);
	}

	.now .label {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
	}

	.dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--accent);
	}

	.talk h2 {
		margin-top: var(--space-8);
	}

	.talk a {
		transition: color var(--duration-3) var(--ease-out);
	}

	.talk a:hover {
		color: var(--accent);
	}

	.talk .arrow {
		font-size: 0.45em;
		font-weight: 400;
		vertical-align: 0.9em;
		margin-left: 0.1em;
	}

	@media (max-width: 63.99rem) {
		.mark {
			grid-column: 1 / span 6;
		}

		.copy,
		.marker,
		.ideal-body {
			grid-column: 1 / -1;
		}

		.range {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 47.99rem) {
		.meta p:last-child {
			display: none;
		}

		.meta p:first-child,
		.foot .lead,
		.jump {
			grid-column: 1 / -1;
			justify-self: start;
		}

		.mark {
			grid-column: 1 / -1;
		}

		.columns,
		.principles {
			grid-template-columns: 1fr;
		}

		.range {
			grid-template-columns: 1fr;
		}

		.range li {
			flex-direction: row;
			align-items: baseline;
			gap: var(--space-4);
			padding-block: var(--space-4);
		}
	}
</style>
