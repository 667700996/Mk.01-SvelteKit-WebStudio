<script lang="ts">
	import { onMount, tick } from 'svelte';
	import { enhance } from '$app/forms';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { siteConfig } from '$lib/config/site';
	import LocalTime from '$lib/components/ui/LocalTime.svelte';
	import PageHeader from '$lib/components/ui/PageHeader.svelte';
	import { BRIEF_MIN, projectTypes, type ContactField } from './form';

	let { form } = $props();

	let pending = $state(false);
	let editing = $state(false);
	let status = $state('');
	let copied = $state(false);
	let hydrated = $state(false);
	let readyHeading = $state<HTMLElement>();
	let briefLength = $state(0);

	onMount(() => {
		hydrated = true;
		briefLength = form?.values?.brief.length ?? 0;
	});

	const ready = $derived(Boolean(form?.ready) && !editing);
	const values = $derived(form?.values);
	const errors = $derived<Partial<Record<ContactField, string>>>(form?.errors ?? {});

	const describe = (field: ContactField, hint?: string) =>
		[hint, errors[field] ? `${field}-error` : ''].filter(Boolean).join(' ') || undefined;

	const submit: SubmitFunction = () => {
		pending = true;
		status = 'Checking your message…';

		return async ({ result, update }) => {
			await update({ reset: false });
			pending = false;

			if (result.type === 'failure') {
				const count = Object.keys((result.data?.errors as object) ?? {}).length;
				status = `${count} ${count === 1 ? 'field needs' : 'fields need'} attention.`;
				await tick();
				document.querySelector<HTMLElement>('form [aria-invalid="true"]')?.focus();
			} else if (result.type === 'success') {
				editing = false;
				status = 'Your message is ready to send.';
				await tick();
				readyHeading?.focus();
			} else {
				status = '';
			}
		};
	};

	async function copyEmail() {
		await navigator.clipboard.writeText(siteConfig.contactEmail);
		copied = true;
		setTimeout(() => (copied = false), 1800);
	}

	function edit(event: MouseEvent) {
		event.preventDefault();
		editing = true;
		status = '';
		tick().then(() => document.getElementById('field-name')?.focus());
	}
</script>

<PageHeader
	label="Start a project"
	title="Craft your next experience."
	lead="Share a few details and we’ll orchestrate a kickoff session to shape scope, timeline, and success metrics."
/>

