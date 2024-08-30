<script lang="ts">
	import type { ColumnType } from '$lib/types';
	import type { RecordModel } from 'pocketbase';

	export let data: RecordModel;
	export let column: ColumnType;
</script>

{#each column.Fields as field (field.Field)}
	{#if data[field.Field]}
		<div class="ma-table-dateentry ma-table-data-{field.Field}">
			{new Date(data[field.Field]).toLocaleDateString()} <br/>
			{new Date(data[field.Field]).toLocaleTimeString()}
		</div>
	{/if}
{/each}
