<script lang="ts">
	import EntryTable from '$lib/components/list/EntryTable.svelte';
	import TableFoot from '$lib/components/list/TableFoot.svelte';
	import { RecordsList } from '$stores/records.svelte';
	import * as Tooltip from '$lib/shacdn/components/ui/tooltip';

	const { data } = $props();

	// scheme must be derived; otherwise it does not change on data change.
	let table: EntryTable;

	// this data is initialized and bound in the data table
	let selectable: boolean = $state(false);
	let visiblefields: string[] = $state([]);

	let records = $derived.by(() => {
		return new RecordsList(data.scheme, data.perPage);
	});

	let filtered = false;
	let selectcount = 0;

	$effect(() => {
		records.Fetch();
	});
</script>

<div class="px-8 py-2 border-b bg-slate-50 flex flex-row sticky top-0">
	<h2 class="text-slate-400 py-0.5">
		<span class="">Sammlungen&nbsp;&middot;&nbsp;</span><span class="text-slate-900 font-bold">{data.scheme.Name}</span>
	</h2>
	<Tooltip.Root>
		<Tooltip.Trigger>
			<button type="button" aria-label="Refresh" class="ml-2 w-6 h-6 my-0.5 rounded-full hover:bg-slate-300 justify-center items-center text-center" onclick={() => records.Refresh()} class:refreshing={records.Refreshing}>
				<i class="ri-refresh-line"></i>
			</button>
		</Tooltip.Trigger>
		<Tooltip.Content side="bottom">
			<p class="text-base">Neu laden</p>
		</Tooltip.Content>
	</Tooltip.Root>

	<div class="grow"></div>
	<div class="">
		{#if records.Loading || records.Refreshing || !records.List}
			<i class="ri-hourglass-2-fill inline-block align-middle !text-base"></i>
		{:else}
			<TableFoot
				total={records.TotalItems}
				totalPages={records.TotalPages}
				perPage={data.perPage}
				page={records.Page}
				{filtered}
				selected={selectcount}
				on:resetfilter={() => {}}
				on:resetselect={() => {}}
				on:deleteselected={() => {}}
				on:npage={() => records.Next()} />
		{/if}
	</div>
</div>

{#each records.Visible as v (v.Name)}
	<div>{v.Name}</div>
{/each}

<div class="">
	<EntryTable bind:this={table} scheme={data.scheme} {records} bind:selectable bind:visiblefields />
</div>

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
		display: inline-block;
	}
</style>
