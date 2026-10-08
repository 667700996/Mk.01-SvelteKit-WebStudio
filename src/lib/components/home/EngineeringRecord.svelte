<script lang="ts">
	import { fade } from 'svelte/transition';
	import SectionHead from '$lib/components/ui/SectionHead.svelte';

	const lenses = [
		{
			id: 'architecture',
			label: 'Architecture',
			kicker: 'Composed, not coupled',
			title: 'Complexity, arranged.',
			copy: 'Route-level experiences stay expressive because content, motion, rendering, and interface primitives have explicit boundaries.',
			signal: 'Typed at every boundary',
			nodes: ['Content models', 'Experience layer', 'Route surface'],
			principles: [
				['Structure', 'Feature-oriented modules'],
				['Data', 'Typed content contracts'],
				['Delivery', 'Route-isolated payloads']
			]
		},
		{
			id: 'runtime',
			label: 'Runtime',
			kicker: 'Motion with a budget',
			title: 'Alive, by design.',
			copy: 'Every moving system owns its lifecycle. Rendering pauses outside the viewport, pixel density adapts, and the main thread stays available.',
			signal: 'Frame-aware by default',
			nodes: ['Input signal', 'Adaptive renderer', 'Visible response'],
			principles: [
				['GPU', 'Bounded pixel density'],
				['Lifecycle', 'Visibility-aware loops'],
				['Motion', 'Reduced-motion parity']
			]
		},
		{
			id: 'quality',
			label: 'Quality',
			kicker: 'Resilience is the finish',
			title: 'Craft that holds up.',
			copy: 'Semantic structure, keyboard paths, progressive enhancement, and disciplined cleanup are treated as product decisions—not release chores.',
			signal: 'Designed beyond the happy path',
			nodes: ['Human intent', 'Inclusive system', 'Durable outcome'],
			principles: [
				['Access', 'Keyboard-first controls'],
				['Semantics', 'Native interaction model'],
				['Stability', 'Deterministic teardown']
			]
		}
	] as const;

	let selected = $state(0);
	const lens = $derived(lenses[selected]);
	let tabs = $state<HTMLButtonElement[]>([]);

	function onKey(event: KeyboardEvent) {
		const last = lenses.length - 1;
		const next: Record<string, number> = {
			ArrowDown: selected === last ? 0 : selected + 1,
			ArrowRight: selected === last ? 0 : selected + 1,
			ArrowUp: selected === 0 ? last : selected - 1,
			ArrowLeft: selected === 0 ? last : selected - 1,
			Home: 0,
			End: last
		};
		if (!(event.key in next)) return;
		event.preventDefault();
		selected = next[event.key];
		tabs[selected]?.focus();
	}
</script>

