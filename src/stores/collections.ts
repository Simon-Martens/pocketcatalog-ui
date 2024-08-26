import { writable, type Writable } from "svelte/store";
import { api } from "./pocketbase";
import { tables } from "./schema";
import type { RecordModel } from "pocketbase";

export const collections: Writable<RecordModel[]> = writable([]);

export function refreshCollections() {
    if (!Object.hasOwn(tables, "Collections")) return;

    for (const c of tables["Collections"]) {
        if (!c.Fields || !c.Fields.Main || !c.Fields.Main.length) continue;
        const main = c.Fields.Main[0].Name;
        api.collection(c.Name).getFullList({ sort: main })
            // TODO: error handling
            .catch((err) => { console.log(err) })
            .then((records) => {
                if (records && records.length)
                    collections.update((oldc) => {
                        oldc = oldc.filter((x) => x.collectionName !== c.Name);
                        oldc.push(...records);
                        return oldc;
                    });

            });
    }
}
