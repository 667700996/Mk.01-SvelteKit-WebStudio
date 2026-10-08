<script lang="ts">
	import { ui } from '$lib/state/ui.svelte';

	let columns = $state<HTMLElement>();
	let spec = $state('');

	$effect(() => {
		if (!ui.gridVisible || !columns) return;
		const target = columns;
		const measure = () => {
			const style = getComputedStyle(target);
			const count = style.gridTemplateColumns.split(' ').length;
			spec = `${count} col · ${Math.round(parseFloat(style.columnGap))}px gutter · ${Math.round(parseFloat(style.paddingLeft))}px margin`;
		};
		const observer = new ResizeObserver(measure);
		observer.observe(target);
		return () => observer.disconnect();
	});
</script>

{#if ui.gridVisible}
	<div class="overlay" aria-hidden="true">
		<div class="wrap grid columns" bind:this={columns}>
			{#each { length: 12 } as _}
				<span></span>
			{/each}
		</div>
		<p class="label spec">{spec} — press G to hide</p>
	</div>
{/if}

<style>
	.overlay {
		position: fixed;
		inset: 0;
		z-index: 900;
		pointer-events: none;
	}

	.columns {
		height: 100%;
	}

	.columns span {
		background: color-mix(in oklab, var(--accent) 7%, transparent);
		box-shadow:
			inset 1px 0 color-mix(in oklab, var(--accent) 30%, transparent),
			inset -1px 0 color-mix(in oklab, var(--accent) 30%, transparent);
	}

	.spec {
		position: absolute;
		left: 50%;
		bottom: var(--space-4);
		padding: var(--space-1) var(--space-3);
		border-radius: 999px;
		background: var(--fg);
		color: var(--bg);
		translate: -50% 0;
		white-space: nowrap;
	}

	@media (max-width: 47.99rem) {
		.columns {
			grid-template-columns: repeat(4, minmax(0, 1fr));
		}

		.columns span:nth-child(n + 5) {
			display: none;
		}
	}
</style>
