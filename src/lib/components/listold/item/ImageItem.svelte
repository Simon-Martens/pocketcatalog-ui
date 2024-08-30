<script lang="ts">
	import type { ColumnType } from '$lib/types';
	import { api_url, api } from '$stores/pocketbase.js';
	import type { RecordModel } from 'pocketbase';

	export let data: RecordModel;
	export let tablename: string;
	export let column: ColumnType;

	// TODO Loading tokens
</script>

<div class=" inline-flex  gap-2">
{#each column.Fields as field (field.Field)}
	{#each data[field.Field] as scan}
			<a class="aspect-square w-10" href="{api_url}/api/files/{tablename}/{data.id}/{scan}" target="_blank">
				<img
					src="{api_url}/api/files/{tablename}/{data.id}/{scan}?thumb=100x0"
					width="200"
					alt="Scan des Inhalts {data.id}"
				/>
			</a>
	{/each}
{/each}
</div>
<style>
</style>
