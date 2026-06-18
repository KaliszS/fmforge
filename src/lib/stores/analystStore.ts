import { writable, get } from 'svelte/store';

interface AnalystCache {
    params: string;
    data: any;
}

function createAnalystStore() {
    const store = writable<AnalystCache | null>(null);
    const { subscribe, set } = store;

    return {
        subscribe,
        setCache: (params: any, data: any) => {
            set({ params: JSON.stringify(params), data });
        },
        getCache: (currentParams: any) => {
            const cache = get(store);
            if (!cache) return null;
            return cache.params === JSON.stringify(currentParams) ? cache.data : null;
        },
        clear: () => set(null),
    };
}

export const analystStore = createAnalystStore();
