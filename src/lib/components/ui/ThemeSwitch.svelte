<script lang="ts">
	import { onMount } from 'svelte';
	import { ui, type ThemePreference } from '$lib/state/ui.svelte';

	// The stored preference is only known in the browser; render "Auto" on the
	// server and reconcile after hydration so markup never mismatches.
	let hydrated = $state(false);
	onMount(() => (hydrated = true));
	const current = $derived(hydrated ? ui.theme : 'system');

	const options: { value: ThemePreference; label: string }[] = [
		{ value: 'system', label: 'Auto' },
		{ value: 'light', label: 'Light' },
		{ value: 'dark', label: 'Dark' }
	];
</script>

<fieldset class="switch">
	<legend class="sr-only">Appearance</legend>
	{#each options as option (option.value)}
		<label>
			<input
				type="radio"
				name="theme"
				value={option.value}
				checked={current === option.value}
				onchange={() => ui.setTheme(option.value)}
			/>
			<span>{option.label}</span>
		</label>
	{/each}
</fieldset>

<style>
	.switch {
		display: inline-flex;
		padding: 2px;
		border: var(--hairline) solid var(--line);
		border-radius: 999px;
	}

	label {
		position: relative;
	}

	input {
		position: absolute;
		opacity: 0;
		inset: 0;
		margin: 0;
		cursor: pointer;
	}

	span {
		display: block;
		padding: var(--space-1) var(--space-3);
		border-radius: 999px;
		color: var(--fg-3);
		font-size: 0.8125rem;
		transition:
			background-color var(--duration-2) var(--ease-out),
			color var(--duration-2) var(--ease-out);
	}

	label:hover span {
		color: var(--fg);
	}

	input:checked + span {
		background: var(--bg-raised);
		color: var(--fg);
		box-shadow: inset 0 0 0 var(--hairline) var(--line);
	}

	input:focus-visible + span {
		outline: 2px solid var(--accent);
		outline-offset: 1px;
	}
</style>
