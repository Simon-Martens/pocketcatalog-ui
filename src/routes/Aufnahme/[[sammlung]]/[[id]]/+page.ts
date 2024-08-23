import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

const perPage: number = 120;

export const load: PageLoad = async ({ params, parent }) => {
	let d = await parent();

	return {
		perPage,
		tables: d.tables ? d.tables['aufnahme'] : {}
	}
}
