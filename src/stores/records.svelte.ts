import type { FieldList, Schema, Table } from "$lib/newtypes";
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

    Visible = $state<Schema[]>([]);

    Filter: string = '';

    #scheme: Table;
    #perpage: number;
    #permanentFilter: string = "";

    constructor(scheme: Table, perPage: number = 120, listFilter: boolean = true) {
        this.#scheme = scheme;
        this.#perpage = perPage;

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
        for (const f of this.Showables(this.#scheme.Fields)) {
            this.Visible.push(f);
        }
    }

    * Showables(list: FieldList) {
        yield* this.#ShowablesArray(list.MainSymbol);
        yield* this.#ShowablesArray(list.Main);
        yield* this.#ShowablesArray(list.Diff);
        yield* this.#ShowablesArray(list.Title);
        yield* this.#ShowablesArray(list.Transcriptions);
    }

    * #ShowablesArray(schemata: Schema[] | undefined | null) {
        if (!schemata || schemata.length === 0) return;
        for (const s of schemata) {
            if (s.THidden) continue;
            yield s;
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
                expand: "Orte,Sammlungen,Werk,__Aufnahme_Reihen_via_Aufnahme.Reihe,__Aufnahme_Akteure_via_Aufnahme.Akteur",
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
}
