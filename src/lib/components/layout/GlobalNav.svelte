<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { experienceStore } from '$services/experience';

	const links = [
		{ href: '/#work', label: 'Work' },
		{ href: '/#lab', label: 'R&D' },
		{ href: '/#engineering', label: 'Engineering' },
		{ href: '/#method', label: 'Method' },
		{ href: '/about', label: 'Profile' }
	];

	let mobileOpen = false;
	let y = 0;

	$: isHome = $page.url.pathname === '/';
	$: scrolled = y > 24;

	function closeMenu() {
		mobileOpen = false;
		document.body.style.removeProperty('overflow');
	}

	function toggleMenu() {
		mobileOpen = !mobileOpen;
		document.body.style.overflow = mobileOpen ? 'hidden' : '';
	}

	onMount(() => {
		const handleKeydown = (event: KeyboardEvent) => {
			if (event.key === 'Escape' && mobileOpen) closeMenu();
		};

		window.addEventListener('keydown', handleKeydown);
		return () => {
			window.removeEventListener('keydown', handleKeydown);
			document.body.style.removeProperty('overflow');
		};
	});

	function openCommandPalette() {
		closeMenu();
		experienceStore.openCommandPalette();
	}
</script>

<svelte:window bind:scrollY={y} />

<header class:scrolled class:home-nav={isHome} class="site-nav">
	<a class="site-nav__brand" href="/" aria-label="Mk.01 home">
		<span>MK.01</span>
		<i>Creative technology</i>
	</a>

	<nav class="site-nav__links" aria-label="Primary navigation">
		{#each links as link}
			<a href={link.href}>
				<span>{link.label}</span>
			</a>
		{/each}
	</nav>

	<div class="site-nav__actions">
		<button class="site-nav__command" type="button" on:click={openCommandPalette}>
			<span>Index</span>
			<kbd>⌘K</kbd>
		</button>
		<a class="site-nav__contact" href="/#contact">
			<span class="site-nav__status"></span>
			Start a conversation
		</a>
	</div>

	<button
		class="site-nav__toggle"
		type="button"
		aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
		aria-expanded={mobileOpen}
		aria-controls="mobile-navigation"
		on:click={toggleMenu}
	>
		<span></span>
		<span></span>
	</button>
</header>

{#if mobileOpen}
	<div class="mobile-nav" id="mobile-navigation">
		<div class="mobile-nav__meta">
			<span>Index / 2026</span>
			<span>Seoul, KR</span>
		</div>
		<nav aria-label="Mobile navigation">
			{#each links as link, index}
				<a href={link.href} on:click={closeMenu}>
					<small>0{index + 1}</small>
					<span>{link.label}</span>
					<i>↗</i>
				</a>
			{/each}
		</nav>
		<div class="mobile-nav__footer">
			<button type="button" on:click={openCommandPalette}>Open index <kbd>⌘K</kbd></button>
			<a class="mobile-nav__contact" href="/#contact" on:click={closeMenu}>
				studio@mk1.dev
				<span>Open to conversations / 26</span>
			</a>
		</div>
	</div>
{/if}

<style>
	.site-nav {
		position: fixed;
		inset: 0 0 auto;
		z-index: 100;
		display: grid;
		grid-template-columns: 1fr auto 1fr;
		align-items: center;
		height: 70px;
		padding: 0 clamp(18px, 3vw, 50px);
		border-bottom: 1px solid transparent;
		color: #f0f0e8;
		transition:
			height 400ms cubic-bezier(0.16, 1, 0.3, 1),
			background 300ms ease,
			border-color 300ms ease;
	}

	.site-nav.scrolled {
		height: 58px;
		border-color: rgba(240, 240, 232, 0.12);
		background: rgba(8, 9, 7, 0.78);
		backdrop-filter: blur(18px);
	}

	.site-nav__brand {
		display: inline-flex;
		width: fit-content;
		align-items: baseline;
		gap: 13px;
		color: inherit;
	}

	.site-nav__brand span {
		font-family: 'Syne', sans-serif;
		font-size: 17px;
		font-weight: 700;
		letter-spacing: -0.055em;
	}

	.site-nav__brand i {
		color: rgba(240, 240, 232, 0.42);
		font-family: 'JetBrains Mono', monospace;
		font-size: 7px;
		font-style: normal;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.site-nav__links {
		display: flex;
		align-items: center;
		gap: 2px;
	}

	.site-nav__links a {
		position: relative;
		overflow: hidden;
		padding: 8px 15px;
		color: rgba(240, 240, 232, 0.7);
		font-family: 'JetBrains Mono', monospace;
		font-size: 8px;
		letter-spacing: 0.09em;
		text-transform: uppercase;
	}

	.site-nav__links a::after {
		position: absolute;
		right: 15px;
		bottom: 4px;
		left: 15px;
		height: 1px;
		background: #d7ff55;
		content: '';
		transform: scaleX(0);
		transform-origin: right;
		transition: transform 350ms cubic-bezier(0.16, 1, 0.3, 1);
	}

	.site-nav__links a:hover {
		color: #f0f0e8;
	}

	.site-nav__links a:hover::after {
		transform: scaleX(1);
		transform-origin: left;
	}

	.site-nav__actions {
		display: flex;
		justify-self: end;
		align-items: center;
		gap: 22px;
	}

	.site-nav__command {
		display: inline-flex;
		align-items: center;
		gap: 8px;
		border: 0;
		padding: 7px 0;
		background: transparent;
		color: rgba(240, 240, 232, 0.48);
		font-family: 'JetBrains Mono', monospace;
		font-size: 8px;
		letter-spacing: 0.09em;
		text-transform: uppercase;
		transition: color 200ms ease;
		cursor: pointer;
	}

	.site-nav__command:hover {
		color: #f0f0e8;
	}

	.site-nav__command kbd {
		border: 1px solid rgba(240, 240, 232, 0.18);
		border-radius: 3px;
		padding: 2px 4px;
		font: inherit;
		letter-spacing: 0;
	}

	.site-nav__contact {
		display: inline-flex;
		justify-self: end;
		align-items: center;
		gap: 9px;
		color: #f0f0e8;
		font-family: 'JetBrains Mono', monospace;
		font-size: 8px;
		letter-spacing: 0.09em;
		text-transform: uppercase;
	}

	.site-nav__status {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: #d7ff55;
		box-shadow: 0 0 12px rgba(215, 255, 85, 0.7);
		animation: status 2.2s ease-in-out infinite;
	}

	@keyframes status {
		50% {
			opacity: 0.4;
		}
	}

	.site-nav__toggle {
		display: none;
		width: 42px;
		height: 42px;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		gap: 5px;
		border: 1px solid rgba(240, 240, 232, 0.18);
		border-radius: 50%;
		background: rgba(8, 9, 7, 0.4);
		color: #f0f0e8;
	}

	.site-nav__toggle span {
		width: 14px;
		height: 1px;
		background: currentColor;
	}

	.mobile-nav {
		position: fixed;
		inset: 0;
		z-index: 90;
		display: flex;
		flex-direction: column;
		padding: 100px 18px 24px;
		background: #d7ff55;
		color: #080907;
		animation: menu-in 500ms cubic-bezier(0.76, 0, 0.24, 1);
	}

	@keyframes menu-in {
		from {
			clip-path: inset(0 0 100% 0);
		}
		to {
			clip-path: inset(0);
		}
	}

	.mobile-nav__meta {
		display: flex;
		justify-content: space-between;
		border-top: 1px solid rgba(8, 9, 7, 0.3);
		padding-top: 12px;
		font-family: 'JetBrains Mono', monospace;
		font-size: 8px;
		letter-spacing: 0.1em;
		text-transform: uppercase;
	}

	.mobile-nav nav {
		margin-top: 11vh;
	}

	.mobile-nav nav a {
		display: grid;
		grid-template-columns: 34px 1fr auto;
		align-items: center;
		border-bottom: 1px solid rgba(8, 9, 7, 0.26);
		padding: 12px 0 8px;
		color: #080907;
		font-family: 'Syne', sans-serif;
		font-size: clamp(52px, 15vw, 78px);
		font-weight: 600;
		letter-spacing: -0.07em;
		line-height: 0.9;
	}

	.mobile-nav nav small {
		align-self: start;
		padding-top: 5px;
		font-family: 'JetBrains Mono', monospace;
		font-size: 8px;
		letter-spacing: 0;
	}

	.mobile-nav nav i {
		font-family: sans-serif;
		font-size: 22px;
		font-style: normal;
		font-weight: 300;
		letter-spacing: 0;
	}

	.mobile-nav__contact {
		display: flex;
		justify-content: space-between;
		margin-top: auto;
		border-top: 1px solid rgba(8, 9, 7, 0.3);
		padding-top: 14px;
		color: #080907;
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		letter-spacing: 0.06em;
		text-transform: uppercase;
	}

	.mobile-nav__footer {
		margin-top: auto;
	}

	.mobile-nav__footer > button {
		display: flex;
		width: 100%;
		justify-content: space-between;
		margin-bottom: 18px;
		border: 0;
		border-top: 1px solid rgba(8, 9, 7, 0.3);
		border-bottom: 1px solid rgba(8, 9, 7, 0.3);
		padding: 13px 0;
		background: transparent;
		color: #080907;
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.mobile-nav__footer kbd {
		font: inherit;
	}

	@media (max-width: 760px) {
		.site-nav {
			height: 64px;
			grid-template-columns: 1fr auto;
			padding-inline: 17px;
		}

		.site-nav__brand i,
		.site-nav__links,
		.site-nav__actions {
			display: none;
		}

		.site-nav__toggle {
			display: flex;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.site-nav__status {
			animation: none;
		}

		.mobile-nav {
			animation: none;
		}
	}
</style>
