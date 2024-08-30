<script lang="ts">
	import type {
		SchemaType,
		ReiheType,
		InhaltType,
		BandType,
		ColumnType,
		PersonType
	} from '$lib/types';
	import BoolItem from './item/BoolItem.svelte';
	import DateItem from './item/DateItem.svelte';
	import HtmlItem from './item/HTMLItem.svelte';
	import MultiRelationItem from './item/MultiRelationItem.svelte';
	import NumberItem from './item/NumberItem.svelte';
	import SingleSelectItem from './item/SingleSelectItem.svelte';
	import SingleRelationItem from './item/SingleRelationItem.svelte';
	import MultiSelectItem from './item/MultiSelectItem.svelte';
	import ImageItem from './item/ImageItem.svelte';
	import TextItem from './item/TextItem.svelte';
	import IDItem from './item/IDItem.svelte';

	import { fade } from 'svelte/transition';
	import { createEventDispatcher } from 'svelte';
	import type { RecordModel } from 'pocketbase';

	export let schema: SchemaType;
	export let data: RecordModel;
	export let visible: string[];
	export let selected: Set<string>;
	export let selectable: boolean = true;
	export let minitable: boolean = false;
	
	$: select = selected.has(data.id);

	let dispatch = createEventDispatcher();
</script>

<tr
	class="ma-table-row ma-table-row-{schema.TableName} odd:bg-slate-200"
	class:odd:!bg-slate-50={minitable}
	class:even:!bg-slate-100={minitable}
	class:odd:!border-r-slate-50={minitable}
	class:even:!border-r-slate-100={minitable}
	transition:fade
	on:click={() => dispatch('open', data)}
>
	{#if selectable}
	<td class="ma-table-cell ma-table-cell-select px-3 py-2 border-b-slate-300 border-b border-r-4 w-4 !border-r-[inherit]" class:!border-r-slate-700={select}>
		<input
			class="shadow-inner relative top-1 focus:ring-indigo-500 focus:border-indigo-500 block sm:text-sm border-gray-300 rounded-md w-4 h-4"
			type="checkbox"
			name="selecttablerow"
			checked={select}
			on:change={() => dispatch('toggleselectrow', data.id)}
			value={data.id}
		/>
	</td>
	{/if}

	{#each schema.Columns as column (column.Name)}
		<!-- Fields length is always > 0 since all columns are defined by the schema -->
		{#if visible && visible.includes(column.Name) && column.Fields.length > 0}
			<td class="ma-table-cell ma-table-cell-{column.Name} px-3 py-2 border-b-slate-300 border-b max-w-[16rem]" class:bg-slate-300={select}>
				{#if column.Fields[0].Type == 'text'}
					<TextItem {data} {column} />
				{:else if column.Fields[0].Type == 'HTML'}
					<HtmlItem {data} {column} />
				{:else if column.Fields[0].Type == 'date'}
					<DateItem {data} {column} />
				{:else if column.Fields[0].Type == 'bool'}
					<BoolItem {data} {column} />
				{:else if column.Fields[0].Type == 'number'}
					<NumberItem {data} {column} />
				{:else if column.Fields[0].Type == 'singlerelation'}
					<SingleRelationItem {data} {column} />
				{:else if column.Fields[0].Type == 'multirelation'}
					<MultiRelationItem {data} {column} />
				{:else if column.Fields[0].Type == 'singleselect'}
					<SingleSelectItem {data} {column} />
				{:else if column.Fields[0].Type == 'multiselect'}
					<MultiSelectItem {data} {column} />
				{:else if column.Fields[0].Type == 'image'}
					<ImageItem {data} {column} tablename={schema.TableName} />
				{:else if column.Fields[0].Type == 'id'}
					<IDItem {data} {column} />
				{/if}
			</td>
		{/if}
	{/each}
</tr>

<style>

</style>