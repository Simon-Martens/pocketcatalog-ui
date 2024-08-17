import type { SchemaType } from '$lib/types';
import { baendeSchema, inhalteSchema, personenSchema, reihenSchema } from '$lib/models.js';
import { error } from '@sveltejs/kit';

const perPage: number = 120;

export async function load({ url, params, fetch }) {
    let schema: SchemaType;
    if (params.sammlung === "reihen") {
        schema = reihenSchema;
    } else if (params.sammlung === "akteure") {
        schema = personenSchema;
    } else if (params.sammlung === "baende") {
        schema = baendeSchema;
    } else if (params.sammlung === "inhalte") {
        schema = inhalteSchema;
    } else {
        throw error(404, "Unbekannte Sammlung");
    }

    return {
        schema,
        perPage
    }
}