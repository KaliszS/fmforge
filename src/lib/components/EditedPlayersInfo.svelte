<script lang="ts">
    import { editedCount, clearAllEditedPlayers, showOnlyEdited, toggleShowOnlyEdited } from '$lib/stores/editedPlayers';
</script>

{#if $editedCount > 0}
    <article class="edited-players-info">
        <section class="edited-count">
            <button 
                class="count-badge clickable"
                onclick={toggleShowOnlyEdited}
                title={$showOnlyEdited ? 'Show all players' : 'Show only edited players'}
            >
                {$editedCount}
            </button>
            <span class="count-text">
                {$editedCount === 1 ? 'player edited' : 'players edited'}
            </span>
        </section>
        
        <button 
            class="reset-icon-btn" 
            onclick={clearAllEditedPlayers}
            title="Reset all changes to original values"
            aria-label="Reset all changes to original values"
        >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                <path d="M21 3v5h-5"/>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                <path d="M3 21v-5h5"/>
            </svg>
        </button>
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
    
    .reset-icon-btn {
        background: none;
        border: none;
        color: var(--color-text-muted);
        cursor: pointer;
        padding: var(--spacing-sm);
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: 
            color var(--transition-fast),
            background-color var(--transition-fast),
            transform var(--transition-fast);
    }
    
    .reset-icon-btn:hover {
        color: var(--color-text);
        background-color: var(--color-background-hover);
        transform: scale(1.1);
    }
    
    .reset-icon-btn svg {
        width: 18px;
        height: 18px;
    }
</style>