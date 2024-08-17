<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<!-- svelte-ignore a11y-missing-attribute -->
<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	
	export let page: number;
	export let totalPages: number;
	export let total: number;
	export let selected: number;
	export let perPage: number;
	export let filtered: boolean;

	$: filteractive = filtered;

	let dispatch = createEventDispatcher();
</script>

{#if selected > 0}
	<em>{selected} </em>{#if selected === 1} Eintrag {:else} Einträge {/if} ausgewählt 
	<a
		on:click|preventDefault={() => {
			dispatch('resetselect');
		}}
		class="underline text-slate-600 hover:text-slate-900 decoration-dotted hover:decoration-solid">
		Auswahl aufheben
	</a>
	<a 
		on:click|preventDefault={() => {
			dispatch('deleteselected');
		}}
		class="inline-block ml-1 px-2 py-0.5 bg-red-200 text-red-600 hover:text-red-900 rounded hover:shadow-inner">
		<i class="ri-delete-bin-line"></i> löschen
	</a> | 
{/if}

{#if filteractive}
	<a
		on:click|preventDefault={() => {
			dispatch('resetfilter');
		}}
		class="inline-block px-2 bg-orange-200 text-orange-700 hover:text-orange-900 rounded hover:shadow-inner">
		<i class="ri-filter-off-line"></i> Filter zurücksetzen
	</a> | 
{/if}

<span class="inline-block py-0.5">
{#if page !== totalPages && totalPages !== 0}
<em>{page * perPage}</em>&thinsp;/&thinsp;<em>{total}</em> Einträge | <a
			on:click|preventDefault={() => {
				window.scrollTo({ top: 0, behavior: 'smooth' });
			}}
			class="underline text-slate-600 hover:text-slate-900 decoration-dotted hover:decoration-solid">
			<i class="ri-arrow-up-fill"></i></a>
		<a
			on:click|preventDefault={() => {
				window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth'});
			}}
			class="underline text-slate-600 hover:text-slate-900 decoration-dotted hover:decoration-solid">
			<i class="ri-arrow-down-fill"></i>
		</a>
		<a
			on:click|preventDefault={() => {
				// window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto'});
				dispatch('npage');
			}}
			class="underline text-slate-600 hover:text-slate-900 decoration-dotted hover:decoration-solid">
			Mehr anzeigen
		</a>
{:else if total > 0}
<em>{total}</em> {#if total === 1} Eintrag {:else} Einträge {/if}

{:else}
Keine Einträge gefunden
{/if}
</span>

<style>
	em {
		font-style: normal;
		font-weight: bold;
	}
</style>
