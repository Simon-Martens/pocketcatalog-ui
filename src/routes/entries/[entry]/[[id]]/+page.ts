import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';
import { tables } from '$stores/schema';

const perPage: number = 120;

export const load: PageLoad = async ({ params }) => {
	if (!Object.hasOwn(tables, "Entries")) throw error(404, "Not Found");
	const scheme = tables["Entries"].find((t) => t.Name === params.entry);
	if (!scheme) throw error(404, "Not found!");

	return {
		scheme,
		perPage,
	}
}
