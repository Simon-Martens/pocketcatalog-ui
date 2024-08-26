<script lang="ts">
	import type { Table } from '$lib/newtypes';
	import TableHead from './TableHead.svelte';
	import TableRow from './TableRow.svelte';
	import type { ListResult, RecordModel } from 'pocketbase';

	export let schema: Table;
	export let sort: string[];
	export let entries: RecordModel[] | null;
	export let loading: boolean;
	export let selected: Set<string>;
	export let visible: string[];
	export let selectable: boolean = true;

	$: if (!selectable) {
		selected = new Set();
	}

	$: if (schema) {
		resetSelected();
	}

	let tablehead: TableHead;

	$: if (tablehead && entries && selected.size === entries.length) {
		tablehead.selectAll();
	} else if (tablehead && entries && selected.size < entries.length) {
		tablehead.deselectAll();
	}

	export const resetSelected = function () {
		selected = new Set();
	};

	const toggleSelectRow = function (event: CustomEvent<string>) {
		if (selected.has(event.detail)) {
			selected.delete(event.detail);
		} else {
			selected.add(event.detail);
		}

		selected = selected;
	};

	const toggleSelectAll = function (event: CustomEvent<boolean>) {
		if (entries && selected.size !== entries.length) {
			selected = new Set(entries.map((e) => e.id));
		} else {
			selected = new Set();
		}
	};
</script>

<table class="w-full border-separate border-spacing-0 mb-10">
	<TableHead bind:this={tablehead} {schema} {sort} bind:visible on:toggleselectall={toggleSelectAll} on:sort bind:selectable />
	{#if entries}
		<tbody>
			{#each entries as item (item.id)}
				<TableRow {schema} data={item} {visible} bind:selected on:toggleselectrow={toggleSelectRow} on:open bind:selectable />
			{/each}
		</tbody>
	{/if}
</table>

{#if !entries || loading}
	<div class="w-full align-middle text-center refreshing-infinite">
		<i class="ri-loader-3-line text-4xl text-center w-full" />
	</div>
{:else if !entries.length}
	<div class="w-full align-middle text-center">
		<i class="ri-filter-line text-xl text-center w-full" /><span class="font-bold">Keine Einträge gefunden</span>
	</div>
{/if}

<style>
	@keyframes refresh {
		100% {
			transform: rotate(360deg);
		}
	}

	.refreshing-infinite i {
		animation: refresh 900ms infinite;
	}

	i {
		display: inline-block;
	}
</style>
