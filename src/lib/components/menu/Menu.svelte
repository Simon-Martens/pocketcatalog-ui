<script lang="ts">
	import { tables } from '$stores/tables';
	import { page } from '$app/stores';
	import { loggedIn } from '$stores/pocketbase';
	import { fly } from 'svelte/transition';
	import { sineInOut } from 'svelte/easing';
	import type { Collections } from '$stores/collections.svelte';
	import CollectionDropdown from '$lib/components/menu/CollectionDropdown.svelte';

	interface Props {
		collections: Collections | undefined;
	}

	const { collections = $bindable() }: Props = $props();

	let entries = tables.GetTableTypes('Entries');
	let contents = tables.GetTableTypes('Contents');
</script>

<div class="flex flex-row gap-y-2 w-full border-b px-8 border-slate-300 bg-slate-100" class:border-b={$loggedIn}>
	<div class="w-12 h-12 border border-slate-500 mr-4"></div>
	{#if $loggedIn}
		<nav class="flex flex-row gap-x-3 grow" in:fly|global={{ x: -30, duration: 450, easing: sineInOut }} out:fly|global={{ x: -30, duration: 450, easing: sineInOut }}>
			{#each entries as entry}
				<a href="/entries/{entry.Name}" aria-current={$page.url.pathname.toLowerCase().startsWith('/entries/' + entry.Name.toLowerCase())}>
					{#if entry.Icon}
						<i class={entry.Icon}></i>
					{:else}
						<i class="ri-book-2-line"></i>
					{/if}
					<span class="">{entry.friendlyName ?? entry.Name}</span>
				</a>
			{/each}
			{#each contents as content}
				<a href="/entries/{content.Name}" aria-current={$page.url.pathname.toLowerCase().startsWith('/entries/' + content.Name.toLowerCase())}>
					{#if content.Icon}
						<i class={content.Icon}></i>
					{:else}
						<i class="ri-book-2-line"></i>
					{/if}
					<span class="">{content.friendlyName ?? content.Name}</span>
				</a>
			{/each}
			<div class="grow"></div>
			<a href="/entities/Serials" aria-current={$page.url.pathname.toLowerCase().startsWith('/entities/serials')}>
				<i class="ri-organization-chart"></i> <span class="name">Reihen</span>
			</a>
			<a href="/entities/Actors" aria-current={$page.url.pathname.toLowerCase().startsWith('/entities/actors')}>
				<i class="ri-group-line"></i> <span class="name">Akteure</span>
			</a>
			<a href="/entities/Places" aria-current={$page.url.pathname.toLowerCase().startsWith('/entities/places')}>
				<i class="ri-map-pin-line"></i> <span class="name">Orte</span>
			</a>
		</nav>
		<div class="mt-1.5 ml-4">
			<CollectionDropdown {collections} />
		</div>
	{/if}
</div>

<style>
	nav a {
		@apply text-center pt-3;
	}

	nav a:hover {
		@apply text-zinc-900 border-zinc-400;
	}

	nav a i {
		@apply mr-1 text-xl;
	}

	nav a {
		@apply px-3 text-zinc-600 hover:text-zinc-900 box-border border-b-2 border-transparent transition-all duration-100;
	}

	nav a span {
		@apply text-lg;
	}

	nav a .name {
		@apply hidden;
	}

	nav a[aria-current='true'] {
		@apply border-b-2 shadow border-zinc-800 text-zinc-900 pointer-events-none;
	}

	nav a[aria-current='true'] .name {
		@apply !inline-block;
	}
</style>
