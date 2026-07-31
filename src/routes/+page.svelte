<script lang="ts">
	import { onMount } from 'svelte';
	import SignalArtifact from '$lib/components/3d/SignalArtifact.svelte';
	import FieldConsole from '$lib/components/experience/FieldConsole.svelte';
	import '../styles/home.css';

	const projects = [
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
			discipline: 'Digital flagship / Art direction / Commerce',
			statement: 'A brutalist retail system where typography becomes interface, image, and motion.',
			metric: '+38%',
			metricLabel: 'qualified actions',
			type: 'monolith'
		}
	];

	const disciplines = [
		{
			index: '01',
			title: 'Direction',
			copy: 'Positioning, visual systems, and a singular idea strong enough to govern every decision.'
		},
		{
			index: '02',
			title: 'Experience',
			copy: 'Narrative UX, interaction choreography, and motion with an editorial sense of timing.'
		},
		{
			index: '03',
			title: 'Technology',
			copy: 'Svelte, shaders, WebGL, creative coding, and performant systems built for the real world.'
		},
		{
			index: '04',
			title: 'Launch',
			copy: 'Production, accessibility, measurement, and the last ten percent that people remember.'
		}
	];

	let introVisible = true;
	let activeProject = 0;
	let currentTime = '';

	onMount(() => {
		document.body.classList.add('mk-home-active');

		const formatTime = () => {
			currentTime = new Intl.DateTimeFormat('en-GB', {
				hour: '2-digit',
				minute: '2-digit',
				second: '2-digit',
				hour12: false,
				timeZone: 'Asia/Seoul'
			}).format(new Date());
		};
		formatTime();
		const clockTimer = window.setInterval(formatTime, 1000);
		const introTimer = window.setTimeout(() => {
			introVisible = false;
		}, 1900);

		const revealObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						entry.target.classList.add('is-visible');
						revealObserver.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.14, rootMargin: '0px 0px -8% 0px' }
		);
		document.querySelectorAll('[data-reveal]').forEach((element) => revealObserver.observe(element));

		const projectObserver = new IntersectionObserver(
			(entries) => {
				const visibleEntry = entries
					.filter((entry) => entry.isIntersecting)
					.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
				if (visibleEntry) {
					activeProject = Number((visibleEntry.target as HTMLElement).dataset.projectIndex ?? 0);
				}
			},
			{ threshold: [0.25, 0.5, 0.72], rootMargin: '-18% 0px -18% 0px' }
		);
		document
			.querySelectorAll<HTMLElement>('[data-project-index]')
			.forEach((element) => projectObserver.observe(element));

		return () => {
			document.body.classList.remove('mk-home-active');
			window.clearInterval(clockTimer);
			window.clearTimeout(introTimer);
			revealObserver.disconnect();
			projectObserver.disconnect();
		};
	});
</script>

<svelte:head>
	<meta name="theme-color" content="#080907" />
</svelte:head>

