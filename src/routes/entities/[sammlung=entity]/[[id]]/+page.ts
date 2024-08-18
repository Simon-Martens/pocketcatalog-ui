import type { SchemaType } from '$lib/types';
import { baendeSchema, inhalteSchema, personenSchema, reihenSchema } from '$lib/models.js';
import { error } from '@sveltejs/kit';

const perPage: number = 120;

export async function load({ params }) {
    let schema: SchemaType;
    if (params.entity === "reihen") {
        schema = reihenSchema;
    } else if (params.entity === "akteure") {
        schema = personenSchema;
    } else if (params.entity === "aufnahme") {
        schema = baendeSchema;
    } else if (params.entity === "inhalte") {
        schema = inhalteSchema;
    } else {
        throw error(404, "Unbekannte Sammlung");
    }

    return {
        schema,
        perPage
    }
}
