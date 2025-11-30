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
    
    function filter(type: 'modified' | 'added' | 'deleted') {
        if ($showOnlyEdited && editTypeFilter === type) {
            showOnlyEdited.set(false);
        } else {
            showOnlyEdited.set(true);
            editTypeFilter = type;
            onFilterChange(type);
        }
    }

    function handleRevert(type: 'modified' | 'added' | 'deleted') {
        if (type === 'modified') revertModifiedPlayers();
        if (type === 'added') revertAddedPlayers();
        if (type === 'deleted') revertDeletedPlayers();
        if ($showOnlyEdited && editTypeFilter === type) {
            showOnlyEdited.set(false);
            editTypeFilter = 'all';
            onFilterChange('all');
        }
    }
</script>

<div class="edit-labels">
    {#if modifiedCount > 0}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div 
            class="label modified" 
            class:active={$showOnlyEdited && editTypeFilter === 'modified'}
            title={$showOnlyEdited && editTypeFilter === 'modified' ? 'Show all players' : 'Show only modified players'} 
            onclick={() => filter('modified')}
            role="button"
            tabindex="0"
        >
            <span>Modified ({modifiedCount})</span>
            <span onclick={(e) => e.stopPropagation()} role="none">
                <RefreshButton title="Revert modified players" onClick={() => handleRevert('modified')} />
            </span>
        </div>
    {/if}
    {#if addedCount > 0}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div 
            class="label added" 
            class:active={$showOnlyEdited && editTypeFilter === 'added'}
            title={$showOnlyEdited && editTypeFilter === 'added' ? 'Show all players' : 'Show only added players'} 
            onclick={() => filter('added')}
            role="button"
            tabindex="0"
        >
            <span>Added ({addedCount})</span>
            <span onclick={(e) => e.stopPropagation()} role="none">
                <RefreshButton title="Revert added players" onClick={() => handleRevert('added')} />
            </span>
        </div>
    {/if}
    {#if deletedCount > 0}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div 
            class="label deleted" 
            class:active={$showOnlyEdited && editTypeFilter === 'deleted'}
            title={$showOnlyEdited && editTypeFilter === 'deleted' ? 'Show all players' : 'Show only deleted players'} 
            onclick={() => filter('deleted')}
            role="button"
            tabindex="0"
        >
            <span>Deleted ({deletedCount})</span>
            <span onclick={(e) => e.stopPropagation()} role="none">
                <RefreshButton title="Revert deleted players" onClick={() => handleRevert('deleted')} />
            </span>
        </div>
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
