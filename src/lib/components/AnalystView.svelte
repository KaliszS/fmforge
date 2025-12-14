<script lang="ts">
    import type { PlayerRecord } from "$lib/types";
    import { getPlayerStatistics } from "$lib/api/player";
    import { analystStore } from "$lib/stores/analystStore";
    import AnalystSidebar from "./analyst/AnalystSidebar.svelte";
    import AnalystContent from "./analyst/AnalystContent.svelte";

    let { 
        players = $bindable(),
        selectedCountry,
        selectedClub,
        selectedPosition,
        selectedFavouriteClub,
        minCA,
        maxCA,
        minPA,
        maxPA,
        preferredFoot,
        favouriteNumber,
        birthYear,
        nameQuery,
        sortBy,
        filteredPlayers,
        allFilteredIds = null
    }: {
        players: PlayerRecord[];
        selectedCountry: number | null;
        selectedClub: number | null;
        selectedPosition: string | null;
        selectedFavouriteClub: number | null;
        minCA: number | null;
        maxCA: number | null;
        minPA: number | null;
        maxPA: number | null;
        preferredFoot: number | null;
        favouriteNumber: number | null;
        birthYear: number | null;
        nameQuery: string | null;
        sortBy: string[] | null;
        filteredPlayers: PlayerRecord[];
        allFilteredIds?: number[] | null;
    } = $props();

    let activeTab = $state('overview');
    let statistics = $state<any>(null);
    let loading = $state(true);
    let error = $state<string | null>(null);

    // Helper to ensure consistent params object structure
    const getParams = () => ({
        selectedCountry,
        selectedClub,
        selectedPosition,
        selectedFavouriteClub,
        minCA,
        maxCA,
        minPA,
        maxPA,
        preferredFoot,
        favouriteNumber,
        birthYear,
        nameQuery,
        sortBy,
        playerIds: allFilteredIds
    });

    // Initialize from cache if available
    const initialParams = getParams();
    const cachedInitial = analystStore.getCache(initialParams);
    if (cachedInitial) {
        statistics = cachedInitial;
        loading = false;
    }

    $effect(() => {
        // Explicitly track filteredPlayers to ensure updates when filter changes
        void filteredPlayers;
        void allFilteredIds;
        const params = getParams();

        // Check cache first
        const cachedData = analystStore.getCache(params);
        if (cachedData) {
            statistics = cachedData;
            loading = false;
            error = null;
            return;
        }

        const loadStats = async () => {
            loading = true;
            error = null;
            try {
                const stats = await getPlayerStatistics(
                    selectedCountry,
                    selectedClub,
                    minCA,
                    maxCA,
                    minPA,
                    maxPA,
                    preferredFoot,
                    favouriteNumber,
                    birthYear,
                    selectedPosition,
                    selectedFavouriteClub,
                    nameQuery,
                    sortBy,
                    allFilteredIds
                );
                // Cache the result
                analystStore.setCache(params, stats);
                statistics = stats;
            } catch (err) {
                error = err instanceof Error ? err.message : 'Failed to load statistics';
                console.error('Error loading statistics:', err);
            } finally {
                loading = false;
            }
        };
        loadStats();
    });
</script>

<div class="analyst-view">
    <div class="analyst-layout">
        <AnalystSidebar 
            bind:players 
            bind:activeTab
            {statistics}
            {loading}
            {selectedCountry}
            {selectedClub}
            {minCA}
            {maxCA}
            {minPA}
            {maxPA}
            {preferredFoot}
            {favouriteNumber}
            {birthYear}
            {nameQuery}
            {sortBy}
        />
        
        <AnalystContent 
            {activeTab} 
            {statistics}
            {loading}
            {error}
            {players}
            {selectedCountry}
            {selectedClub}
            {minCA}
            {maxCA}
            {minPA}
            {maxPA}
            {preferredFoot}
            {favouriteNumber}
            {birthYear}
            {nameQuery}
            {sortBy}
            {allFilteredIds}
        />
    </div>
</div>

<style>
    .analyst-view {
        background: var(--color-background);
        border-radius: var(--radius-xl);
        box-shadow: 0 0.1875rem 0.625rem var(--color-shadow-light);
        overflow: hidden;
        min-height: 25rem;
    }

    .analyst-layout {
        display: flex;
        min-height: 25rem;
    }

</style>
