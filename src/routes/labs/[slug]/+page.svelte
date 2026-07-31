<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	const { experiment } = data;

	// Mock "Tweakpane" controls for the lab
	let controls = [
		{ label: 'Intensity', value: 0.8, min: 0, max: 1, step: 0.01, type: 'range' },
		{ label: 'Color Shift', value: 0.2, min: 0, max: 1, step: 0.01, type: 'range' },
		{ label: 'Speed', value: 1.5, min: 0.1, max: 5, step: 0.1, type: 'range' },
		{ label: 'Bloom', value: true, type: 'toggle' },
		{ label: 'Grid Mode', value: 'Polar', options: ['Cartesian', 'Polar', 'Iso'], type: 'select' }
	];

	// Canvas ref (placeholder for actual WebGL)
	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null;
	let raf: number;
	let time = 0;

	onMount(() => {
		if (canvas) {
			ctx = canvas.getContext('2d');
			const resize = () => {
				canvas.width = canvas.parentElement?.clientWidth ?? 800;
				canvas.height = canvas.parentElement?.clientHeight ?? 600;
			};
			window.addEventListener('resize', resize);
			resize();

			const animate = () => {
				time += 0.01 * (controls.find(c => c.label === 'Speed')?.value as number ?? 1);
				draw();
				raf = requestAnimationFrame(animate);
			};
			animate();

			return () => {
				window.removeEventListener('resize', resize);
				cancelAnimationFrame(raf);
			};
		}
	});

	function draw() {
		if (!ctx) return;
		const w = canvas.width;
		const h = canvas.height;
		const intensity = controls.find(c => c.label === 'Intensity')?.value as number ?? 0.5;
		const colorShift = controls.find(c => c.label === 'Color Shift')?.value as number ?? 0;

		ctx.fillStyle = '#050505'; // Dark background
		ctx.fillRect(0, 0, w, h);

		// Simulate "Lab" visual
		ctx.lineWidth = 2;
		const count = 20;
		const cx = w / 2;
		const cy = h / 2;

		for (let i = 0; i < count; i++) {
			const t = i / count;
			const r = (Math.sin(time + t * Math.PI * 2) * 100 + 150) * intensity;
			
			ctx.beginPath();
			ctx.strokeStyle = `hsl(${(time * 50 + t * 360 + colorShift * 100) % 360}, 70%, 60%)`;
			ctx.globalAlpha = 1 - t;
			ctx.arc(cx, cy, r * (1 - t * 0.5), 0, Math.PI * 2);
			ctx.stroke();
		}
	}
</script>

<div class="lab-layout h-screen overflow-hidden flex flex-col md:flex-row">
	<!-- Main Viewport (Canvas) -->
	<main class="flex-1 relative bg-black order-2 md:order-1">
		<canvas bind:this={canvas} class="absolute inset-0 w-full h-full block"></canvas>
		
		<!-- Floating Header -->
		<header class="absolute top-0 left-0 right-0 p-6 flex justify-between items-start pointer-events-none">
			<div class="pointer-events-auto">
				<a href="/labs" aria-label="Back to Labs" class="btn btn-sm btn-circle btn-ghost bg-base-100/10 backdrop-blur text-base-content mb-4">
					<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>
				</a>
				<h1 class="text-4xl font-bold text-base-content drop-shadow-md">{experiment.title}</h1>
				<p class="text-base-content/70 max-w-md mt-2 drop-shadow-sm">{experiment.summary}</p>
			</div>
			
			<div class="flex gap-2 pointer-events-auto">
				<a href={experiment.links.source} target="_blank" class="btn btn-sm btn-outline text-base-content border-base-content/20 hover:bg-base-content/10">
					View Source
				</a>
			</div>
		</header>
	</main>

	<!-- Sidebar Controls -->
	<aside class="w-full md:w-80 bg-base-200 border-l border-base-content/10 p-6 flex flex-col gap-8 overflow-y-auto z-10 shadow-2xl order-1 md:order-2">
		<div class="space-y-6">
			<div>
				<h2 class="text-xs uppercase tracking-widest text-base-content/50 mb-4">Parameters</h2>
				<div class="space-y-5">
					{#each controls as control}
						<div class="control-group">
							<div class="flex justify-between mb-2">
								<label for={`control-${control.label}`} class="text-sm font-medium text-base-content/80">{control.label}</label>
								<span class="text-xs font-mono text-primary">{control.value}</span>
							</div>
							
							{#if control.type === 'range'}
								<input 
									id={`control-${control.label}`}
									type="range" 
									min={control.min} 
									max={control.max} 
									step={control.step} 
									bind:value={control.value}
									class="range range-xs range-primary" 
								/>
							{:else if control.type === 'toggle'}
								<input 
									id={`control-${control.label}`}
									type="checkbox" 
									bind:checked={control.value}
									class="toggle toggle-sm toggle-primary" 
								/>
							{:else if control.type === 'select'}
								<select id={`control-${control.label}`} bind:value={control.value} class="select select-bordered select-xs w-full">
									{#each control.options as opt}
										<option value={opt}>{opt}</option>
									{/each}
								</select>
							{/if}
						</div>
					{/each}
				</div>
			</div>

			<div class="divider"></div>

			<div>
				<h2 class="text-xs uppercase tracking-widest text-base-content/50 mb-4">Tech Stack</h2>
				<div class="flex flex-wrap gap-2">
					{#each experiment.tech as tech}
						<span class="badge badge-outline badge-sm opacity-70">{tech}</span>
					{/each}
				</div>
			</div>

			<div>
				<h2 class="text-xs uppercase tracking-widest text-base-content/50 mb-2">Concept</h2>
				<p class="text-sm text-base-content/70 leading-relaxed">
					{experiment.highlight}
				</p>
			</div>
		</div>

		<div class="mt-auto pt-6 border-t border-base-content/10">
			<p class="text-xs text-center text-base-content/40">
				Mk.01 Lab Runtime v2.4.0
			</p>
		</div>
	</aside>
</div>

<style>
	/* Custom scrollbar for sidebar */
	aside::-webkit-scrollbar {
		width: 6px;
	}
	aside::-webkit-scrollbar-track {
		background: transparent;
	}
	aside::-webkit-scrollbar-thumb {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 3px;
	}
	aside::-webkit-scrollbar-thumb:hover {
		background: rgba(255, 255, 255, 0.2);
	}
</style>
