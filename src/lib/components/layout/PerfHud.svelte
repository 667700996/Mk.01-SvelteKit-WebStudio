<!--
	A live readout of this visit's performance, measured in the visitor's own
	browser. Toggle with P or from the command palette.
-->
<script lang="ts">
	import { onMount } from 'svelte';
	import { ui } from '$lib/state/ui.svelte';
	import { formatBytes, formatMs, rate, vitals, type Rating } from '$lib/state/vitals.svelte';

	let mounted = $state(false);
	let fps = $state<number | null>(null);

	onMount(() => (mounted = true));

	// Count frames only while the HUD is open; the probe itself costs one rAF.
	$effect(() => {
		if (!ui.hudVisible) return;
		let frames = 0;
		let since = performance.now();
		let raf = requestAnimationFrame(function tick(now) {
			frames += 1;
			if (now - since >= 500) {
				fps = Math.round((frames * 1000) / (now - since));
				frames = 0;
				since = now;
			}
			raf = requestAnimationFrame(tick);
		});
		const dom = setInterval(() => vitals.sampleDom(), 2000);
		return () => {
			cancelAnimationFrame(raf);
			clearInterval(dom);
			fps = null;
		};
	});

	const rows = $derived<{ label: string; value: string; rating: Rating | null; hint?: string }[]>([
		{ label: 'FPS', value: fps === null ? '—' : String(fps), rating: fps === null ? null : fps >= 55 ? 'good' : fps >= 30 ? 'needs-improvement' : 'poor' },
		{ label: 'LCP', value: formatMs(vitals.lcp), rating: rate('lcp', vitals.lcp) },
		{ label: 'CLS', value: vitals.cls.toFixed(3), rating: rate('cls', vitals.cls) },
		{ label: 'INP', value: formatMs(vitals.inp), rating: rate('inp', vitals.inp), hint: 'after first interaction' },
		{ label: 'TTFB', value: formatMs(vitals.ttfb), rating: rate('ttfb', vitals.ttfb) },
		{ label: 'Route', value: formatMs(vitals.navigation), rating: null, hint: 'last client navigation' },
		{ label: 'Transfer', value: `${formatBytes(vitals.transfer)} · ${vitals.requests} req`, rating: null },
		{ label: 'DOM', value: `${vitals.domNodes} nodes`, rating: null }
	]);
</script>

{#if mounted && ui.hudVisible}
	<aside class="hud" aria-label="Performance of this visit">
		<header>
			<span class="label">This visit</span>
			<button type="button" class="close" aria-label="Close performance panel" onclick={() => ui.toggleHud()}>
				×
			</button>
		</header>
		<dl>
			{#each rows as row (row.label)}
				<div title={row.hint}>
					<dt>{row.label}</dt>
					<dd>
						{#if row.rating}<span class="dot {row.rating}" aria-hidden="true"></span>{/if}
						{row.value}
						{#if row.rating}<span class="sr-only">({row.rating.replace('-', ' ')})</span>{/if}
					</dd>
				</div>
			{/each}
		</dl>
		<p class="foot"><a href="/colophon">How this is measured</a></p>
	</aside>
{/if}

<style>
	.hud {
		position: fixed;
		left: var(--space-4);
		bottom: var(--space-4);
		z-index: 800;
		width: 15.5rem;
		padding: var(--space-3) var(--space-4) var(--space-3);
		border: var(--hairline) solid var(--line);
		border-radius: var(--radius-m);
		background: var(--veil);
		-webkit-backdrop-filter: saturate(180%) blur(20px);
		backdrop-filter: saturate(180%) blur(20px);
		box-shadow: var(--shadow-pop);
		font-family: var(--font-mono);
		font-size: 0.6875rem;
		font-variant-numeric: tabular-nums;
		animation: hud-in var(--duration-3) var(--ease-out) both;
	}

	@keyframes hud-in {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
	}

	header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: var(--space-2);
	}

	.close {
		width: 1.75rem;
		height: 1.75rem;
		margin-right: calc(var(--space-2) * -1);
		border: 0;
		background: none;
		color: var(--fg-3);
		font-size: 1rem;
		line-height: 1;
	}

	.close:hover {
		color: var(--fg);
	}

	dl div {
		display: flex;
		justify-content: space-between;
		gap: var(--space-3);
		padding-block: 0.3rem;
		border-top: var(--hairline) solid var(--line);
	}

	dt {
		color: var(--fg-3);
		text-transform: uppercase;
		letter-spacing: var(--track-label);
	}

	dd {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		color: var(--fg);
	}

	.dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
	}

	.good {
		background: var(--accent);
	}

	.needs-improvement {
		background: var(--fg-3);
	}

	.poor {
		background: var(--danger);
	}

	.foot {
		margin-top: var(--space-2);
		padding-top: var(--space-2);
		border-top: var(--hairline) solid var(--line);
	}

	.foot a {
		color: var(--fg-3);
		text-decoration: underline;
		text-underline-offset: 0.2em;
	}

	.foot a:hover {
		color: var(--fg);
	}

	@media (max-width: 47.99rem) {
		.hud {
			left: var(--space-3);
			right: var(--space-3);
			width: auto;
		}
	}
</style>
