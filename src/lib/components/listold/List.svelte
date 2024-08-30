<script lang="ts">
	import type { ReiheType, PersonType, BandType, InhaltType, SchemaType } from '$lib/types';
	import type { ListResult, RecordModel, RecordSubscription } from 'pocketbase';
	import Search from './Search.svelte';
	import Table from './Table.svelte';
	import TableFoot from './TableFoot.svelte';
	import { createEventDispatcher, onMount } from 'svelte';
	import ColumnToggler from './TableViewOptions.svelte';
	import SearchHistory from './SearchHistory.svelte';
	import { fade } from 'svelte/transition';
	import { crossfade } from 'svelte/transition';
	import { expoInOut } from 'svelte/easing';
	import { api } from '$stores/pocketbase';
	import { addInfoAlert, addSuccessAlert } from '$stores/alerts';

	// The schema of the table
	export let schema: SchemaType;
	export let loading: boolean = false;

	// results of the fetch function
	export let fetchResult: ListResult<ReiheType> | ListResult<InhaltType> | ListResult<BandType> | ListResult<PersonType>;

	// State of the component
	export let filter: string;
	export let sort: string[];
	export let visible: string[] = [];

	let dispatch = createEventDispatcher();

	let search: Search;
	let table: Table;
	let refreshTimeoutId: number | undefined = undefined;
	let alertsDisabled: boolean = false;
	let filterHivered = false;
	let lastinput: string = '';
	let selected: Set<string> = new Set();
	let blocked: boolean = false;

	let first: boolean = true;

	// Prevent refetchin on first load
	$: if (filter !== '-1' || sort.length) {
		filterChanged();
	}

	$: filtered = filter !== '';

	$: selectcount = selected ? selected.size : 0;

	const filterChanged = function () {
		if (!first) {
			console.log('filter changed');
			dispatch('fetch', { page: 1, filter, sort });
			if (table) table.resetSelected();
			return;
		}
		if (first) first = false;
	};

	function nextPage() {
		dispatch('fetch', { page: fetchResult.page + 1, filter, sort });
	}

	function Filter(event: { detail: { input: string; filter: string } }) {
		filter = event.detail.filter;
		lastinput = event.detail.input;
	}

	function refresh() {
		dispatch('refetch', { page: fetchResult.page, filter, sort });

		clearTimeout(refreshTimeoutId);
		refreshTimeoutId = setTimeout(() => {
			refreshTimeoutId = undefined;
		}, 300);
	}

	onMount(() => {
		return () => clearTimeout(refreshTimeoutId);
	});

	export const getFilter = function () {
		return filter;
	};

	export const getSort = function () {
		return sort;
	};

	export const resetSelected = function () {
		selected = new Set();
	};

	export const checkSelected = function (result: ListResult<RecordModel>) {
		let s = new Set(result.items.map((x) => x.id).filter((x) => selected.has(x)));
		if (s && s.size > 0) selected = s as Set<string>;
		else selected = new Set();
	};

	const [send, receive] = crossfade({
		duration: 240,
		easing: expoInOut,

		fallback: (node, params) => {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 240,
				easing: expoInOut,
				css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		}
	});

	$: if (loading) {
		blocked = true;
		setTimeout(() => {
			blocked = false;
		}, 350);
	}

	const deleteselected = function () {
		alertsDisabled = true;
		setTimeout(() => {
			alertsDisabled = false;
		}, 20000);
		dispatch('deleteselected', selected);
	};

	const refresh_ondatachange = function () {
		if (refreshTimeoutId) return;
		refresh();
	};

	onMount(() => {});
</script>

