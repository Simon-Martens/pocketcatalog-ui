<script lang="ts">
	import type { BandType, InhaltType, SchemaType } from '$lib/types';
	import { baendeSchema, inhalteSchema } from '$lib/models';
	import { createEventDispatcher } from 'svelte';
	import MiniTable from '../list/MiniTable.svelte';
	import { api } from '$stores/pocketbase';
	import { addErrorAlert, addSuccessAlert } from '$stores/alerts';
	import type { RecordModel } from 'pocketbase';

	export let selected: Set<string>;
	export let schema: SchemaType;
	export let sort: string[];
	export let data: RecordModel[];

	let s_band: SchemaType = baendeSchema;
	let s_inhalt: SchemaType = inhalteSchema;

	export let v_baende: BandType[] = [];
	export let v_inhalte: InhaltType[] = [];
	let v_show: boolean = false;

	export let c_baende: BandType[] = [];
	export let c_inhalte: InhaltType[] = [];
	let c_show: boolean = false;

	let deleting: boolean = false;
	let deletion_errors: RecordModel[] = [];

	let dispatch = createEventDispatcher();

	export const show_vs = function (vb: BandType[] | null, vi: InhaltType[] | null) {
		v_baende = vb ?? [];
		v_inhalte = vi ?? [];
		v_show = true;
	};

	export const show_cs = function (cb: BandType[] | null, ci: InhaltType[] | null) {
		c_baende = cb ?? [];
		c_inhalte = ci ?? [];
		c_show = true;
	};

	const del = async function (tname: string, data: RecordModel[]) {
		deleting = true;
		let del_errors: { [key: string]: string } = {};

		// We do the bin handling server-side to avoid unesccesary roudtrips

		// This must not throw because inidividual errors are caught in the yield function
		Promise.all(yieldDeletionPromises(tname, data, del_errors))
			.then(() => {
				if (Object.keys(del_errors).length > 0) {
					deletion_errors = data.filter((d) => Object.keys(del_errors).includes(d.id));

					addErrorAlert('Fehler beim Löschen von Einträgen.', true);
				} else {
					if (data.length > 1) addSuccessAlert('Einträge gelöscht', true);
					else addSuccessAlert('Eintrag gelöscht', true);
					dispatch('delete', true);
				}
			})
			.finally(() => {
				deleting = false;
			});
	};

	function* yieldDeletionPromises(tableName: string, ids: RecordModel[], errorcatcher: { [key: string]: string }) {
		for (const id of ids)
			yield api
				.collection(tableName)
				.delete(id.id, { requestKey: null })
				.catch((error) => {
					errorcatcher[id.id] = error.message;
				});
	}

	function serialize(val: any) {
		return JSON.stringify(typeof val === 'undefined' ? null : val, null, 2);
	}
</script>

<div class="fixed top-0 w-screen h-screen backdrop-blur-sm backdrop-grayscale transition-all duration-500 z-20"></div>
<div
	class="fixed min-w-[52rem] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-9 py-6 bg-slate-50 rounded-lg shadow-xl !opacity-100 z-30">
	<h1 class="text-2xl mb-2.5">
		{#if selected.size > 1}
			Einträge
		{:else}
			Eintrag{/if} löschen
	</h1>

	{#if deletion_errors.length === 0}
		<p>
			Sind Sie sich sicher, dass Sie {#if selected.size > 1}
				die ausgewählten Einträge
			{:else}
				den ausgewählten Eintrag{/if} löschen möchten?
		</p>
		<p>
			Gelöschte Einträge werden in den Papierkorb verschoben und können dort von einem Administrator wiederhergestellt
			werden.
		</p>
		{#if schema.TableName === 'Akteure' || schema.TableName === 'Reihentitel'}
			<p>
				Möglicherweise werden <em>Verweise</em> in Bänden {#if schema.TableName === 'Akteure'}
					oder Inhalten
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<!-- svelte-ignore a11y-no-static-element-interactions -->
					<!-- svelte-ignore a11y-missing-attribute -->
				{/if} ebenfalls gelöscht und Einträge der entsprechenden Tabellen geändert (<a
					class="underline decoration-dotted hover:decoration-solid"
					on:click={() => dispatch('show_vs')}>anzeigen</a
				>).
			</p>
		{/if}

		<div class="mt-6 max-h-80 overflow-auto">
			<MiniTable {schema} {sort} {data} />
		</div>

		<div class="flex flex-row justify-between gap-x-4 mt-6">
			<button
				class="rounded bg-slate-200 text-slate-600 hover:bg-slate-300 hover:text-slate-900 shadow-inner px-4 py-3 grow transition-colors duration-100"
				on:click={() => dispatch('close')}
				>Abbrechen
			</button>
			<button
				class="rounded bg-red-300 text-red-600 hover:text-red-900 shadow-red-200 shadow hover:shadow-md px-4 py-3 grow transition-colors duration-100 font-bold border border-red-300"
				on:click={() => del(schema.TableName, data)}
				disabled={deleting}
				class:refreshing-infinite={deleting}
				>Löschen {#if deleting}
					<i class="ri-hourglass-2-fill inline-block align-middle !text-lg ml-2"></i>
				{/if}
			</button>
		</div>
	{:else}
		<p>
			{#if deletion_errors.length === 1}
				Ein Eintrag konnte nicht gelöscht werden.
			{:else}
				Einige Einträge konnten nicht gelöscht werden.
			{/if}
			Bitte vergewissern Sie sich, dass für Reihen keine Bände und für Bände keine Inhalte mehr existieren, die auf die Einträge
			oder den Eintrag verweisen.
		</p>
		<p>
			{#if deletion_errors.length > 1}
				Folgende Elemente konnten
			{:else}
				Folgendes Element konnte
			{/if} nicht glöscht werden:
		</p>
		<div class="mt-6 max-h-80 overflow-auto">
			<MiniTable {schema} {sort} data={deletion_errors} />
		</div>
		<button
			class="rounded bg-slate-200 text-slate-600 hover:bg-slate-300 hover:text-slate-900 shadow-inner px-4 py-3 w-full transition-colors duration-100"
			on:click={() => dispatch('delete', false)}
			>Abbrechen
		</button>
	{/if}
</div>

<style>
	p:not(:first-of-type) {
		text-indent: 0rem !important;
	}

	p {
		max-width: 40rem;
	}

	@keyframes refresh {
		100% {
			transform: rotate(360deg);
		}
	}

	.refreshing-infinite i {
		animation: refresh 900ms infinite;
	}
</style>
