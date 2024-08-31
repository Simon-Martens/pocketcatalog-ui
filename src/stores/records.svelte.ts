import type { Group, Table, ViewGroup, ViewGroupResult } from "$lib/newtypes";
import { type RecordModel } from "pocketbase";

import { api } from "./pocketbase";
import { tables } from "./tables";

// This is all the Meta Groups, into which fields can be grouped
// TODO: we can create different meta groups and pass them to the constructor
// of RecordsList to create different views
export const ViewGroups: ViewGroup[] = [
    {
        "Name": "Symbol",
        "friendlyName": "None",
        "Groups": ["Template", "State", "Symbol"],
        "NeverGroup": true
    },
    {
        "Name": "Norm Data",
        "friendlyName": "Normdaten",
        "Groups": ["Name", "Works", "Serials", "Issue", "Date", "Agents", "Places"],
    },
    {
        "Name": "Count Data",
        "friendlyName": "Zählung",
        "Groups": ["Order", "Count"],
        "NeverGroup": true,
    },
    {
        "Name": "Title Data",
        "friendlyName": "Titel- & Transkriptionsdaten",
        "Groups": ["Title", "Transcriptions"],
    },
    {
        "Name": "None",
        "Groups": ["None"],
        "NeverGroup": true
    },
    {
        "Name": "Media Data",
        "friendlyName": "Medium & Format",
        "Groups": ["Extend", "MediaSpecific", "MediaMeta"]
    },
    {
        "Name": "Annotations",
        "friendlyName": "Anmerkungen",
        "Groups": ["Annotations"]
    },
    {
        "Name": "Editor Data",
        "friendlyName": "Forschungsdaten",
        "Groups": ["Identifier", "Research", "Description", "Collections", "Tag", "EditorNotes"]
    },
    {
        "Name": "Other Fields",
        "friendlyName": "Andere Felder",
        "Groups": ["URL", "File", "Deprecated"],
        "NeverGroup": true
    },
    {
        "Name": "Parent Child Relations",
        "Groups": ["Children", "Entries", "Relation"],
    }
];



export class RecordsList {
    // We use state.raw bc we do not need deep reactivity. We do not modify subitems.
    List = $state.raw<null | RecordModel[]>(null);
    TotalItems = $state(0);
    TotalPages = $state(0);

    Loading = $state(false);
    Refreshing = $state(false);

    Page = $state(1);
    Sort = $state<string[]>([]);
    Filter: string = $state("");

    // We give out the grouping for the visible groups once here, so we don't have
    // to iterate over all fields or the visible array for every single table cell.
    // VisibleGroups depends on Visible and Grouped and will rerun on every change.
    Visible = $state<string[]>([]);
    Grouped = $state<string[]>(["Title Data"]);
    VisibleGroups = $derived.by(() => {
        let vg: ViewGroupResult[] = [];
        for (let mg of this.YieldGroups()) {
            let ret: ViewGroupResult | null = null;
            for (const [n, g] of Object.entries(mg.Fields)) {
                let show = [];
                for (const f of g) {
                    if (this.Visible.indexOf(f.Name) !== -1)
                        show.push(f);
                }
                if (show.length) {
                    if (!ret) ret = { Group: mg.Group, Fields: {} };
                    ret.Fields[n as Group] = show;
                }
            }
            if (ret) {
                if (mg.Group < ViewGroups.length && this.Grouped.indexOf(ViewGroups[mg.Group].Name) !== -1)
                    ret.Grouped = true;
                vg.push(ret);
            }
        }
        return vg;
    });

    Selected = $state([]);
    Selectable = $state<boolean>(false);

    #expand: string;
    #scheme: Table;
    #perpage: number;
    #permanentFilter: string = "";
    #collection: string = "";

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

        let s = tables.GetPresentationFields(this.#scheme.Name);
        if (!s) return;
        this.Sort.push(...s.Main.map((x) => x.Name));
        if (s.Diff) this.Sort.push(...s.Diff.map((x) => x.Name));

    }

    DefaultFilter() {
        this.Filter = '';
        if (this.#scheme.DefaultFilter)
            this.Filter = this.#scheme.DefaultFilter
    }

    DefaultVisible() {
        let vis = [];
        if (!this.#scheme.Fields) return;
        for (const v of Object.values(this.#scheme.Fields)) {
            for (const f of v)
                if (!Object.hasOwn(f, "TVisibility") || f.TVisibility)
                    vis.push(f.Name);
        }
        this.Visible = vis;
    }

    // System & Some other Fields are not yielded here
    * YieldGroups(): Generator<ViewGroupResult> {
        if (!this.#scheme.Fields) return;
        let i = 0;
        for (const mg of ViewGroups) {
            let ret: ViewGroupResult | null = null;
            for (const mgg of mg.Groups) {
                let show = [];
                if (Object.hasOwn(this.#scheme.Fields, mgg)) {
                    for (const f of this.#scheme.Fields[mgg]) {
                        if (!f.THidden)
                            show.push(f);
                    }
                }
                if (show.length) {
                    if (!ret) ret = { Group: i, Fields: {} };
                    ret.Fields[mgg as Group] = show;
                }
            }
            i++;
            if (ret) yield ret;
        }
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


    SetCollection(id: string) {
        this.#collection = id;
        this.Refresh();
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

    // TODO: Indirect fetch. (Beiträge over Aufnahmen, Aufnahmen over Sammlung)
    async Fetch(fetch = window.fetch) {
        this.Loading = true;
        return this.#InternalFetch(this.#perpage, this.Page, this.Filter, this.Sort, fetch)
            .then(() => this.Loading = false);
    }

    async #InternalFetch(perpage: number, page: number, filter: string, sort: string[], fetch = window.fetch) {
        const s = sort.join(",");
        let f = this.#permanentFilter;

        if (filter) {
            if (f) f = f + " && ";
            f = f + filter;
        }

        if (this.#collection) {
            if (f) f = f + " && ";
            f = f + "Collections?~'" + this.#collection + "'";
        }

        return api.collection(this.#scheme.Name)
            .getList(page, perpage, {
                filter: f,
                sort: s,
                skipTotal: page !== 1,
                expand: this.#expand,
                requestKey: null,
                fetch: fetch
            })
            .catch((err) => { console.log(err); throw err; })
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
                            // Because we are using state.raw
                            this.List = [...this.List, ...res.items];
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
        for (const [_, g] of Object.entries(this.#scheme.Fields)) {
            for (const f of g) {
                if (f.THidden) continue;
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
                            exp = exp + f.Options.Collection + "_via_" + ef;
                        }
                }
            }
        }
        return exp;
    }
}
