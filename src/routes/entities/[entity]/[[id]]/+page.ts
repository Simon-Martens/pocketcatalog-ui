import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

const perPage: number = 120;

export const load: PageLoad = async ({ params, parent }) => {
    let d = await parent();
    console.log(d.tables);
    console.log(params.entity);
    if (!d.tables || !Object.hasOwn(d.tables, params.entity))
        throw error(404, "Unbekannte Sammlung");

    return {
        perPage,
        tables: d.tables[params.entity]
    }
}
