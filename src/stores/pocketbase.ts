import { writable, type Writable } from "svelte/store";
import Pocketbase, { type AuthModel } from 'pocketbase';
import {
    PUBLIC_PB_API,
} from '$env/static/public';
import type { UserType } from "$lib/types";

export const api_url: string = PUBLIC_PB_API;
export const api: Pocketbase = new Pocketbase(PUBLIC_PB_API);
export const loading: Writable<boolean> = writable(false);
export const loggedIn: Writable<boolean> = writable(api.authStore.isValid);

export const pushUser = function(u: UserType) {
    api.collection('users').update(u.id, u);
}

api.authStore.onChange((token) => {
    loggedIn.set(!!token);
});

api.beforeSend = (url, options) => {
    loading.set(true);
    return { url, options };
}

api.afterSend = (response, data) => {
    loading.set(false);

    // TODO: auth check on every request
    // not unauthenticated, we need to send the request again.
    // if (response.status === 401) {
    //     api.collection('users').authRefresh()
    // }

    return Object.assign(data);
}
