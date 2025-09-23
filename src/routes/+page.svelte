<script lang="ts">
    import PlayerTable from "$lib/components/PlayerTable.svelte";
    import PaginationSection from "$lib/components/PaginationSection.svelte";
    import AppHeader from "$lib/components/AppHeader.svelte";
    import PlayerFilters from "$lib/components/PlayerFilters.svelte";
    import ProblematicRows from "$lib/components/ProblematicRows.svelte";
    import ViewSwitcher from "$lib/components/ViewSwitcher.svelte";
    import AnalystView from "$lib/components/AnalystView.svelte";
    import type { PlayerRecord } from "$lib/types";
    import { showOnlyEdited, getModifiedPlayersAsRecords } from "$lib/stores/editedPlayers";
    import { loadPlayersPage } from "$lib/api/player";
    import { onMount } from 'svelte';

    onMount(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
    });

    let players: PlayerRecord[] = $state([]);
    let currentPage = $state(-1); // loading data from file will always set currentPage to 0 and triggert $effect to load page
    let pageSize = $state(10);
    let isLastPage = $state(false);
    let selectedCountry: number | null = $state(null);
    let selectedClub: number | null = $state(null);
    let minCA: number | null = $state(null);
    let maxCA: number | null = $state(null);
    let minPA: number | null = $state(null);
    let maxPA: number | null = $state(null);
    let preferredFoot: number | null = $state(null);
    let favouriteNumber: number | null = $state(null);
    let birthYear: number | null = $state(null);
    let effectiveBirthYear: number | null = $state(null);
    let sortBy: string | null = $state(null);
    let problematicRows: number[] = $state([]);
    let showProblematicDetails = $state(false);
    let currentView: 'scout' | 'analyst' = $state('scout');

    async function loadPage() {        
        players = await loadPlayersPage(
            currentPage * pageSize,
            pageSize,
            selectedCountry,
            selectedClub,
            minCA,
            maxCA,
            minPA,
            maxPA,
            preferredFoot,
            favouriteNumber,
            effectiveBirthYear,
            sortBy,
        );

        isLastPage = players.length < pageSize;
    }

    let filteredPlayers = $derived(
        $showOnlyEdited
            ? (() => {
                const allEditedPlayers = getModifiedPlayersAsRecords();
                const startIndex = currentPage * pageSize;
                const endIndex = startIndex + pageSize;
                return allEditedPlayers.slice(startIndex, endIndex);
            })()
            : players
    );

    $effect(() => {
        void selectedCountry;
        void selectedClub;
        void minCA;
        void maxCA;
        void minPA;
        void maxPA;
        void preferredFoot;
        void favouriteNumber;
        void birthYear;
        void effectiveBirthYear;
        void sortBy;
        void currentPage;
        void pageSize;
        
        if (!$showOnlyEdited) {
            loadPage();
        }
    });

    $effect(() => {
        if ($showOnlyEdited) {
            const allEditedPlayers = getModifiedPlayersAsRecords();
            const totalEdited = allEditedPlayers.length;
            const startIndex = currentPage * pageSize;
            isLastPage = startIndex + pageSize >= totalEdited;
        } else {
            isLastPage = players.length < pageSize;
        }
    });

    function nextPage() {
        currentPage += 1;
    }

    function prevPage() {
        if (currentPage > 0) {
            currentPage -= 1;
        }
    }

    function jumpToPage(page: number) {
        currentPage = page;
    }

    function handleViewChange(view: 'scout' | 'analyst') {
        currentView = view;
        if (view === 'scout') {
            currentPage = 0;
        }
    }
</script>

<main>
    <AppHeader 
        bind:players={filteredPlayers}
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
        bind:effectiveBirthYear
        bind:sortBy
        bind:problematicRows 
        bind:showProblematicDetails 
        bind:isLastPage
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
            bind:effectiveBirthYear
            bind:sortBy
            disabled={$showOnlyEdited}
        />

        <ViewSwitcher bind:currentView onViewChange={handleViewChange} />

        {#if currentView === 'scout'}
            <PaginationSection 
                bind:currentPage 
                onPrev={prevPage} 
                onNext={nextPage} 
                onPageChange={jumpToPage} 
                {isLastPage} 
            />
            <PlayerTable bind:players={filteredPlayers} />
            <PaginationSection 
                bind:currentPage 
                onPrev={prevPage} 
                onNext={nextPage} 
                onPageChange={jumpToPage} 
                {isLastPage} 
            />
        {:else if currentView === 'analyst'}
            <AnalystView 
                bind:players
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
        {/if}
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
        margin-top: 4.5rem;
        width: 100%;
        padding: var(--spacing-md);
        display: flex;
        flex-direction: column;
    }
</style>