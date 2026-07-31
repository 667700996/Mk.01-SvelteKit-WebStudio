<script lang="ts">
	import { onMount } from 'svelte';
	import { derived } from 'svelte/store';
	import { navigationConfig } from '$config/navigation.config';
	import { experienceStore } from '$services/experience';
	import { sampleProjects } from '$modules/work';
	import { labExperiments } from '$modules/labs';

	const sections = navigationConfig.commandPalette;

	let query = '';
	let inputElement: HTMLInputElement | null = null;

	const isOpen = derived(experienceStore, ($experience) => $experience.isCommandPaletteOpen);

	const navActions = sections.flatMap((section) =>
		section.actions.map((action) => ({
			section: section.title,
			type: 'Navigation',
			tags: [],
			score: 0,
			...action
		}))
	);

	const projectActions = sampleProjects.map((project) => ({
		section: 'Work',
		type: 'Case study',
		label: project.title,
		description: project.summary,
		href: `/work/${project.slug}`,
		accent: 'secondary',
		tags: project.tags,
		score: 0
	}));

	const labActions = labExperiments.map((experiment) => ({
		section: 'Labs',
		type: 'Experiment',
		label: experiment.title,
		description: experiment.summary,
		href: `/labs/${experiment.slug}`,
		accent: 'accent',
		tags: experiment.tech,
		score: 0
	}));

	const searchable = [...navActions, ...projectActions, ...labActions, {
		section: 'Settings',
		type: 'Action',
		label: 'Toggle Performance Mode',
		description: 'Reduce animations for better performance',
		href: '#', // Handled by action, not navigation
		accent: 'ghost',
		tags: ['settings', 'performance', 'animations'],
		score: 0,
		action: () => experienceStore.togglePerformanceMode()
	}];

	function rankActions(term: string) {
		const q = term.trim().toLowerCase();
		if (!q) return searchable.slice(0, 14);

		return searchable
			.map((item) => {
				const haystack = `${item.label} ${item.description ?? ''} ${item.section} ${item.tags?.join(' ')}`.toLowerCase();
				const score = haystack.includes(q) ? 3 : q.split(/\s+/).reduce((acc, token) => acc + (haystack.includes(token) ? 1 : 0), 0);
				return { ...item, score };
			})
			.filter((item) => item.score > 0)
			.sort((a, b) => b.score - a.score)
			.slice(0, 14);
	}

	$: filteredActions = rankActions(query);

	function closePalette() {
		experienceStore.closeCommandPalette();
		query = '';
	}

	function handleKeydown(event: KeyboardEvent) {
		if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
			event.preventDefault();
			if (event.shiftKey) {
				experienceStore.toggleTheme();
				return;
			}
			if (event.altKey) {
				experienceStore.toggleAmbientAudio();
				return;
			}
			experienceStore.openCommandPalette();
		}

		if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'p') {
			event.preventDefault();
			experienceStore.togglePerformanceMode();
			closePalette(); // Close palette after toggling performance mode
			return;
		}

		if (event.key === 'Escape') {
			closePalette();
		}
	}

	let focusFrame: number | null = null;

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);

		return () => {
			window.removeEventListener('keydown', handleKeydown);
			if (focusFrame !== null) {
				cancelAnimationFrame(focusFrame);
				focusFrame = null;
			}
		};
	});

	$: {
		if ($isOpen && inputElement) {
			focusFrame = requestAnimationFrame(() => {
				inputElement?.focus();
			});
		} else if (focusFrame !== null) {
			cancelAnimationFrame(focusFrame);
			focusFrame = null;
		}
	}
</script>

