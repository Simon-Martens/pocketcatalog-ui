<script lang="ts">
	import { RecordsList } from '$stores/records.svelte';
	import type { Table } from '$lib/newtypes';

	interface Props {
		records: RecordsList;
		scheme: Table;
		selectable: boolean;
		visiblefields: string[];
	}

	const { records = $bindable(), scheme, selectable = $bindable(), visiblefields = $bindable() }: Props = $props();

	const more = () => {
		if (records) records.Next();
	};
</script>

<table>
	{#if records && records.List && records.List.length}
		<tbody>
			{#each records.List as e (e.id)}
				<tr>
					<td>{e.id}</td>
				</tr>
			{/each}
		</tbody>
	{/if}
</table>
<button onclick={more}>More</button>