{#if introVisible}
	<div class="intro" aria-hidden="true">
		<div class="intro__mark">MK.01</div>
		<div class="intro__status">
			<span>Calibrating digital matter</span>
			<span>2026</span>
		</div>
		<div class="intro__track"><span></span></div>
	</div>
{/if}

<article class="home">
	<section class="hero" aria-labelledby="hero-title">
		<div class="hero__grid" aria-hidden="true"></div>
		<div class="hero__artifact">
			<SignalArtifact />
		</div>

		<div class="hero__meta hero__meta--left">
			<span>Independent creative technology studio</span>
			<span>Seoul / Everywhere</span>
		</div>
		<div class="hero__meta hero__meta--right">
			<span>Art direction × Engineering</span>
			<span>Selected signal / 2026</span>
		</div>

		<div class="hero__headline">
			<p class="hero__kicker">We make technology feel inevitable.</p>
			<h1 id="hero-title">
				<span class="hero__line hero__line--one">Digital</span>
				<span class="hero__line hero__line--two">matter,</span>
				<span class="hero__line hero__line--three">engineered.</span>
			</h1>
		</div>

		<div class="hero__footer">
			<p>
				Mk.01 creates digital flagships and interactive systems for ambitious brands operating at
				the edge of culture and technology.
			</p>
			<a class="text-link" href="#work">Explore selected work <span>↓</span></a>
		</div>

		<div class="hero__coordinates" aria-hidden="true">
			<span>37.5665° N</span>
			<span>126.9780° E</span>
		</div>
	</section>

	<section class="manifesto section-pad" aria-labelledby="manifesto-title">
		<div class="section-index" data-reveal>
			<span>( 00 )</span>
			<span>Manifesto</span>
		</div>
		<div class="manifesto__statement" data-reveal>
			<h2 id="manifesto-title">
				The screen is not a canvas.
				<span>It is a material.</span>
			</h2>
			<div class="manifesto__support">
				<p>
					We combine strategy, design, motion, and engineering into one continuous practice. No
					handoff gaps. No decorative movement. Every frame has a job.
				</p>
				<p class="mono-copy">
					Our work is built to earn attention,<br />
					reward curiosity, and survive reality.
				</p>
			</div>
		</div>
		<div class="manifesto__ticker" aria-hidden="true">
			<div>
				<span>Strategy</span><i>✦</i><span>Interaction</span><i>✦</i><span>WebGL</span><i>✦</i
				><span>Motion</span><i>✦</i><span>Systems</span><i>✦</i><span>Strategy</span><i>✦</i
				><span>Interaction</span><i>✦</i><span>WebGL</span><i>✦</i>
			</div>
		</div>
	</section>

	<section class="work section-pad" id="work" aria-labelledby="work-title">
		<header class="work__header" data-reveal>
			<div class="section-index">
				<span>( 01—03 )</span>
				<span>Selected work</span>
			</div>
			<h2 id="work-title">Built to be<br />felt, not scrolled past.</h2>
			<p>Three systems where concept, craft, and computation became inseparable.</p>
		</header>

		<div class="work__sequence">
			<div class="work__stage">
				<div class="work__visual" aria-hidden="true">
					{#each projects as project, index}
						<div
							class:active={activeProject === index}
							class="project-art project-art--{project.type}"
						>
							{#if project.type === 'orbital'}
								<div class="orbital__core"></div>
								<div class="orbital__ring orbital__ring--a"></div>
								<div class="orbital__ring orbital__ring--b"></div>
								<div class="orbital__ring orbital__ring--c"></div>
							{:else if project.type === 'signal'}
								<div class="signal__beam"></div>
								<div class="signal__disc"></div>
								<div class="signal__grid"></div>
							{:else}
								<div class="monolith__block monolith__block--a"></div>
								<div class="monolith__block monolith__block--b"></div>
								<div class="monolith__type">R</div>
							{/if}
							<div class="project-art__label">
								<span>MK / CASE {project.index}</span>
								<span>LIVE SYSTEM</span>
							</div>
						</div>
					{/each}
				</div>
				<div class="work__stage-counter" aria-hidden="true">
					<span>0{activeProject + 1}</span>
					<i></i>
					<span>03</span>
				</div>
			</div>

			<div class="work__list">
				{#each projects as project, index}
					<a
						href="/work/{project.slug}"
						class:active={activeProject === index}
						class="project-row"
						data-project-index={index}
					>
						<div class="project-row__top">
							<span class="project-row__index">{project.index}</span>
							<span class="project-row__discipline">{project.discipline}</span>
							<span class="project-row__arrow">↗</span>
						</div>
						<h3>{project.title}</h3>
						<p>{project.statement}</p>
						<div class="project-row__metric">
							<strong>{project.metric}</strong>
							<span>{project.metricLabel}</span>
						</div>
					</a>
				{/each}
			</div>
		</div>
	</section>

	<section class="lab section-pad" id="lab" aria-labelledby="lab-title">
		<header class="lab__header" data-reveal>
			<div class="section-index">
				<span>( 04 )</span>
				<span>Live experiment</span>
			</div>
			<div>
				<h2 id="lab-title">Touch the<br />signal field.</h2>
				<p>
					A real-time kinetic system. Move through the field and hold to reverse its polarity.
					No video. No illusion. Just the browser.
				</p>
			</div>
		</header>
		<div class="lab__console" data-reveal>
			<FieldConsole />
			<div class="lab__caption">
				<span>Experiment 08 / Elastic topology</span>
				<span>Pointer, touch, reduced-motion aware</span>
			</div>
		</div>
	</section>

	<section class="method section-pad" id="method" aria-labelledby="method-title">
		<div class="method__intro" data-reveal>
			<div class="section-index">
				<span>( 05 )</span>
				<span>One continuous practice</span>
			</div>
			<h2 id="method-title">Thinking and making<br />belong in the same room.</h2>
		</div>

		<div class="method__list">
			{#each disciplines as discipline}
				<article class="method-row" data-reveal>
					<span class="method-row__index">{discipline.index}</span>
					<h3>{discipline.title}</h3>
					<p>{discipline.copy}</p>
					<span class="method-row__glyph" aria-hidden="true">+</span>
				</article>
			{/each}
		</div>

		<div class="method__principle" data-reveal>
			<p class="mono-copy">The Mk.01 principle</p>
			<p>
				Use less technology.<br />
				Make it matter more.
			</p>
		</div>
	</section>

	<section class="contact" id="contact" aria-labelledby="contact-title">
		<div class="contact__noise" aria-hidden="true"></div>
		<div class="contact__meta">
			<span>Have something ambitious in mind?</span>
			<span>Available for selected commissions / Q4 2026</span>
		</div>
		<h2 id="contact-title">
			<a href="mailto:studio@mk1.dev?subject=New%20project%20with%20Mk.01">
				<span>Make it</span>
				<span>impossible.</span>
				<i aria-hidden="true">↗</i>
			</a>
		</h2>
		<div class="contact__footer">
			<a href="mailto:studio@mk1.dev">studio@mk1.dev</a>
			<div>
				<span>Seoul {currentTime} KST</span>
				<span>© 2026 MK.01</span>
			</div>
		</div>
	</section>
</article>
