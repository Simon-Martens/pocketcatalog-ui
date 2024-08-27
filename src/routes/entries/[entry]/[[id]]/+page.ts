import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { tables } from '$stores/schema';
import { RecordsList } from '$stores/records.svelte';
const perPage: number = 120;

export const load: PageLoad = async ({ params }) => {
	if (!Object.hasOwn(tables, "Entries") || !Object.hasOwn(tables, "Contents"))
		throw error(404, "Not Found");
	let scheme = tables["Entries"].find((t) => t.Name === params.entry);
	if (!scheme) scheme = tables["Contents"].find((t) => t.Name === params.entry);
	if (!scheme) throw error(404, "Not found!");

	const records = new RecordsList(scheme, perPage);
	records.Fetch();

	return {
		scheme,
		perPage,
		records
	}
}
