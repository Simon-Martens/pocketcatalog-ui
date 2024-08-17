<script lang="ts">
	import type { SchemaType, ReiheType, InhaltType, BandType, ColumnType, PersonType } from '$lib/types';
	import TableHead from './TableHead.svelte';
	import TableRow from './TableRow.svelte';
	import type { RecordModel } from 'pocketbase';
	import { onMount } from 'svelte';

	export let schema: SchemaType;
	export let sort: string[];
	export let data: RecordModel[];
	export let loading: boolean = false;
	export let selected: Set<string> = new Set();
	export let visible: string[] = [];

	let tablehead: TableHead;

    onMount(() => {
        visible = schema.MiniColumns;
    });
</script>

<table
	class="w-full border-separate border-spacing-0 mb-3">
	<TableHead bind:this={tablehead} {schema} bind:sort bind:visible selectable={false} minitable={true}/>
	<tbody>
		{#each data as item (item.id)}
			<TableRow {schema} data={item} {visible} bind:selected selectable={false} minitable={true} />
		{/each}
	</tbody>
</table>
