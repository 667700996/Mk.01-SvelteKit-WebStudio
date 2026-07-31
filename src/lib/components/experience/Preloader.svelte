<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { experienceStore } from '$services/experience';

	export let loaded = false;

	let progress = 0;
let bootLines = [
	'INITIALIZING CORE...',
	'LOADING ASSETS...',
	'CONNECTING TO NEURAL NET...',
	'ESTABLISHING SECURE CONNECTION...',
	'SYSTEM READY.'
];
let visibleLines: string[] = [];
let hasGlitch = false; // Initialize to safe default
let failSafeTimeout: ReturnType<typeof setTimeout> | null = null;
let interval: ReturnType<typeof setInterval> | null = null;
let lineInterval: ReturnType<typeof setInterval> | null = null;

	onMount(() => {
		// Safe store subscription
		const unsub = experienceStore.subscribe(state => {
			hasGlitch = !state.isPerformanceMode;
		});

		// Start progress immediately
		interval = setInterval(() => {
			progress += Math.random() * 5;
			if (progress >= 100) {
				progress = 100;
				if (interval) clearInterval(interval);
				setTimeout(() => {
					loaded = true;
				}, 800);
			}
		}, 100);

		// Ensure we never hang at 0% if JS timing glitches happen.
		failSafeTimeout = setTimeout(() => {
			progress = 100;
			loaded = true;
			if (interval) clearInterval(interval);
			if (lineInterval) clearInterval(lineInterval);
		}, 3000); // Increased slightly to give normal load a chance

		// Reveal boot lines
		let lineIndex = 0;
		lineInterval = setInterval(() => {
			if (lineIndex < bootLines.length) {
				visibleLines = [...visibleLines, bootLines[lineIndex]];
				lineIndex++;
			} else {
				if (lineInterval) clearInterval(lineInterval);
			}
		}, 400);

		return () => {
			if (interval) clearInterval(interval);
			if (lineInterval) clearInterval(lineInterval);
			if (failSafeTimeout) clearTimeout(failSafeTimeout);
			unsub();
		};
	});</script>

{#if !loaded}
	<div class="preloader" out:fade={{ duration: 1000, easing: cubicOut }}>
		<div class="content">
			<div class="logo-wrap">
				<div class="logo-glitch" class:no-glitch={!hasGlitch} data-text="Mk.01">Mk.01</div>
			</div>
			
			<div class="terminal">
				{#each visibleLines as line}
					<p in:fly={{ y: 10, duration: 300 }} class="line">
						<span class="prefix">></span> {line}
					</p>
				{/each}
			</div>

			<div class="progress-bar-track">
				<div class="progress-bar-fill" style:width="{progress}%"></div>
			</div>
			<div class="progress-text">{Math.floor(progress)}%</div>
		</div>
	</div>
{/if}

<style>
	.preloader {
		position: fixed;
		inset: 0;
		z-index: 99999;
		background: #050505;
		display: grid;
		place-items: center;
		color: #e0e0e0;
		font-family: 'JetBrains Mono', monospace;
	}

	.content {
		width: 100%;
		max-width: 400px;
		display: flex;
		flex-col-gap: 2rem;
		flex-direction: column;
		align-items: flex-start;
	}

	.logo-wrap {
		margin-bottom: 2rem;
	}

	.logo-glitch {
		font-size: 3rem;
		font-weight: 800;
		position: relative;
		color: white;
		letter-spacing: -0.05em;
	}

	.logo-glitch::before,
	.logo-glitch::after {
		content: attr(data-text);
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: #050505;
	}

	.logo-glitch::before {
		left: 2px;
		text-shadow: -1px 0 #ff00c1;
		clip: rect(44px, 450px, 56px, 0);
		animation: glitch-anim-1 2s infinite linear alternate-reverse;
	}

	.logo-glitch.no-glitch::before {
		animation: none;
		clip: auto;
		text-shadow: none;
	}

	.logo-glitch::after {
		left: -2px;
		text-shadow: -1px 0 #00fff9;
		clip: rect(44px, 450px, 56px, 0);
		animation: glitch-anim-2 2s infinite linear alternate-reverse;
	}

	.logo-glitch.no-glitch::after {
		animation: none;
		clip: auto;
		text-shadow: none;
	}

	.terminal {
		min-height: 120px;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		font-size: 0.8rem;
		color: rgba(255, 255, 255, 0.7);
	}

	.line {
		display: flex;
		gap: 0.5rem;
	}

	.prefix {
		color: #00fff9;
	}

	.progress-bar-track {
		width: 100%;
		height: 2px;
		background: rgba(255, 255, 255, 0.1);
		margin-top: 1rem;
		position: relative;
		overflow: hidden;
	}

	.progress-bar-fill {
		height: 100%;
		background: #00fff9;
		box-shadow: 0 0 10px #00fff9;
	}

	.progress-text {
		font-size: 0.7rem;
		margin-top: 0.5rem;
		align-self: flex-end;
		color: rgba(255, 255, 255, 0.5);
	}

	@keyframes glitch-anim-1 {
		0% { clip: rect(30px, 9999px, 10px, 0); }
		20% { clip: rect(50px, 9999px, 80px, 0); }
		40% { clip: rect(10px, 9999px, 90px, 0); }
		60% { clip: rect(40px, 9999px, 20px, 0); }
		80% { clip: rect(70px, 9999px, 60px, 0); }
		100% { clip: rect(20px, 9999px, 50px, 0); }
	}

	@keyframes glitch-anim-2 {
		0% { clip: rect(10px, 9999px, 30px, 0); }
		20% { clip: rect(80px, 9999px, 10px, 0); }
		40% { clip: rect(90px, 9999px, 50px, 0); }
		60% { clip: rect(20px, 9999px, 70px, 0); }
		80% { clip: rect(60px, 9999px, 40px, 0); }
		100% { clip: rect(50px, 9999px, 90px, 0); }
	}
</style>
