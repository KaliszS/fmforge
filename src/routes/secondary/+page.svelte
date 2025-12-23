<script lang="ts">
    import { listen } from '@tauri-apps/api/event';
    import { getCurrentWindow } from '@tauri-apps/api/window';
    import { onMount, onDestroy } from 'svelte';
    import PlayerTable from "$lib/components/PlayerTable.svelte";
    import type { PlayerRecord } from "$lib/types";
    import { loadPlayersPage } from "$lib/api/player";
    import { getModifiedPlayersAsRecords, modifiedPlayers, originalPlayers } from "$lib/stores/editedPlayers";
    import { selectedPlayers } from "$lib/stores/selectionStore";

    let players: PlayerRecord[] = $state([]);
    let sortBy: string[] | null = $state(null);
    let unlisten: () => void;

    // State received from main window
    let currentState: any = $state(null);

    function filterEditedPlayersByType(players: PlayerRecord[], type: 'all' | 'modified' | 'added' | 'deleted'): PlayerRecord[] {
        if (type === 'all') {
            return players;
        }
        
        return players.filter(record => {
            const original = $originalPlayers.get(record.id);
            const modified = $modifiedPlayers.get(record.id);
            switch (type) {
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

    async function loadData() {
        if (!currentState) return;

        // Calculate next page
        const nextPage = currentState.currentPage + 1;
        const offset = nextPage * currentState.pageSize;

        // Case 1: Show Only Edited
        if (currentState.showOnlyEdited) {
            // Ensure reactivity
            void $modifiedPlayers;
            void $originalPlayers;
            
            const allEditedPlayers = getModifiedPlayersAsRecords();
            let filtered = filterEditedPlayersByType(allEditedPlayers, currentState.editTypeFilter);
            
            if (currentState.showOnlySelected) {
                 const selectedIds = $selectedPlayers;
                 filtered = filtered.filter(p => selectedIds.has(p.id));
            }
            
            // Pagination
            const startIndex = offset;
            const endIndex = startIndex + currentState.pageSize;
            players = filtered.slice(startIndex, endIndex);
            sortBy = currentState.sortBy;
            return;
        }

        // Case 2: Show Only Selected (Global Backend Filter)
        let playerIds: number[] | null = null;
        if (currentState.showOnlySelected) {
             playerIds = Array.from($selectedPlayers);
             if (playerIds.length === 0) {
                 players = [];
                 return;
             }
        }

        players = await loadPlayersPage(
            offset,
            currentState.pageSize,
            currentState.selectedCountry,
            currentState.selectedClub,
            currentState.minCA,
            currentState.maxCA,
            currentState.minPA,
            currentState.maxPA,
            currentState.preferredFoot,
            currentState.favouriteNumber,
            currentState.effectiveBirthYear,
            currentState.selectedPosition,
            currentState.selectedFavouriteClub,
            currentState.nameQuery,
            currentState.sortBy,
            playerIds
        );
        
        sortBy = currentState.sortBy;
    }

    onMount(async () => {
        const appWindow = getCurrentWindow();
        await appWindow.setTitle("FM Forge - next page");

        // Listen for sync events
        unlisten = await listen('sync-state', (event: any) => {
            console.log('Received sync state:', event.payload);
            currentState = event.payload;
            
            if (currentState.theme) {
                document.documentElement.setAttribute('data-theme', currentState.theme);
            }
            
            loadData();
        });
    });
    
    // React to store changes (since we use them in loadData)
    $effect(() => {
        if (currentState) {
            // Trigger reload if stores change
            void $modifiedPlayers;
            void $originalPlayers;
            void $selectedPlayers;
            loadData();
        }
    });

    onDestroy(() => {
        if (unlisten) unlisten();
    });
</script>

<main>
    <div class="header">
        <div style="display: flex; align-items: center;">
            <h2>Secondary View (Next Page)</h2>
            <span class="read-only-label">Read Only</span>
        </div>
        {#if currentState}
            <span class="page-info">Page {currentState.currentPage + 2}</span>
        {/if}
    </div>
    
    <div class="content">
        <PlayerTable 
            bind:players={players} 
            bind:sortBy 
            onToggleGlobalSelection={() => {}} 
            disableSorting={true}
            readOnly={true}
        />
    </div>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        height: 100vh;
        background-color: var(--color-background-page);
        padding: var(--spacing-md) var(--spacing-sm) var(--spacing-sm) var(--spacing-lg);
    }

    .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-md);
        padding: 0 var(--spacing-sm);
    }

    h2 {
        margin: 0;
        font-size: var(--font-lg);
        color: var(--color-text);
    }

    .read-only-label {
        font-size: 0.8rem;
        font-weight: 700;
        color: var(--color-text-muted);
        background-color: var(--color-background-light);
        padding: 0.2em 0.6em;
        border-radius: 4px;
        border: 1px solid var(--color-border);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-left: 1em;
    }

    .page-info {
        font-weight: bold;
        color: var(--color-primary);
    }

    .content {
        flex: 1;
        overflow: auto;
    }
</style>
