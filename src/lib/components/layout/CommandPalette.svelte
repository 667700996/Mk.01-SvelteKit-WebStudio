<script lang="ts">
	import { goto } from '$app/navigation';
	import { siteConfig } from '$lib/config/site';
	import { paletteNav } from '$config/navigation.config';
	import { ui, type ThemePreference } from '$lib/state/ui.svelte';
	import { highlight, search, type SearchEntry } from '$lib/utils/search';
	import Kbd from '$lib/components/ui/Kbd.svelte';

	type Entry = SearchEntry & { run?: () => void | Promise<void> };

	let dialog: HTMLDialogElement;
	let list = $state<HTMLElement>();
	let query = $state('');
	let active = $state(0);
	let notice = $state('');
	let remote = $state<SearchEntry[] | null>(null);
	let loading: Promise<void> | null = null;

	const themeAction = (preference: ThemePreference, label: string): Entry => ({
		id: `theme:${preference}`,
		group: 'Actions',
		label,
		description: 'Appearance',
		keywords: ['theme', 'appearance', 'mode'],
		run: () => ui.setTheme(preference)
	});

	const actions: Entry[] = [
		{
			id: 'copy-email',
			group: 'Actions',
			label: 'Copy email address',
			description: siteConfig.contactEmail,
			keywords: ['contact', 'mail'],
			run: async () => {
				await navigator.clipboard.writeText(siteConfig.contactEmail);
				flash('Email address copied');
			}
		},
		themeAction('light', 'Use light appearance'),
		themeAction('dark', 'Use dark appearance'),
		themeAction('system', 'Match system appearance'),
		{
			id: 'grid',
			group: 'Actions',
			label: 'Toggle layout grid',
			description: 'Shortcut: G',
			keywords: ['columns', 'debug', 'design'],
			run: () => {
				ui.gridVisible = !ui.gridVisible;
			}
		}
	];

	// Until the full index arrives, pages are searchable from the bundled config.
	const fallback: SearchEntry[] = paletteNav.map((link) => ({
		id: `page:${link.href}`,
		group: 'Pages',
		label: link.label,
		description: link.description,
		href: link.href
	}));

	const entries = $derived<Entry[]>([...(remote ?? fallback), ...actions]);
	const results = $derived(
		query.trim() ? search(entries, query, 30) : search(entries.filter(isDefault), '', 30)
	);
	const groups = $derived.by(() => {
		const map = new Map<string, typeof results>();
		for (const result of results) {
			const group = map.get(result.entry.group) ?? [];
			group.push(result);
			map.set(result.entry.group, group);
		}
		return [...map];
	});
	// Flat order as rendered, so arrow keys follow what the eye sees.
	const ordered = $derived(groups.flatMap(([, items]) => items));

	function isDefault(entry: Entry) {
		return entry.group === 'Pages' || entry.group === 'Work' || entry.id === 'copy-email';
	}

	function loadIndex() {
		loading ??= fetch('/search.json')
			.then((response) => (response.ok ? response.json() : Promise.reject(response.status)))
			.then((data: SearchEntry[]) => void (remote = data))
			.catch(() => {
				loading = null; // Retry on next open; the fallback keeps pages searchable.
			});
	}

	function flash(message: string) {
		notice = message;
		setTimeout(() => notice === message && (notice = ''), 1800);
	}

	async function choose(entry: Entry) {
		if (entry.run) {
			await entry.run();
			if (entry.id !== 'copy-email') ui.paletteOpen = false;
			return;
		}
		ui.paletteOpen = false;
		if (entry.href) await goto(entry.href);
	}

	function move(delta: number) {
		if (!ordered.length) return;
		active = (active + delta + ordered.length) % ordered.length;
		requestAnimationFrame(() =>
			list?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'nearest' })
		);
	}

	function onInputKey(event: KeyboardEvent) {
		const keys: Record<string, () => void> = {
			ArrowDown: () => move(1),
			ArrowUp: () => move(-1),
			Home: () => move(-active),
			End: () => move(ordered.length - 1 - active),
			Enter: () => ordered[active] && choose(ordered[active].entry)
		};
		if (event.key in keys && !event.isComposing) {
			if ((event.key === 'Home' || event.key === 'End') && !event.ctrlKey && query) return;
			event.preventDefault();
			keys[event.key]();
		}
	}

	function isTyping(target: EventTarget | null) {
		return (
			target instanceof HTMLElement &&
			(target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName))
		);
	}

	function onGlobalKey(event: KeyboardEvent) {
		if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
			event.preventDefault();
			ui.paletteOpen = !ui.paletteOpen;
			return;
		}
		if (ui.paletteOpen || isTyping(event.target) || event.metaKey || event.ctrlKey || event.altKey)
			return;
		if (event.key === '/') {
			event.preventDefault();
			ui.paletteOpen = true;
		} else if (event.key.toLowerCase() === 'g') {
			ui.gridVisible = !ui.gridVisible;
		}
	}

	// Keep the native dialog in sync with state; the dialog handles focus
	// trapping, Escape, inertness of the page, and focus restoration.
	$effect(() => {
		if (ui.paletteOpen && !dialog.open) {
			loadIndex();
			query = '';
			active = 0;
			dialog.showModal();
		} else if (!ui.paletteOpen && dialog.open) {
			dialog.close();
		}
	});

	$effect(() => {
		void query;
		active = 0;
	});
</script>

<svelte:window onkeydown={onGlobalKey} />

<dialog
	bind:this={dialog}
	class="palette"
	aria-label="Search and commands"
	onclose={() => (ui.paletteOpen = false)}
	onclick={(event) => event.target === dialog && (ui.paletteOpen = false)}
