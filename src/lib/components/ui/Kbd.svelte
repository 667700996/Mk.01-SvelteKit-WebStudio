<script lang="ts">
	import { onMount } from 'svelte';
	import { isApplePlatform } from '$lib/utils/platform';

	let { keys }: { keys: string[] } = $props();

	// Server renders the Apple glyph; the client corrects it after hydration.
	let apple = $state(true);
	onMount(() => (apple = isApplePlatform()));

	const labels = $derived(keys.map((key) => (key === 'mod' ? (apple ? '⌘' : 'Ctrl') : key)));
</script>

<kbd>{#each labels as label}<span>{label}</span>{/each}</kbd>

<style>
	kbd {
		display: inline-flex;
		align-items: center;
		gap: 0.125rem;
		padding: 0.0625rem 0.3125rem;
		border: var(--hairline) solid var(--line);
		border-radius: var(--radius-s);
		background: var(--bg-raised);
		color: var(--fg-3);
		font-family: var(--font-sans);
		font-size: 0.6875rem;
		font-weight: 500;
		letter-spacing: 0;
		line-height: 1.5;
	}
</style>
