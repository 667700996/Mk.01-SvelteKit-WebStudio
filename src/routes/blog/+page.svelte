<script lang="ts">
	import PageSection from '$lib/components/ui/PageSection.svelte';
	import Image from '$lib/components/ui/Image.svelte';
	import { tilt } from '$lib/components/motion/tilt';
	import type { PageData } from './$types';

	export let data: PageData;

	const { posts, pageNumber, totalPages, searchTerm, categories, categoryFilter, tagFilter } = data;
	let search = searchTerm;
	let selectedCategory = categoryFilter;
	
	const featuredPost = posts[0];
	const remainingPosts = posts.slice(1);

	const dateFormatter = new Intl.DateTimeFormat('en', {
		year: 'numeric',
		month: 'long',
		day: 'numeric'
	});

	function formatDate(value: string | number | Date) {
		try {
			return dateFormatter.format(new Date(value));
		} catch {
			return value;
		}
	}
</script>

<PageSection id="journal-hero" tone="contrast" padding="xl">
	<div class="grid lg:grid-cols-[1fr_minmax(300px,0.5fr)] gap-12 items-end">
		<div class="space-y-6">
			<span class="eyebrow text-secondary/80">Studio Journal</span>
			<h1 class="text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl leading-[0.9]">
				Thoughts on code, craft, and chaos.
			</h1>
			<p class="max-w-2xl text-lg text-base-content/70 sm:text-xl">
				A collection of field notes from the edge of web engineering. Deep dives into design systems, shader experiments, and the business of building digital products.
			</p>
		</div>

		<!-- Filter Rail -->
		<form class="flex flex-col gap-4 p-6 rounded-2xl bg-base-100/50 border border-base-content/10 backdrop-blur-md" method="get">
			<div class="form-control w-full">
				<label class="label" for="search-input">
					<span class="label-text text-xs uppercase tracking-widest font-bold text-base-content/60">Search</span>
				</label>
				<input
					id="search-input"
					type="search"
					name="search"
					placeholder="Find an article..."
					class="input input-bordered w-full bg-base-200/50"
					bind:value={search}
				/>
			</div>
			
			<div class="form-control w-full">
				<label class="label" for="category-select">
					<span class="label-text text-xs uppercase tracking-widest font-bold text-base-content/60">Filter</span>
				</label>
				<select id="category-select" name="category" class="select select-bordered w-full bg-base-200/50" bind:value={selectedCategory}>
					<option value="">All Categories</option>
					{#each categories as category}
						<option value={category.toLowerCase()}>{category}</option>
					{/each}
				</select>
			</div>

			<div class="flex gap-2 mt-2">
				<button class="btn btn-primary flex-1" type="submit">Filter</button>
				<a href="/blog" class="btn btn-ghost flex-1">Clear</a>
			</div>
		</form>
	</div>
</PageSection>

{#if !searchTerm && !categoryFilter && !tagFilter && featuredPost}
	<PageSection id="featured-post" padding="compact">
		<div class="mb-8 flex items-center gap-4">
			<span class="h-px w-8 bg-primary/50"></span>
			<span class="text-xs uppercase tracking-[0.3em] text-primary font-bold">Featured Article</span>
		</div>
		
		<a href={`/blog/${featuredPost.slug}`} class="group relative block rounded-3xl overflow-hidden aspect-[21/9] shadow-2xl" use:tilt={{ max: 5, scale: 1.01 }}>
			<div class="absolute inset-0 z-0">
				<!-- Using generic placeholder if no image, can be replaced with real data later -->
				<Image 
					src={featuredPost.coverImage || `/images/blog/${featuredPost.slug}.jpg`} 
					alt={featuredPost.title}
					className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
				/>
				<div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
			</div>
			
			<div class="absolute bottom-0 left-0 p-8 md:p-12 z-10 max-w-4xl space-y-4">
				<div class="flex flex-wrap gap-3">
					<span class="badge badge-primary border-none bg-primary/20 text-primary-content backdrop-blur">
						{featuredPost.category}
					</span>
					<span class="badge badge-ghost backdrop-blur text-base-content/80">
						{featuredPost.readingTime} min read
					</span>
				</div>
				<h2 class="text-3xl md:text-5xl font-bold text-base-content leading-tight group-hover:text-primary transition-colors duration-300">
					{featuredPost.title}
				</h2>
				<p class="text-lg md:text-xl text-base-content/80 line-clamp-2 max-w-2xl">
					{featuredPost.description}
				</p>
			</div>
		</a>
	</PageSection>
{/if}

<PageSection id="all-posts">
	<div class="grid gap-x-8 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
		{#each (searchTerm || categoryFilter || tagFilter ? posts : remainingPosts) as post}
			<article class="group flex flex-col h-full gap-4">
				<a href={`/blog/${post.slug}`} class="block rounded-2xl overflow-hidden aspect-[16/10] relative shadow-lg" use:tilt={{ max: 8, scale: 1.02 }}>
					<Image 
						src={post.coverImage || `/images/blog/${post.slug}.jpg`} 
						alt={post.title}
						className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
					/>
					<div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
				</a>

				<div class="space-y-3 flex-1 flex flex-col">
					<div class="flex items-center justify-between text-xs uppercase tracking-widest text-base-content/50 font-bold">
						<span>{formatDate(post.date)}</span>
						<span class="text-primary/80">{post.category}</span>
					</div>
					
					<h3 class="text-2xl font-bold leading-tight group-hover:text-primary transition-colors duration-200">
						<a href={`/blog/${post.slug}`}>
							{post.title}
						</a>
					</h3>
					
					<p class="text-base text-base-content/70 line-clamp-3 leading-relaxed flex-1">
						{post.description}
					</p>

					<div class="pt-4 flex items-center justify-between border-t border-base-content/10">
						<div class="flex gap-2">
							{#each post.tags?.slice(0, 2) ?? [] as tag}
								<span class="text-[0.65rem] uppercase tracking-wider px-2 py-1 rounded bg-base-200 text-base-content/60">
									#{tag}
								</span>
							{/each}
						</div>
						<span class="text-xs font-mono text-base-content/40">
							{post.readingTime} min
						</span>
					</div>
				</div>
			</article>
		{/each}
	</div>

	{#if posts.length === 0}
		<div class="py-20 text-center border rounded-3xl border-dashed border-base-content/20">
			<span class="text-4xl">∅</span>
			<h2 class="mt-4 text-2xl font-bold">Signal Lost</h2>
			<p class="mt-2 text-base-content/70">No articles found matching your query.</p>
			<a href="/blog" class="btn btn-outline mt-6">Clear Filters</a>
		</div>
	{/if}

	{#if totalPages > 1}
		<div class="mt-16 flex justify-center">
			<div class="join grid grid-cols-2 shadow-xl">
				<a
					href={`/blog?page=${pageNumber - 1}`}
					class="join-item btn btn-outline"
					class:btn-disabled={pageNumber <= 1}>Previous</a
				>
				<a
					href={`/blog?page=${pageNumber + 1}`}
					class="join-item btn btn-outline"
					class:btn-disabled={pageNumber >= totalPages}>Next</a
				>
			</div>
		</div>
	{/if}
</PageSection>
