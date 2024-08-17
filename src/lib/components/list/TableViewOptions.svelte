<script lang="ts">
	import type { SchemaType, UserType } from '$lib/types';
	import { fly } from 'svelte/transition';
	import { pushUser, api } from '$stores/pocketbase';
	import { clickOutside } from '$lib/actions/ClickOutside';

	export let schema: SchemaType;
	export let selectable: boolean;
	export let allowSelection: boolean = true;
	export let visible: string[] = [];

	let hidden: boolean = true;

	$: if (visible.length) {
		updateUserdata();
	}

	$: if (schema) {
		initSettings();
	}

	const updateUserdata = function () {
		// We need to check for hidden so that we don't update userdata when the component is first mounted
		// Sorry, I know this is ugly, but I don't know how to do it better because of the way Svelte works
		if (!hidden && api.authStore.model) {
			let copy = structuredClone(api.authStore.model) as UserType;
			copy.settings = copy.settings || {};
			copy.settings.VisibleFields = copy.settings.VisibleFields || {};
			copy.settings.VisibleFields[schema.TableName] = visible;
			pushUser(copy);
		}
	};

	function initSettings() {
		if (api.authStore.model?.settings?.VisibleFields && api.authStore.model.settings.VisibleFields[schema.TableName]) {
			visible = api.authStore.model.settings.VisibleFields[schema.TableName];
		} else if (schema.Columns) {
			visible = schema.Columns.filter((s) => s.DefaultVisible).map((s) => s.Name);
		}
	}
</script>

<div
	class="relative inline-block"
	use:clickOutside
	on:click_outside={() => {
		if (!hidden) hidden = true;
	}}>
	<button
		title="Tabellenanzeige anpassen"
		type="button"
		aria-label="Refresh"
		class="w-10 h-10 rounded-full hover:bg-slate-300 justify-center items-center text-center m-0"
		class:bg-slate-300={!hidden}
		on:click={() => (hidden = !hidden)}>
		{#if hidden}
			<i class="ri-list-settings-line" />
		{:else}
			<i class="ri-list-settings-fill" />
		{/if}
	</button>

	{#if !hidden}
		<div
			class="absolute z-10 w-72 min-w-min pb-2.5 bg-slate-50 shadow-md border border-slate-300 top-12 rounded-md"
			transition:fly={{ y: 60, duration: 150 }}>
			{#if allowSelection}
			<div class="block mb-1.5 px-3.5 pt-2.5 pb-2 border-b border-b-slate-400">
				<label class="switch">
					<input class="inline-block" type="checkbox" bind:checked={selectable} />
					<span class="slider round"></span>
				</label>
				<span class="inline-block ml-0.5 font-bold">Zeilenauswahl zulassen</span>
			</div>
			{/if}
			<div class="mb-1.5 font-bold px-3.5 pt-1 ">Spalten ein-/ausblenden</div>
			{#each schema.Columns as column (column.Name)}
				<div class="block mb-1.5 px-3.5">
					<label class="switch">
						<input class="inline-block" type="checkbox" value={column.Name} bind:group={visible} />
						<span class="slider round"></span>
					</label>
					<span class="inline-block ml-0.5">{column.Name}</span>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	@keyframes refresh {
		100% {
			transform: rotate(180deg);
		}
	}
	.refreshing i {
		animation: refresh 300ms ease-out;
	}

	i {
		font-size: 1.5rem;
		display: inline-block;
	}
</style>
