import type { Schema, Table } from "$lib/newtypes";
import { type RecordModel } from "pocketbase";

import { api } from "./pocketbase";

export class RecordsList {
    List = $state<null | RecordModel[]>(null)
    TotalItems = $state(0);
    TotalPages = $state(0);

    Loading = $state(false);
    Refreshing = $state(false);

    Page = $state(1);
    Sort = $state<string[]>([]);
    Filter: string = $state("");

    Visible = $state<Schema[]>([]);

    Selectable = $state<boolean>(false);
    Selected = $state<RecordModel[]>([]);

    #expand: string;
    #scheme: Table;
    #perpage: number;
    #permanentFilter: string = "";

    constructor(scheme: Table, perPage: number = 120, listFilter: boolean = true) {
        this.#scheme = scheme;
        this.#perpage = perPage;
        this.#expand = this.#Expand();

        this.DefaultSort();
        this.DefaultFilter();
        this.DefaultVisible();

        if (scheme.ListFilter && listFilter) {
            this.#permanentFilter = scheme.ListFilter
        }

    }

    DefaultSort() {
        this.Sort = [];

        if (this.#scheme.DefaultSort) {
            this.Sort = this.#scheme.DefaultSort;
            return;
        }

        if (this.#scheme.Fields && this.#scheme.Fields.Main) {
            for (const f of this.#scheme.Fields.Main)
                this.Sort.push(f.Name);
        }

        if (this.#scheme.Fields && this.#scheme.Fields.Diff) {
            for (const f of this.#scheme.Fields.Diff)
                this.Sort.push(f.Name)
        }
    }

    DefaultFilter() {
        this.Filter = '';
        if (this.#scheme.DefaultFilter)
            this.Filter = this.#scheme.DefaultFilter
    }

    DefaultVisible() {
        this.Visible = [];
        if (!this.#scheme.Fields) return;
        for (const f of this.Showables()) {
            if (!Object.hasOwn(f, "TVisibility") || f.TVisibility)
                this.Visible.push(f);
        }
    }

    // System & Some other Fields are not yielded here
    * Showables() {
        const list = this.#scheme.Fields;
        if (!list) return;
        yield* this.#ShowablesArray(list.MainSymbol);
        yield* this.#ShowablesArray(list.Main);
        yield* this.#ShowablesArray(list.Diff);
        yield* this.#ShowablesArray(list.Title);
        yield* this.#ShowablesArray(list.Description);
        yield* this.#ShowablesArray(list.Transcriptions);
        yield* this.#ShowablesArray(list.Norm);
        yield* this.#ShowablesArray(list.Actors);
        yield* this.#ShowablesArray(list.None);
        yield* this.#ShowablesArray(list.MediaSpecific);
        yield* this.#ShowablesArray(list.Research);
        yield* this.#ShowablesArray(list.Tag);
        yield* this.#ShowablesArray(list.Collections);
        yield* this.#ShowablesArray(list.MediaMeta);
        yield* this.#ShowablesArray(list.Identifier);
        yield* this.#ShowablesArray(list.Exemplare);
        yield* this.#ShowablesArray(list.File);
        yield* this.#ShowablesArray(list.Includes);
        yield* this.#ShowablesArray(list.IncludedIn);
        yield* this.#ShowablesArray(list.Additional);
        yield* this.#ShowablesArray(list.EditorNotes);
        yield* this.#ShowablesArray(list.Deprecated);
    }

    * #ShowablesArray(schemata: Schema[] | undefined | null) {
        if (!schemata || schemata.length === 0) return;
        for (const s of schemata) {
            if (s.THidden) continue;
            yield s;
        }
    }

    Toggle(name: string) {
        let i = 0;
        for (const f of this.Showables()) {
            if (i < this.Visible.length && name === this.Visible[i].Name) {
                // Field already is shown, we hide
                this.Visible.splice(i, 1);
                break;
            } else if (i < this.Visible.length && f.Name === this.Visible[i].Name) {
                i++;
            } else if (f.Name === name) {
                this.Visible.splice(i, 0, f);
                break;
            }
        }
    }


    Show(name: string) {
        let i = 0;
        for (const f of this.Showables()) {
            if (i < this.Visible.length && f.Name === this.Visible[i].Name) {
                i++;
            } else if (i < this.Visible.length && name === this.Visible[i].Name) {
                // Field already is shown, we do nothing
                break;
            } else if (f.Name === name) {
                this.Visible.splice(i, 0, f);
                break;
            }
        }
    }

    Hide(name: string) {
        this.Visible = this.Visible.filter((f) => f.Name !== name);
    }

    Shown(name: string): boolean {
        return this.Visible.find((f) => f.Name === name) !== undefined;
    }

    SortBy(name: string) {
        const i = this.Sort.indexOf(name);
        const j = this.Sort.indexOf('-' + name);
        if (i !== -1) {
            this.Sort = [this.#InvertSort(this.Sort[i])];
        } else if (j !== -1) {
            this.Sort = [this.#InvertSort(this.Sort[j])];
        } else {
            this.Sort = [name];
        }
    }

    AndSortBy(name: string) {
        const i = this.Sort.indexOf(name);
        const j = this.Sort.indexOf('-' + name);
        if (i !== -1) {
            this.Sort.splice(i, 1, this.#InvertSort(this.Sort[i]))
        } else if (j !== -1) {
            this.Sort.splice(j, 1, this.#InvertSort(this.Sort[j]))
        } else {
            this.Sort.push(name)
        }
    }

    #InvertSort(name: string) {
        if (name.startsWith('-')) {
            return name.substring(1, name.length);
        } else {
            return '-' + name;
        }
    }

    async Next() {
        this.Page = this.Page + 1;
        return this.Fetch();
    }

    // TODO: refresh resets page to one and does not reload all the pages
    async Refresh() {
        this.List = [];
        this.Page = 1;
        this.Refreshing = true;
        return this.#InternalFetch(this.#perpage, this.Page, this.Filter, this.Sort)
            .then(() => this.Refreshing = false);
    }

    async Fetch() {
        this.Loading = true;
        return this.#InternalFetch(this.#perpage, this.Page, this.Filter, this.Sort)
            .then(() => this.Loading = false);
    }

    async #InternalFetch(perpage: number, page: number, filter: string, sort: string[]) {
        const s = sort.join(",");
        let f = this.#permanentFilter;

        if (filter) {
            if (f) f = f + " && ";
            f = f + filter;
        }

        return api.collection(this.#scheme.Name)
            .getList(page, perpage, {
                filter: f,
                sort: s,
                skipTotal: page !== 1,
                expand: this.#expand,
                requestKey: null,
            })
            .catch((err) => console.log(err))
            .then((res) => {
                if (page === 1) {
                    if (!res) {
                        this.List = null;
                        this.TotalItems = 0;
                        this.TotalPages = 0;
                    } else {
                        this.List = res.items;
                        this.TotalItems = res.totalItems;
                        this.TotalPages = res.totalPages;
                    }
                } else {
                    if (res) {
                        if (this.List) {
                            this.List.push(...res.items);
                        } else {
                            this.List = res.items;
                        }
                    }
                }
            })
    }

    #Expand() {
        if (!this.#scheme || !this.#scheme.Fields) return "";
        let exp = "";
        for (const f of this.Showables()) {
            if (f.Type.startsWith("Relation")) {
                if (exp !== "") exp = exp + ",";
                if (f.Options && f.Options.Expand) {
                    exp = exp + f.Options.Expand;
                } else {
                    exp = exp + f.Name;
                }
            } else if (f.Type.startsWith("BackRelation") && f.Options) {
                if (f.Options.Expand) {
                    if (exp !== "") exp = exp + ",";
                    exp = exp + f.Options.Expand;
                } else if (f.Options.Field)
                    for (const ef of f.Options.Field) {
                        if (exp !== "") exp = exp + ",";
                        exp = exp + f.Options.Table + "_via_" + ef;
                    }
            }
        }
        return exp;
    }
}
