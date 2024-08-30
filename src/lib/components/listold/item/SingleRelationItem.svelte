<script lang="ts">
	import type { ColumnType } from '$lib/types';
	import type { RecordModel } from 'pocketbase';

	export let data: RecordModel;
	export let column: ColumnType;

	function getText(field: string) {
		const fields = field.split(',');
		let text: string[] = [];
		for (let field of fields) {
			const expand = field.split('.');
			if (expand.length > 1 && data.expand && data.expand[expand[0]]) {
				text.push(data.expand[expand[0]][expand[1]]);
			} else {
				text.push(data[field]);
			}
		}

		return text.join(' ');
	}
</script>

{#each column.Fields as field (field.Field)}
	{#if field.Type !== 'searchonly'}
		<div class="ma-table-multiselectentry ma-table-data-{field.Field}">
			{getText(field.Field)}
		</div>
	{/if}
{/each}
