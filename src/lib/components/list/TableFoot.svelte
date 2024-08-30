<script lang="ts">
	import * as Tooltip from '$lib/shacdn/components/ui/tooltip';
	import type { RecordsList } from '$stores/records.svelte';

	interface Props {
		records: RecordsList;
		perPage: number;
	}

	const { records, perPage }: Props = $props();

	let page: number = $derived(records.Page);
	let totalPages: number = $derived(records.TotalPages);
	let total: number = $derived(records.TotalItems);
	let filtered: boolean = $derived(records.Filter !== '');

	let Y: number = $state(0);
	let h: number = $state(0);
</script>

<svelte:window bind:scrollY={Y} bind:innerHeight={h} />
{#if records.Selected.length > 0 && records.Selectable}
	<em>{records.Selected.length} </em>
	{#if records.Selected.length === 1}
		Eintrag
	{:else}
		Einträge
	{/if} ausgewählt
	<!-- TODO: Mehrfachauswahl -->
	<button
		onclick={() => {
			records.Selected = [];
		}}
		class="underline text-slate-600 hover:text-slate-900 decoration-dotted hover:decoration-solid">aufheben</button>
	<!-- TODO: Implement deleting -->
	<button onclick={() => {}} class="inline-block ml-1 px-2 py-0.5 bg-red-200 text-red-600 hover:text-red-900 rounded hover:shadow-inner">
		<i class="ri-delete-bin-line"></i> löschen
	</button>
{/if}

<Tooltip.Root>
	<Tooltip.Trigger>
		<input type="checkbox" bind:checked={records.Selectable} class="!mx-1 w-4 h-4 !my-1 justify-center items-center text-center accent-black shadow-none" />
	</Tooltip.Trigger>
	<Tooltip.Content side="bottom">
		<p class="text-base">Mehrfachauswahl</p>
	</Tooltip.Content>
</Tooltip.Root> |
{#if filtered}
	<!-- TODO: Implement filter -->
	<button onclick={() => {}} class="inline-block px-2 bg-orange-200 text-orange-700 hover:text-orange-900 rounded hover:shadow-inner">
		<i class="ri-filter-off-line"></i> Filter zurücksetzen
	</button> |
{/if}

<span class="inline-block py-0.5">
	{#if page !== totalPages && totalPages !== 0}
		<em>{page * perPage}</em>&thinsp;/&thinsp;<em>{total}</em> Einträge |
		<button onclick={() => records.Next()} class="underline text-slate-600 hover:text-slate-900 decoration-dotted hover:decoration-solid"> Mehr anzeigen </button>
	{:else if total > 0}
		<em>{total}</em>
		{#if total === 1}
			Eintrag
		{:else}
			Einträge
		{/if}
	{:else}
		Keine Einträge gefunden
	{/if} |
	{#if Y > 150}
		<Tooltip.Root closeDelay={0}>
			<Tooltip.Trigger>
				<button
					onclick={() => {
						window.scrollTo({ top: 0, behavior: 'smooth' });
					}}
					class="underline text-slate-600 hover:text-slate-900 decoration-dotted hover:decoration-solid">
					<i class="ri-arrow-up-fill"></i></button>
			</Tooltip.Trigger>
			<Tooltip.Content side="bottom"><p class="text-base">Seitenanfang</p></Tooltip.Content>
		</Tooltip.Root>
	{/if}
	{#if Y + h < document.body.scrollHeight}
		<Tooltip.Root closeDelay={0}>
			<Tooltip.Trigger>
				<button
					onclick={() => {
						window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
					}}
					class="underline text-slate-600 hover:text-slate-900 decoration-dotted hover:decoration-solid">
					<i class="ri-arrow-down-fill"></i></button>
			</Tooltip.Trigger>
			<Tooltip.Content side="bottom"><p class="text-base">Seitenende</p></Tooltip.Content>
		</Tooltip.Root>
	{/if}
</span>

<style>
	a {
		@apply cursor-pointer;
	}

	em {
		font-style: normal;
		font-weight: bold;
	}
</style>
