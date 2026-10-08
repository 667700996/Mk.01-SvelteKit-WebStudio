<script lang="ts">
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import { siteConfig } from '$lib/config/site';
</script>

<PageHeader label="Legal" title="Terms of Service" lead="This is a placeholder for the terms of service." />

<section class="wrap">
	<div class="grid note">
		<p class="label">Status</p>
		<div class="body">
			<p>
				The final document has not been published yet. Until it is, questions about this topic can
				be sent to
				<a class="link" href="mailto:{siteConfig.contactEmail}">{siteConfig.contactEmail}</a>.
			</p>
		</div>
	</div>
</section>

<style>
	.note {
		row-gap: var(--space-3);
		padding-top: var(--space-5);
		border-top: var(--hairline) solid var(--line);
	}

	.note .label {
		grid-column: 1 / span 3;
	}

	.body {
		grid-column: 4 / span 6;
		max-width: var(--measure);
		color: var(--fg-2);
	}

	@media (max-width: 63.99rem) {
		.note .label,
		.body {
			grid-column: 1 / -1;
		}
	}
</style>
