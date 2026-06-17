<script lang="ts">
    import { selectedPlayers, deselectAll, showOnlySelected } from '$lib/stores/selectionStore';
    import { markPlayerForDeletion } from '$lib/stores/editedPlayers';
    import { loadPlayersPage } from '$lib/api/player';
    import MassEditModal from '$lib/components/player/MassEditModal.svelte';
    import Icon from '$lib/components/common/Icon.svelte';

    let showMassEdit = $state(false);

    function toggleFilter() {
        showOnlySelected.update(v => !v);
    }

    function handleDeselect(e: MouseEvent) {
        e.stopPropagation();
        deselectAll();
    }

    async function handleMassDelete() {
        const ids = Array.from($selectedPlayers);
        if (ids.length === 0) return;

        const players = await loadPlayersPage(0, ids.length, null, null, null, null, null, null, null, null, null, null, null, null, null, ids);
        const playerMap = new Map(players.map(p => [p.id, p.player]));

        for (const id of ids) {
            const player = playerMap.get(id);
            markPlayerForDeletion(id, player);
        }

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

            <button class="delete-section" onclick={handleMassDelete} title="Mass Delete Selected Players" aria-label="Mass Delete Selected Players">
                <Icon name="trash" />
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
        transition: all var(--transition-fast);
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
        transition: background-color var(--transition-fast);
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

    .delete-section {
        width: 32px;
        border-left: 1px solid rgba(255, 255, 255, 0.2);
        font-size: 1em;
    }

    .delete-section:hover {
        background-color: rgba(220, 50, 50, 0.4);
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
