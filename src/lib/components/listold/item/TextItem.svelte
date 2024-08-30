<script lang="ts">
	import type { ColumnType } from '$lib/types';
	import { Icons } from '$stores/icons';
	import type { RecordModel } from 'pocketbase';
	export let data: RecordModel;
	export let column: ColumnType;
</script>

<!-- Text items can have bool flags after the text as Akteure.Name & Akteure.Koerperschaft -->
{#each column.Fields as field (field.Field)}
	{#if field.Type === 'bool'}
		{#if data[field.Field]}
			<div
				class="ma-table-boolentry-true ma-table-data-{field.Field} ml-2 inline-block text-xs font-bold hyphens-none border text-slate-700 border-slate-300 bg-slate-300 px-2 py-0.5 rounded-full text-center">
				{#if field.Icon}
					<i class={Icons[field.Icon]}></i>
				{/if}
				{#if field.Text}
					<span>{field.Text}</span>
				{/if}
			</div>
		{:else if field.NotIcon || field.NotText}
			<div
				class="ma-table-boolentry-false ma-table-data-{field.Field} ml-2 inline-block text-xs font-bold hyphens-none border text-slate-700 border-slate-300 bg-slate-300 px-2 py-0.5 rounded-full text-center">
				{#if field.NotIcon}
					<i class={Icons[field.NotIcon]}></i>
				{/if}
				{#if field.NotText}
					<span>{field.NotText}</span>
				{/if}
			</div>
		{/if}
	{:else if field.Type === 'singleselect' || field.Type === 'multiselect'}

	{:else}
		<div class="ma-table-textentry ma-table-data-{field.Field} inline-block">
			{#if !data[field.Field] || data[field.Field] === ''}
				{#if field.NotText}{field.NotText}{/if}
			{:else}
				<span>{data[field.Field]}</span>
			{/if}
		</div>
	{/if}
{/each}
