<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';

	// Sound definitions - simple synthesized sounds for interactions
	// In a real app, these would likely be small MP3/WAV files
	// For this prototype, we'll use AudioContext oscillators for a "techy" feel

	type ToneShape = 'sine' | 'square' | 'sawtooth' | 'triangle';

	const audioCtx = (() => {
		if (typeof window === 'undefined') return null;
		return new window.AudioContext();
	})();

	function playTone(freq: number, type: ToneShape = 'sine', duration = 0.1, vol = 0.1) {
		if (!audioCtx || audioCtx.state === 'suspended') return;

		const osc = audioCtx.createOscillator();
		const gain = audioCtx.createGain();

		osc.type = type;
		osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
		osc.connect(gain);
		gain.connect(audioCtx.destination);

		gain.gain.setValueAtTime(vol, audioCtx.currentTime);
		gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

		osc.start();
		osc.stop(audioCtx.currentTime + duration);
	}

	function playHover() {
		playTone(800, 'sine', 0.05, 0.02);
	}

	function playClick() {
		playTone(1200, 'triangle', 0.08, 0.05);
	}

	function playPageTransition() {
		playTone(400, 'sine', 0.3, 0.05);
		setTimeout(() => playTone(600, 'sine', 0.4, 0.03), 100);
	}

	onMount(() => {
		if (!audioCtx) return;

		// Attach listeners to interactive elements
		const attachListeners = () => {
			const interactives = document.querySelectorAll('a, button, input, [role="button"]');
			interactives.forEach((el) => {
				el.addEventListener('mouseenter', playHover);
				el.addEventListener('click', playClick);
			});
		};

		// Initial attach
		attachListeners();

		// Re-attach on DOM changes (e.g. navigation) - basic implementation
		const observer = new MutationObserver(() => {
			// Debounce could be added here
			attachListeners();
		});

		observer.observe(document.body, { childList: true, subtree: true });

		// Page transition sound
		const unsubscribe = page.subscribe(() => {
			playPageTransition();
		});

		// Unlock audio context on first interaction
		const unlock = () => {
			if (audioCtx.state === 'suspended') {
				audioCtx.resume();
			}
			window.removeEventListener('click', unlock);
			window.removeEventListener('keydown', unlock);
		};
		window.addEventListener('click', unlock);
		window.addEventListener('keydown', unlock);

		return () => {
			observer.disconnect();
			unsubscribe();
			const interactives = document.querySelectorAll('a, button, input, [role="button"]');
			interactives.forEach((el) => {
				el.removeEventListener('mouseenter', playHover);
				el.removeEventListener('click', playClick);
			});
		};
	});
</script>

<slot />
