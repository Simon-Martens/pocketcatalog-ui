<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-missing-attribute -->
<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	import * as Tooltip from '$lib/shacdn/components/ui/tooltip';
	export let page: number;
	export let totalPages: number;
	export let total: number;
	export let selected: number;
	export let perPage: number;
	export let filtered: boolean;

	let Y: number;
	let h: number;

	$: filteractive = filtered;

	let dispatch = createEventDispatcher();
</script>

<svelte:window bind:scrollY={Y} bind:innerHeight={h} />
{#if selected > 0}
	<em>{selected} </em>{#if selected === 1}
		Eintrag
	{:else}
		Einträge
	{/if} ausgewählt
	<button
		on:click|preventDefault={() => {
			dispatch('resetselect');
		}}
		class="underline text-slate-600 hover:text-slate-900 decoration-dotted hover:decoration-solid">
		Auswahl aufheben
	</button>
	<button
		on:click|preventDefault={() => {
			dispatch('deleteselected');
		}}
		class="inline-block ml-1 px-2 py-0.5 bg-red-200 text-red-600 hover:text-red-900 rounded hover:shadow-inner">
		<i class="ri-delete-bin-line"></i> löschen
	</button> |
{/if}

{#if filteractive}
	<button
		on:click|preventDefault={() => {
			dispatch('resetfilter');
		}}
		class="inline-block px-2 bg-orange-200 text-orange-700 hover:text-orange-900 rounded hover:shadow-inner">
		<i class="ri-filter-off-line"></i> Filter zurücksetzen
	</button> |
{/if}

<span class="inline-block py-0.5">
	{#if page !== totalPages && totalPages !== 0}
		<em>{page * perPage}</em>&thinsp;/&thinsp;<em>{total}</em> Einträge |
		<button
			on:click|preventDefault={() => {
				dispatch('npage');
			}}
			class="underline text-slate-600 hover:text-slate-900 decoration-dotted hover:decoration-solid">
			Mehr anzeigen
		</button>
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
					on:click|preventDefault={() => {
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
					on:click|preventDefault={() => {
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
