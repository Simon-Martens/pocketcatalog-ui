<script lang="ts">
	import { RecordsList, ViewGroups } from '$stores/records.svelte';
	import type { Table } from '$lib/newtypes';

	interface Props {
		records: RecordsList;
		scheme: Table;
	}

	const { records = $bindable(), scheme }: Props = $props();
</script>

{#if records.VisibleGroups}
	<table class="w-full">
		<thead>
			<tr>
				{#if records.Selectable}
					<th>S</th>
				{/if}
				{#each records.VisibleGroups as mg (mg.Group)}
					{#if mg.Grouped}
						<th>{ViewGroups[mg.Group].friendlyName ?? ViewGroups[mg.Group].Name}</th>
					{:else}
						{#each Object.entries(mg.Fields) as [n, g] (n)}
							{#each g as f (f.Name)}
								<th>{f.friendlyName ?? f.Name}</th>
							{/each}
						{/each}
					{/if}
				{/each}
			</tr>
		</thead>
		<tbody>
			{#if records.List}
				{#each records.List as e (e.id)}
					<tr>
						{#if records.Selectable}
							<td>
								<input type="checkbox" class="!mx-1 w-4 h-4 !my-1 justify-center items-center text-center accent-black shadow-none" value={e.id} bind:group={records.Selected} />
							</td>
						{/if}
						{#each records.VisibleGroups as mg (mg.Group)}
							{#if mg.Grouped}
								<td>
									{#each Object.entries(mg.Fields) as [n, g] (n)}
										{#each g as f (f.Name)}
											<div>{e[f.Name]}</div>
										{/each}
									{/each}
								</td>
							{:else}
								{#each Object.entries(mg.Fields) as [n, g] (n)}
									{#each g as f (f.Name)}
										<td>{e[f.Name]}</td>
									{/each}
								{/each}
							{/if}
						{/each}
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
{/if}

{#if records.TotalPages !== 0 && records.Page !== records.TotalPages && !records.Loading && !records.Refreshing}
	<button onclick={() => records.Next()}>Mehr Einträge laden</button>
{/if}

<style>
	td {
		@apply align-top max-w-[32rem];
	}
</style>
