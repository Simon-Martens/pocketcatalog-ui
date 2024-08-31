import fields_def from '$lib/fields_default.json';
import tables_def from '$lib/tables_default.json';
import tables_mus from '$lib/tables_musenalm.json';
import type { PresentationFields, Schema, Table, TableType } from '$lib/newtypes';

class TableManager {
    Tables: Table[];

    constructor(tables: Table[]) {
        this.Tables = tables;
    }

    // Assignment in these functions strictly isnt neccessary, since they modify
    // the underlying objects.
    AddTable(tables: Table[]) {
        this.Tables = TableManager.MergeTables(tables, this.Tables);
        return this;
    }

    AddFields(fields: Schema[]) {
        this.Tables = TableManager.MergeFields(this.Tables, fields);
        return this;
    }

    GetTable(name: string) {
        return this.Tables.find((x) => x.Name === name);
    }

    GetPresentationFields(name: string) {
        return this.Tables.find((x) => x.Name === name)?.PresentationFields;
    }

    GetTableTypes(type: TableType) {
        return this.Tables.filter((x) => x.Type === type);
    }

    // We calculate the presentation fields so we don't have to do it all over
    // again when representing one related field or the minitable for the table.
    AddPresentationFields() {
        for (const t of this.Tables) {
            t.PresentationFields = this.#PresentationFields(t.Name);
        }
        return this;
    }

    static MergeTables(added: Table[], def: Table[]) {
        let map: {
            [key: string]: Table,
        } = {};

        for (let t of added) {
            map[t.Name] = t
        }

        for (let t of def) {
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

                val.Schema = TableManager.Merge(val.Schema, t.Schema);
                if (t.BackRelations)
                    if (val.BackRelations)
                        val.BackRelations = TableManager.Merge(val.BackRelations, t.BackRelations);
                    else
                        val.BackRelations = t.BackRelations;
                map[t.Name] = val;
            }
        }


        return Object.values(map).flat();
    }

    // WARNING: this is recursive and depends on external data so it has potentially infinite oopise woopsies
    #PresentationFields(name: string): PresentationFields | null {
        if (!this.Tables) return null;
        let table = this.Tables.find((x) => x.Name === name);
        if (!table || !table.Fields) return null;
        let main: Schema[] = [];
        let diff: Schema[] = [];
        let msym: Schema[] = [];
        let rela: Schema[] = [];
        let notm: Schema[] = [];
        for (const [_, g] of Object.entries(table.Fields)) {
            for (const f of g) {
                if (f.Presentation)
                    if (f.Presentation === "Main") {
                        main.push(f);
                    } else if (f.Presentation === "Diff") {
                        diff.push(f);
                    } else if (f.Presentation === "FromWhere") {
                        main.push(f);
                    } else if (f.Presentation === "MainSymbol") {
                        msym.push(f);
                    } else if (f.Presentation === "Relation") {
                        rela.push(f);
                    } else if (f.Presentation === "NotMain") {
                        notm.push(f);
                    }
            }
        }

        let pfields: PresentationFields = { Table: name, Main: main }
        if (diff.length) pfields['Diff'] = diff;
        if (msym.length) pfields['MainSymbol'] = msym;
        if (rela.length) pfields['Relation'] = rela;
        if (notm.length) pfields['NotMain'] = notm;
        return pfields;
    }

    static MergeFields(tables: Table[], fields: Schema[]) {
        for (const value of tables) {
            if (!value.NoDefaults) {
                value.Schema = TableManager.Merge(value.Schema, fields)
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

        return tables;
    }

    static Merge(fields1: Schema[], fields2: Schema[]) {
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
}

export const tables = new TableManager(tables_def as Table[])
    .AddTable(tables_mus as Table[])
    .AddFields(fields_def as Schema[])
    .AddPresentationFields();
