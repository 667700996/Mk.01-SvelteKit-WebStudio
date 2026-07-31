<script lang="ts">
	import PageSection from '$lib/components/ui/PageSection.svelte';
	import ScrambleText from '$lib/components/motion/ScrambleText.svelte';
	import { tilt } from '$lib/components/motion/tilt';
	import { scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	const projectTypes = [
		'Product experience overhaul',
		'Cinematic launch website',
		'Design system + component library',
		'Labs collaboration'
	];

	let isSubmitting = false;
	let isSent = false;

	async function handleSubmit() {
		isSubmitting = true;
		// Simulate network request
		await new Promise(resolve => setTimeout(resolve, 2000));
		isSubmitting = false;
		isSent = true;
	}

	function resetForm() {
		isSent = false;
	}
</script>

<PageSection id="contact-hero" tone="contrast" padding="xl">
	<div class="space-y-6 text-center max-w-4xl mx-auto">
		<span class="eyebrow text-secondary/80">Start a project</span>
		<h1 class="text-5xl font-bold tracking-tight sm:text-7xl leading-[0.9]">
			<ScrambleText text="Craft your next experience." speed={40} />
		</h1>
		<p class="text-lg text-base-content/70 sm:text-xl leading-relaxed max-w-2xl mx-auto">
			Share a few details and we’ll orchestrate a kickoff session to shape scope, timeline, and
			success metrics.
		</p>
	</div>
</PageSection>

<PageSection id="contact-form">
	<div class="mx-auto max-w-2xl space-y-12 min-h-[600px] relative">
		{#if !isSent}
			<form 
				class="space-y-8 p-8 md:p-12 rounded-3xl border border-base-content/10 bg-base-100/40 backdrop-blur-md relative overflow-hidden transition-all duration-500"
				on:submit|preventDefault={handleSubmit}
				use:tilt={{ max: 2, scale: 1.005 }}
				out:scale={{ duration: 400, start: 0.95, opacity: 0, easing: cubicOut }}
			>
				<div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none"></div>
				
				<div class="grid gap-8 relative z-10" class:opacity-50={isSubmitting} class:pointer-events-none={isSubmitting}>
					<div class="grid gap-6 md:grid-cols-2">
						<label class="form-control w-full">
							<span class="label-text text-xs font-bold uppercase tracking-widest text-base-content/50 mb-2">Name</span>
							<input type="text" placeholder="Your name" class="input input-lg input-bordered w-full bg-base-200/50 focus:border-primary/50 focus:shadow-[0_0_20px_-5px_rgba(0,255,249,0.3)] transition-all" required />
						</label>

						<label class="form-control w-full">
							<span class="label-text text-xs font-bold uppercase tracking-widest text-base-content/50 mb-2">Email</span>
							<input type="email" placeholder="you@company.com" class="input input-lg input-bordered w-full bg-base-200/50 focus:border-primary/50 focus:shadow-[0_0_20px_-5px_rgba(0,255,249,0.3)] transition-all" required />
						</label>
					</div>

					<label class="form-control w-full">
						<span class="label-text text-xs font-bold uppercase tracking-widest text-base-content/50 mb-2">Project type</span>
						<select class="select select-lg select-bordered w-full bg-base-200/50 focus:border-primary/50 focus:shadow-[0_0_20px_-5px_rgba(0,255,249,0.3)] transition-all">
							{#each projectTypes as type}
								<option value={type}>{type}</option>
							{/each}
						</select>
					</label>

					<label class="form-control w-full">
						<span class="label-text text-xs font-bold uppercase tracking-widest text-base-content/50 mb-2">Brief</span>
						<textarea
							class="textarea textarea-bordered textarea-lg w-full min-h-[200px] bg-base-200/50 focus:border-primary/50 focus:shadow-[0_0_20px_-5px_rgba(0,255,249,0.3)] transition-all"
							placeholder="Tell us about the opportunity…"
						></textarea>
					</label>
				</div>

				<button 
					type="submit" 
					class="btn btn-primary btn-lg w-full relative z-10 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-1"
					disabled={isSubmitting}
				>
					{#if isSubmitting}
						<span class="loading loading-spinner"></span>
						Transmitting...
					{:else}
						Send Transmission
					{/if}
				</button>
			</form>
		{:else}
			<div 
				class="absolute inset-0 flex flex-col items-center justify-center text-center p-8 rounded-3xl border border-success/20 bg-base-100/40 backdrop-blur-md"
				in:scale={{ duration: 600, start: 0.9, opacity: 0, easing: cubicOut, delay: 200 }}
			>
				<div class="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-6 text-success shadow-[0_0_30px_-5px] shadow-success/30">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
				</div>
				<h3 class="text-3xl font-bold mb-4">Signal Received</h3>
				<p class="text-lg text-base-content/70 max-w-md mb-8">
					We've logged your transmission. Expect a response on your secure channel within 24 hours.
				</p>
				<button class="btn btn-outline" on:click={resetForm}>
					Send Another
				</button>
			</div>
		{/if}

		<div class="text-center space-y-2 mt-12">
			<h2 class="text-sm font-bold uppercase tracking-widest text-base-content/50">Direct Channel</h2>
			<a href="mailto:studio@mk1.dev" class="text-xl md:text-2xl font-bold text-base-content hover:text-primary transition-colors link link-hover">
				studio@mk1.dev
			</a>
		</div>
	</div>
</PageSection>
