<script lang="ts">
	import type { ColumnType } from '$lib/types';
	import { Icons } from '$stores/icons';
	import type { RecordModel } from 'pocketbase';
	export let data: RecordModel;
	export let column: ColumnType;
</script>

{#each column.Fields as field (field.Field)}
	{#if data[field.Field]}
		<div class="ma-table-boolentry-true ma-table-data-{field.Field}">
			{#if field.Icon}	
				<i class="text-md {Icons[field.Icon+'-true']}"></i>
			{/if}
			{#if field.Text}
				<span>{field.Text}</span>
			{/if}
		</div>
	{:else}
		<div class="ma-table-boolentry-false ma-table-data-{field.Field}">
			{#if field.Icon}	
				<i class="text-md {Icons[field.Icon+'-false']}"></i>
			{/if}
			{#if field.NotText}
				<span>{field.NotText}</span>
			{/if}
		</div>
	{/if}
{/each}
