<script lang="ts">
	import type { ListResult, RecordModel, RecordSubscription } from 'pocketbase';
	import { onMount } from 'svelte';
	import 'remixicon/fonts/remixicon.css';
	import { fade } from 'svelte/transition';
	import { crossfade } from 'svelte/transition';
	import { expoInOut } from 'svelte/easing';
	import { api } from '$stores/pocketbase';
	import { addInfoAlert, addSuccessAlert } from '$stores/alerts';
	import Search from '$lib/components/list/Search.svelte';
	import Table from '$lib/components/list/Table.svelte';
	import TableFoot from '$lib/components/list/TableFoot.svelte';
	import TableViewOptions from '$lib/components/list/TableViewOptions.svelte';
	import SearchHistory from '$lib/components/list/SearchHistory.svelte';
	import DeletionDialog from '$lib/components/dialog/DeletionDialog.svelte';
	import { navigating } from '$app/stores';

	export let data;

	// results of the fetch function
	let fetchResult: ListResult<RecordModel> | null = null;

	// State of the component
	let filter: string;
	let sort: string[];
	let visible: string[] = [];

	let search: Search;
	let table: Table;
	let refreshTimeoutId: number | undefined = undefined;
	let filterHivered = false;
	let lastinput: string = '';
	let selected: Set<string> = new Set();
	let loading: boolean = false;
	let searching: boolean = false;
	let selectable: boolean = true;
	let changeModeDebounce: number | undefined = undefined;

	let intermediateFetchResult: ListResult<RecordModel> | null = null;
	let DelDialog: DeletionDialog | undefined = undefined;

	// Prevent refetchin on first load
	$: if (!fetchResult) {
		// ? just set sort, the retch will follow, see below
	}

	$: schema = data.schema;

	$: if (schema) {
		loading = false;
		filter = schema.DefaultFilter ?? '';
		// We need to slice the array to create a copy not mutating the original
		sort = schema.DefaultSort.slice();
		search?.clear(false);
	}

	$: if (filter !== '-1' || sort.length) {
		filterChanged();
	}

	$: filtered = filter !== '';

	$: selectcount = selected ? selected.size : 0;

	const filterChanged = function () {
		fetchPage(1, filter, sort);
		if (table) table.resetSelected();
		return;
	};

	function nextPage() {
		if (fetchResult) fetchPage(fetchResult.page + 1, filter, sort);
	}

	function Filter(event: { detail: { input: string; filter: string } }) {
		filter = event.detail.filter;
		lastinput = event.detail.input;
	}

	function refresh() {
		if (fetchResult) reFetch(fetchResult.page, filter, sort);
		clearTimeout(refreshTimeoutId);
		refreshTimeoutId = setTimeout(() => {
			refreshTimeoutId = undefined;
		}, 300);
	}

	const checkSelected = function (result: ListResult<RecordModel>) {
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

	const setDebounceChangeNotification = function (ms: number = 20000) {
		if (changeModeDebounce) clearTimeout(changeModeDebounce);
		changeModeDebounce = setTimeout(() => {
			changeModeDebounce = undefined;
		}, ms);
	};

	const refresh_ondatachange = function () {
		if (refreshTimeoutId) return;
		refresh();
	};

	const sort_f = function (event: CustomEvent<string[]>) {
		sort = event.detail;
	};

	async function fetchPage(page: number, filter: string, sort: string[]) {
		loading = true;
		if (filter != '') searching = true;
		await fetch(page, filter, sort);
		fetchResult = intermediateFetchResult;
		if (fetchResult) checkSelected(fetchResult);
		// We need a hight timeout to be set, since TableFoot is not reactive (bug?) and needs to be destroyed first (after animation)
		setTimeout(() => {
			loading = false;
		}, 600);
		searching = false;
	}

	async function reFetch(page: number, filter: string, sort: string[]) {
		loading = true;
		fetchResult = null;
		intermediateFetchResult = null;
		for (let i = 1; i <= page; i++) {
			await fetch(i, filter, sort);
		}
		fetchResult = intermediateFetchResult;
		if (fetchResult) checkSelected(fetchResult);
		setTimeout(() => {
			loading = false;
		}, 600);
	}

	async function fetch(
		page: number = 1,
		filter: string = '',
		sort_p: string[] = [],
		expand: string[] | undefined = undefined,
		perPage: number = 120
	) {
		perPage = perPage <= 0 ? data.perPage : perPage;
		sort_p = sort_p && sort_p.length ? sort_p : schema.DefaultSort;
		expand = expand && expand.length ? expand : schema.DefaultExpand;
		let fexpand = expand ? expand.join(',') : '';
		let ssort = sort_p.join(',');
		return api
			.collection(schema.TableName)
			.getList(page, perPage, {
				sort: ssort,
				// TODO: filter shows no entry items for the sorted column. On sorting, we don't show empty columns.
				filter,
				expand: fexpand,
				skipTotal: page !== 1
			})
			.then((result) => {
				if (page === 1 || !intermediateFetchResult) {
					intermediateFetchResult = result;
				} else {
					intermediateFetchResult.items = [...intermediateFetchResult.items, ...result.items];
					intermediateFetchResult.page = page;
				}
			})
			.catch((error) => {
				console.log(error);
			});
	}

	function deleteSelected() {
		setDebounceChangeNotification(15000);
		let dialogmount = document.getElementById('dialogmount') as HTMLDivElement;
		if (dialogmount && fetchResult && fetchResult.items && selected && selected.size > 0) {
			DelDialog = new DeletionDialog({
				target: dialogmount,
				props: {
					selected,
					schema: schema,
					data: fetchResult.items.filter((x) => selected.has(x.id)),
					sort: sort
				}
			});
			DelDialog.$on('close', () => {
				DelDialog?.$destroy();
				DelDialog = undefined;
			});
			DelDialog.$on('delete', (evebt: CustomEvent<boolean>) => {
				if (evebt.detail) {
					selected = new Set();
				}
				DelDialog?.$destroy();
				DelDialog = undefined;

				if (fetchResult) reFetch(fetchResult.page, filter, sort);
			});
		}
	}

	onMount(() => {
		// We need to slice the array to create a copy not mutating the original
		sort = schema.DefaultSort.slice();
		// fetchPage({ detail: { page: 1, filter: schema.DefaultFilter ?? "", sort: schema.DefaultSort } });
		api.collection(schema.TableName).subscribe('*', function (e: RecordSubscription<RecordModel>) {
			if (!changeModeDebounce && !loading) {
				setDebounceChangeNotification(15000);
				addInfoAlert('Die Liste wurde aktualisiert.', refresh_ondatachange, 'Neu laden', '', true);
			}
		});

		const unsubscribe = navigating.subscribe((navigating) => {
			if (navigating) {
				fetchResult = null;
				intermediateFetchResult = null;
			}
		});

		return () => {
			api.collection(schema.TableName).unsubscribe('*');
			sort = schema.DefaultSort;
			filter = '';
			unsubscribe();
		};
	});
</script>

<div class="mb-4">
	<h2 class="inline-block text-slate-400 pr-3">
		<span class="">Sammlungen&nbsp;/&nbsp;</span><span class="text-slate-900 font-bold">{schema.Name}</span>
	</h2>
	<button
		title="Neu laden"
		type="button"
		aria-label="Refresh"
		class="w-10 h-10 rounded-full hover:bg-slate-300 justify-center items-center text-center m-0"
		class:refreshing={refreshTimeoutId || !fetchResult}
		on:click={refresh}>
		<i class="ri-refresh-line" />
	</button>

	<SearchHistory
		filter={lastinput}
		{schema}
		on:selecthistory={(value) => {
			search.setValue(value.detail);
			search.search();
		}} />

	<TableViewOptions bind:schema bind:visible bind:selectable />

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

<Search bind:this={search} {searching} bind:filter {schema} on:search={(event) => Filter(event)} autoFocus={true} />

<Table
	bind:this={table}
	bind:selectable
	{schema}
	{sort}
	bind:data={fetchResult}
	{loading}
	{visible}
	bind:selected
	on:open
	on:sort={sort_f} />

<!-- Animating this with: in:send={{ key: 'message' }}
		out:receive={{ key: 'message' }} results in some kind of bug, where filtered and selectedcount loose reactivity. 
	Workaround: we make sure that Tablefoot is destroyed and loading always takes longer then the animation.  -->
{#if loading || !fetchResult}
	<div
		in:send={{ key: 'hugelistload' }}
		out:receive={{ key: 'hugelistload' }}
		class="bg-slate-50 w-12 h-12 m-0 fixed text-center bottom-6 right-6 rounded-full shadow-lg border border-slate-300 refreshing-infinite select-none">
		<i class="ri-hourglass-2-fill inline-block align-middle !text-lg !leading-[3rem]"></i>
	</div>
{:else}
	<div
		in:send={{ key: 'hugelistload' }}
		out:receive={{ key: 'hugelistload' }}
		class="bg-slate-50 px-5 py-2 fixed bottom-6 right-6 rounded-full shadow-lg border border-slate-300 select-none max-w-6xl refreshing-infinite transition-all duration-300">
		<TableFoot
			total={fetchResult.totalItems}
			totalPages={fetchResult.totalPages}
			perPage={fetchResult.perPage}
			page={fetchResult.page}
			{filtered}
			selected={selectcount}
			on:resetfilter={() => search.clear(true)}
			on:resetselect={() => table.resetSelected()}
			on:deleteselected={deleteSelected}
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
