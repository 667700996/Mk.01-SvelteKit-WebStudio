
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/about" | "/blog" | "/blog/category" | "/blog/category/[category]" | "/blog/[slug]" | "/capabilities" | "/contact" | "/labs" | "/labs/[slug]" | "/open-source" | "/portfolio" | "/privacy" | "/services" | "/stack" | "/team" | "/terms" | "/work" | "/work/[slug]";
		RouteParams(): {
			"/blog/category/[category]": { category: string };
			"/blog/[slug]": { slug: string };
			"/labs/[slug]": { slug: string };
			"/work/[slug]": { slug: string }
		};
		LayoutParams(): {
			"/": { category?: string; slug?: string };
			"/about": Record<string, never>;
			"/blog": { category?: string; slug?: string };
			"/blog/category": { category?: string };
			"/blog/category/[category]": { category: string };
			"/blog/[slug]": { slug: string };
			"/capabilities": Record<string, never>;
			"/contact": Record<string, never>;
			"/labs": { slug?: string };
			"/labs/[slug]": { slug: string };
			"/open-source": Record<string, never>;
			"/portfolio": Record<string, never>;
			"/privacy": Record<string, never>;
			"/services": Record<string, never>;
			"/stack": Record<string, never>;
			"/team": Record<string, never>;
			"/terms": Record<string, never>;
			"/work": { slug?: string };
			"/work/[slug]": { slug: string }
		};
		Pathname(): "/" | "/about" | "/about/" | "/blog" | "/blog/" | "/blog/category" | "/blog/category/" | `/blog/category/${string}` & {} | `/blog/category/${string}/` & {} | `/blog/${string}` & {} | `/blog/${string}/` & {} | "/capabilities" | "/capabilities/" | "/contact" | "/contact/" | "/labs" | "/labs/" | `/labs/${string}` & {} | `/labs/${string}/` & {} | "/open-source" | "/open-source/" | "/portfolio" | "/portfolio/" | "/privacy" | "/privacy/" | "/services" | "/services/" | "/stack" | "/stack/" | "/team" | "/team/" | "/terms" | "/terms/" | "/work" | "/work/" | `/work/${string}` & {} | `/work/${string}/` & {};
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/favicon.ico" | "/noise.png" | "/og.png" | string & {};
	}
}