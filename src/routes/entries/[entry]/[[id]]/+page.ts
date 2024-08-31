import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { tables } from '$stores/tables';
import { RecordsList } from '$stores/records.svelte';
const perPage: number = 120;

export const load: PageLoad = async ({ params, fetch }) => {
	let scheme = tables.GetTable(params.entry);
	if (!scheme) throw error(404, "Not found!"); // This will not happen; we make typescript happy

	const records = new RecordsList(scheme, perPage);
	records.Fetch(fetch);

	return {
		scheme,
		perPage,
		records
	}
}
