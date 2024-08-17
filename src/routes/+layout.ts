import type { UserType } from '$lib/types';
import { api } from '$stores/pocketbase';
import { redirect } from '@sveltejs/kit';

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
        .catch(() =>  {
            api.authStore.clear();
            throw redirect(303, `/login?redirectTo=${url.pathname}`);
        });    
}