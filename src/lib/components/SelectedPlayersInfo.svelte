<script lang="ts">
    import { selectedPlayers, deselectAll, showOnlySelected } from '$lib/stores/selectionStore';

    function toggleFilter() {
        showOnlySelected.update(v => !v);
    }

    function handleDeselect(e: MouseEvent) {
        e.stopPropagation();
        deselectAll();
    }
</script>

{#if $selectedPlayers.size > 0}
    <article class="selected-players-info">
        <button 
            class="selection-btn"
            class:active={$showOnlySelected}
            onclick={toggleFilter}
            title={$showOnlySelected ? "Show all players" : "Show only selected players"}
        >
            <span class="filter-section">
                <span class="count">{$selectedPlayers.size}</span>
                <span class="label">selected</span>
            </span>
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <span class="icon-close" onclick={handleDeselect}>✕</span>
        </button>
    </article>
{/if}

<style>
    .selected-players-info {
        display: flex;
        align-items: center;
        margin-right: var(--spacing-lg);
        animation: fadeIn 0.2s ease;
    }

    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(2px); }
        to { opacity: 1; transform: translateY(0); }
    }

    .selection-btn {
        display: flex;
        align-items: center;
        gap: 0;
        background-color: var(--color-primary);
        color: white;
        padding: 0;
        border-radius: 100px;
        border: 1px solid var(--color-primary);
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: var(--font-sm);
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        height: 28px;
        overflow: hidden;
    }

    .filter-section {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 4px 12px;
        flex: 1;
        height: 100%;
    }

    .selection-btn:hover {
        background-color: var(--color-primary-hover);
        transform: translateY(-1px);
        box-shadow: 0 3px 8px rgba(0,0,0,0.15);
    }

    .selection-btn.active {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
        font-weight: 700;
    }

    .selection-btn:active {
        transform: translateY(0);
        box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }

    .count {
        font-weight: 800;
        font-size: 1.05em;
    }

    .label {
        font-weight: 700;
        font-size: 0.85em;
        opacity: 1;
        color: #ffffff;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .icon-close {
        font-size: 1em;
        font-weight: 700;
        padding: 0 14px;
        border-left: 1px solid rgba(255, 255, 255, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        align-self: stretch;
    }

    .icon-close:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }
</style>
