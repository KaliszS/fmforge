<script lang="ts">
    import PlayerTable from "$lib/components/PlayerTable.svelte";
    import PaginationSection from "$lib/components/PaginationSection.svelte";
    import AppHeader from "$lib/components/AppHeader.svelte";
    import PlayerFilters from "$lib/components/PlayerFilters.svelte";
    import InvalidRows from "$lib/components/InvalidRows.svelte";
    import ViewSwitcher from "$lib/components/ViewSwitcher.svelte";
    import AnalystView from "$lib/components/AnalystView.svelte";
    import type { PlayerRecord } from "$lib/types";
    import { showOnlyEdited, getModifiedPlayersAsRecords, originalPlayers, modifiedPlayers } from "$lib/stores/editedPlayers";
    import { loadPlayersPage, getFilteredPlayerIds } from "$lib/api/player";
    import { selectedPlayers, setSelection, deselectAll, showOnlySelected } from '$lib/stores/selectionStore';
    import type { InvalidRow } from "$lib/api/file";
    import { onMount } from 'svelte';
    import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
    import { emit } from '@tauri-apps/api/event';

    onMount(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
    });
    
    $effect(() => { // reset to page 1 when switching to edited players view
        if ($showOnlyEdited) {
            jumpToPage(0);
        }
    });

    let players: PlayerRecord[] = $state([]);
    let currentPage = $state(-1); // loading data from file will always set currentPage to 0 and triggert $effect to load page
    let pageSize = $state(10);
    let isLastPage = $state(false);
    let refreshTrigger = $state(0);
    let selectedCountry: number | null = $state(null);
    let selectedClub: number | null = $state(null);
    let selectedPosition: string | null = $state(null);
    let selectedFavouriteClub: number | null = $state(null);
    let minCA: number | null = $state(null);
    let maxCA: number | null = $state(null);
    let minPA: number | null = $state(null);
    let maxPA: number | null = $state(null);
    let preferredFoot: number | null = $state(null);
    let favouriteNumber: number | null = $state(null);
    let birthYear: number | null = $state(null);
    let effectiveBirthYear: number | null = $state(null);
    let nameQuery: string | null = $state(null);
    let sortBy: string[] | null = $state(null);
    let invalidRows: InvalidRow[] = $state([]);
    let showInvalidDetails = $state(false);
    let currentView: 'scout' | 'analyst' = $state('scout');
    let editTypeFilter: 'all' | 'modified' | 'added' | 'deleted' = $state('all');

    async function toggleSecondaryWindow() {
        const label = 'secondary';
        const win = await WebviewWindow.getByLabel(label);
        
        if (win) {
            await win.close();
        } else {
            const webview = new WebviewWindow(label, {
                url: '/secondary',
                title: 'FM Forge - next page',
                width: 1020,
                height: 800,
            });
            
            webview.once('tauri://created', function () {
                // webview window successfully created
                // Give it a moment to load the page before syncing
                setTimeout(syncSecondaryWindow, 1000);
            });
            
            webview.once('tauri://error', function (e) {
                // an error happened creating the webview window
                console.error('Error creating secondary window', e);
            });
        }
    }

    async function syncSecondaryWindow() {
        const theme = document.documentElement.getAttribute('data-theme') || 'light';
        const state = {
            currentPage,
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
            selectedPosition,
            selectedFavouriteClub,
            nameQuery,
            sortBy,
            theme,
            showOnlyEdited: $showOnlyEdited,
            showOnlySelected: $showOnlySelected,
            editTypeFilter
        };
        
        await emit('sync-state', state);
    }

    // Sync when theme changes
    $effect(() => {
        // We can't easily detect theme changes unless we store it in a store
        // But we can listen to the toggle event if we had one, or just rely on the user refreshing
        // For now, let's just sync when other things change
    });

    function filterEditedPlayersByType(players: PlayerRecord[]): PlayerRecord[] {
        if (editTypeFilter === 'all') {
            return players;
        }
        
        return players.filter(record => {
            const original = $originalPlayers.get(record.id);
            const modified = $modifiedPlayers.get(record.id);
            switch (editTypeFilter) {
                case 'modified':
                    return original !== null && modified !== null;
                case 'added':
                    return original === null && modified !== null;
                case 'deleted':
                    return original !== null && modified === null;
                default:
                    return true;
            }
        });
    }

    async function loadPage() {
        let playerIds: number[] | null = null;
        if ($showOnlySelected) {
             playerIds = Array.from($selectedPlayers);
             if (playerIds.length === 0) {
                 players = [];
                 isLastPage = true;
                 return;
             }
        }

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
            selectedPosition,
            selectedFavouriteClub,
            nameQuery,
            sortBy,
            playerIds
        );

        isLastPage = players.length < pageSize;
    }

    let allFilteredIds = $derived(
        (() => {
            let ids: number[] | null = null;
            
            if ($showOnlyEdited) {
                void editTypeFilter;
                void $modifiedPlayers;
                const allEditedPlayers = getModifiedPlayersAsRecords();
                const filteredEdited = filterEditedPlayersByType(allEditedPlayers);
                ids = filteredEdited.map(p => p.id);
            }
            
            if ($showOnlySelected && $selectedPlayers.size > 0) {
                const selectedIds = Array.from($selectedPlayers);
                if (ids) {
                    ids = ids.filter(id => selectedIds.includes(id));
                } else {
                    ids = selectedIds;
                }
            }
            
            return ids;
        })()
    );

    let filteredPlayers = $derived(
        (() => {
            // Start with base data
            let result: PlayerRecord[];
            
            if ($showOnlyEdited) {
                // Show edited players (with optional type filter)
                void editTypeFilter;
                void $modifiedPlayers; // Ensure reactivity when players are edited
                const allEditedPlayers = getModifiedPlayersAsRecords();
                result = filterEditedPlayersByType(allEditedPlayers);
            } else {
                // Show regular players (with Group 1 filters from backend)
                result = players;
            }
            
            // Apply selected filter ON TOP of current result (narrowing down)
            if ($showOnlySelected && $selectedPlayers.size > 0) {
                const selectedIds = $selectedPlayers;
                result = result.filter(p => selectedIds.has(p.id));
            }
            
            // Pagination for edited players
            if ($showOnlyEdited) {
                const startIndex = currentPage * pageSize;
                const endIndex = startIndex + pageSize;
                return result.slice(startIndex, endIndex);
            }
            
            return result;
        })()
    );

    $effect(() => {
        void selectedCountry;
        void selectedClub;
        void selectedPosition;
        void selectedFavouriteClub;
        void minCA;
        void maxCA;
        void minPA;
        void maxPA;
        void preferredFoot;
        void favouriteNumber;
        void birthYear;
        void effectiveBirthYear;
        void nameQuery;
        void sortBy;
        void currentPage;
        void pageSize;
        
        if (!$showOnlyEdited) {
            loadPage();
            syncSecondaryWindow();
        }
    });

    $effect(() => {
        if ($showOnlyEdited) {
            void editTypeFilter;
            void $showOnlySelected;
            const allEditedPlayers = getModifiedPlayersAsRecords();
            let filtered = filterEditedPlayersByType(allEditedPlayers);
            
            // Apply selected filter on top
            if ($showOnlySelected && $selectedPlayers.size > 0) {
                const selectedIds = $selectedPlayers;
                filtered = filtered.filter(p => selectedIds.has(p.id));
            }
            
            const totalEdited = filtered.length;
            const startIndex = currentPage * pageSize;
            isLastPage = startIndex + pageSize >= totalEdited;
        } else {
            // For regular view, isLastPage is determined by loadPage result
            isLastPage = players.length < pageSize;
        }
    });

    $effect(() => {
        void refreshTrigger;
        if (refreshTrigger > 0) {
            loadPage();
        }
        refreshTrigger = 0; // otherwise page will be loaded twice
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

    function triggerRefresh() {
        refreshTrigger += 1;
    }

    function handleViewChange(view: 'scout' | 'analyst') {
        currentView = view;
        if (view === 'scout') {
            currentPage = 0;
        }
    }

    async function handleGlobalSelection() {
        if ($selectedPlayers.size > 0) {
            // If any selection exists, clear it (user request: "odznaczyć przy ponowym kliknieciu", but implies if all selected.
            // But simpler logic as per typical checkbox "indeterminate -> checked" or "checked -> unchecked".
            // User said: "ta globalna ma zaznaczyć (i odznaczyć przy ponowym kliknieciu)"
            // If we strictly follow "select all if not all selected", we need to know total count.
            // But simpler UX: if selection > 0, assume user might want to clear.
            // Or if selection == 0, select all.
            // Let's try: if selection > 0, clear. If selection == 0, select all.
            deselectAll();
        } else {
            // Select all filtered
            const ids = await getFilteredPlayerIds(
                selectedCountry,
                selectedClub,
                minCA,
                maxCA,
                minPA,
                maxPA,
                preferredFoot,
                favouriteNumber,
                effectiveBirthYear,
                selectedPosition,
                selectedFavouriteClub,
                nameQuery,
                sortBy
            );
            setSelection(ids);
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
        bind:selectedPosition
        bind:selectedFavouriteClub
        bind:minCA
        bind:maxCA
        bind:minPA
        bind:maxPA
        bind:preferredFoot
        bind:favouriteNumber
        bind:birthYear
        bind:effectiveBirthYear
        bind:nameQuery
        bind:sortBy
        bind:invalidRows 
        bind:showInvalidDetails 
        bind:isLastPage
        bind:editTypeFilter
        {triggerRefresh}
        onToggleDualView={toggleSecondaryWindow}
    />
    
    <article class="content">
        <InvalidRows bind:invalidRows bind:showInvalidDetails />
        <PlayerFilters 
            bind:selectedCountry 
            bind:selectedClub 
            bind:selectedPosition
            bind:selectedFavouriteClub
            bind:minCA
            bind:maxCA
            bind:minPA
            bind:maxPA
            bind:preferredFoot
            bind:favouriteNumber
            bind:birthYear
            bind:effectiveBirthYear
            bind:nameQuery
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
                bind:editTypeFilter
                onFilterChange={(type) => editTypeFilter = type}
            />
            <PlayerTable 
                bind:players={filteredPlayers} 
                bind:sortBy 
                onToggleGlobalSelection={handleGlobalSelection}
            />
            <PaginationSection 
                bind:currentPage 
                onPrev={prevPage} 
                onNext={nextPage} 
                onPageChange={jumpToPage} 
                {isLastPage}
                bind:editTypeFilter
                onFilterChange={(type) => editTypeFilter = type}
            />
        {:else if currentView === 'analyst'}
            <AnalystView 
                bind:players={filteredPlayers}
                {selectedCountry}
                {selectedClub}
                {selectedPosition}
                {selectedFavouriteClub}
                {minCA}
                {maxCA}
                {minPA}
                {maxPA}
                {preferredFoot}
                {favouriteNumber}
                {birthYear}
                {nameQuery}
                {sortBy}
                {filteredPlayers}
                {allFilteredIds}
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