<script lang="ts">
    import { selectedPlayers, toggleSelection } from '$lib/stores/selectionStore';
    import { modifiedPlayers, originalPlayers } from '$lib/stores/editedPlayers';

    let { playerId }: { playerId: number } = $props();

    let isSelected = $derived($selectedPlayers.has(playerId));
    let isDeleted = $derived.by(() => {
        const original = $originalPlayers.get(playerId);
        const modified = $modifiedPlayers.get(playerId);
        return original !== null && modified === null;
    });
    let isNewlyAdded = $derived.by(() => {
        const original = $originalPlayers.get(playerId);
        return original === null;
    });

    function handleToggle(e: Event) {
        e.stopPropagation();
        if (isDeleted) return; // Don't allow selecting deleted players
        toggleSelection(playerId);
    }
</script>

<button 
    class="selection-trigger" 
    class:selected={isSelected}
    class:newly-added={isNewlyAdded}
    class:deleted={isDeleted}
    onclick={handleToggle}
    onkeydown={(e) => e.key === 'Enter' && handleToggle(e)}
    aria-label={isDeleted ? "Cannot select deleted player" : isSelected ? "Deselect player" : "Select player"}
    disabled={isDeleted}
>
    <div class="trigger-indicator">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 18l6-6-6-6"/>
        </svg>
    </div>
</button>

<style>
    .selection-trigger {
        position: absolute;
        left: -12px;
        top: 0;
        bottom: 0;
        width: 12px;
        padding: 0;
        background: transparent;
        border: none;
        display: flex;
        align-items: center;
        cursor: pointer;
        z-index: 20;
        transition: all 0.2s ease;
    }

    .trigger-indicator {
        width: 100%;
        height: 22px;
        background-color: var(--color-background-light);
        border: 1px solid var(--color-border);
        border-right: none;
        border-radius: 6px 0 0 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--color-text-muted);
        opacity: 0.6;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .trigger-indicator svg {
        transform: rotate(180deg); /* Point right towards content */
        width: 8px;
        height: 8px;
        stroke-width: 2.5;
    }

    .selection-trigger:hover .trigger-indicator {
        opacity: 1;
        background-color: var(--color-background-hover);
        border-color: var(--color-border-hover);
        width: 14px;
        transform: translateX(-2px);
    }

    .selection-trigger.selected .trigger-indicator {
        background-color: var(--color-primary);
        border-color: var(--color-primary);
        color: white;
        opacity: 1;
        box-shadow: -1px 0 3px rgba(0,0,0,0.1);
    }

    .selection-trigger.newly-added.selected .trigger-indicator {
        background-color: #22c55e;
        border-color: #22c55e;
    }

    .selection-trigger.deleted {
        cursor: not-allowed;
        opacity: 0.3;
    }

    .selection-trigger.deleted .trigger-indicator {
        background-color: var(--color-background-light);
        border-color: var(--color-border);
        color: var(--color-text-muted);
    }
</style>
