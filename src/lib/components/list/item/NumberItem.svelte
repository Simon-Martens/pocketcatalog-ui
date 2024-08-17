<script lang="ts">
	import type { ColumnType } from "$lib/types";
	import type { RecordModel } from "pocketbase";

    export let data: RecordModel;
    export let column: ColumnType;
</script>

{#each column.Fields as field (field.Field)}
<div class="ma-table-numberentry ma-table-data-{field.Field}">
    {#if !data[field.Field] || data[field.Field] === 0}
        {#if field.NotText}{field.NotText}{/if}
    {:else}
        <span class="ma-table-numberentry-number">{data[field.Field]}</span>
    {/if}
</div>
{/each}