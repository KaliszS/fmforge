<script lang="ts">
    import type { PlayerRecord } from "$lib/types";
    import PlayerItem from "./PlayerItem.svelte";
    import AddPlayerRow from "./AddPlayerRow.svelte";
    import GlobalSelectionTrigger from "./player/GlobalSelectionTrigger.svelte";
    import { modifiedPlayers, originalPlayers, showOnlyEdited } from "$lib/stores/editedPlayers";

    let { 
        players = $bindable(),
        sortBy = $bindable(),
        onToggleGlobalSelection
    }: { 
        players: PlayerRecord[],
        sortBy?: string[] | null,
        onToggleGlobalSelection?: () => void
    } = $props();
    
    let newlyAddedPlayers = $derived.by(() => {
        let result: PlayerRecord[] = [];
        $modifiedPlayers.forEach((player, id) => {
            const original = $originalPlayers.get(id);
            if (original === null && player) {
                result.push({ id, player });
            }
        });
        return result;
    });

    type SortField = 'name' | 'age' | 'ca' | 'pa' | 'nationality' | 'position' | 'club' | 'height' | 'weight' | 'foot';

    function toggleSort(field: SortField) {
        let currentSorts = sortBy ? [...sortBy] : [];
        
        // Find if this field is already in the sort list
        const existingIndex = currentSorts.findIndex(s => s.startsWith(field));
        
        if (existingIndex !== -1) {
            const currentSort = currentSorts[existingIndex];
            const isAsc = currentSort.endsWith('_asc');
            
            // Toggle direction or remove
            if (field === 'name' || field === 'nationality' || field === 'position' || field === 'club') {
                // String fields: Asc -> Desc -> Remove
                if (isAsc) {
                    currentSorts[existingIndex] = `${field}_desc`;
                } else {
                    currentSorts.splice(existingIndex, 1);
                }
            } else {
                // Numeric fields: Desc -> Asc -> Remove
                if (!isAsc) { // is Desc
                    currentSorts[existingIndex] = `${field}_asc`;
                } else {
                    currentSorts.splice(existingIndex, 1);
                }
            }
        } else {
            // Add new sort
            if (field === 'name' || field === 'nationality' || field === 'position' || field === 'club') {
                currentSorts.push(`${field}_asc`);
            } else {
                currentSorts.push(`${field}_desc`);
            }
        }
        
        sortBy = currentSorts.length > 0 ? currentSorts : null;
    }

    function isSortActive(field: SortField) {
        return sortBy?.some(s => s.startsWith(field)) ?? false;
    }

    function clearSort() {
        sortBy = null;
    }
</script>

