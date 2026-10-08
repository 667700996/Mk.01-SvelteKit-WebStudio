<script lang="ts">
	import CtaBand from '$lib/components/ui/CtaBand.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import SectionHead from '$lib/components/ui/SectionHead.svelte';
	import { pad } from '$lib/utils/format';

	let { data } = $props();

	/** First letter of up to two words: "Mira Park" → "MP", "이준호" → "이". */
	function monogram(name: string) {
		return name
			.split(/\s+/)
			.slice(0, 2)
			.map((word) => Array.from(word)[0])
			.join('')
			.toUpperCase();
	}

	const isHangul = (value: string) => /[\u3131-\uD79D]/.test(value);
</script>

<PageHeader
	label="Team"
	title="The constellation behind Mk.01 experiments and launches."
	lead="Distributed across Seoul, Busan, Tokyo, and beyond, the team blends strategy, design systems, motion direction, and engineering discipline."
/>

<section class="wrap" aria-label="Team members">
	<ul class="members" role="list">
		{#each data.team as member, index (member.name)}
			<li class="member" data-reveal>
				<div class="portrait" aria-hidden="true">
					<span class="monogram" class:hangul={isHangul(member.name)} lang={isHangul(member.name) ? 'ko' : undefined}>{monogram(member.name)}</span>
					<span class="label corner">{pad(index + 1)}</span>
				</div>
				<h2 class="h4">{member.name}</h2>
				<p class="secondary">{member.title}</p>
				<p class="label location">{member.location}</p>
				<ul class="specialties" role="list" aria-label="Specialties">
					{#each member.specialties as specialty (specialty)}
						<li>{specialty}</li>
					{/each}
				</ul>
			</li>
		{/each}
	</ul>
</section>

<section class="section wrap" aria-labelledby="timeline-title">
	<SectionHead index="02" label="Timeline" title="How the studio grew." id="timeline-title" />
	<ol class="timeline" role="list">
		{#each data.timeline as item (item.year)}
			<li class="grid entry" data-reveal>
				<p class="h3 tabular year">{item.year}</p>
				<h3 class="h4">{item.title}</h3>
				<p class="secondary">{item.description}</p>
			</li>
		{/each}
	</ol>
</section>

<CtaBand
	title="Build with us."
	copy="We assemble a bespoke crew for every engagement. Tell us what you’re building and we’ll pair the right specialists."
>
	{#snippet actions()}
		<a class="button" href="/contact">Start a scope</a>
		<a class="button button--quiet" href="/about">Learn about the studio</a>
	{/snippet}
</CtaBand>

<style>
	.members {
		display: grid;
		grid-template-columns: repeat(4, minmax(0, 1fr));
		column-gap: var(--gutter);
		row-gap: var(--space-8);
	}

	.portrait {
		position: relative;
		display: grid;
		place-items: center;
		aspect-ratio: 4 / 5;
		margin-bottom: var(--space-5);
		border-radius: var(--radius-l);
		background: var(--bg-raised);
		background-image: radial-gradient(var(--line-strong) 1px, transparent 1px);
		background-size: 20px 20px;
		background-position: center;
	}

	.monogram {
		font-size: clamp(3rem, 2rem + 3vw, 5rem);
		font-weight: 600;
		letter-spacing: -0.05em;
		line-height: 1;
	}

	/* Hangul glyphs are built from jamo; tight Latin tracking breaks them apart. */
	.monogram.hangul {
		letter-spacing: 0;
		font-weight: 500;
	}

	.corner {
		position: absolute;
		top: var(--space-4);
		left: var(--space-4);
	}

	.member .secondary {
		margin-top: var(--space-1);
	}

	.location {
		margin-top: var(--space-3);
	}

	.specialties {
		margin-top: var(--space-5);
		border-top: var(--hairline) solid var(--line);
	}

	.specialties li {
		padding-block: var(--space-2);
		border-bottom: var(--hairline) solid var(--line);
		font-size: var(--text-small);
		color: var(--fg-2);
	}

	.timeline {
		border-bottom: var(--hairline) solid var(--line);
	}

	.entry {
		row-gap: var(--space-2);
		align-items: baseline;
		padding-block: var(--space-5);
		border-top: var(--hairline) solid var(--line);
	}

	.year {
		grid-column: 1 / span 3;
	}

	.entry h3 {
		grid-column: 4 / span 3;
	}

	.entry p.secondary {
		grid-column: 7 / -1;
		max-width: 34em;
	}

	@media (max-width: 63.99rem) {
		.members {
			grid-template-columns: repeat(2, minmax(0, 1fr));
		}

		.year {
			grid-column: 1 / span 3;
		}

		.entry h3 {
			grid-column: 4 / -1;
		}

		.entry p.secondary {
			grid-column: 4 / -1;
		}
	}

	@media (max-width: 47.99rem) {
		.members {
			grid-template-columns: 1fr;
		}

		.portrait {
			aspect-ratio: 16 / 10;
		}

		.year,
		.entry h3,
		.entry p.secondary {
			grid-column: 1 / -1;
		}
	}
</style>
