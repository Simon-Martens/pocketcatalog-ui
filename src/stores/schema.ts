import fields_def from '$lib/fields_default.json';
import tables_def from '$lib/tables_default.json';
import tables_mus from '$lib/tables_musenalm.json';
import type { FieldList, Schema, Table } from '$lib/newtypes';

export const tables = GetMergeTypes(tables_mus as Table[], tables_def as Table[], fields_def as Schema[]);
console.log(tables);

function GetMergeTypes(table_mus: Table[], table_def: Table[], val_def: Schema[]) {
    let c = MergeCollection(table_mus, table_def);

    for (const [_, values] of Object.entries(c)) {
        for (const value of values) {
            if (!value.NoDefaults) {
                value.Schema = MergeFields(value.Schema, val_def)
            }

            let l: FieldList = {};
            // WARNING: We do not use copies of the Schema objects, but the objects themselves here. Change if mutated!
            for (const f of value.Schema) {
                let g = f.Group;
                if (!g) g = "None";
                if (Object.hasOwn(l, g)) {
                    l[g]!.push(f);
                } else {
                    l[g] = [f];
                }
            }

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
            if (t.Name !== "") {
                val.Name = t.Name;
            }

            if (t.Type) {
                val.Type = t.Type;
            }

            if (t.DefaultSort) {
                val.DefaultSort = t.DefaultSort;
            }

            if (t.DefaultFilter) {
                val.DefaultFilter = t.DefaultFilter;
            }

            if (t.ListFilter) {
                val.ListFilter = t.ListFilter;
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