<section class="section wrap" id="engineering" aria-labelledby="engineering-title">
	<SectionHead
		index="05"
		label="Engineering record"
		title="The experience is the proof."
		intro="A beautiful interface is only finished when its architecture is legible, its motion is responsible, and its behavior survives real conditions."
		id="engineering-title"
	/>

	<div class="instrument" data-reveal>
		<div class="tabs" role="tablist" aria-label="Engineering lenses" aria-orientation="vertical">
			{#each lenses as item, index (item.id)}
				<button
					bind:this={tabs[index]}
					id="tab-{item.id}"
					type="button"
					role="tab"
					aria-selected={selected === index}
					aria-controls="panel-engineering"
					tabindex={selected === index ? 0 : -1}
					onclick={() => (selected = index)}
					onkeydown={onKey}
				>
					<span class="label">0{index + 1}</span>
					<span class="tab-name">{item.label}</span>
				</button>
			{/each}
			<span class="indicator" style:--index={selected} aria-hidden="true"></span>
			<p class="label status" aria-hidden="true">
				<span class="pulse"></span>System nominal<br />MK / Runtime 01
			</p>
		</div>

		<div
			class="panel"
			id="panel-engineering"
			role="tabpanel"
			aria-labelledby="tab-{lens.id}"
			tabindex="0"
		>
			{#key lens.id}
				<div class="panel-body" in:fade={{ duration: 260, delay: 60 }}>
					<div class="copy">
						<p class="label kicker">{lens.kicker}</p>
						<h3 class="h3">{lens.title}</h3>
						<p class="secondary">{lens.copy}</p>
						<p class="label signal">{lens.signal}</p>
					</div>

					<ol class="path" role="list" aria-label="{lens.label} signal path">
						{#each lens.nodes as node, index}
							<li style:--i={index}>
								<span class="label">0{index + 1}</span>
								<span class="node">{node}</span>
							</li>
						{/each}
					</ol>

					<dl class="spec">
						{#each lens.principles as [term, value]}
							<div>
								<dt class="label">{term}</dt>
								<dd>{value}</dd>
							</div>
						{/each}
					</dl>
				</div>
			{/key}
		</div>
	</div>
</section>

<style>
	.instrument {
		display: grid;
		grid-template-columns: minmax(12rem, 3fr) 9fr;
		border: var(--hairline) solid var(--line);
		border-radius: var(--radius-l);
		overflow: hidden;
	}

	.tabs {
		position: relative;
		display: flex;
		flex-direction: column;
		border-right: var(--hairline) solid var(--line);
	}

	button {
		display: flex;
		align-items: baseline;
		gap: var(--space-4);
		height: 4.5rem;
		padding: 0 var(--space-5);
		border: 0;
		border-bottom: var(--hairline) solid var(--line);
		background: none;
		color: var(--fg-3);
		text-align: left;
		align-items: center;
		transition: color var(--duration-2) var(--ease-out);
	}

	button:hover,
	button[aria-selected='true'] {
		color: var(--fg);
	}

	button:focus-visible {
		outline-offset: -4px;
	}

	.tab-name {
		font-weight: 520;
	}

	.indicator {
		position: absolute;
		left: 0;
		top: 0;
		width: 2px;
		height: 4.5rem;
		background: var(--accent);
		transform: translateY(calc(var(--index) * 4.5rem));
		transition: transform var(--duration-3) var(--ease-out);
	}

	.status {
		margin-top: auto;
		padding: var(--space-5);
		line-height: 1.8;
	}

	.pulse {
		display: inline-block;
		width: 6px;
		height: 6px;
		margin-right: var(--space-2);
		border-radius: 50%;
		background: var(--accent);
		vertical-align: 0.1em;
		animation: pulse 2.4s var(--ease-in-out) infinite;
	}

	@keyframes pulse {
		50% {
			opacity: 0.35;
		}
	}

	.panel {
		display: grid;
		min-height: 30rem;
	}

	.panel:focus-visible {
		outline-offset: -4px;
	}

	.panel-body {
		grid-area: 1 / 1;
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr auto;
	}

	.copy {
		padding: var(--space-7) var(--space-6);
	}

	.kicker {
		color: var(--accent);
		margin-bottom: var(--space-5);
	}

	.copy .secondary {
		max-width: 30em;
		margin-top: var(--space-5);
	}

	.signal {
		margin-top: var(--space-6);
		display: flex;
		align-items: center;
		gap: var(--space-3);
	}

	.signal::before {
		content: '';
		width: 1.5rem;
		height: 1px;
		background: currentColor;
	}

	/* The signal path: three nodes, joined by a line a pulse travels along. */
	.path {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		gap: var(--space-5);
		padding: var(--space-7) var(--space-6);
		border-left: var(--hairline) solid var(--line);
		background-image: radial-gradient(var(--line-strong) 1px, transparent 1px);
		background-size: 16px 16px;
		background-position: center;
	}

	.path::before {
		content: '';
		position: absolute;
		left: calc(var(--space-6) + 1.25rem);
		top: 50%;
		height: 60%;
		width: 1px;
		background: var(--line-strong);
		translate: 0 -50%;
	}

	.path li {
		position: relative;
		display: flex;
		align-items: center;
		gap: var(--space-4);
		animation: node-in var(--duration-3) var(--ease-out) both;
		animation-delay: calc(var(--i) * 70ms + 80ms);
	}

	.path .label {
		display: grid;
		place-items: center;
		width: 2.5rem;
		height: 2.5rem;
		border: var(--hairline) solid var(--line-strong);
		border-radius: 50%;
		background: var(--bg);
		color: var(--fg-2);
	}

	.path li:last-child .label {
		border-color: var(--accent);
		color: var(--accent);
	}

	.node {
		padding: var(--space-2) var(--space-4);
		border: var(--hairline) solid var(--line);
		border-radius: var(--radius-m);
		background: var(--bg);
		font-weight: 520;
	}

	@keyframes node-in {
		from {
			opacity: 0;
			transform: translateX(-0.5rem);
		}
	}

	.spec {
		grid-column: 1 / -1;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		border-top: var(--hairline) solid var(--line);
	}

	.spec div {
		padding: var(--space-5) var(--space-6);
	}

	.spec div + div {
		border-left: var(--hairline) solid var(--line);
	}

	dd {
		margin-top: var(--space-2);
		font-weight: 520;
	}

	@media (max-width: 63.99rem) {
		.instrument {
			grid-template-columns: 1fr;
		}

		.tabs {
			flex-direction: row;
			border-right: 0;
			border-bottom: var(--hairline) solid var(--line);
		}

		button {
			flex: 1;
			height: 3.5rem;
			justify-content: center;
			border-bottom: 0;
			padding: 0 var(--space-3);
		}

		button + button {
			border-left: var(--hairline) solid var(--line);
		}

		button .label,
		.status {
			display: none;
		}

		.indicator {
			top: auto;
			bottom: -1px;
			width: calc(100% / 3);
			height: 2px;
			transform: translateX(calc(var(--index) * 100%));
		}

		.panel-body {
			grid-template-columns: 1fr;
		}

		.path {
			border-left: 0;
			border-top: var(--hairline) solid var(--line);
		}

		.spec {
			grid-template-columns: 1fr;
		}

		.spec div + div {
			border-left: 0;
			border-top: var(--hairline) solid var(--line);
		}
	}

	@media (max-width: 47.99rem) {
		.copy,
		.path {
			padding: var(--space-6) var(--space-5);
		}

		.path::before {
			left: calc(var(--space-5) + 1.25rem);
		}

		.spec div {
			padding: var(--space-4) var(--space-5);
		}
	}
</style>