>
	<div class="panel">
		<div class="field">
			<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
				<circle cx="7" cy="7" r="4.75" />
				<path d="M10.5 10.5 14 14" />
			</svg>
			<input
				bind:value={query}
				onkeydown={onInputKey}
				type="text"
				role="combobox"
				aria-expanded="true"
				aria-controls="palette-results"
				aria-autocomplete="list"
				aria-activedescendant={ordered[active] ? `opt-${ordered[active].entry.id}` : undefined}
				placeholder="Search pages, work, labs, writing…"
				autocomplete="off"
				spellcheck="false"
			/>
			<Kbd keys={['esc']} />
		</div>

		<div class="results" id="palette-results" role="listbox" aria-label="Results" bind:this={list}>
			{#each groups as [group, items] (group)}
				<div role="group" aria-labelledby="group-{group}">
					<p class="label group" id="group-{group}" role="presentation">{group}</p>
					{#each items as { entry, indices } (entry.id)}
						{@const index = ordered.findIndex((result) => result.entry.id === entry.id)}
						<div
							id="opt-{entry.id}"
							class="option"
							role="option"
							tabindex="-1"
							aria-selected={index === active}
							onpointermove={() => (active = index)}
							onclick={() => choose(entry)}
							onkeydown={() => {}}
						>
							<span class="title">
								{#each highlight(entry.label, indices) as segment}
									{#if segment.match}<mark>{segment.text}</mark>{:else}{segment.text}{/if}
								{/each}
							</span>
							{#if entry.description}
								<span class="description">{entry.description}</span>
							{/if}
							<span class="enter" aria-hidden="true">↵</span>
						</div>
					{/each}
				</div>
			{:else}
				<p class="empty">No results for “{query}”.</p>
			{/each}
		</div>

		<footer class="footer">
			<span class="hint"><Kbd keys={['↑', '↓']} /> to move</span>
			<span class="hint"><Kbd keys={['↵']} /> to open</span>
			<span class="notice" role="status">{notice}</span>
		</footer>
	</div>
</dialog>

<style>
	.palette {
		width: min(40rem, calc(100vw - 2 * var(--space-4)));
		max-height: none;
		margin: min(14vh, 8rem) auto auto;
		padding: 0;
		border: 0;
		background: transparent;
		color: var(--fg);
		overflow: visible;
	}

	.palette::backdrop {
		background: rgb(0 0 0 / 0.28);
		-webkit-backdrop-filter: blur(2px);
		backdrop-filter: blur(2px);
	}

	/* Entry motion via @starting-style; browsers without it simply appear. */
	.palette[open],
	.palette[open]::backdrop {
		transition:
			opacity var(--duration-2) var(--ease-out),
			transform var(--duration-3) var(--ease-out),
			overlay var(--duration-2) allow-discrete,
			display var(--duration-2) allow-discrete;
	}

	.palette[open] {
		opacity: 1;
		transform: none;
	}

	@starting-style {
		.palette[open] {
			opacity: 0;
			transform: translateY(-6px) scale(0.985);
		}

		.palette[open]::backdrop {
			opacity: 0;
		}
	}

	.panel {
		display: flex;
		flex-direction: column;
		max-height: min(32rem, 72vh);
		border: var(--hairline) solid var(--line);
		border-radius: var(--radius-l);
		background: var(--bg);
		box-shadow: var(--shadow-pop);
		overflow: hidden;
	}

	.field {
		display: flex;
		align-items: center;
		gap: var(--space-3);
		padding: 0 var(--space-5);
		border-bottom: var(--hairline) solid var(--line);
	}

	.field svg {
		flex: none;
		fill: none;
		stroke: var(--fg-3);
		stroke-width: 1.5;
		stroke-linecap: round;
	}

	input {
		flex: 1;
		min-width: 0;
		height: 3.75rem;
		border: 0;
		background: none;
		font-size: 1.125rem;
		letter-spacing: -0.014em;
		outline: none;
	}

	input::placeholder {
		color: var(--fg-3);
	}

	.results {
		flex: 1;
		overflow-y: auto;
		overscroll-behavior: contain;
		padding: var(--space-2);
		scroll-padding-block: var(--space-7) var(--space-2);
	}

	.group {
		padding: var(--space-4) var(--space-3) var(--space-2);
	}

	.option {
		display: grid;
		grid-template-columns: minmax(0, auto) minmax(0, 1fr) auto;
		align-items: baseline;
		gap: var(--space-3);
		padding: var(--space-3);
		border-radius: var(--radius-m);
		cursor: pointer;
	}

	.option[aria-selected='true'] {
		background: var(--bg-raised);
	}

	.title {
		font-weight: 520;
		white-space: nowrap;
	}

	mark {
		background: none;
		color: var(--accent);
	}

	.description {
		overflow: hidden;
		color: var(--fg-3);
		font-size: var(--text-small);
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.enter {
		color: var(--fg-3);
		font-size: 0.8125rem;
		opacity: 0;
	}

	.option[aria-selected='true'] .enter {
		opacity: 1;
	}

	.empty {
		padding: var(--space-7) var(--space-4);
		color: var(--fg-3);
		text-align: center;
	}

	.footer {
		display: flex;
		align-items: center;
		gap: var(--space-5);
		padding: var(--space-3) var(--space-5);
		border-top: var(--hairline) solid var(--line);
		color: var(--fg-3);
		font-size: 0.8125rem;
	}

	.hint {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
	}

	.notice {
		margin-left: auto;
		color: var(--fg);
	}

	@media (max-width: 40rem) {
		.palette {
			margin-top: var(--space-4);
		}

		.description,
		.hint {
			display: none;
		}

		.option {
			grid-template-columns: 1fr auto;
		}
	}
</style>
