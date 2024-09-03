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
	let data: RecordModel[] | null = $state.raw(null);
	let pres: PresentationFields | null | undefined | undefined = $state.raw(null);

	onMount(() => {
		let name = F.Type.startsWith('Back') ? getViaStr() : F.Name;
		let corr = F.Options && Object.hasOwn(M, 'expand') && Object.hasOwn(M['expand']!, name);
		data = corr ? M['expand']![name] : null;
		pres = F.Options?.Collection ? tables.GetPresentationFields(F.Options.Collection) : null;
	});

	// TODO: this kind of works, but is a lot of work for that many tabke entries
	const getText = (field: Schema, i: number) => {
		if (!data || data?.length <= i) return "";
		if (field.Type === "RelationOne" && field.Options?.Collection) {
			if (!data[i].expand || !(data[i].expand[field.Name])) return  "";
			let pres = tables.GetPresentationFields(field.Options?.Collection);
			let r = "";
			if (pres)
			for (const p of pres.Main) {
				if (!(data[i].expand[field.Name][p.Name])) {
					continue;
				};
				r += data[i].expand[field.Name][p.Name] + " ";
			}
			return r;
		}
		return data[i][field.Name];
	};
</script>

<!-- TODO: For build-in types: Agents, Places, Serials, Works, Items, Entries we could customize the view here -->

{#snippet entry(d: RecordModel, i: number)}
	{#if pres}
		<div class="">
			{#each pres.Main as n (n)}
				<div class="">{d[n.Name]}</div>
			{/each}
		</div>

		{#if pres.Relation}
			<div class="">
				{#each pres.Relation as n (n)}
					<div class="">{d[n.Name]}</div>
				{/each}
			</div>
		{/if}
	
{#if pres.FromWhere}
{#each Object.entries(pres.FromWhere) as [coll, field]}
	{#if coll !== T.Name}
		<div class="">{getText(field, i)}</div>
{/if}
	{/each}
{/if}
	{/if}
{/snippet}

{#if data && pres}
		{#each data as d, i}
			{@render entry(d, i)}
		{/each}
{/if}
