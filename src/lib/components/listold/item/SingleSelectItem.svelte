<script lang="ts">
	import type { ColumnType } from "$lib/types";
	import type { RecordModel } from "pocketbase";

    export let data: RecordModel;
    export let column: ColumnType;
</script>

{#each column.Fields as field (field.Field)}
<div class="ma-table-singleselectentry ma-table-data-{field.Field}">
    {data[field.Field]}
</div>
{/each}