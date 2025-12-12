<script lang="ts">
    import { selectedPlayers } from '$lib/stores/selectionStore';

    let { onToggle }: { onToggle: () => void } = $props();

    // It's "selected" if at least one player is selected.
    // We might want a "tri-state" if not all are selected, but the requirement says
    // "select all filtered (and deselect on second click)".
    // So if >0 selected, clicking it should probably select ALL (if not all selected) or deselect ALL?
    // The user said: "ta globalna ma zaznaczyć (i odznaczyć przy ponowym kliknieciu) wszystkich garczy przefiltrowanych"
    // Simplest logic: 
    // If 0 selected -> Select All.
    // If >0 selected -> Deselect All. (This is standard "bulk" behavior if we don't distinguish 'some' vs 'all')
    // BUT standard table behavior is usually:
    // If some selected -> click makes it ALL selected.
    // If all selected -> click makes it NONE selected.
    // Given we don't know "total count" easily here without props, let's trust the parent to handle the logic,
    // and this component just shows a visual state.
    
    // However, for visual feedback:
    // If size > 0, we show as "active" or "indeterminate"?
    // Let's just use size > 0 for now as "active" style.
    let hasSelection = $derived($selectedPlayers.size > 0);
</script>

<button 
    class="global-selection-trigger" 
    class:selected={hasSelection}
    onclick={onToggle}
    title={hasSelection ? "Deselect all" : "Select all filtered players"}
    aria-label={hasSelection ? "Deselect all players" : "Select all filtered players"}
>
    <div class="trigger-indicator">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 18l6-6-6-6"/>
        </svg>
    </div>
</button>

<style>
    .global-selection-trigger {
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
        transform: rotate(180deg);
        width: 8px;
        height: 8px;
        stroke-width: 2.5;
    }

    .global-selection-trigger:hover .trigger-indicator {
        opacity: 1;
        background-color: var(--color-background-hover);
        border-color: var(--color-border-hover);
        width: 14px;
        transform: translateX(-2px);
    }

    /* Different style for global trigger when active to distinguish? 
       Or same? User said "add another global arrow". 
       Let's keep it consistent but maybe blue outline? */
    .global-selection-trigger.selected .trigger-indicator {
        background-color: var(--color-primary);
        border-color: var(--color-primary);
        color: white;
        opacity: 1;
        box-shadow: -1px 0 3px rgba(0,0,0,0.1);
    }
</style>
