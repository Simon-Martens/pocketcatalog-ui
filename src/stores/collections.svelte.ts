import { tables } from "./tables";
import type { Table, Collection } from "$lib/newtypes";
import { api } from "./pocketbase";
import { writable } from "svelte/store";

export class Collections {
    // As with records there's no deep reactivity needed.
    List = $state.raw<null | Collection[]>(null);
    TotalItems = $derived(this.List ? this.List.length : 0);
    Loading = $state(false);

    Selected = writable("");

    #scheme: Table | null;

    constructor() {
        let cs = tables.GetTableTypes("Collections");
        if (cs.length) this.#scheme = cs[0];
        else this.#scheme = null;
    }

    async Fetch() {
        if (!this.#scheme) return;
        const s = this.#scheme.DefaultSort ? this.#scheme.DefaultSort.join(',') : "";
        this.Loading = true;
        return api.collection(this.#scheme.Name).getFullList({ sort: s })
            .catch((err) => { console.log(err); throw err; })
            .then((res) => {
                if (res) {
                    this.List = res as Collection[];
                }
            })
            .finally(() => {
                this.Loading = false;
            });
    }
}
