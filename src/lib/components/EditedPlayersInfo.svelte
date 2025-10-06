<script lang="ts">
    import { editedCount, clearAllEditedPlayers, showOnlyEdited, toggleShowOnlyEdited } from '$lib/stores/editedPlayers';
    import RefreshButton from "./RefreshButton.svelte";
    
    let {
        editTypeFilter = 'all',
        onFilterReset = () => {}
    }: {
        editTypeFilter?: 'all' | 'modified' | 'added' | 'deleted';
        onFilterReset?: () => void;
    } = $props();
    
    function handleToggle() {
        toggleShowOnlyEdited(editTypeFilter, onFilterReset);
    }
</script>

{#if $editedCount > 0}
    <article class="edited-players-info">
        <section class="edited-count">
            <button 
                class="count-badge clickable"
                onclick={handleToggle}
                title={$showOnlyEdited ? 'Show all players' : 'Show only edited players'}
            >
                {$editedCount}
            </button>
            <span class="count-text">
                {$editedCount === 1 ? 'player edited' : 'players edited'}
            </span>
        </section>
        
        <RefreshButton 
            size={18}
            title="Reset all changes to original values"
            onClick={clearAllEditedPlayers}
        />
    </article>
{/if}

<style>
    .edited-players-info {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
    }
    
    .edited-count {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        font-weight: 600;
    }
    
    .count-badge {
        background-color: var(--color-primary);
        color: white;
        padding: var(--spacing-sm) var(--spacing-md);
        border-radius: var(--radius-md);
        font-size: var(--font-sm);
        font-weight: 700;
        min-width: 2rem;
        text-align: center;
        box-shadow: 0 0.125rem 0.3125rem var(--color-shadow-primary);
        border: none;
        cursor: pointer;
        transition: 
            background-color var(--transition-fast),
            transform var(--transition-fast);
    }
    
    .count-badge.clickable:hover {
        background-color: var(--color-primary-hover);
        transform: scale(1.05);
    }
    
    .count-text {
        color: var(--color-text);
        font-size: var(--font-base);
        font-weight: 500;
    }
    
</style>