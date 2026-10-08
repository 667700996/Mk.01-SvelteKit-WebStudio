<script lang="ts">
	import { footerNav } from '$config/navigation.config';
	import { siteConfig } from '$lib/config/site';
	import Kbd from '$lib/components/ui/Kbd.svelte';
	import LocalTime from '$lib/components/ui/LocalTime.svelte';
	import ThemeSwitch from '$lib/components/ui/ThemeSwitch.svelte';
</script>

<footer class="footer">
	<div class="wrap">
		<div class="grid top">
			<div class="intro">
				<a class="brand" href="/">MK.01</a>
				<p class="secondary">
					Independent design engineering practice.<br />Seoul, working globally.
				</p>
				<a class="link email" href="mailto:{siteConfig.contactEmail}">{siteConfig.contactEmail}</a>
			</div>

			{#each footerNav as group (group.title)}
				<nav class="column" aria-labelledby="footer-{group.title}">
					<h2 class="label" id="footer-{group.title}">{group.title}</h2>
					<ul role="list">
						{#each group.links as link (link.href)}
							<li><a href={link.href}>{link.label}</a></li>
						{/each}
					</ul>
				</nav>
			{/each}
		</div>

		<div class="bottom">
			<p class="label">© 2026 MK.01</p>
			<p class="label">Seoul <LocalTime /></p>
			<p class="label shortcuts">
				<Kbd keys={['mod', 'K']} /> Search <Kbd keys={['G']} /> Grid <Kbd keys={['P']} /> Metrics
			</p>
			<ThemeSwitch />
		</div>
	</div>
</footer>

<style>
	.footer {
		border-top: var(--hairline) solid var(--line);
		padding-block: var(--space-9) var(--space-6);
		font-size: var(--text-small);
	}

	.top {
		row-gap: var(--space-7);
		padding-bottom: var(--space-9);
	}

	.intro {
		grid-column: 1 / span 6;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: var(--space-4);
	}

	.brand {
		font-size: 1.375rem;
		font-weight: 680;
		letter-spacing: -0.04em;
	}

	.email {
		margin-top: var(--space-2);
	}

	.column {
		grid-column: span 2;
	}

	.column h2 {
		margin-bottom: var(--space-4);
	}

	.column li + li {
		margin-top: var(--space-2);
	}

	.column a {
		color: var(--fg-2);
		transition: color var(--duration-2) var(--ease-out);
	}

	.column a:hover {
		color: var(--fg);
	}

	.bottom {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-4) var(--space-6);
		padding-top: var(--space-5);
		border-top: var(--hairline) solid var(--line);
	}

	.bottom > :global(fieldset) {
		margin-left: auto;
	}

	.shortcuts {
		display: inline-flex;
		align-items: center;
		gap: var(--space-2);
	}

	.shortcuts :global(kbd:not(:first-child)) {
		margin-left: var(--space-3);
	}

	@media (max-width: 63.99rem) {
		.intro {
			grid-column: 1 / -1;
		}

		.column {
			grid-column: span 4;
		}
	}

	@media (max-width: 47.99rem) {
		.column {
			grid-column: span 6;
		}

		.shortcuts {
			display: none;
		}

		.bottom > :global(fieldset) {
			margin-left: 0;
		}
	}
</style>
