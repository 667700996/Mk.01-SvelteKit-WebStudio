<script lang="ts">
	import { page } from '$app/stores';
	import { navigationConfig } from '$config/navigation.config';
	import { experienceStore } from '$services/experience';
	import { derived } from 'svelte/store';

	const { primary } = navigationConfig;

	let mobileOpen = false;

	const activePath = derived(page, ($page) => $page.url.pathname);

	function toggleMobileMenu() {
		mobileOpen = !mobileOpen;
	}

	function handleNavigate() {
		mobileOpen = false;
	}

	function openCommandPalette() {
		experienceStore.openCommandPalette();
	}

	function cycleTheme() {
		experienceStore.toggleTheme();
	}
</script>

<header class="nav-shell">
	<div class="nav-background" aria-hidden="true"></div>
	<div class="nav-gradient" aria-hidden="true"></div>

	<nav class="nav-container">
		<a href="/" class="brand">
			<span class="brand-glyph">MK</span>
			<span class="brand-lockup">
				<span class="brand-eyebrow">Studio Mk.01</span>
				<span class="brand-title">SvelteKit Playground</span>
			</span>
		</a>

		<div class="desktop-links">
			{#each primary as group}
				<div class="desktop-group">
					<span class="desktop-group-title">{group.title}</span>
					<ul>
						{#each group.items as item}
							{#if $activePath === item.href}
								<li>
									<a href={item.href} class="link active" aria-current="page">
										<span>{item.label}</span>
										{#if item.description}
											<small>{item.description}</small>
										{/if}
									</a>
								</li>
							{:else}
								<li>
									<a href={item.href} class="link" on:click={handleNavigate}>
										<span>{item.label}</span>
										{#if item.description}
											<small>{item.description}</small>
										{/if}
									</a>
								</li>
							{/if}
						{/each}
					</ul>
				</div>
			{/each}
		</div>

		<div class="actions">
			<button class="theme-button" type="button" on:click={cycleTheme}>
				<span class="sr-only">Toggle theme</span>
				<div class="theme-icon" aria-hidden="true">
					<div></div>
					<div></div>
				</div>
			</button>
			<button class="command-button" type="button" on:click={openCommandPalette}>
				<span>Command</span>
				<kbd>⌘K</kbd>
			</button>
			<a href="mailto:studio@mk1.dev" class="cta">Start a project</a>
			<button
				class="menu-button"
				type="button"
				on:click={toggleMobileMenu}
				aria-expanded={mobileOpen}
			>
				<span class="sr-only">Toggle navigation</span>
				<div class="menu-icon" aria-hidden="true">
					<div class:open={mobileOpen}></div>
					<div class:open={mobileOpen}></div>
				</div>
			</button>
		</div>
	</nav>

	<div class="mobile-sheet" class:mobile-open={mobileOpen}>
		<div class="mobile-inner">
			{#each primary as group}
				<section>
					<p class="mobile-group-title">{group.title}</p>
					<ul>
						{#each group.items as item}
							<li>
								<a href={item.href} class="mobile-link" on:click={handleNavigate}>
									<span>{item.label}</span>
									{#if item.description}
										<small>{item.description}</small>
									{/if}
								</a>
							</li>
						{/each}
					</ul>
				</section>
			{/each}
			<button class="mobile-command" type="button" on:click={openCommandPalette}>
				Open Command Palette
			</button>
		</div>
	</div>
</header>

<style>
	.nav-shell {
		position: sticky;
		top: 0;
		z-index: 40;
		isolation: isolate;
	}

	.nav-background {
		position: absolute;
		inset: 0;
		background: rgba(6, 10, 26, 0.78);
		backdrop-filter: blur(14px);
		border-bottom: 1px solid rgba(255, 255, 255, 0.04);
	}

	.nav-gradient {
		position: absolute;
		inset: auto 4rem 0 4rem;
		height: 60%;
		background: radial-gradient(120% 120% at 50% 0%, rgba(47, 93, 255, 0.25), transparent);
		filter: blur(60px);
		opacity: 0.6;
		pointer-events: none;
	}

	.nav-container {
		position: relative;
		z-index: 2;
		display: grid;
		grid-template-columns: auto 1fr auto;
		align-items: center;
		gap: 2rem;
		max-width: min(1140px, 92vw);
		margin: 0 auto;
		padding: 1rem 0;
		color: #dfe8ff;
	}

	.brand {
		display: inline-flex;
		align-items: center;
		gap: 1rem;
		text-decoration: none;
		color: inherit;
	}

	.brand-glyph {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 3rem;
		height: 3rem;
		border-radius: 18px;
		background: conic-gradient(from 140deg, #6c63ff, #ff6bcb, #6c63ff);
		color: #050816;
		font-weight: 700;
		letter-spacing: 0.06em;
		box-shadow: 0 8px 24px rgba(108, 99, 255, 0.35);
	}

	.brand-lockup {
		display: flex;
		flex-direction: column;
		font-size: 0.75rem;
		line-height: 1.2;
		text-transform: uppercase;
		letter-spacing: 0.3em;
		opacity: 0.85;
	}

	.brand-title {
		font-size: 0.95rem;
		letter-spacing: 0.14em;
		text-transform: none;
		font-weight: 600;
	}

	.desktop-links {
		display: grid;
		grid-auto-flow: column;
		gap: 1.5rem;
	}

	.desktop-group {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
	}

	.desktop-group-title {
		font-size: 0.65rem;
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.28em;
		opacity: 0.5;
	}

	.desktop-group ul {
		display: flex;
		gap: 0.75rem;
	}

	.link {
		position: relative;
		display: inline-flex;
		flex-direction: column;
		gap: 0.2rem;
		padding: 0.3rem 0.6rem;
		border-radius: 0.9rem;
		background: rgba(255, 255, 255, 0.02);
		color: inherit;
		text-decoration: none;
		transition:
			background 200ms ease,
			color 200ms ease,
			transform 200ms ease;
	}

	.link small {
		font-size: 0.65rem;
		opacity: 0.65;
		letter-spacing: 0.05em;
	}

	.link:hover,
	.link:focus-visible {
		background: rgba(108, 99, 255, 0.2);
		transform: translateY(-2px);
	}

	.link.active {
		background: rgba(108, 99, 255, 0.28);
		box-shadow: 0 10px 30px rgba(108, 99, 255, 0.25);
	}

	.actions {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.theme-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 2.4rem;
		height: 2.4rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(255, 255, 255, 0.05);
		color: inherit;
		transition:
			transform 200ms ease,
			border 200ms ease,
			background 200ms ease;
	}

	.theme-button:hover,
	.theme-button:focus-visible {
		transform: translateY(-1px);
		border-color: rgba(255, 255, 255, 0.2);
		background: rgba(255, 255, 255, 0.12);
	}

	.theme-icon {
		position: relative;
		width: 1.2rem;
		height: 1.2rem;
	}

	.theme-icon div:first-child {
		position: absolute;
		inset: 0;
		border-radius: 999px;
		border: 2px solid currentColor;
		opacity: 0.8;
	}

	.theme-icon div:last-child {
		position: absolute;
		top: -0.2rem;
		right: -0.15rem;
		width: 0.6rem;
		height: 0.6rem;
		border-radius: 999px;
		background: currentColor;
		box-shadow: 0 0 12px rgba(255, 255, 255, 0.35);
	}

	.command-button {
		display: inline-flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.6rem 0.95rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.08);
		background: rgba(255, 255, 255, 0.05);
		color: inherit;
		font-size: 0.8rem;
		letter-spacing: 0.04em;
		text-transform: uppercase;
		cursor: pointer;
		transition:
			background 200ms ease,
			border 200ms ease,
			transform 200ms ease;
	}

	.command-button:hover,
	.command-button:focus-visible {
		background: rgba(108, 99, 255, 0.18);
		border-color: rgba(108, 99, 255, 0.6);
		transform: translateY(-1px);
	}

	.command-button kbd {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.15rem 0.45rem;
		border-radius: 0.4rem;
		background: rgba(255, 255, 255, 0.08);
		font-size: 0.7rem;
		font-family: 'JetBrains Mono', monospace;
	}

	.cta {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.65rem 1.1rem;
		border-radius: 999px;
		background: linear-gradient(135deg, rgba(108, 99, 255, 0.95), rgba(255, 107, 203, 0.95));
		color: #050816;
		font-weight: 600;
		text-transform: uppercase;
		font-size: 0.75rem;
		letter-spacing: 0.2em;
		text-decoration: none;
		box-shadow: 0 12px 34px rgba(108, 99, 255, 0.4);
		transition:
			transform 200ms ease,
			box-shadow 200ms ease;
	}

	.cta:hover,
	.cta:focus-visible {
		transform: translateY(-2px);
		box-shadow: 0 16px 40px rgba(108, 99, 255, 0.5);
	}

	.menu-button {
		display: none;
		padding: 0.4rem;
		border-radius: 999px;
		border: 1px solid rgba(255, 255, 255, 0.1);
		background: rgba(255, 255, 255, 0.03);
		color: inherit;
	}

	.menu-icon {
		width: 1.75rem;
		height: 1.75rem;
		position: relative;
	}

	.menu-icon div {
		position: absolute;
		left: 0.2rem;
		right: 0.2rem;
		height: 2px;
		background: currentColor;
		border-radius: 999px;
		transition:
			transform 200ms ease,
			top 200ms ease,
			opacity 200ms ease;
	}

	.menu-icon div:first-child {
		top: 0.6rem;
	}

	.menu-icon div:last-child {
		top: 1.1rem;
	}

	.menu-icon div.open:first-child {
		top: 0.85rem;
		transform: rotate(45deg);
	}

	.menu-icon div.open:last-child {
		top: 0.85rem;
		transform: rotate(-45deg);
	}

	.mobile-sheet {
		position: absolute;
		inset: 100% 0 auto 0;
		transform: translateY(-1rem);
		background: rgba(5, 8, 22, 0.96);
		border-bottom: 1px solid rgba(255, 255, 255, 0.1);
		backdrop-filter: blur(18px);
		max-height: 0;
		overflow: hidden;
		transition:
			max-height 280ms ease,
			opacity 240ms ease;
		opacity: 0;
	}

	.mobile-sheet.mobile-open {
		max-height: 420px;
		opacity: 1;
	}

	.mobile-inner {
		padding: 1.25rem 1.5rem 2rem;
		display: grid;
		gap: 1.5rem;
		color: #f1f4ff;
	}

	.mobile-group-title {
		font-size: 0.7rem;
		text-transform: uppercase;
		letter-spacing: 0.28em;
		opacity: 0.55;
		margin-bottom: 0.4rem;
	}

	.mobile-link {
		display: flex;
		flex-direction: column;
		gap: 0.3rem;
		padding: 0.75rem 0.9rem;
		margin: 0 -0.9rem;
		border-radius: 1rem;
		text-decoration: none;
		color: inherit;
		background: rgba(255, 255, 255, 0.02);
		transition:
			background 180ms ease,
			transform 180ms ease;
	}

	.mobile-link:hover,
	.mobile-link:focus-visible {
		background: rgba(108, 99, 255, 0.2);
		transform: translateX(4px);
	}

	.mobile-link small {
		font-size: 0.75rem;
		opacity: 0.7;
	}

	.mobile-command {
		width: 100%;
		padding: 0.85rem 1rem;
		border-radius: 0.9rem;
		border: 1px solid rgba(255, 255, 255, 0.12);
		background: rgba(255, 255, 255, 0.03);
		color: inherit;
		font-weight: 600;
		letter-spacing: 0.14em;
		text-transform: uppercase;
	}

	@media (max-width: 1024px) {
		.desktop-links {
			display: none;
		}

		.nav-container {
			grid-template-columns: 1fr auto;
			gap: 1rem;
		}

		.actions {
			gap: 0.6rem;
		}

		.command-button {
			display: none;
		}

		.cta {
			display: none;
		}

		.menu-button {
			display: inline-flex;
			align-items: center;
			justify-content: center;
		}
	}

	@media (max-width: 520px) {
		.brand-glyph {
			width: 2.6rem;
			height: 2.6rem;
		}

		.brand-lockup {
			display: none;
		}
	}
</style>
