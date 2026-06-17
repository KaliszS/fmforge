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

    let counts = $derived.by(() => {
        let modified = 0, added = 0, deleted = 0;
        const mod = $modifiedPlayers;
        for (const [id, original] of $originalPlayers) {
            const player = mod.get(id);
            if (original !== null && player !== null) modified++;
            else if (original === null && player !== null) added++;
            else if (original !== null && player === null) deleted++;
        }
        return { modified, added, deleted };
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

    const LABEL_TITLES: Record<'modified' | 'added' | 'deleted', string> = {
        modified: 'Modified',
        added: 'Added',
        deleted: 'Deleted',
    };
</script>

{#snippet editLabel(type: 'modified' | 'added' | 'deleted', count: number)}
    {#if count > 0}
        <div
            class="label-group {type}"
            class:active={$showOnlyEdited && editTypeFilter === type}
        >
            <button
                class="label-btn"
                onclick={() => filter(type)}
                title={$showOnlyEdited && editTypeFilter === type ? 'Show all players' : `Show only ${type} players`}
            >
                {LABEL_TITLES[type]} ({count})
            </button>
            <RefreshButton
                title="Revert {type} players"
                onclick={() => handleRevert(type)}
            />
        </div>
    {/if}
{/snippet}

<div class="edit-labels">
    {@render editLabel('modified', counts.modified)}
    {@render editLabel('added', counts.added)}
    {@render editLabel('deleted', counts.deleted)}
</div>

<style>
    .edit-labels {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-md);
    }

    .label-group {
        display: flex;
        align-items: stretch;
        border-radius: var(--radius-sm);
        border: 1px solid;
        overflow: hidden;
        transition: all var(--transition-fast);
        white-space: nowrap;
        font-size: var(--font-xs);
        font-weight: 600;
    }

    .label-group:hover {
        transform: scale(1.05);
        box-shadow: 0 2px 8px var(--color-shadow);
    }

    .label-group.active {
        transform: scale(1.05);
        box-shadow: 0 2px 8px var(--color-shadow);
        font-weight: 700;
    }

    .label-group.modified {
        background-color: var(--color-modified-bg);
        color: var(--color-modified);
        border-color: var(--color-modified);
    }

    .label-group.added {
        background-color: var(--color-newly-added-bg);
        color: var(--color-newly-added);
        border-color: var(--color-newly-added);
    }

    .label-group.deleted {
        background-color: var(--color-deleted-bg);
        color: var(--color-deleted);
        border-color: var(--color-deleted);
    }

    .label-btn {
        background: none;
        border: none;
        color: inherit;
        font: inherit;
        cursor: pointer;
        padding: var(--spacing-sm) var(--spacing-md);
    }

    .label-btn:hover {
        background-color: rgba(0, 0, 0, 0.05);
    }
</style>