{#if $isOpen}
	<div class="fixed inset-0 z-[200] grid place-items-center p-4" role="dialog" aria-modal="true">
		<!-- Backdrop -->
		<button 
			type="button" 
			class="absolute inset-0 bg-base-300/60 backdrop-blur-md transition-opacity" 
			on:click={closePalette} 
			aria-label="Close palette"
		></button>

		<!-- Palette -->
		<div class="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-base-content/10 bg-base-100/95 shadow-2xl backdrop-blur-xl ring-1 ring-base-content/5">
			
			<!-- Header -->
			<header class="border-b border-base-content/10 p-3">
				<div class="relative flex items-center">
					<svg class="pointer-events-none absolute left-4 h-5 w-5 text-base-content/50" viewBox="0 0 20 20" fill="currentColor">
						<path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
					</svg>
					<input
						bind:this={inputElement}
						type="text"
						class="h-12 w-full bg-transparent pl-11 pr-4 text-base text-base-content placeholder-base-content/40 focus:outline-none"
						placeholder="Search actions, pages, or ideas…"
						bind:value={query}
					/>
					<button 
						type="button" 
						class="ml-2 rounded-lg p-2 text-base-content/50 hover:bg-base-content/10 hover:text-base-content" 
						on:click={closePalette} 
						aria-label="Close palette"
					>
						<span class="sr-only">Close</span>
						<kbd class="font-sans text-xs">ESC</kbd>
					</button>
				</div>
			</header>

			<!-- Results -->
			<section class="max-h-[60vh] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-base-content/10 scrollbar-track-transparent">
				{#if filteredActions.length === 0}
					<div class="flex flex-col items-center justify-center py-12 text-center text-base-content/60">
						<p class="text-sm">No results found.</p>
						<p class="mt-1 text-xs opacity-70">Try searching for 'Work', 'Labs', or 'About'.</p>
					</div>
				{:else}
					<ul class="space-y-1">
						{#each filteredActions as action, index (action.href + index)}
							<li>
								<a 
									href={action.href !== '#' ? action.href : undefined} 
									on:click={(e) => {
										if (action.action) {
											e.preventDefault();
											action.action();
										}
										closePalette();
									}}
									class="group flex items-center justify-between rounded-lg px-4 py-3 transition-colors hover:bg-base-content/5 focus:bg-base-content/5 focus:outline-none"
								>
									<div class="flex flex-col gap-0.5">
										<div class="flex items-center gap-2">
											<span class="font-medium text-base-content group-hover:text-primary transition-colors">{action.label}</span>
											{#if action.type}
												<span class="rounded bg-base-content/10 px-1.5 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-base-content/70">
													{action.type}
												</span>
											{/if}
										</div>
										{#if action.description}
											<span class="text-xs text-base-content/60 line-clamp-1">{action.description}</span>
										{/if}
									</div>

									{#if action.accent}
										<div class={`badge badge-sm uppercase tracking-widest text-[0.6rem] font-bold ${
											action.accent === 'secondary' ? 'badge-secondary' : 
											action.accent === 'accent' ? 'badge-accent' : action.accent === 'ghost' ? 'badge-ghost' : ''
										}`}>
											{action.accent === 'secondary' ? 'Case' : action.accent === 'accent' ? 'Lab' : action.accent === 'ghost' ? 'Action' : 'Nav'}
										</div>
									{/if}
								</a>
							</li>
						{/each}
					</ul>
				{/if}
			</section>

			<!-- Footer -->
			<footer class="hidden items-center justify-end gap-4 border-t border-base-content/10 bg-base-200/50 px-4 py-2 text-[0.65rem] font-medium uppercase tracking-widest text-base-content/50 sm:flex">
				<div class="flex items-center gap-1.5">
					<kbd class="rounded border border-base-content/20 bg-base-100 px-1.5 py-0.5 font-mono">⌘K</kbd>
					<span>Open</span>
				</div>
				<div class="flex items-center gap-1.5">
					<kbd class="rounded border border-base-content/20 bg-base-100 px-1.5 py-0.5 font-mono">↑↓</kbd>
					<span>Navigate</span>
				</div>
				<div class="flex items-center gap-1.5">
					<kbd class="rounded border border-base-content/20 bg-base-100 px-1.5 py-0.5 font-mono">⏎</kbd>
					<span>Select</span>
				</div>
				<div class="flex items-center gap-1.5">
					<kbd class="rounded border border-base-content/20 bg-base-100 px-1.5 py-0.5 font-mono">⌘P</kbd>
					<span>Perf Mode</span>
				</div>
			</footer>
		</div>
	</div>
{/if}