{#snippet sortIcon(field: SortField)}
    {@const sortIndex = sortBy?.findIndex(s => s.startsWith(field))}
    {@const sortString = sortIndex !== undefined && sortIndex !== -1 ? sortBy![sortIndex] : null}
    
    <span class="sort-icon">
        {#if sortString === `${field}_asc`}
            <div class="sort-indicator">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5"/><path d="M5 12l7-7 7 7"/></svg>
                {#if (sortBy?.length ?? 0) > 1}
                    <span class="sort-index">{sortIndex! + 1}</span>
                {/if}
            </div>
        {:else if sortString === `${field}_desc`}
            <div class="sort-indicator">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M19 12l-7 7-7-7"/></svg>
                {#if (sortBy?.length ?? 0) > 1}
                    <span class="sort-index">{sortIndex! + 1}</span>
                {/if}
            </div>
        {:else}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.5"><path d="M7 15l5 5 5-5"/><path d="M7 9l5-5 5 5"/></svg>
        {/if}
    </span>
{/snippet}

<div class="player-table">
    <div class="header-row">
        {#if onToggleGlobalSelection}
            <GlobalSelectionTrigger onToggle={onToggleGlobalSelection} />
        {/if}
        <div class="header-cell">
            <button class="sort-btn" class:active={isSortActive('nationality')} onclick={() => toggleSort('nationality')}>
                Nat {@render sortIcon('nationality')}
            </button>
        </div>
        <div class="header-cell col-personal">
            <button class="sort-btn" class:active={isSortActive('position')} onclick={() => toggleSort('position')}>
                Pos {@render sortIcon('position')}
            </button>
            <button class="sort-btn" class:active={isSortActive('name')} onclick={() => toggleSort('name')}>
                Name {@render sortIcon('name')}
            </button>
            <button class="sort-btn" class:active={isSortActive('age')} onclick={() => toggleSort('age')}>
                Age {@render sortIcon('age')}
            </button>
        </div>
        <div class="header-cell col-ability">
            <button class="sort-btn" class:active={isSortActive('ca')} onclick={() => toggleSort('ca')}>
                CA {@render sortIcon('ca')}
            </button>
            <button class="sort-btn" class:active={isSortActive('pa')} onclick={() => toggleSort('pa')}>
                PA {@render sortIcon('pa')}
            </button>
        </div>
        <div class="header-cell">
            <button class="sort-btn" class:active={isSortActive('foot')} onclick={() => toggleSort('foot')}>
                Ft {@render sortIcon('foot')}
            </button>
        </div>
        <div class="header-cell">
            <button class="sort-btn" class:active={isSortActive('club')} onclick={() => toggleSort('club')}>
                Club {@render sortIcon('club')}
            </button>
        </div>
        <div class="header-cell col-appearance">
            <button class="sort-btn" class:active={isSortActive('height')} onclick={() => toggleSort('height')}>
                H {@render sortIcon('height')}
            </button>
            <button class="sort-btn" class:active={isSortActive('weight')} onclick={() => toggleSort('weight')}>
                W {@render sortIcon('weight')}
            </button>
        </div>
        <div class="header-cell col-actions">
            {#if sortBy && sortBy.length > 0}
                <button class="btn-clear" onclick={clearSort} title="Clear sorting">
                    ✕
                </button>
            {/if}
        </div>
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
        overflow: visible; /* Allow selection triggers to overflow */
        display: flex;
        flex-direction: column;
    }

    .header-row {
        display: grid;
        grid-template-columns:
            3.3em
            22.2em
            7.5em
            3.5em
            24em
            7em
            auto;
        gap: var(--spacing-md);
        align-items: center;
        padding: 0.5em 0.5em;
        background-color: var(--color-background-light);
        border-bottom: 1px solid var(--color-border);
        border-left: 4px solid transparent; /* Align with player items */
        font-size: 0.85rem;
        font-weight: 600;
        color: var(--color-text-muted);
        position: relative; /* For absolute positioning of global selection trigger */
        overflow: visible;
    }

    .header-cell {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
    }

    .col-actions {
        display: flex;
        justify-content: center;
    }

    .col-personal {
        display: grid;
        grid-template-columns: 4em 5em 3em;
        gap: var(--spacing-sm);
        justify-content: start;
    }

    .col-ability {
        display: grid;
        grid-template-columns: 3.5em 3.5em;
        gap: var(--spacing-sm);
    }

    .col-appearance {
        display: grid;
        grid-template-columns: 1em 4.5em;
        gap: var(--spacing-md);
        justify-items: end;
    }

    .sort-btn {
        background: transparent;
        border: 1px solid transparent;
        cursor: pointer;
        font-family: inherit;
        font-size: 0.75rem;
        font-weight: 600;
        color: var(--color-text-muted);
        display: inline-flex;
        align-items: center;
        gap: 0.35em;
        padding: 0.35em 0.65em;
        border-radius: var(--radius-md);
        transition: all 0.2s ease;
        text-transform: uppercase;
        letter-spacing: 0.02em;
    }

    .sort-btn:hover {
        background-color: var(--color-background);
        border-color: var(--color-border);
        color: var(--color-text);
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    }

    .sort-btn:active {
        transform: translateY(0);
        box-shadow: none;
    }

    .sort-btn.active {
        color: var(--color-primary);
        background-color: var(--color-primary-light);
        border-color: var(--color-primary-light);
    }

    .sort-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 12px;
        height: 12px;
    }

    .sort-indicator {
        display: flex;
        align-items: center;
        gap: 2px;
    }

    .sort-index {
        font-size: 0.65em;
        font-weight: 700;
        color: var(--color-primary);
        margin-left: 1px;
    }

    .player-list {
        list-style: none;
        padding: 0;
        margin: 0;
        width: 100%;
    }
</style>
