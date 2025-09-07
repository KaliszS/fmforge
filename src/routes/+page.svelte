<script lang="ts">
    import PlayerTable from "$lib/components/PlayerTable.svelte";
    import PaginationControls from "$lib/components/PaginationControls.svelte";
    import AppHeader from "$lib/components/AppHeader.svelte";
    import PlayerFilters from "$lib/components/PlayerFilters.svelte";
    import ProblematicRows from "$lib/components/ProblematicRows.svelte";
    import type { PlayerRecord } from "$lib/types";

    let players: PlayerRecord[] = $state([]);
    let currentPage = $state(0);
    let pageSize = $state(10);
    let selectedCountry: number | null = $state(null);
    let selectedClub: number | null = $state(null);
    let minCA: number | null = $state(null);
    let maxCA: number | null = $state(null);
    let minPA: number | null = $state(null);
    let maxPA: number | null = $state(null);
    let preferredFoot: number | null = $state(null);
    let favouriteNumber: number | null = $state(null);
    let birthYear: number | null = $state(null);
    let sortBy: string | null = $state(null);
    let problematicRows: number[] = $state([]);
    let showProblematicDetails = $state(false);

    function nextPage() {
        currentPage += 1;
    }

    function prevPage() {
        if (currentPage > 0) {
            currentPage -= 1;
        }
    }
</script>

<main>
    <AppHeader 
        bind:players 
        bind:currentPage 
        bind:pageSize 
        bind:selectedCountry 
        bind:selectedClub 
        bind:minCA
        bind:maxCA
        bind:minPA
        bind:maxPA
        bind:preferredFoot
        bind:favouriteNumber
        bind:birthYear
        bind:sortBy
        bind:problematicRows 
        bind:showProblematicDetails 
    />
    
    <article class="content">
        <ProblematicRows bind:problematicRows bind:showProblematicDetails />
        <PlayerFilters 
            bind:selectedCountry 
            bind:selectedClub 
            bind:minCA
            bind:maxCA
            bind:minPA
            bind:maxPA
            bind:preferredFoot
            bind:favouriteNumber
            bind:birthYear
            bind:sortBy
        />

        <PaginationControls {currentPage} onPrev={prevPage} onNext={nextPage} />
        <PlayerTable bind:players />
        <PaginationControls {currentPage} onPrev={prevPage} onNext={nextPage} />
    </article>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        background-color: var(--color-background-page);
    }

    .content {
        margin-top: 4rem;
        width: 100%;
        padding: var(--spacing-md);
        display: flex;
        flex-direction: column;
    }
</style>