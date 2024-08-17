import { api } from '$stores/pocketbase';

export async function load() {
    if (api.authStore.model && api.authStore.isValid) {
        api.authStore.clear();
    }
}