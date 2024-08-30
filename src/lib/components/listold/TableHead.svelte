<script lang="ts">
	import type { SchemaType, ColumnType } from '$lib/types';
	import { createEventDispatcher } from 'svelte';
	import { Icons } from '$stores/icons';

	export let schema: SchemaType;
	export let sort: string[];
	export let visible: string[];
	export let selectable: boolean = true;
	export let minitable: boolean = false;

	let longpress: number;

	let forceselect: boolean = false;
	let dispatch = createEventDispatcher();

	export const selectAll = function () {
		forceselect = true;
	};

	export const deselectAll = function () {
		forceselect = false;
	};

	const addSort = function (fieldName: string) {
		longpress = -1;
		if (!sort) {
			sort = [fieldName];
			return;
		}

		let index = sort.indexOf(fieldName);
		if (index > -1) {
			sort.splice(index, 1);
			sort.push('-' + fieldName);
			dispatch('sort', sort);
			return;
		}

		index = sort.indexOf('-' + fieldName);
		if (index > -1) {
			sort.splice(index, 1);
			dispatch('sort', sort);
			return;
		}

		sort.push(fieldName);

		dispatch('sort', sort);
	};

	function toggle(fieldName: string) {
		if (!sort) {
			sort = [fieldName];
		} else if (sort.includes('-' + fieldName) || sort.length > 1) {
			sort = [fieldName];
		} else if (sort.includes(fieldName)) {
			sort = ['-' + fieldName];
		} else {
			sort = [fieldName];
		}
		dispatch('sort', sort);
	}
</script>

<thead class="">
	{#if selectable}
	<th class="bg-background border-slate-600 px-3 py-2 sticky top-0 align-bottom w-4 pb-3 z-10" class:!bg-slate-100={minitable}>
		<input
			class="shadow focus:ring-indigo-500 focus:border-indigo-500 block sm:text-sm border-gray-300 rounded-md w-4 h-4"
			type="checkbox"
			name="selecttableall"
			checked={forceselect}
			on:change={() => dispatch('toggleselectall')} />
	</th>
	{/if}
	{#each schema.Columns as column (column.Name)}
		{#if visible && visible.includes(column.Name)}
			{#if column.NameVisible !== false}
				<th class="bg-background border-slate-600 px-1.5 sticky top-0 align-bottom whitespace-nowrap max-w-[16rem]" class:!bg-slate-100={minitable}>
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<div
						class="ma-list-insideth border-b-[2px] border-slate-600 text-slate-700 px-1 py-1.5  flex flex-row flex-nowrap gap-x-2"
						class:hover:border-slate-900={!minitable}
						class:hover:text-slate-900={!minitable}
						class:cursor-pointer={!minitable}
						class:pt-6={!minitable}
						class:minitable={minitable}
						on:mousedown={ () => {
							longpress = setTimeout(() => {
								addSort(column.Fields[0].Field);
							}, 300);
						}}
						on:mouseup={ () => {
							if (longpress === -1) return; 
							clearTimeout(longpress)
							toggle(column.Fields[0].Field);
						}}>
						<!-- TODO -->
						<!-- svelte-ignore a11y-click-events-have-key-events -->
						<!-- svelte-ignore a11y-no-static-element-interactions -->
						<!-- svelte-ignore a11y-missing-attribute -->
						{#if column.Icon}
							<i class="inline-block text-md {Icons[column.Icon.toLowerCase()]}"></i>
						{/if}
						<div class="inline-block grow">{column.Name}</div>
						{#if sort.includes(column.Fields[0].Field)}
							<i class="ri-arrow-down-line"></i>{#if sort.length > 1}<span class="inline-block align-super text-xs -ml-1.5">{sort.indexOf(column.Fields[0].Field) + 1}</span>{/if}
							<!-- <i class="ri-sort-desc"></i> -->
						{:else if sort.includes('-' + column.Fields[0].Field)}
							<i class="ri-arrow-up-line"></i>{#if sort.length > 1}<span class="inline-block align-super text-xs -ml-1.5">{sort.indexOf('-' + column.Fields[0].Field) + 1}</span>{/if}
							<!-- <i class="ri-sort-asc"></i> -->
						{:else}
							<i class="opacity-0 ri-arrow-down-line text-slate-400"></i>
						{/if}
					</div>
				</th>
			{:else}
				<th
					class="bg-background border-slate-600 px-1.5 pb-1.5 sticky top-0 align-bottom whitespace-nowrap !text-center"
					class:!bg-slate-100={minitable}
					class:pt-6={!minitable}
					class:minitable={minitable}>
					{#if column.Icon}
						<div
							class="ma-list-insideth border-slate-600 text-slate-600 px-1 py-1 hover:border-slate-900 hover:text-slate-900"
							title={column.Name}>
							<i class="text-md {Icons[column.Icon]}"></i>
						</div>
					{/if}
				</th>
			{/if}
		{/if}
	{/each}
</thead>

<style>
	.ma-list-insideth {
		clear: both;
	}

	.ma-list-insideth i {
	}

	.ma-list-insideth:hover:not(.minitable) i {
		opacity: 1 !important;
	}
</style>
