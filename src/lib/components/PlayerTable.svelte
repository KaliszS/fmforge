<script lang="ts">
    import type { PlayerRecord } from "$lib/types";
    import PlayerItem from "./PlayerItem.svelte";
    import AddPlayerRow from "./AddPlayerRow.svelte";
    import { modifiedPlayers, originalPlayers, showOnlyEdited } from "$lib/stores/editedPlayers";

    let { 
        players = $bindable(),
        sortBy = $bindable()
    }: { 
        players: PlayerRecord[],
        sortBy?: string | null
    } = $props();
    
    let newlyAddedPlayers = $derived.by(() => {
        let result: PlayerRecord[] = [];
        $modifiedPlayers.forEach((player, id) => {
            const original = $originalPlayers.get(id);
            if (original === null) {
                result.push({ id, player });
            }
        });
        return result;
    });

    type SortField = 'name' | 'age' | 'ca' | 'pa';

    function toggleSort(field: SortField) {
        const isAsc = sortBy === `${field}_asc`;
        const isDesc = sortBy === `${field}_desc`;

        if (field === 'name') {
            // Default to Ascending (A-Z) for Name
            sortBy = isAsc ? 'name_desc' : 'name_asc';
        } else {
            // Default to Descending (High-Low) for Age, CA, PA
            sortBy = isDesc ? `${field}_asc` : `${field}_desc`;
        }
    }

    function getSortIcon(field: SortField) {
        if (sortBy === `${field}_asc`) return '▲';
        if (sortBy === `${field}_desc`) return '▼';
        return '↕';
    }

    function isSortActive(field: SortField) {
        return sortBy?.startsWith(field) ?? false;
    }
</script>

<div class="player-table">
    <div class="header-row">
        <div class="header-cell">Nat</div>
        <div class="header-cell col-personal">
            <button class="sort-btn" class:active={isSortActive('name')} onclick={() => toggleSort('name')}>
                Name <span class="sort-icon">{getSortIcon('name')}</span>
            </button>
            <button class="sort-btn" class:active={isSortActive('age')} onclick={() => toggleSort('age')}>
                Age <span class="sort-icon">{getSortIcon('age')}</span>
            </button>
        </div>
        <div class="header-cell col-ability">
            <button class="sort-btn" class:active={isSortActive('ca')} onclick={() => toggleSort('ca')}>
                CA <span class="sort-icon">{getSortIcon('ca')}</span>
            </button>
            <button class="sort-btn" class:active={isSortActive('pa')} onclick={() => toggleSort('pa')}>
                PA <span class="sort-icon">{getSortIcon('pa')}</span>
            </button>
        </div>
        <div class="header-cell">Ft</div>
        <div class="header-cell">Club</div>
        <div class="header-cell">Appearance</div>
        <div class="header-cell"></div>
        <div class="header-cell"></div>
    </div>

    <ul class="player-list">
        {#if players.length > 0}
            <AddPlayerRow />
        {/if}
        
        {#if !$showOnlyEdited}
            {#each newlyAddedPlayers as playerRecord}
                <PlayerItem bind:player={playerRecord.player} playerId={playerRecord.id} />
            {/each}
        {/if}
        
        {#each players as playerRecord}
            <PlayerItem bind:player={playerRecord.player} playerId={playerRecord.id} />
        {/each}
    </ul>
</div>

<style>
    .player-table {
        max-width: 100%;
        width: 100%;
        border-radius: var(--radius-xl);
        background-color: var(--color-background);
        box-shadow: 0 0.1875rem 0.625rem var(--color-shadow-light);
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .header-row {
        display: grid;
        grid-template-columns:
            3em
            22em
            9em
            3em
            13em
            14.5em
            5em
            5em;
        gap: var(--spacing-md);
        align-items: center;
        padding: 0.5em 0.5em;
        background-color: var(--color-background-light);
        border-bottom: 1px solid var(--color-border);
        border-left: 4px solid transparent; /* Align with player items */
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--color-text-muted);
    }

    .header-cell {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
    }

    .col-personal {
        justify-content: flex-start;
        gap: var(--spacing-lg);
    }

    .col-ability {
        justify-content: flex-start;
        gap: var(--spacing-md);
    }

    .sort-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-family: inherit;
        font-size: inherit;
        font-weight: inherit;
        color: inherit;
        display: flex;
        align-items: center;
        gap: 0.25em;
        padding: 0.25em 0.5em;
        border-radius: var(--radius-sm);
        transition: all var(--transition-fast);
    }

    .sort-btn:hover {
        background-color: var(--color-background-hover);
        color: var(--color-text);
    }

    .sort-btn.active {
        color: var(--color-primary);
        background-color: var(--color-primary-bg);
    }

    .sort-icon {
        font-size: 0.8em;
        opacity: 0.3;
    }

    .sort-btn:hover .sort-icon,
    .sort-btn.active .sort-icon {
        opacity: 1;
    }

    .player-list {
        list-style: none;
        padding: 0;
        margin: 0;
        width: 100%;
    }
</style>
