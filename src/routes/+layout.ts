import { api } from '$stores/pocketbase';
import { redirect } from '@sveltejs/kit';
import type { LayoutLoad } from './$types';

// This is also needed bc local storage is not available server side 
// and gets deleted on reload otherwise
export const ssr = false;

// This reruns on EVERY page load since url.pathname is a dependency that changes.
// We do not fetch Sammlungen from here...
export const load: LayoutLoad = function({ url }) {
    const path = url.pathname;
    if (path === "/login") return;

    if (!api.authStore.isValid || !api.authStore.model) {
        throw redirect(303, `/login?redirectTo=${path}`);
    }

    // let s = api.collection('Sammlungen').getFullList({ fetch });

    /// We refresh the auth token in case it has expired *server side*
    // api.collection('users').authRefresh({ fetch })
    //     .catch(() => {
    //         api.authStore.clear();
    //         throw redirect(303, `/login?redirectTo=${url.pathname}`);
    //     });

    return {}
}
