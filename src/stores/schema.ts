import fields_def from '$lib/fields_default.json';
import tables_def from '$lib/tables_default.json';
import tables_mus from '$lib/tables_musenalm.json';
import type { Schema, Table } from '$lib/newtypes';

export const tables = GetMergeTypes(tables_mus as Table[], tables_def as Table[], fields_def as Schema[]);

function GetMergeTypes(table_mus: Table[], table_def: Table[], val_def: Schema[]) {
    let c = MergeCollection(table_mus, table_def);

    for (const values of Object.values(c)) {
        for (const value of values) {
            if (!value.NoDefaults) {
                value.Schema = MergeFields(value.Schema, val_def)
            }

            let l = {};
            // WARNING: We do not use copies of the Schema objects, but the objects themselves here. Change if mutated!
            for (const f of value.Schema) {
                let g = f.Group;
                if (!g) g = "None";
                if (!Object.hasOwn(l, g)) {
                    // @ts-ignore
                    l[g] = []
                }
                // @ts-ignore
                l[g].push(f);
            }

            if (value.BackRelations)
                for (const f of value.BackRelations) {
                    let g = f.Group;
                    if (!g) g = "None";
                    if (!Object.hasOwn(l, g)) {
                        // @ts-ignore
                        l[g] = [];
                    }
                    // @ts-ignore
                    l[g].push(f);
                }
            // @ts-ignore
            value.Fields = l;
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

            for (const [key, value] of Object.entries(t)) {
                if (key === "Schema" || key === "BackRelations") continue;
                // @ts-ignore
                // des passt schon so gell
                if (value) val[key] = value;
            }

            val.Schema = MergeFields(val.Schema, t.Schema);
            if (t.BackRelations)
                if (val.BackRelations)
                    val.BackRelations = MergeFields(val.BackRelations, t.BackRelations);
                else
                    val.BackRelations = t.BackRelations;
            map[t.Name] = val;
        }
    }

    let ret: {
        [key: string]: Table[]
    } = {};

    for (const [_, val] of Object.entries(map)) {
        let t = val.Type ?? "None";
        if (!Object.hasOwn(ret, t)) {
            ret[t] = [];
        }

        ret[t].push(val);
    }

    return ret;
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

// WARNING: this is recursive and depends on external data so it has potentially infinite oopise woopsies
export function GetDefaultSort(name: string, fromwhere: string) {
    if (!tables) return [];
    let table = Object.values(tables).flat().find((x) => x.Name === name);
    if (!table || !table.Fields) return [];
    let main: string[] = [];
    let diff: string[] = [];
    let foreign: string[] = [];
    for (const [_, g] of Object.entries(table.Fields)) {
        for (const f of g) {
            if (f.Presentation === "Main") main.push(f.Name);
            if (f.Presentation === "Diff") diff.push(f.Name);
            if (f.Presentation === "FromWhere" && f.Options && f.Options.Table && fromwhere !== f.Options.Table)
                foreign = GetDefaultSort(f?.Options?.Table, name).map((x) => f?.Options?.Table + "." + x);

        }
    }

    main.push(...foreign);
    main.push(...diff);
    return main;
}
