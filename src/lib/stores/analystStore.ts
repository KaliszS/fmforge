import { writable, get } from 'svelte/store';

interface AnalystCache {
    params: string; // JSON stringified params for easy comparison
    data: any;
    timestamp: number;
}

function createAnalystStore() {
    const store = writable<AnalystCache | null>(null);
    const { subscribe, set } = store;

    return {
        subscribe,
        setCache: (params: any, data: any) => {
            console.log('[AnalystStore] Setting cache for params:', JSON.stringify(params));
            set({
                params: JSON.stringify(params),
                data,
                timestamp: Date.now()
            });
        },
        getCache: (currentParams: any) => {
            const cache = get(store);
            const currentParamsStr = JSON.stringify(currentParams);
            
            if (!cache) {
                console.log('[AnalystStore] Cache miss (empty store)');
                return null;
            }
            
            if (cache.params === currentParamsStr) {
                console.log('[AnalystStore] Cache HIT');
                return cache.data;
            }
            
            console.log('[AnalystStore] Cache miss (params mismatch)');
            console.log('Cached:', cache.params);
            console.log('Current:', currentParamsStr);
            return null;
        },
        clear: () => set(null)
    };
}

export const analystStore = createAnalystStore();