<section class="wrap">
	<div class="grid layout">
		<div class="main">
			{#if ready && form?.ready}
				<div class="ready">
					<p class="label step"><span class="dot" aria-hidden="true"></span> Ready to send</p>
					<h2 class="h3" tabindex="-1" bind:this={readyHeading}>
						Your message is ready — open it in your mail app.
					</h2>
					<p class="secondary">
						Nothing has been sent yet. We’ve composed an email to {siteConfig.contactEmail} with your
						details. Review it, then press send from your own mail client.
					</p>

					<dl class="summary">
						<div><dt class="label">Name</dt><dd>{form.values.name}</dd></div>
						<div><dt class="label">Email</dt><dd>{form.values.email}</dd></div>
						<div><dt class="label">Project type</dt><dd>{form.values.projectType}</dd></div>
						<div class="brief"><dt class="label">Brief</dt><dd>{form.values.brief}</dd></div>
					</dl>

					<div class="actions">
						<a class="button" href={form.mailto}>
							Open in mail app <span class="arrow arrow--diagonal" aria-hidden="true">↗</span>
						</a>
						{#if hydrated}
							<button class="button button--quiet" type="button" onclick={copyEmail}>
								{copied ? 'Copied' : 'Copy email address'}
							</button>
						{/if}
						<a class="button button--quiet" href="/contact" onclick={edit}>Edit message</a>
					</div>
				</div>
			{:else}
				<form method="POST" novalidate use:enhance={submit} aria-describedby="form-note">
					<p class="label" id="form-note">All fields are required.</p>

					<div class="pair">
						<div class="field">
							<label for="field-name">Name</label>
							<input
								id="field-name"
								name="name"
								type="text"
								autocomplete="name"
								required
								maxlength="120"
								value={values?.name ?? ''}
								aria-invalid={errors.name ? 'true' : undefined}
								aria-describedby={describe('name')}
							/>
							{#if errors.name}<p class="error" id="name-error">{errors.name}</p>{/if}
						</div>

						<div class="field">
							<label for="field-email">Email</label>
							<input
								id="field-email"
								name="email"
								type="email"
								inputmode="email"
								autocomplete="email"
								autocapitalize="off"
								spellcheck="false"
								required
								placeholder="you@company.com"
								value={values?.email ?? ''}
								aria-invalid={errors.email ? 'true' : undefined}
								aria-describedby={describe('email')}
							/>
							{#if errors.email}<p class="error" id="email-error">{errors.email}</p>{/if}
						</div>
					</div>

					<div class="field">
						<label for="field-type">Project type</label>
						<div class="select">
							<select
								id="field-type"
								name="projectType"
								required
								aria-invalid={errors.projectType ? 'true' : undefined}
								aria-describedby={describe('projectType')}
							>
								{#each projectTypes as type (type)}
									<option value={type} selected={values?.projectType === type}>{type}</option>
								{/each}
							</select>
						</div>
						{#if errors.projectType}
							<p class="error" id="projectType-error">{errors.projectType}</p>
						{/if}
					</div>

					<div class="field">
						<div class="field-head">
							<label for="field-brief">Brief</label>
							{#if hydrated}
								<span
									class="label count tabular"
									class:met={briefLength >= BRIEF_MIN}
									aria-hidden="true">{briefLength} / {BRIEF_MIN}+</span
								>
							{/if}
						</div>
						<textarea
							id="field-brief"
							name="brief"
							required
							minlength={BRIEF_MIN}
							maxlength="4000"
							rows="7"
							placeholder="Tell us about the opportunity…"
							aria-invalid={errors.brief ? 'true' : undefined}
							aria-describedby={describe('brief', 'brief-hint')}
							oninput={(event) => (briefLength = event.currentTarget.value.trim().length)}
							>{values?.brief ?? ''}</textarea
						>
						<p class="hint" id="brief-hint">
							Goals, timeline, and anything already decided. At least {BRIEF_MIN} characters.
						</p>
						{#if errors.brief}<p class="error" id="brief-error">{errors.brief}</p>{/if}
					</div>

					<div class="submit">
						<button class="button" type="submit" disabled={pending} aria-disabled={pending}>
							{pending ? 'Preparing…' : 'Prepare message'}
							<span class="arrow" aria-hidden="true">→</span>
						</button>
						<p class="hint">Opens a pre-filled email in your mail app. Nothing is stored.</p>
					</div>
				</form>
			{/if}

			<p class="sr-only" role="status" aria-live="polite">{status}</p>
		</div>

		<aside class="aside" aria-labelledby="direct-title">
			<h2 class="label" id="direct-title">Direct channel</h2>
			<a class="h4 email" href="mailto:{siteConfig.contactEmail}">{siteConfig.contactEmail}</a>
			<dl class="facts">
				<div><dt class="label">Studio time</dt><dd>Seoul <LocalTime /></dd></div>
				<div><dt class="label">Reply</dt><dd>Usually within 24 hours</dd></div>
				<div><dt class="label">Availability</dt><dd>Selected commissions, 2026</dd></div>
			</dl>
		</aside>
	</div>
</section>

<style>
	.layout {
		row-gap: var(--space-8);
		padding-top: var(--space-6);
		border-top: var(--hairline) solid var(--fg);
	}

	.main {
		grid-column: 1 / span 7;
	}

	.aside {
		grid-column: 9 / -1;
	}

	/* Form ---------------------------------------------------------------- */

	form {
		display: flex;
		flex-direction: column;
		gap: var(--space-6);
	}

	.pair {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: var(--space-6) var(--gutter);
	}

	.field {
		display: flex;
		flex-direction: column;
		gap: var(--space-2);
	}

	.field-head {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
	}

	label {
		font-size: var(--text-small);
		font-weight: 520;
	}

	input,
	select,
	textarea {
		width: 100%;
		min-height: 3rem;
		padding: 0 var(--space-4);
		border: var(--hairline) solid var(--line-control);
		border-radius: var(--radius-m);
		background: var(--bg);
		font-size: 1rem;
		transition:
			border-color var(--duration-2) var(--ease-out),
			box-shadow var(--duration-2) var(--ease-out);
	}

	textarea {
		min-height: 11rem;
		padding-block: var(--space-3);
		line-height: 1.5;
		resize: vertical;
	}

	::placeholder {
		color: var(--fg-3);
	}

	input:hover,
	select:hover,
	textarea:hover {
		border-color: var(--fg-2);
	}

	input:focus-visible,
	select:focus-visible,
	textarea:focus-visible {
		border-color: var(--accent);
		outline: none;
		box-shadow: 0 0 0 3px var(--accent-soft);
	}

	[aria-invalid='true'] {
		border-color: var(--danger);
	}

	[aria-invalid='true']:focus-visible {
		border-color: var(--danger);
		box-shadow: 0 0 0 3px color-mix(in oklab, var(--danger) 16%, transparent);
	}

	.select {
		position: relative;
	}

	.select select {
		appearance: none;
		padding-right: var(--space-7);
		cursor: pointer;
	}

	.select::after {
		content: '';
		position: absolute;
		right: var(--space-4);
		top: 50%;
		width: 0.5rem;
		height: 0.5rem;
		border-right: 1.5px solid var(--fg-2);
		border-bottom: 1.5px solid var(--fg-2);
		translate: 0 -70%;
		rotate: 45deg;
		pointer-events: none;
	}

	.hint {
		color: var(--fg-3);
		font-size: 0.875rem;
	}

	.error {
		color: var(--danger);
		font-size: 0.875rem;
		font-weight: 500;
	}

	.count {
		transition: color var(--duration-2) var(--ease-out);
	}

	.count.met {
		color: var(--fg);
	}

	.submit {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: var(--space-3) var(--space-5);
		padding-top: var(--space-2);
	}

	.submit .button {
		min-height: 3rem;
		padding-inline: var(--space-6);
	}

	/* Ready state --------------------------------------------------------- */

	.ready {
		animation: settle var(--duration-3) var(--ease-out) both;
	}

	@keyframes settle {
		from {
			opacity: 0;
			transform: translateY(0.5rem);
		}
	}

	.step {
		display: flex;
		align-items: center;
		gap: var(--space-2);
		color: var(--fg);
	}

	.dot {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--accent);
	}

	.ready h2 {
		max-width: 18ch;
		margin-top: var(--space-5);
		outline: none;
	}

	.ready > .secondary {
		max-width: 34em;
		margin-top: var(--space-4);
	}

	.summary {
		margin-top: var(--space-7);
		border-top: var(--hairline) solid var(--line);
	}

	.summary div,
	.facts div {
		display: grid;
		grid-template-columns: 9rem 1fr;
		gap: var(--space-4);
		padding-block: var(--space-3);
		border-bottom: var(--hairline) solid var(--line);
	}

	.summary dt,
	.facts dt {
		padding-top: 0.2em;
	}

	.summary dd {
		margin: 0;
		overflow-wrap: anywhere;
	}

	.summary .brief dd {
		white-space: pre-line;
		color: var(--fg-2);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: var(--space-3);
		margin-top: var(--space-6);
	}

	/* Aside --------------------------------------------------------------- */

	.email {
		display: inline-block;
		margin-top: var(--space-4);
		text-decoration: underline;
		text-decoration-color: var(--line-strong);
		text-decoration-thickness: 1px;
		text-underline-offset: 0.2em;
		transition: text-decoration-color var(--duration-2) var(--ease-out);
	}

	.email:hover {
		text-decoration-color: currentColor;
	}

	.facts {
		margin-top: var(--space-6);
		border-top: var(--hairline) solid var(--line);
	}

	.facts div {
		grid-template-columns: 7rem 1fr;
	}

	.facts dd {
		margin: 0;
		color: var(--fg-2);
	}

	@media (max-width: 63.99rem) {
		.main,
		.aside {
			grid-column: 1 / -1;
		}
	}

	@media (max-width: 47.99rem) {
		.pair {
			grid-template-columns: 1fr;
		}

		.summary div {
			grid-template-columns: 1fr;
			gap: var(--space-1);
		}
	}
</style>
