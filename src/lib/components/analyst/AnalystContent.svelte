<script lang="ts">
    import type { PlayerRecord } from "$lib/types";
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
        nameQuery,
        sortBy
    }: { 
        activeTab: string;
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
        nameQuery: string | null;
        sortBy: string[] | null;
    } = $props();
</script>

<div class="analyst-content">
    <div class="content-header">
        <h3 class="content-title">
            {#if activeTab === 'overview'}
                📊 Overview
            {:else if activeTab === 'abilities'}
                ⚽ Abilities
            {:else if activeTab === 'geography'}
                🌍 Geography
            {:else if activeTab === 'physical'}
                👤 Physical
            {:else if activeTab === 'positional'}
                🏃 Positional
            {:else if activeTab === 'appearance'}
                🎨 Appearance
            {:else if activeTab === 'temporal'}
                📅 Temporal
            {:else if activeTab === 'clubs'}
                🏆 Clubs
            {/if}
        </h3>
    </div>
    
    <div class="content-body">
        {#if activeTab === 'overview'}
            <OverviewSection 
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
        {:else if activeTab === 'geography'}
            <GeographySection 
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
        {:else if activeTab === 'positional'}
            <PositionalSection 
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

    .placeholder {
        text-align: center;
        color: var(--color-text-muted);
        padding: var(--spacing-xl) 0;
    }

    .placeholder-icon {
        font-size: 3rem;
        margin-bottom: var(--spacing-lg);
        opacity: 0.6;
    }

    .placeholder h4 {
        margin: 0 0 var(--spacing-md) 0;
        font-size: var(--font-lg);
        color: var(--color-text);
        font-weight: 600;
    }

    .placeholder p {
        margin: 0;
        font-size: var(--font-base);
        line-height: 1.6;
        max-width: 500px;
        margin: 0 auto;
    }


</style>
