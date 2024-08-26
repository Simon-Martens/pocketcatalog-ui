import { tables } from '$stores/schema';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

const perPage: number = 120;

export const load: PageLoad = async ({ params }) => {
    if (!Object.hasOwn(tables, params.entity))
        throw error(404, "Unknown entity");

    return {
        perPage,
        tables: tables[params.entity]
    }
}
