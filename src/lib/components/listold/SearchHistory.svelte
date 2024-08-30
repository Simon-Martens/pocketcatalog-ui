<script lang="ts">
	import { clickOutside } from '$lib/actions/ClickOutside';
	import { pushUser, api } from '$stores/pocketbase';
	import { fly } from 'svelte/transition';
	import { createEventDispatcher, onMount } from 'svelte';
	import type { SchemaType, UserType } from '$lib/types';
	import SearchHistoryItem from './item/SearchHistoryItem.svelte';

	export let filter: string = '';
	export let schema: SchemaType;

	let dispatch = createEventDispatcher();

	let hidden: boolean = true;
	let history: string[] = [];
	let pinned: { Name: string; Search: string }[] = [];

	$: if (schema) {
		initSettings();
	}

	$: if (filter != '') {
		changeHistory();
	}

	const changeHistory = function () {
		if (pinned.find((x) => x.Search == filter)) return;
		history = history.filter((h) => h != filter);
		history = [filter, ...history];
		if (history.length > 10) history.pop();
		
		pushHistory();
	};

	const pushHistory = function () {
		if (api.authStore.model) {
			let copy = structuredClone(api.authStore.model) as UserType;
			copy.settings = copy.settings || {};
			copy.settings.SearchHistory = copy.settings.SearchHistory || {};
			copy.settings.SearchHistory[schema.TableName] = history;

			copy.settings.PinnedSearches = copy.settings.PinnedSearches || {};
			copy.settings.PinnedSearches[schema.TableName] = pinned || {};

			pushUser(copy);
		}
	}

	const deleteHistory = function (item: string) {
		history = history.filter((x) => x != item);
		pushHistory();
	};

	const initSettings = function () {
		if (api.authStore.model?.settings && 
			api.authStore.model.settings.SearchHistory && 
			api.authStore.model.settings.SearchHistory[schema.TableName]) {
			history = api.authStore.model.settings.SearchHistory[schema.TableName];
		} else {
			history = [];
		}

		if (
			api.authStore.model?.settings &&
			api.authStore.model.settings.PinnedSearches &&
			api.authStore.model.settings.PinnedSearches[schema.TableName]) {
			pinned = api.authStore.model.settings.PinnedSearches[schema.TableName];
		} else {
			pinned = [];
		}
	};

	const selectHistory = function (event: CustomEvent<string>) {
		hidden = true;
		dispatch('selecthistory', event.detail);
	};

	const pin = function (event: CustomEvent<string>) {
		deleteHistory(event.detail);
		pinned = [...pinned, { Name: '', Search: event.detail }];
		pushHistory();
	};

	const unpin = function (event: CustomEvent<string>) {
		pinned = pinned.filter((x) => x.Search != event.detail);
		pushHistory();
	};
</script>

{#if history.length > 0 || pinned.length > 0}
	<div
		class="relative inline-block"
		use:clickOutside
		on:click_outside={() => {
			if (!hidden) hidden = true;
		}}>
		<button
			title="Verlauf ein-/ausblenden"
			type="button"
			aria-label="History"
			class="w-10 h-10 rounded-full hover:bg-slate-300 justify-center items-center text-center m-0"
			class:bg-slate-300={!hidden}
			on:click={() => (hidden = !hidden)}>
			{#if hidden}
				<i class="ri-history-line" />
			{:else}
				<i class="ri-history-fill" />
			{/if}
		</button>

		{#if !hidden}
			<div
				class="absolute z-10 bg-slate-50 whitespace-nowrap overflow-hidden overflow-ellipsis shadow-md border border-slate-300 top-12 rounded-md pb-1"
				transition:fly={{ y: 60, duration: 150 }}>
				<div class="mb-2 font-bold px-3 pt-2.5 pb-2 border-b border-b-slate-400">
					<i class="titleicon ri-input-field text-sm relative -bottom-0.5 pr-1"></i> Suchverlauf
				</div>
				{#if pinned.length}
					<div class="flex flex-col gap-y-1 border-b pb-2">
						{#each pinned as item (item)}
							<SearchHistoryItem
								pinned={true}
								item={item.Search}
								name={item.Name}
								on:selecthistory={selectHistory}
								on:unpin={unpin} />
						{/each}
					</div>
				{/if}
				{#if history.length}
					<div class="flex flex-col gap-y-1 pt-2 mb-1">
						{#each history as item (item)}
							<SearchHistoryItem {item} on:selecthistory={selectHistory} on:pin={pin} />
						{/each}
					</div>
				{/if}
			</div>
		{/if}
	</div>
{/if}

<style>
	button i,
	.titleicon {
		font-size: 1.5rem;
		display: inline-block;
	}
</style>
