import { api } from '$stores/pocketbase';
import { redirect } from '@sveltejs/kit';
import fields_def from '$lib/fields_default.json';
import tables_def from '$lib/tables_default.json';
import tables_mus from '$lib/tables_musenalm.json';
import type { Schema, Table } from '$lib/newtypes';

// This is also needed bc local storage is not available server side 
// and gets deleted on reload otherwise
export const ssr = false;

export function load({ url, fetch }) {
    if (url.pathname === "/login") return;

    if (!api.authStore.isValid || !api.authStore.model) {
        throw redirect(303, `/login?redirectTo=${url.pathname}`);
    }

    /// We refresh the auth token in case it has expired *server side*
    api.collection('users').authRefresh({ fetch })
        .catch(() => {
            api.authStore.clear();
            throw redirect(303, `/login?redirectTo=${url.pathname}`);
        });

    return {
        tables: GetMergeTypes()
    }
}


function GetMergeTypes() {
    let c = MergeCollection(tables_mus as Table[], tables_def as Table[]);

    for (const [_, value] of Object.entries(c)) {
        if (!value.NoDefaults) {
            value.Schema = MergeFields(value.Schema, fields_def as Schema[])
        }
    }

    return c;
}

function MergeCollection(col1: Table[], col2: Table[]) {
    let map: {
        [key: string]: Table,
    } = {};

    for (let t of col1) {
        map[t.Name] = t
    }

    for (let t of col2) {
        if (!Object.hasOwn(map, t.Name)) {
            map[t.Name] = t
        } else {
            let val = map[t.Name]
            if (t.Name !== "") {
                val.Name = t.Name;
            }

            val.Schema = MergeFields(val.Schema, t.Schema);
            map[t.Name] = val;
        }
    }

    return map;
}

function MergeFields(fields1: Schema[], fields2: Schema[]) {
    let map: {
        [key: string]: Schema,
    } = {};

    for (let f of fields1) {
        map[f.Name] = f;
    }

    for (let f of fields2) {
        map[f.Name] = f
    }

    return Object.values(map);
}
