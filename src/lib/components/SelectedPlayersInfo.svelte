<script lang="ts">
    import { selectedPlayers, deselectAll, showOnlySelected } from '$lib/stores/selectionStore';
    import MassEditModal from '$lib/components/player/MassEditModal.svelte';

    let showMassEdit = $state(false);

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
        <div class="selection-group" class:active={$showOnlySelected}>
            <button 
                class="filter-section"
                onclick={toggleFilter}
                title={$showOnlySelected ? "Show all players" : "Show only selected players"}
            >
                <span class="count">{$selectedPlayers.size}</span>
                <span class="label">selected</span>
            </button>

            <button class="edit-section" onclick={() => showMassEdit = true} title="Mass Edit Selected Players">
                ✎
            </button>

            <button class="close-section" onclick={handleDeselect} title="Deselect all">
                ✕
            </button>
        </div>
    </article>

    <MassEditModal bind:isOpen={showMassEdit} onClose={() => showMassEdit = false} />
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

    .selection-group {
        display: flex;
        align-items: stretch;
        background-color: var(--color-primary);
        color: white;
        border-radius: 100px;
        overflow: hidden;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        height: 28px;
        transition: all 0.2s ease;
        border: 1px solid rgba(255,255,255,0.1);
    }

    .selection-group:hover {
        background-color: var(--color-primary-hover);
        transform: translateY(-1px);
        box-shadow: 0 3px 8px rgba(0,0,0,0.15);
    }

    .selection-group.active {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25);
    }

    .selection-group.active .filter-section {
        font-weight: 700;
    }

    button {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: background-color 0.2s;
    }

    .filter-section {
        padding: 0 12px;
        gap: 8px;
        font-size: var(--font-sm);
    }

    .filter-section:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }

    .edit-section {
        width: 32px;
        border-left: 1px solid rgba(255, 255, 255, 0.2);
        font-size: 1.1em;
    }

    .edit-section:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }

    .close-section {
        width: 28px;
        border-left: 1px solid rgba(255, 255, 255, 0.2);
        font-size: 0.9em;
        padding-right: 2px;
    }

    .close-section:hover {
        background-color: rgba(255, 255, 255, 0.2);
    }

    .count {
        font-weight: 800;
        font-size: 1.05em;
    }

    .label {
        font-size: 0.9em;
        color: #ffffff;
        opacity: 1;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 700;
    }
</style>