<div class="mb-8">
	<h1 class="inline-block text-4xl text-slate-500 px-3">Sammlungen &middot;</h1>
	<h2 class="inline-block text-4xl text-slate-900 mr-1.5">{schema.Name}</h2>
	<button title="Neu laden" type="button" aria-label="Refresh" class="w-10 h-10 rounded-full hover:bg-slate-300 justify-center items-center text-center m-0" class:refreshing={refreshTimeoutId} on:click={refresh}>
		<i class="ri-refresh-line" />
	</button>

	<SearchHistory
		{schema}
		filter={lastinput}
		on:selecthistory={(value) => {
			search.setValue(value.detail);
			search.search();
		}} />

	<ColumnToggler {schema} bind:visible />

	{#if filter !== ''}
		<button
			transition:fade={{ duration: 150 }}
			type="button"
			title="Filter zurücksetzen"
			aria-label="Filter zurücksetzen"
			class="w-10 h-10 rounded-full text-orange-900 hover:bg-orange-300 bg-orange-200 justify-center items-center text-center m-0"
			on:click={() => search.clear(true)}
			on:mouseover={() => (filterHivered = true)}
			on:mouseout={() => (filterHivered = false)}
			on:blur={() => (filterHivered = false)}
			on:focus={() => (filterHivered = true)}>
			{#if filterHivered}
				<i class="ri-filter-off-line" />
			{:else}
				<i class="ri-filter-line" />
			{/if}
		</button>
	{/if}
</div>

<Search bind:this={search} bind:filter {schema} on:search={(event) => Filter(event)} autoFocus={true} />

<Table bind:this={table} {schema} bind:sort bind:data={fetchResult} {loading} {visible} bind:selected on:open />

<!-- It reapeats itself bc the animation will not play otherwise -->
{#if loading || blocked}
	<div in:send={{ key: 'message' }} out:receive={{ key: 'message' }} class="bg-slate-50 w-12 h-12 m-0 fixed text-center bottom-8 left-7 rounded-full shadow-lg border border-slate-300 refreshing-infinite">
		<i class="ri-hourglass-2-fill inline-block align-middle !text-lg !leading-[3rem]"></i>
	</div>
{:else if fetchResult.page !== fetchResult.totalPages && fetchResult.totalPages !== 0}
	<div in:send={{ key: 'message' }} out:receive={{ key: 'message' }} class="bg-slate-50 px-5 py-2 fixed bottom-8 left-7 rounded-full shadow-lg border border-slate-300">
		<TableFoot
			total={fetchResult.totalItems}
			totalPages={fetchResult.totalPages}
			perPage={fetchResult.perPage}
			page={fetchResult.page}
			{filtered}
			selected={selectcount}
			on:resetfilter={() => search.clear(true)}
			on:resetselect={() => table.resetSelected()}
			on:deleteselected={deleteselected}
			on:npage={nextPage} />
	</div>
{:else if fetchResult.totalItems > 0}
	<div in:send={{ key: 'message' }} out:receive={{ key: 'message' }} class="bg-slate-50 px-5 py-2 fixed bottom-8 left-7 rounded-full shadow-lg border border-slate-300">
		<TableFoot
			total={fetchResult.totalItems}
			totalPages={fetchResult.totalPages}
			perPage={fetchResult.perPage}
			page={fetchResult.page}
			{filtered}
			selected={selectcount}
			on:resetfilter={() => search.clear(true)}
			on:resetselect={() => table.resetSelected()}
			on:deleteselected={deleteselected}
			on:npage={nextPage} />
	</div>
{:else}
	<div in:send={{ key: 'message' }} out:receive={{ key: 'message' }} class="bg-slate-50 px-5 py-2 fixed bottom-8 left-7 rounded-full shadow-lg border border-slate-300">
		<TableFoot
			total={fetchResult.totalItems}
			totalPages={fetchResult.totalPages}
			perPage={fetchResult.perPage}
			page={fetchResult.page}
			{filtered}
			selected={selectcount}
			on:resetfilter={() => search.clear(true)}
			on:resetselect={() => table.resetSelected()}
			on:deleteselected={deleteselected}
			on:npage={nextPage} />
	</div>
{/if}

<style>
	@keyframes refresh {
		100% {
			transform: rotate(360deg);
		}
	}
	.refreshing i {
		animation: refresh 600ms ease-out;
	}

	.refreshing-infinite i {
		animation: refresh 900ms infinite;
	}

	i {
		font-size: 1.5rem;
		display: inline-block;
	}
</style>
