<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { primaryNav } from '$config/navigation.config';
	import { ui } from '$lib/state/ui.svelte';
	import Kbd from '$lib/components/ui/Kbd.svelte';

	let scrolled = $state(false);
	let menuOpen = $state(false);

	const isCurrent = (href: string) =>
		page.url.pathname === href || page.url.pathname.startsWith(`${href}/`);

	afterNavigate(() => (menuOpen = false));

	$effect(() => {
		if (!menuOpen) return;
		const { style } = document.documentElement;
		style.overflow = 'hidden';
		const onKey = (event: KeyboardEvent) => event.key === 'Escape' && (menuOpen = false);
		const desktop = matchMedia('(min-width: 48rem)');
		const onResize = () => desktop.matches && (menuOpen = false);
		window.addEventListener('keydown', onKey);
		desktop.addEventListener('change', onResize);
		return () => {
			style.removeProperty('overflow');
			window.removeEventListener('keydown', onKey);
			desktop.removeEventListener('change', onResize);
		};
	});
</script>

<svelte:window onscroll={() => (scrolled = window.scrollY > 4)} />

<header class="header" class:scrolled class:open={menuOpen}>
	<div class="wrap bar">
		<a class="brand" href="/" aria-label="MK.01, home">
			MK.01
		</a>

		<nav class="primary" aria-label="Primary">
			<ul role="list">
				{#each primaryNav as link (link.href)}
					<li>
						<a href={link.href} aria-current={isCurrent(link.href) ? 'page' : undefined}>
							{link.label}
						</a>
					</li>
				{/each}
			</ul>
		</nav>

		<div class="tools">
			<button
				class="search"
				type="button"
				aria-label="Search the site"
				aria-keyshortcuts="Meta+K Control+K"
				onclick={() => (ui.paletteOpen = true)}
			>
				<svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true">
					<circle cx="7" cy="7" r="4.75" />
					<path d="M10.5 10.5 14 14" />
				</svg>
				<span class="search-label">Search</span>
				<Kbd keys={['mod', 'K']} />
			</button>

			<button
				class="menu-toggle"
				type="button"
				aria-expanded={menuOpen}
				aria-controls="mobile-menu"
				aria-label={menuOpen ? 'Close menu' : 'Open menu'}
				onclick={() => (menuOpen = !menuOpen)}
			>
				<span></span>
				<span></span>
			</button>
		</div>
	</div>

	<nav id="mobile-menu" class="sheet" aria-label="Mobile" hidden={!menuOpen}>
		<ul role="list">
			{#each primaryNav as link, index (link.href)}
				<li style:--i={index}>
					<a href={link.href} aria-current={isCurrent(link.href) ? 'page' : undefined}>
						{link.label}
					</a>
				</li>
			{/each}
		</ul>
	</nav>
</header>

<style>
	.header {
		position: sticky;
		top: 0;
		z-index: 50;
		view-transition-name: site-header;
	}

	/* The bar's material lives on a pseudo-element so the open sheet can share it. */
	.header::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		border-bottom: var(--hairline) solid transparent;
		background: var(--veil);
		-webkit-backdrop-filter: saturate(180%) blur(20px);
		backdrop-filter: saturate(180%) blur(20px);
		transition: border-color var(--duration-3) var(--ease-out);
	}

	.scrolled::before,
	.open::before {
		border-bottom-color: var(--line);
	}

	.open::before {
		background: var(--bg);
	}

	.bar {
		display: flex;
		align-items: center;
		gap: var(--space-6);
		height: var(--nav-height);
	}

	.brand {
		font-size: 1.0625rem;
		font-weight: 680;
		letter-spacing: -0.035em;
		margin-right: auto;
	}

	.primary ul {
		display: flex;
		gap: var(--space-1);
	}

	.primary a {
		position: relative;
		display: block;
		padding: var(--space-2) var(--space-3);
		color: var(--fg-2);
		font-size: 0.875rem;
		letter-spacing: -0.006em;
		transition: color var(--duration-2) var(--ease-out);
	}

	.primary a:hover,
	.primary a[aria-current='page'] {
		color: var(--fg);
	}

	.primary a[aria-current='page']::after {
		content: '';
		position: absolute;
		left: 50%;
		bottom: 0;
		width: 4px;
		height: 4px;
		border-radius: 50%;
		background: currentColor;
		translate: -50% 0;
	}

	.tools {
		display: flex;
		align-items: center;
		gap: var(--space-2);
	}

	.search {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
		height: 2rem;
		padding: 0 var(--space-2) 0 var(--space-3);
		border: var(--hairline) solid var(--line);
		border-radius: 999px;
		background: transparent;
		color: var(--fg-2);
		font-size: 0.8125rem;
		transition:
			border-color var(--duration-2) var(--ease-out),
			color var(--duration-2) var(--ease-out);
	}

	.search:hover {
		border-color: var(--line-strong);
		color: var(--fg);
	}

	.search svg {
		fill: none;
		stroke: currentColor;
		stroke-width: 1.5;
		stroke-linecap: round;
	}

	.menu-toggle {
		display: none;
		position: relative;
		width: 2.75rem;
		height: 2.75rem;
		margin-right: calc(var(--space-3) * -1);
		border: 0;
		background: none;
	}

	.menu-toggle span {
		position: absolute;
		left: 50%;
		top: 50%;
		width: 1.125rem;
		height: 1.5px;
		border-radius: 1px;
		background: var(--fg);
		translate: -50% calc(-50% + var(--y));
		transition:
			translate var(--duration-3) var(--ease-out),
			rotate var(--duration-3) var(--ease-out);
	}

	.menu-toggle span:first-child {
		--y: -3.5px;
	}

	.menu-toggle span:last-child {
		--y: 3.5px;
	}

	.menu-toggle[aria-expanded='true'] span {
		--y: 0px;
	}

	.menu-toggle[aria-expanded='true'] span:first-child {
		rotate: 45deg;
	}

	.menu-toggle[aria-expanded='true'] span:last-child {
		rotate: -45deg;
	}

	.sheet {
		position: fixed;
		inset: var(--nav-height) 0 0;
		background: var(--bg);
		overflow-y: auto;
	}

	.sheet ul {
		padding: var(--space-5) var(--margin) var(--space-8);
	}

	.sheet a {
		display: block;
		padding-block: var(--space-2);
		font-size: 2rem;
		font-weight: 600;
		letter-spacing: -0.035em;
	}

	.sheet a[aria-current='page'] {
		color: var(--fg-3);
	}

	.sheet:not([hidden]) li {
		animation: sheet-in var(--duration-3) var(--ease-out) both;
		animation-delay: calc(var(--i) * 30ms + 40ms);
	}

	@keyframes sheet-in {
		from {
			opacity: 0;
			transform: translateY(-0.5rem);
		}
	}

	@media (max-width: 47.99rem) {
		.primary,
		.search-label,
		.search :global(kbd) {
			display: none;
		}

		.search {
			width: 2.75rem;
			height: 2.75rem;
			padding: 0;
			justify-content: center;
			border: 0;
		}

		.search svg {
			width: 18px;
			height: 18px;
		}

		.menu-toggle {
			display: block;
		}
	}
</style>
