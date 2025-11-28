<script lang="ts">
    import type { PlayerRecord } from "$lib/types";
    import AnalystSidebar from "./analyst/AnalystSidebar.svelte";
    import AnalystContent from "./analyst/AnalystContent.svelte";

    let { 
        players = $bindable(),
        selectedCountry,
        selectedClub,
        minCA,
        maxCA,
        minPA,
        maxPA,
        preferredFoot,
        favouriteNumber,
        birthYear,
        sortBy
    }: {
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
        sortBy: string[] | null;
    } = $props();

    let activeTab = $state('overview');
</script>

<div class="analyst-view">
    <div class="analyst-layout">
        <AnalystSidebar 
            bind:players 
            bind:activeTab
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
        />
        
        <AnalystContent 
            {activeTab} 
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
