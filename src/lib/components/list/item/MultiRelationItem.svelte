<script lang="ts">
	import type { ColumnType } from '$lib/types';
	import type { RecordModel } from 'pocketbase';

	export let data: RecordModel;
	export let column: ColumnType;

	function getText(field: string, id: string) {
		const fields = field.split(',');
		let text: string[] = [];
		for (let field of fields) {
			const expand = field.split('.');
			if (expand.length > 1 && data.expand && data.expand[expand[0]]) {
				let entry = data.expand[expand[0]].filter((x) => x.id === id)[0];
				text.push(entry[expand[1]]);
			} else {
				text.push(data[field]);
			}
		}

		return text;
	}

	function getField(name: string) {
		return name.split('.')[0];
	}

	function getTextSingle(field: string) {
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
	{#if field.Type == 'multirelation' && data[getField(field.Field)] && data[getField(field.Field)].length > 0}
		<div class="ma-table-multiselectentry ma-table-data-{field.Field}">
			{#each data[getField(field.Field)] as item}
				<div class="block">
					{#each getText(field.Field, item) as text}
						<div class="inline hyphens-none mr-1">
							{text}
						</div>
					{/each}
				</div>
			{/each}
		</div>
		<!-- We need to check for multiple or single relations since in Baende.Andere Reihentitel we have a mixed field type -->
	{:else if field.Type !== "searchonly"}
		<div class="ma-table-singleselectentry ma-table-data-{field.Field}">
			{getTextSingle(field.Field)}
		</div>
	{/if}
{/each}
