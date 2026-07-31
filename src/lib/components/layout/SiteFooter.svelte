<script lang="ts">
	const links = [
		{ title: 'Work', href: '/work' },
		{ title: 'Labs', href: '/labs' },
		{ title: 'About', href: '/about' },
		{ title: 'Contact', href: '/contact' }
	];
</script>

<footer class="site-footer">
	<div class="site-footer__top">
		<a href="/" class="site-footer__brand">MK.01</a>
		<p>Independent creative technology studio.<br />Seoul / Everywhere.</p>
	</div>
	<div class="site-footer__bottom">
		<nav aria-label="Footer navigation">
			{#each links as link}
				<a href={link.href}>{link.title}</a>
			{/each}
		</nav>
		<a href="mailto:studio@mk1.dev">studio@mk1.dev ↗</a>
		<span>© 2026</span>
	</div>
</footer>

<style>
	.site-footer {
		padding: 100px clamp(18px, 3vw, 50px) 28px;
		border-top: 1px solid rgba(240, 240, 232, 0.14);
		background: #080907;
		color: #f0f0e8;
	}

	.site-footer__top {
		display: flex;
		align-items: flex-end;
		justify-content: space-between;
		margin-bottom: 100px;
	}

	.site-footer__brand {
		color: inherit;
		font-family: 'Syne', sans-serif;
		font-size: clamp(76px, 14vw, 220px);
		font-weight: 700;
		letter-spacing: -0.09em;
		line-height: 0.75;
	}

	.site-footer__top p {
		margin: 0;
		color: rgba(240, 240, 232, 0.45);
		font-family: 'JetBrains Mono', monospace;
		font-size: 9px;
		letter-spacing: 0.07em;
		line-height: 1.6;
		text-transform: uppercase;
	}

	.site-footer__bottom {
		display: grid;
		grid-template-columns: 1fr 1fr auto;
		gap: 40px;
		border-top: 1px solid rgba(240, 240, 232, 0.14);
		padding-top: 20px;
		font-family: 'JetBrains Mono', monospace;
		font-size: 8px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
	}

	.site-footer nav {
		display: flex;
		gap: 22px;
	}

	.site-footer a {
		color: rgba(240, 240, 232, 0.7);
	}

	.site-footer a:hover {
		color: #d7ff55;
	}

	@media (max-width: 650px) {
		.site-footer__top {
			align-items: flex-start;
			flex-direction: column;
			gap: 40px;
		}

		.site-footer__bottom {
			grid-template-columns: 1fr auto;
		}

		.site-footer__bottom > a {
			grid-row: 2;
		}
	}
</style>
