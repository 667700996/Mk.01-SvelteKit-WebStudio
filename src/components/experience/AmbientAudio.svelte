<script lang="ts">
	import { onMount } from 'svelte';
	import { experienceStore } from '$services/experience';
	import { derived, get } from 'svelte/store';

	const isPlayingStore = derived(experienceStore, ($experience) => $experience.isAmbientAudioPlaying);
	const isPerformanceMode = derived(experienceStore, ($experience) => $experience.isPerformanceMode);

	let isPlaying = false;
	let audioElement: HTMLAudioElement | null = null;
	let canvas: HTMLCanvasElement | null = null;
	let ctx: AudioContext | null = null;
	let analyser: AnalyserNode | null = null;
	let dataArray: Uint8Array | null = null;
	let raf = 0;
	let visualizerActive = true;

	// Host locally to avoid hotlink errors; place file in static/audio/...
	const ambienceSrc = '/audio/cyberpunk-city-ambient.mp3';

function toggle() {
	experienceStore.toggleAmbientAudio();
}

	onMount(() => {
		const unsubscribePlay = isPlayingStore.subscribe((value) => {
			isPlaying = value;

			if (!audioElement) return;

			if (value) {
				audioElement
					.play()
					.then(() => {
						if (ctx && ctx.state === 'suspended') ctx.resume();
					})
					.catch(() => experienceStore.toggleAmbientAudio());
			} else {
				audioElement.pause();
			}
		});

		const unsubscribePerf = isPerformanceMode.subscribe((value) => {
			visualizerActive = !value;
			if (visualizerActive && isPlaying) {
				setupVisualizer();
			} else {
				cancelAnimationFrame(raf);
				analyser?.disconnect();
				if (ctx) {
					ctx.close();
					ctx = null;
				}
				if (canvas) {
					const ctx2d = canvas.getContext('2d');
					ctx2d?.clearRect(0, 0, canvas.width, canvas.height);
				}
			}
		});

		if (audioElement) {
			audioElement.volume = 0.35;
			audioElement.loop = true;
		}

		// Initial setup if not in performance mode
		if (!get(isPerformanceMode)) {
			setupVisualizer();
		}

		return () => {
			unsubscribePlay();
			unsubscribePerf();
			audioElement?.pause();
			cancelAnimationFrame(raf);
			analyser?.disconnect();
			if (ctx) {
				ctx.close();
			}
		};
	});

	function setupVisualizer() {
		if (canvas && !ctx && !get(isPerformanceMode)) { // Only setup if not already setup and not in perf mode
			ctx = new AudioContext();
			if (!audioElement) return; // Ensure audioElement is available
			const source = ctx.createMediaElementSource(audioElement);
			analyser = ctx.createAnalyser();
			analyser.fftSize = 256;
			source.connect(analyser);
			analyser.connect(ctx.destination);
			dataArray = new Uint8Array(analyser.frequencyBinCount);

			const c = canvas;
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			const resize = () => {
				const { width, height } = c.getBoundingClientRect();
				c.width = width * dpr;
				c.height = height * dpr;
			};
			window.addEventListener('resize', resize);
			resize();

			const draw = () => {
				if (!analyser || !dataArray || !c || !visualizerActive) return;
				analyser.getByteFrequencyData(dataArray);

				const ctx2d = c.getContext('2d');
				if (!ctx2d) return;
				const { width, height } = c;
				ctx2d.clearRect(0, 0, width, height);
				const barCount = 36;
				const slice = Math.floor(dataArray.length / barCount);

				for (let i = 0; i < barCount; i++) {
					const value = dataArray[i * slice];
					const scaled = (value / 255) * (height * 0.5);
					const x = (width / barCount) * i + 2;
					const barW = width / barCount - 4;
					const y = height - scaled - 8;
					const gradient = ctx2d.createLinearGradient(x, y, x, height);
					gradient.addColorStop(0, 'rgba(124,247,255,0.9)');
					gradient.addColorStop(1, 'rgba(255,107,203,0.5)');
					ctx2d.fillStyle = gradient;
					ctx2d.fillRect(x, y, barW, scaled);
					ctx2d.globalAlpha = 0.7;
				}

				raf = requestAnimationFrame(draw);
			};

			raf = requestAnimationFrame(draw);
		}
	}
</script>

<button class="ambient-toggle" type="button" on:click={toggle}>
	<span class="pulse" aria-hidden="true"></span>
	{#if isPlaying}
		<span class="label">Ambient on</span>
	{:else}
		<span class="label">Ambient off</span>
	{/if}
</button>

<audio bind:this={audioElement} src={ambienceSrc} preload="auto"></audio>
{#if visualizerActive}
<canvas bind:this={canvas} class="viz" aria-hidden="true"></canvas>
{/if}
<style>
	.ambient-toggle {
		position: fixed;
		right: 1.5rem;
		bottom: 1.5rem;
		z-index: 120;
		display: inline-flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.75rem 1.1rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(9, 13, 31, 0.55);
		color: rgba(226, 232, 255, 0.9);
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.28em;
		cursor: pointer;
		backdrop-filter: blur(12px);
		box-shadow: 0 12px 28px rgba(5, 8, 22, 0.35);
	}

	.pulse {
		width: 0.9rem;
		height: 0.9rem;
		border-radius: 999px;
		background: radial-gradient(circle, rgba(47, 93, 255, 0.9), rgba(47, 93, 255, 0.2));
		position: relative;
	}

	.pulse::after {
		content: '';
		position: absolute;
		inset: -0.35rem;
		border-radius: inherit;
		border: 2px solid rgba(47, 93, 255, 0.4);
		animation: ripple 2.2s ease-out infinite;
	}

	.label {
		white-space: nowrap;
	}

	.viz {
		position: fixed;
		right: 1.5rem;
		bottom: 4.6rem;
		width: 160px;
		height: 56px;
		pointer-events: none;
		mix-blend-mode: screen;
		opacity: 0.85;
		filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.3));
	}

	@keyframes ripple {
		0% {
			transform: scale(0.6);
			opacity: 0.9;
		}

		100% {
			transform: scale(1.4);
			opacity: 0;
		}
	}

	@media (max-width: 640px) {
		.ambient-toggle {
			right: 1rem;
			bottom: 1rem;
			gap: 0.5rem;
			padding: 0.6rem 0.9rem;
			letter-spacing: 0.2em;
		}
	}
</style>
