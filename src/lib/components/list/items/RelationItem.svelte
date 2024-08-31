<script lang="ts">
	import type { PresentationFields, Schema, Table } from '$lib/newtypes';
	import type { RecordModel } from 'pocketbase';
	import { tables } from '$stores/tables';
	import { onMount } from 'svelte';

	interface Props {
		M: RecordModel;
		T: Table;
		F: Schema;
		G: boolean;
	}

	const { M, T, F, G }: Props = $props();

	const getViaStr = () => {
		if (!F.Options?.Collection || !F.Options.Field?.length) return '';
		return F.Options.Collection + '_via_' + F.Options.Field[0];
	};

	// We do a lot of work here; maybe the abstraction is not worth this much performance.
	let data: RecordModel | RecordModel[] | null = $state.raw(null);
	let pres: PresentationFields | null | undefined | undefined = $state.raw(null);

	onMount(() => {
		let name = F.Type.startsWith('Back') ? getViaStr() : F.Name;
		let corr = F.Options && Object.hasOwn(M, 'expand') && Object.hasOwn(M['expand']!, name);
		data = corr ? M['expand']![name] : null;
		pres = F.Options?.Collection ? tables.GetPresentationFields(F.Options.Collection) : null;
	});
</script>

<!-- TODO: For build-in types: Agents, Places, Serials, Works, Items, Entries we could customize the view here -->

{#snippet entry(d: RecordModel)}
	{#if pres}
		<div class="">
			{#each pres.Main as n (n)}
				<div class="">{d[n.Name]}</div>
			{/each}
		</div>

		{#if pres.Diff}
			<div class="">
				{#each pres.Diff as n (n)}
					<div class="">{d[n.Name]}</div>
				{/each}
			</div>
		{/if}
	{/if}
{/snippet}

{#if data && pres}
	{#if Array.isArray(data)}
		{#each data as d}
			{@render entry(d)}
		{/each}
	{:else}
		{@render entry(data)}
	{/if}
	{:else if !data}
	<div class="text-muted-foreground text-center">N/A</div>
{/if}
