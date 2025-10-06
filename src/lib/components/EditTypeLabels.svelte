<script lang="ts">
    import RefreshButton from "./RefreshButton.svelte";
    import { originalPlayers, modifiedPlayers, revertModifiedPlayers, revertAddedPlayers, revertDeletedPlayers, showOnlyEdited } from "$lib/stores/editedPlayers";
    
    let {
        editTypeFilter = $bindable(),
        onFilterChange = () => {}
    }: {
        editTypeFilter?: 'all' | 'modified' | 'added' | 'deleted';
        onFilterChange?: (type: 'all' | 'modified' | 'added' | 'deleted') => void;
    } = $props();
    
    let modifiedCount = $derived.by(() => {
        let count = 0;
        const originals = $originalPlayers;
        const modified = $modifiedPlayers;
        
        for (const [id, original] of originals) {
            const modifiedPlayer = modified.get(id);
            if (original !== null && modifiedPlayer !== null) {
                count++;
            }
        }
        return count;
    });
    
    let addedCount = $derived.by(() => {
        let count = 0;
        const originals = $originalPlayers;
        const modified = $modifiedPlayers;
        
        for (const [id, original] of originals) {
            const modifiedPlayer = modified.get(id);
            if (original === null && modifiedPlayer !== null) {
                count++;
            }
        }
        return count;
    });
    
    let deletedCount = $derived.by(() => {
        let count = 0;
        const originals = $originalPlayers;
        const modified = $modifiedPlayers;
        
        for (const [id, original] of originals) {
            const modifiedPlayer = modified.get(id);
            if (original !== null && modifiedPlayer === null) {
                count++;
            }
        }
        return count;
    });
    
    function filterModified() {
        if ($showOnlyEdited && editTypeFilter === 'modified') {
            showOnlyEdited.set(false);
        } else {
            showOnlyEdited.set(true);
            editTypeFilter = 'modified';
            onFilterChange('modified');
        }
    }
    
    function filterAdded() {
        if ($showOnlyEdited && editTypeFilter === 'added') {
            showOnlyEdited.set(false);
        } else {
            showOnlyEdited.set(true);
            editTypeFilter = 'added';
            onFilterChange('added');
        }
    }
    
    function filterDeleted() {
        if ($showOnlyEdited && editTypeFilter === 'deleted') {
            showOnlyEdited.set(false);
        } else {
            showOnlyEdited.set(true);
            editTypeFilter = 'deleted';
            onFilterChange('deleted');
        }
    }
</script>

<div class="edit-labels">
    {#if modifiedCount > 0}
        <button 
            class="label modified" 
            class:active={$showOnlyEdited && editTypeFilter === 'modified'}
            title={$showOnlyEdited && editTypeFilter === 'modified' ? 'Show all players' : 'Show only modified players'} 
            onclick={filterModified}
        >
            <span>Modified ({modifiedCount})</span>
            <RefreshButton title="Revert modified players" onClick={revertModifiedPlayers} />
        </button>
    {/if}
    {#if addedCount > 0}
        <button 
            class="label added" 
            class:active={$showOnlyEdited && editTypeFilter === 'added'}
            title={$showOnlyEdited && editTypeFilter === 'added' ? 'Show all players' : 'Show only added players'} 
            onclick={filterAdded}
        >
            <span>Added ({addedCount})</span>
            <RefreshButton title="Revert added players" onClick={revertAddedPlayers} />
        </button>
    {/if}
    {#if deletedCount > 0}
        <button 
            class="label deleted" 
            class:active={$showOnlyEdited && editTypeFilter === 'deleted'}
            title={$showOnlyEdited && editTypeFilter === 'deleted' ? 'Show all players' : 'Show only deleted players'} 
            onclick={filterDeleted}
        >
            <span>Deleted ({deletedCount})</span>
            <RefreshButton title="Revert deleted players" onClick={revertDeletedPlayers} />
        </button>
    {/if}
</div>

<style>
    .edit-labels {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }
    
    .label {
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 600;
        white-space: nowrap;
        background: none;
        border: none;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .label:hover {
        transform: scale(1.05);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }
    
    .label.active {
        transform: scale(1.05);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
        font-weight: 700;
    }
    
    
    .label.modified {
        background-color: rgba(59, 130, 246, 0.1);
        color: #3b82f6;
        border: 1px solid #3b82f6;
    }
    
    .label.added {
        background-color: rgba(34, 197, 94, 0.1);
        color: #22c55e;
        border: 1px solid #22c55e;
    }
    
    .label.deleted {
        background-color: rgba(220, 38, 38, 0.1);
        color: #dc2626;
        border: 1px solid #dc2626;
    }
</style>
