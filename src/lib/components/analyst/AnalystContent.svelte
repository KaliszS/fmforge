<script lang="ts">
    import type { PlayerRecord } from "$lib/types";
    import type { BirthDateRange } from "$lib/api/player";
    import { ANALYST_TABS } from './tabs';
    import OverviewSection from "./sections/OverviewSection.svelte";
    import AbilitiesSection from "./sections/AbilitiesSection.svelte";
    import GeographySection from "./sections/GeographySection.svelte";
    import PhysicalSection from "./sections/PhysicalSection.svelte";
    import PositionalSection from "./sections/PositionalSection.svelte";
    import AppearanceSection from "./sections/AppearanceSection.svelte";
    import TemporalSection from "./sections/TemporalSection.svelte";
    import ClubsSection from "./sections/ClubsSection.svelte";

    let { 
        activeTab,
        statistics,
        loading,
        error,
        players,
        selectedCountry,
        selectedClub,
        minCA,
        maxCA,
        minPA,
        maxPA,
        preferredFoot,
        favouriteNumber,
        birthYear,
        birthDateRange = null,
        nameQuery,
        sortBy,
        allFilteredIds = null
    }: { 
        activeTab: string;
        statistics: any;
        loading: boolean;
        error: string | null;
        players: PlayerRecord[];
        selectedCountry: number | null;
        selectedClub: number | null;
        minCA: number | null;
        maxCA: number | null;
        minPA: number | null;
        maxPA: number | null;
        preferredFoot: number | null;
        favouriteNumber: number | null;
        birthYear: number | null;
        birthDateRange?: BirthDateRange | null;
        nameQuery: string | null;
        sortBy: string[] | null;
        allFilteredIds?: number[] | null;
    } = $props();

    const currentTab = $derived(ANALYST_TABS.find(t => t.id === activeTab));
</script>

<div class="analyst-content">
    <div class="content-header">
        <h3 class="content-title">
            {currentTab?.icon} {currentTab?.name}
        </h3>
    </div>
    
    <div class="content-body">
        {#if activeTab === 'overview'}
            <OverviewSection 
                {statistics} {loading} {error}
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
                {sortBy}
                {nameQuery}
            />
        {:else if activeTab === 'abilities'}
            <AbilitiesSection 
                {statistics} {loading} {error}
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
                {birthDateRange}
                {sortBy}
                {nameQuery}
                {allFilteredIds}
            />
        {:else if activeTab === 'geography'}
            <GeographySection 
                {statistics} {loading} {error}
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
                {sortBy}
                {nameQuery}
            />
        {:else if activeTab === 'physical'}
            <PhysicalSection 
                {statistics} {loading} {error}
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
                {birthDateRange}
                {sortBy}
                {nameQuery}
                {allFilteredIds}
            />
        {:else if activeTab === 'positional'}
            <PositionalSection 
                {statistics} {loading} {error}
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
                {sortBy}
                {nameQuery}
            />
        {:else if activeTab === 'appearance'}
            <AppearanceSection 
                {statistics} {loading} {error}
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
                {sortBy}
                {nameQuery}
            />
        {:else if activeTab === 'temporal'}
            <TemporalSection 
                {statistics} {loading} {error}
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
                {sortBy}
                {nameQuery}
            />
        {:else if activeTab === 'clubs'}
            <ClubsSection 
                {statistics} {loading} {error}
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
                {sortBy}
                {nameQuery}
            />
        {/if}
    </div>
</div>

<style>
    .analyst-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        background: var(--color-background);
    }

    .content-header {
        padding: var(--spacing-lg) var(--spacing-xl);
        border-bottom: 1px solid var(--color-border-light);
        background: var(--color-background-light);
    }

    .content-title {
        margin: 0;
        font-size: var(--font-lg);
        font-weight: 600;
        color: var(--color-text);
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
    }

    .content-body {
        flex: 1;
        padding: var(--spacing-xl);
        overflow-y: auto;
    }



</style>
