<script lang="ts">
	import type { ColumnType } from '$lib/types';
	import type { RecordModel } from 'pocketbase';

	export let data: RecordModel;
	export let column: ColumnType;
</script>

{#each column.Fields as field (field.Field)}
	{#if data[field.Field].length > 0}
	<div class="flex flex-col gap-x-2 gap-y-1.5 whitespace-nowrap">
		{#each data[field.Field] as item}
			<div class="ma-table-multiselectentry w-min ma-table-data-{field.Field} text-xs font-bold hyphens-none border text-slate-700 border-slate-300 bg-slate-300 px-2 py-0.5 rounded-full text-center inline-block">
				{item}
			</div>
		{/each}
	</div>
	{/if}
{/each}

