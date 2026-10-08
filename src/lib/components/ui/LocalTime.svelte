<script lang="ts">
	import { onMount } from 'svelte';

	let { zone = 'Asia/Seoul', label = 'KST' }: { zone?: string; label?: string } = $props();

	const format = new Intl.DateTimeFormat('en-GB', {
		hour: '2-digit',
		minute: '2-digit',
		hourCycle: 'h23',
		timeZone: zone
	});

	let now = $state<Date | null>(null);

	// Tick on the minute boundary rather than polling every second.
	onMount(() => {
		let timer: ReturnType<typeof setTimeout>;
		const tick = () => {
			now = new Date();
			timer = setTimeout(tick, 60_000 - (Date.now() % 60_000) + 20);
		};
		tick();
		return () => clearTimeout(timer);
	});
</script>

<time class="tabular" datetime={now?.toISOString()}>
	{now ? format.format(now) : '--:--'}
	{label}
</time>
