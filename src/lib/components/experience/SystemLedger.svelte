<script lang="ts">
	const lenses = [
		{
			id: 'architecture',
			index: '01',
			label: 'Architecture',
			kicker: 'Composed, not coupled',
			title: 'Complexity,\narranged.',
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
			index: '02',
			label: 'Runtime',
			kicker: 'Motion with a budget',
			title: 'Alive,\nby design.',
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
			index: '03',
			label: 'Quality',
			kicker: 'Resilience is the finish',
			title: 'Craft that\nholds up.',
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
	const traceBars = Array.from({ length: 18 }, (_, index) => 12 + ((index * 17) % 44));

	let activeIndex = 0;

	$: activeLens = lenses[activeIndex];

	function selectLens(index: number) {
		activeIndex = index;
	}

	function handleTabKeydown(event: KeyboardEvent, index: number) {
		if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
		event.preventDefault();

		if (event.key === 'Home') activeIndex = 0;
		else if (event.key === 'End') activeIndex = lenses.length - 1;
		else if (event.key === 'ArrowRight') activeIndex = (index + 1) % lenses.length;
		else activeIndex = (index - 1 + lenses.length) % lenses.length;

		requestAnimationFrame(() => {
			document.getElementById(`ledger-tab-${lenses[activeIndex].id}`)?.focus();
		});
	}
</script>

<section class="ledger" id="engineering" aria-labelledby="ledger-title">
	<header class="ledger__header">
		<div class="ledger__index">
			<span>( 05 )</span>
			<span>Engineering record</span>
		</div>
		<div class="ledger__statement">
			<p>Under the surface</p>
			<h2 id="ledger-title">The experience is the proof.</h2>
		</div>
		<p class="ledger__intro">
			A beautiful interface is only finished when its architecture is legible, its motion is
			responsible, and its behavior survives real conditions.
		</p>
	</header>

	<div class="ledger__instrument">
		<div class="ledger__rail">
			<div class="ledger__tabs" role="tablist" aria-label="Engineering lenses">
				{#each lenses as lens, index}
					<button
						id="ledger-tab-{lens.id}"
						type="button"
						role="tab"
						aria-selected={activeIndex === index}
						aria-controls="ledger-panel-{lens.id}"
						tabindex={activeIndex === index ? 0 : -1}
						class:active={activeIndex === index}
						on:click={() => selectLens(index)}
						on:keydown={(event) => handleTabKeydown(event, index)}
					>
						<span>{lens.index}</span>
						<strong>{lens.label}</strong>
						<i aria-hidden="true"></i>
					</button>
				{/each}
			</div>

			<div class="ledger__status">
				<span><i></i> System nominal</span>
				<span>MK / RUNTIME 01</span>
			</div>
		</div>

		<div
			class="ledger__panel"
			id="ledger-panel-{activeLens.id}"
			role="tabpanel"
			aria-labelledby="ledger-tab-{activeLens.id}"
			tabindex="0"
		>
			<div class="ledger__copy" aria-live="polite">
				<p>{activeLens.kicker}</p>
				<h3>{#each activeLens.title.split('\n') as line}{line}<br />{/each}</h3>
				<div class="ledger__body">
					<p>{activeLens.copy}</p>
					<span>{activeLens.signal}</span>
				</div>
			</div>

			<div class="ledger__diagram" aria-label="{activeLens.label} system flow">
				<div class="ledger__scope">
					<span>Signal path / {activeLens.index}</span>
					<span>Live specification</span>
				</div>
				<div class="ledger__nodes">
					{#each activeLens.nodes as node, index}
						<div class="ledger__node">
							<span>0{index + 1}</span>
							<strong>{node}</strong>
							<i aria-hidden="true"></i>
						</div>
						{#if index < activeLens.nodes.length - 1}
							<div class="ledger__connector" aria-hidden="true"><i></i></div>
						{/if}
					{/each}
				</div>
				<div class="ledger__trace" aria-hidden="true">
					{#each traceBars as height}
						<i style:height={`${height}%`}></i>
					{/each}
				</div>
			</div>

			<div class="ledger__spec">
				{#each activeLens.principles as principle}
					<div>
						<span>{principle[0]}</span>
						<strong>{principle[1]}</strong>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.ledger {
		--ink: #080907;
		--paper: #f0f0e8;
		--signal: #d7ff55;
		padding: clamp(120px, 15vw, 220px) var(--mk-gutter);
		background: #d7ff55;
		color: var(--ink);
	}

	.ledger__header {
		display: grid;
		grid-template-columns: minmax(220px, 0.48fr) minmax(0, 1.1fr) minmax(220px, 0.42fr);
		gap: clamp(30px, 5vw, 80px);
		align-items: end;
		margin-bottom: clamp(72px, 10vw, 140px);
	}

	.ledger__index {
		align-self: start;
		display: grid;
		grid-template-columns: 72px 1fr;
		font-family: var(--mk-mono);
		font-size: 9px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.ledger__statement > p {
		margin: 0 0 22px;
		font-family: var(--mk-mono);
		font-size: 9px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.ledger__statement h2 {
		max-width: 880px;
		margin: 0;
		color: var(--ink);
		font-family: var(--mk-display);
		font-size: clamp(65px, 8vw, 132px);
		font-weight: 600;
		letter-spacing: -0.08em;
		line-height: 0.82;
	}

	.ledger__intro {
		max-width: 350px;
		margin: 0 0 5px;
		font-size: 14px;
		line-height: 1.6;
	}

	.ledger__instrument {
		display: grid;
		grid-template-columns: minmax(190px, 0.28fr) 1fr;
		min-height: 700px;
		border: 1px solid rgba(8, 9, 7, 0.26);
		background: var(--ink);
		color: var(--paper);
		box-shadow: 0 36px 90px rgba(39, 49, 5, 0.18);
	}

	.ledger__rail {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		border-right: 1px solid rgba(240, 240, 232, 0.14);
	}

	.ledger__tabs button {
		position: relative;
		display: grid;
		width: 100%;
		grid-template-columns: 36px 1fr 18px;
		align-items: center;
		gap: 12px;
		border: 0;
		border-bottom: 1px solid rgba(240, 240, 232, 0.14);
		padding: 26px 22px;
		background: transparent;
		color: rgba(240, 240, 232, 0.44);
		text-align: left;
		transition:
			background 250ms ease,
			color 250ms ease;
		cursor: pointer;
	}

	.ledger__tabs button:hover,
	.ledger__tabs button.active {
		background: rgba(215, 255, 85, 0.06);
		color: var(--paper);
	}

	.ledger__tabs button:focus-visible {
		z-index: 2;
		outline-color: var(--signal);
		outline-offset: -5px;
	}

	.ledger__tabs span,
	.ledger__tabs strong,
	.ledger__status,
	.ledger__scope,
	.ledger__spec span {
		font-family: var(--mk-mono);
		font-size: 8px;
		font-weight: 400;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.ledger__tabs button i {
		width: 6px;
		height: 6px;
		border: 1px solid currentColor;
		border-radius: 50%;
	}

	.ledger__tabs button.active i {
		border-color: var(--signal);
		background: var(--signal);
		box-shadow: 0 0 14px rgba(215, 255, 85, 0.75);
	}

	.ledger__status {
		display: flex;
		flex-direction: column;
		gap: 8px;
		padding: 22px;
		color: rgba(240, 240, 232, 0.34);
		line-height: 1.5;
	}

	.ledger__status span:first-child {
		color: rgba(215, 255, 85, 0.8);
	}

	.ledger__status i {
		display: inline-block;
		width: 5px;
		height: 5px;
		margin-right: 7px;
		border-radius: 50%;
		background: var(--signal);
		box-shadow: 0 0 10px rgba(215, 255, 85, 0.7);
	}

	.ledger__panel {
		display: grid;
		grid-template-columns: minmax(0, 0.9fr) minmax(360px, 1.1fr);
		grid-template-rows: 1fr auto;
		outline: none;
	}

	.ledger__copy {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		border-right: 1px solid rgba(240, 240, 232, 0.14);
		padding: clamp(32px, 4vw, 68px);
	}

	.ledger__copy > p {
		margin: 0;
		color: var(--signal);
		font-family: var(--mk-mono);
		font-size: 9px;
		letter-spacing: 0.12em;
		text-transform: uppercase;
	}

	.ledger__copy h3 {
		margin: 60px 0;
		color: var(--paper);
		font-family: var(--mk-display);
		font-size: clamp(62px, 7vw, 118px);
		font-weight: 500;
		letter-spacing: -0.08em;
		line-height: 0.76;
	}

	.ledger__body {
		max-width: 420px;
	}

	.ledger__body p {
		margin: 0 0 32px;
		color: rgba(240, 240, 232, 0.62);
		font-size: 14px;
		line-height: 1.62;
	}

	.ledger__body span {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		font-family: var(--mk-mono);
		font-size: 8px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.ledger__body span::before {
		width: 26px;
		height: 1px;
		background: var(--signal);
		content: '';
	}

	.ledger__diagram {
		position: relative;
		display: flex;
		min-height: 520px;
		flex-direction: column;
		justify-content: space-between;
		overflow: hidden;
		padding: clamp(26px, 3vw, 46px);
		background:
			linear-gradient(rgba(240, 240, 232, 0.045) 1px, transparent 1px),
			linear-gradient(90deg, rgba(240, 240, 232, 0.045) 1px, transparent 1px);
		background-size: 42px 42px;
	}

	.ledger__diagram::after {
		position: absolute;
		inset: 20% 10%;
		background: radial-gradient(circle, rgba(215, 255, 85, 0.1), transparent 64%);
		content: '';
		pointer-events: none;
	}

	.ledger__scope {
		position: relative;
		z-index: 1;
		display: flex;
		justify-content: space-between;
		color: rgba(240, 240, 232, 0.38);
	}

	.ledger__nodes {
		position: relative;
		z-index: 1;
		display: grid;
		grid-template-columns: 1fr 54px 1fr 54px 1fr;
		align-items: center;
	}

	.ledger__node {
		position: relative;
		display: flex;
		aspect-ratio: 1;
		flex-direction: column;
		justify-content: space-between;
		border: 1px solid rgba(215, 255, 85, 0.34);
		border-radius: 50%;
		padding: 18%;
		background: rgba(8, 9, 7, 0.72);
	}

	.ledger__node span {
		color: rgba(240, 240, 232, 0.38);
		font-family: var(--mk-mono);
		font-size: 8px;
	}

	.ledger__node strong {
		max-width: 90px;
		font-family: var(--mk-display);
		font-size: clamp(13px, 1.1vw, 18px);
		font-weight: 500;
		letter-spacing: -0.025em;
		line-height: 1.05;
	}

	.ledger__node i {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--signal);
		box-shadow: 0 0 18px var(--signal);
		transform: translate(-50%, -50%);
		animation: node-pulse 2.4s ease-in-out infinite;
	}

	.ledger__connector {
		position: relative;
		height: 1px;
		overflow: hidden;
		background: rgba(215, 255, 85, 0.25);
	}

	.ledger__connector i {
		position: absolute;
		inset: 0;
		background: linear-gradient(90deg, transparent, var(--signal), transparent);
		animation: signal-pass 2.4s linear infinite;
	}

	.ledger__trace {
		position: relative;
		z-index: 1;
		display: flex;
		height: 50px;
		align-items: end;
		gap: 5px;
		opacity: 0.45;
	}

	.ledger__trace i {
		width: 2px;
		background: var(--signal);
		animation: trace 2.8s ease-in-out infinite alternate;
	}

	.ledger__trace i:nth-child(3n) {
		animation-delay: -0.8s;
	}

	.ledger__trace i:nth-child(4n) {
		animation-delay: -1.4s;
	}

	.ledger__spec {
		grid-column: 1 / -1;
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		border-top: 1px solid rgba(240, 240, 232, 0.14);
	}

	.ledger__spec div {
		display: flex;
		min-height: 92px;
		flex-direction: column;
		justify-content: space-between;
		padding: 20px 24px;
		border-right: 1px solid rgba(240, 240, 232, 0.14);
	}

	.ledger__spec div:last-child {
		border-right: 0;
	}

	.ledger__spec span {
		color: rgba(240, 240, 232, 0.35);
	}

	.ledger__spec strong {
		font-family: var(--mk-display);
		font-size: 16px;
		font-weight: 500;
		letter-spacing: -0.02em;
	}

	@keyframes node-pulse {
		50% {
			opacity: 0.35;
			transform: translate(-50%, -50%) scale(0.7);
		}
	}

	@keyframes signal-pass {
		from {
			transform: translateX(-100%);
		}
		to {
			transform: translateX(100%);
		}
	}

	@keyframes trace {
		to {
			transform: scaleY(0.55);
			transform-origin: bottom;
		}
	}

	@media (max-width: 1080px) {
		.ledger__header {
			grid-template-columns: 1fr 1.8fr;
		}

		.ledger__intro {
			grid-column: 2;
		}

		.ledger__instrument {
			grid-template-columns: 1fr;
		}

		.ledger__rail {
			border-right: 0;
			border-bottom: 1px solid rgba(240, 240, 232, 0.14);
		}

		.ledger__tabs {
			display: grid;
			grid-template-columns: repeat(3, 1fr);
		}

		.ledger__tabs button {
			border-right: 1px solid rgba(240, 240, 232, 0.14);
			border-bottom: 0;
		}

		.ledger__status {
			display: none;
		}
	}

	@media (max-width: 760px) {
		.ledger__header {
			grid-template-columns: 1fr;
		}

		.ledger__intro {
			grid-column: auto;
		}

		.ledger__instrument {
			min-height: 0;
		}

		.ledger__tabs button {
			grid-template-columns: 1fr;
			gap: 6px;
			padding: 18px 12px;
		}

		.ledger__tabs button i {
			position: absolute;
			top: 14px;
			right: 12px;
		}

		.ledger__panel {
			grid-template-columns: 1fr;
		}

		.ledger__copy {
			min-height: 520px;
			border-right: 0;
			border-bottom: 1px solid rgba(240, 240, 232, 0.14);
		}

		.ledger__diagram {
			min-height: 450px;
		}

		.ledger__nodes {
			grid-template-columns: 1fr 26px 1fr 26px 1fr;
		}

		.ledger__node {
			padding: 14%;
		}

		.ledger__node strong {
			font-size: 11px;
		}

		.ledger__spec {
			grid-template-columns: 1fr;
		}

		.ledger__spec div {
			min-height: 76px;
			border-right: 0;
			border-bottom: 1px solid rgba(240, 240, 232, 0.14);
		}

		.ledger__spec div:last-child {
			border-bottom: 0;
		}
	}

	@media (max-width: 460px) {
		.ledger__statement h2 {
			font-size: 58px;
		}

		.ledger__copy h3 {
			font-size: 58px;
		}

		.ledger__scope span:last-child,
		.ledger__node span {
			display: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.ledger__node i,
		.ledger__connector i,
		.ledger__trace i {
			animation: none;
		}
	}
</style>
