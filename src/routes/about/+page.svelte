<script lang="ts">
	import { onMount } from 'svelte';
	import '../../styles/home.css';

	const principles = [
		{
			number: '01',
			title: 'Start with the feeling.',
			copy: 'The emotional target comes before the component tree. It becomes the filter for every visual and technical choice.'
		},
		{
			number: '02',
			title: 'Prototype the unknown.',
			copy: 'The riskiest interaction is coded first. Real behavior reveals answers that a static frame never can.'
		},
		{
			number: '03',
			title: 'Systems create freedom.',
			copy: 'Type, motion, spacing, and performance rules are constraints that let the expressive moments stay coherent.'
		},
		{
			number: '04',
			title: 'Polish is a feature.',
			copy: 'Accessibility, edge cases, loading, and the final easing curve all shape how trustworthy an experience feels.'
		}
	];

	const stack = [
		'Creative direction',
		'Interaction design',
		'Motion systems',
		'Svelte / TypeScript',
		'Three.js / GLSL',
		'Design systems',
		'Performance',
		'Prototyping'
	];

	let ready = false;

	onMount(() => {
		ready = true;
	});
</script>

<article class:ready class="about">
	<header class="about-hero">
		<div class="about-hero__meta">
			<span>Profile / MK.01</span>
			<span>Seoul, Republic of Korea</span>
		</div>
		<p>Designer in the code. Engineer in the concept.</p>
		<h1>
			<span>I design</span>
			<span>the system</span>
			<span>and build</span>
			<span>the magic.</span>
		</h1>
		<div class="about-hero__footer">
			<p>
				MK.01 is the working identity of a hybrid creative developer and designer focused on
				high-craft digital experiences.
			</p>
			<a href="#profile">Read the profile ↓</a>
		</div>
	</header>

	<section class="about-profile" id="profile">
		<div class="about-profile__mark" aria-hidden="true">
			<span>M</span>
			<i>+</i>
			<span>K</span>
			<small>ONE PRACTICE<br />TWO DISCIPLINES</small>
		</div>
		<div class="about-profile__copy">
			<p class="about-label">( 01 ) / Profile</p>
			<h2>Working where visual judgment and technical depth become the same skill.</h2>
			<div>
				<p>
					I care about the exact moment an interface stops feeling assembled and starts feeling
					alive. That means thinking through hierarchy, language, motion, rendering, and runtime as
					one connected problem.
				</p>
				<p>
					My best work happens inside ambitious, multidisciplinary teams—close enough to the
					strategy to challenge the premise, and close enough to the code to protect the final
					pixel.
				</p>
			</div>
		</div>
	</section>

	<section class="about-stack">
		<div class="about-label">( 02 ) / Working range</div>
		<div class="about-stack__list">
			{#each stack as item, index}
				<div>
					<span>0{index + 1}</span>
					<p>{item}</p>
					<i>↗</i>
				</div>
			{/each}
		</div>
	</section>

	<section class="about-principles">
		<header>
			<p class="about-label">( 03 ) / Principles</p>
			<h2>High standards.<br />Low ego.</h2>
		</header>
		<div class="about-principles__grid">
			{#each principles as principle}
				<article>
					<span>{principle.number}</span>
					<h3>{principle.title}</h3>
					<p>{principle.copy}</p>
				</article>
			{/each}
		</div>
	</section>

	<section class="about-ideal">
		<div class="about-label">( 04 ) / The next room</div>
		<div>
			<h2>I am interested in teams where craft is not decoration—it is how the product thinks.</h2>
			<p>
				Brand, product, spatial computing, interactive storytelling, and the strange territory
				between them.
			</p>
		</div>
	</section>

	<section class="about-contact">
		<div>
			<span>Currently</span>
			<p>Open to select creative technology and product design conversations.</p>
		</div>
		<a href="mailto:studio@mk1.dev?subject=Let%27s%20talk">
			<span>Let’s talk</span>
			<i>↗</i>
		</a>
	</section>
</article>

<style>
	.about {
		--gutter: clamp(18px, 3vw, 50px);
		overflow: clip;
		background: #080907;
		color: #f0f0e8;
	}

	.about-label {
		color: rgba(240, 240, 232, 0.4);
		font-family: 'JetBrains Mono', monospace;
		font-size: 8px !important;
		letter-spacing: 0.11em;
		text-transform: uppercase;
	}

	.about-hero {
		display: flex;
		min-height: max(780px, 100svh);
		flex-direction: column;
		justify-content: flex-end;
		padding: 110px var(--gutter) 30px;
		background:
			radial-gradient(circle at 75% 28%, rgba(215, 255, 85, 0.1), transparent 25%),
			linear-gradient(to right, rgba(240, 240, 232, 0.045) 1px, transparent 1px),
			#080907;
		background-size: auto, calc((100vw - var(--gutter) * 2) / 12) 100%, auto;
	}

	.about-hero__meta {
		position: absolute;
		inset: 92px var(--gutter) auto;
		display: flex;
		justify-content: space-between;
		color: rgba(240, 240, 232, 0.42);
		font-family: 'JetBrains Mono', monospace;
		font-size: 8px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.about-hero > p {
		margin: 0 0 25px 0.5vw;
		color: #d7ff55;
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.about-hero h1 {
		margin: 0;
		font-family: 'Syne', sans-serif;
		font-size: clamp(72px, 11.8vw, 202px);
		font-weight: 600;
		letter-spacing: -0.09em;
		line-height: 0.69;
		text-transform: uppercase;
	}

	.about-hero h1 span {
		display: block;
		width: fit-content;
		opacity: 0;
		transform: translateY(0.3em);
		transition: 1s cubic-bezier(0.16, 1, 0.3, 1);
	}

	.about-hero h1 span:nth-child(2) {
		margin-left: 0.18em;
		color: transparent;
		-webkit-text-stroke: 1.5px #f0f0e8;
		transition-delay: 60ms;
	}

	.about-hero h1 span:nth-child(3) {
		margin-left: 0.04em;
		transition-delay: 120ms;
	}

	.about-hero h1 span:nth-child(4) {
		margin-left: 0.33em;
		color: #d7ff55;
		transition-delay: 180ms;
	}

	.ready .about-hero h1 span {
		opacity: 1;
		transform: none;
	}

	.about-hero__footer {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		margin-top: 70px;
		border-top: 1px solid rgba(240, 240, 232, 0.15);
		padding-top: 18px;
	}

	.about-hero__footer p {
		max-width: 450px;
		margin: 0;
		color: rgba(240, 240, 232, 0.6);
		font-size: 13px;
		line-height: 1.6;
	}

	.about-hero__footer a {
		border-bottom: 1px solid rgba(240, 240, 232, 0.35);
		padding-bottom: 7px;
		color: #f0f0e8;
		font-family: 'JetBrains Mono', monospace;
		font-size: 8px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.about-profile {
		display: grid;
		grid-template-columns: 0.85fr 1.15fr;
		min-height: 100svh;
		background: #f0f0e8;
		color: #080907;
	}

	.about-profile__mark {
		position: relative;
		display: grid;
		min-height: 800px;
		place-items: center;
		overflow: hidden;
		background: #d7ff55;
		font-family: 'Syne', sans-serif;
	}

	.about-profile__mark > span {
		position: absolute;
		font-size: min(48vw, 690px);
		font-weight: 700;
		letter-spacing: -0.17em;
		line-height: 0.7;
	}

	.about-profile__mark > span:first-child {
		top: 4%;
		left: -9%;
	}

	.about-profile__mark > span:nth-of-type(2) {
		right: -5%;
		bottom: 3%;
	}

	.about-profile__mark > i {
		z-index: 1;
		display: grid;
		width: 90px;
		height: 90px;
		place-items: center;
		border: 1px solid #080907;
		border-radius: 50%;
		font-family: 'JetBrains Mono', monospace;
		font-size: 28px;
		font-style: normal;
	}

	.about-profile__mark small {
		position: absolute;
		right: 24px;
		bottom: 20px;
		font-family: 'JetBrains Mono', monospace;
		font-size: 8px;
		letter-spacing: 0.1em;
		line-height: 1.5;
		text-align: right;
	}

	.about-profile__copy {
		align-self: center;
		padding: clamp(70px, 9vw, 150px) var(--gutter);
	}

	.about-profile__copy h2 {
		max-width: 950px;
		margin: 70px 0 100px;
		color: #080907;
		font-family: 'Syne', sans-serif;
		font-size: clamp(50px, 6vw, 102px);
		font-weight: 500;
		letter-spacing: -0.07em;
		line-height: 0.91;
	}

	.about-profile__copy > div {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 40px;
	}

	.about-profile__copy > div p {
		margin: 0;
		color: rgba(8, 9, 7, 0.62);
		font-size: 14px;
		line-height: 1.65;
	}

	.about-stack {
		display: grid;
		grid-template-columns: minmax(240px, 0.45fr) 1.55fr;
		gap: 50px;
		padding: clamp(120px, 16vw, 250px) var(--gutter);
	}

	.about-stack__list {
		border-top: 1px solid rgba(240, 240, 232, 0.16);
	}

	.about-stack__list > div {
		display: grid;
		grid-template-columns: 45px 1fr auto;
		gap: 22px;
		align-items: center;
		border-bottom: 1px solid rgba(240, 240, 232, 0.16);
		padding: 22px 0;
	}

	.about-stack__list span {
		color: #d7ff55;
		font-family: 'JetBrains Mono', monospace;
		font-size: 8px;
	}

	.about-stack__list p {
		margin: 0;
		font-family: 'Syne', sans-serif;
		font-size: clamp(27px, 3.5vw, 56px);
		letter-spacing: -0.055em;
	}

	.about-stack__list i {
		color: rgba(240, 240, 232, 0.35);
		font-style: normal;
	}

	.about-principles {
		padding: clamp(110px, 15vw, 230px) var(--gutter);
		background: #11120f;
	}

	.about-principles > header {
		display: grid;
		grid-template-columns: minmax(240px, 0.45fr) 1.55fr;
		gap: 50px;
		margin-bottom: 130px;
	}

	.about-principles h2 {
		margin: 0;
		font-family: 'Syne', sans-serif;
		font-size: clamp(68px, 10vw, 170px);
		font-weight: 500;
		letter-spacing: -0.08em;
		line-height: 0.84;
	}

	.about-principles__grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
	}

	.about-principles article {
		min-height: 420px;
		border-top: 1px solid rgba(240, 240, 232, 0.16);
		padding: 27px clamp(25px, 4vw, 70px) 40px 0;
	}

	.about-principles article:nth-child(odd) {
		border-right: 1px solid rgba(240, 240, 232, 0.16);
	}

	.about-principles article:nth-child(even) {
		padding-left: clamp(25px, 4vw, 70px);
	}

	.about-principles article > span {
		color: #d7ff55;
		font-family: 'JetBrains Mono', monospace;
		font-size: 8px;
	}

	.about-principles h3 {
		margin: 130px 0 25px;
		font-family: 'Syne', sans-serif;
		font-size: clamp(32px, 4vw, 62px);
		font-weight: 500;
		letter-spacing: -0.06em;
	}

	.about-principles article p {
		max-width: 430px;
		margin: 0;
		color: rgba(240, 240, 232, 0.52);
		font-size: 13px;
		line-height: 1.6;
	}

	.about-ideal {
		display: grid;
		grid-template-columns: minmax(240px, 0.45fr) 1.55fr;
		gap: 50px;
		padding: clamp(130px, 18vw, 280px) var(--gutter);
	}

	.about-ideal h2 {
		max-width: 1220px;
		margin: 0;
		font-family: 'Syne', sans-serif;
		font-size: clamp(58px, 8vw, 136px);
		font-weight: 500;
		letter-spacing: -0.075em;
		line-height: 0.9;
	}

	.about-ideal div > p {
		max-width: 520px;
		margin: 80px 0 0 auto;
		color: rgba(240, 240, 232, 0.55);
		font-size: 15px;
		line-height: 1.65;
	}

	.about-contact {
		padding: 35px var(--gutter) 45px;
		background: #d7ff55;
		color: #080907;
	}

	.about-contact > div {
		display: flex;
		justify-content: space-between;
		border-bottom: 1px solid rgba(8, 9, 7, 0.3);
		padding-bottom: 25px;
		font-family: 'JetBrains Mono', monospace;
		font-size: 8px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.about-contact > div p {
		max-width: 420px;
		margin: 0;
		text-align: right;
	}

	.about-contact > a {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		padding-top: 110px;
		color: #080907;
		font-family: 'Syne', sans-serif;
		font-size: clamp(100px, 20vw, 330px);
		font-weight: 600;
		letter-spacing: -0.1em;
		line-height: 0.7;
		text-transform: uppercase;
	}

	.about-contact > a i {
		padding-bottom: 0.1em;
		font-size: 0.28em;
		font-style: normal;
	}

	@media (max-width: 850px) {
		.about-profile {
			grid-template-columns: 1fr;
		}

		.about-profile__mark {
			min-height: 75svh;
		}

		.about-stack,
		.about-principles > header,
		.about-ideal {
			grid-template-columns: 1fr;
		}
	}

	@media (max-width: 600px) {
		.about-hero {
			min-height: 760px;
		}

		.about-hero__meta span:last-child {
			display: none;
		}

		.about-hero > p {
			font-size: 8px;
		}

		.about-hero h1 {
			font-size: clamp(61px, 18.2vw, 104px);
			line-height: 0.74;
		}

		.about-hero h1 span:nth-child(2),
		.about-hero h1 span:nth-child(4) {
			margin-left: 0;
		}

		.about-hero__footer {
			display: block;
		}

		.about-hero__footer p {
			font-size: 11px;
		}

		.about-hero__footer a {
			display: inline-block;
			margin-top: 22px;
		}

		.about-profile__mark {
			min-height: 560px;
		}

		.about-profile__mark > span {
			font-size: 90vw;
		}

		.about-profile__copy h2 {
			margin: 60px 0;
			font-size: 48px;
		}

		.about-profile__copy > div {
			grid-template-columns: 1fr;
		}

		.about-principles h2 {
			font-size: 65px;
		}

		.about-principles__grid {
			grid-template-columns: 1fr;
		}

		.about-principles article,
		.about-principles article:nth-child(even) {
			min-height: 330px;
			border-right: none;
			padding-left: 0;
		}

		.about-principles h3 {
			margin-top: 85px;
		}

		.about-ideal h2 {
			font-size: 52px;
		}

		.about-contact > div p {
			display: none;
		}

		.about-contact > a {
			padding-top: 90px;
			font-size: 92px;
		}
	}
</style>
