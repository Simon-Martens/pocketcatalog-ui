<script lang="ts">
	import EntryTable from '$lib/components/list/EntryTable.svelte';
	import { RecordsList } from '$stores/records.svelte';
	import EntryMenu from '$lib/components/list/EntryMenu.svelte';
	import type { Collection, Table } from '$lib/newtypes.js';
	import { getContext } from 'svelte';
	import type { Collections } from '$stores/collections.svelte.js';

	// scheme must be derived; otherwise it does not change on data change.
	const { data } = $props();
	const collections: Collections = getContext('collections');

	// this is not reactive, and doesn't react to changes in the scheme
	// if we derive this from scheme; but also we can't change state from
	// the derived value. It's fucked.
	let records: RecordsList = $derived(data.records);
	let scheme: Table = $derived(data.scheme);

	let collection: null | Collection = $state(null);

	if (collections) {
		collections.Selected.subscribe((x) => {
			if (!collections.List) {
				collection = null;
				return;
			}
			collection = collections.List.find((y) => y.id === x) ?? null;

			records.SetCollection(x);
		});
	}
</script>

<EntryMenu {collection} {records} {scheme} perPage={data.perPage} />

<div class="px-4">
	<EntryTable {scheme} {records} />
</div>

<style>
	@keyframes refresh {
		100% {
			transform: rotate(360deg);
		}
	}
	.refreshing i {
		animation: refresh 600ms ease-out;
	}

	.refreshing-infinite i {
		animation: refresh 900ms infinite;
	}

	i {
		display: inline-block;
	}
</style>
