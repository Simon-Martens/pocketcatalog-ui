<script lang="ts">
	import { RecordsList } from '$stores/records.svelte';
	import type { Table } from '$lib/newtypes';

	interface Props {
		records: RecordsList;
		scheme: Table;
		selectable: boolean;
	}

	const { records, scheme, selectable = $bindable() }: Props = $props();

	const more = () => {
		if (records) records.Next();
	};
</script>

{#if records.List && records.List.length}
	<table>
		<thead>
			<tr>
				{#each records.Visible as f (f.Name)}
					<th>{f.friendlyName ?? f.Name}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each records.List as e (e.id)}
				<tr>
					{#each records.Visible as f (f.Name)}
						<td>{e[f.Name]}</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
{/if}

{#if records.TotalPages !== 0 && records.Page !== records.TotalPages && !records.Loading && !records.Refreshing}
	<button onclick={more}>Mehr Einträge laden</button>
{/if}

<style>
	td {
		@apply align-top max-w-[32rem];
	}
</style>
