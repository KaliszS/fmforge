<script lang="ts">
    import Icon from '$lib/components/common/Icon.svelte';

    let {
        onSave,
        onDiscard,
        saveDisabled = false,
        saveTitle = "Save changes",
        discardTitle = "Discard changes",
        isDeleted = false
    }: {
        onSave: () => void;
        onDiscard: () => void;
        saveDisabled?: boolean;
        saveTitle?: string;
        discardTitle?: string;
        isDeleted?: boolean;
    } = $props();
</script>

<div class="edit-actions">
    <button
        class="edit-button"
        onclick={onSave}
        title={saveTitle}
        aria-label={saveTitle}
        disabled={saveDisabled || isDeleted}
    >
        <Icon name="check" />
    </button>
    <button
        class="discard-button"
        onclick={onDiscard}
        title={discardTitle}
        aria-label={discardTitle}
        disabled={isDeleted}
    >
        <Icon name="x" />
    </button>
</div>

<style>
    .edit-actions {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
        align-items: center;
        justify-content: center;
        align-self: center;
        margin-left: auto;
    }

    .edit-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.5rem;
        height: 2.5rem;
        background-color: var(--color-newly-added-bg);
        border: 1px solid var(--color-newly-added);
        border-radius: var(--radius-sm);
        color: var(--color-newly-added);
        cursor: pointer;
        transition: all var(--transition-fast);
        box-shadow: 0 0 0 0.5px #fff, 0 0 0 1px var(--color-newly-added);
    }

    .edit-button:hover {
        background-color: var(--color-newly-added);
        color: white;
        transform: scale(1.05);
    }

    .edit-button:active {
        transform: scale(0.95);
    }

    .edit-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background-color: var(--color-background-light);
        color: var(--color-text-muted);
        border-color: var(--color-border);
        box-shadow: 0 0 0 0.5px #fff, 0 0 0 1px var(--color-border);
    }

    .edit-button:disabled:hover {
        transform: none;
        background-color: var(--color-background-light);
        color: var(--color-text-muted);
    }

    .discard-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.5rem;
        height: 2.5rem;
        border: 1px solid var(--color-delete);
        border-radius: var(--radius-sm);
        background-color: var(--color-background);
        color: var(--color-delete);
        cursor: pointer;
        transition: all var(--transition-fast);
        box-shadow: 0 0 0 0.5px #fff, 0 0 0 1px var(--color-delete);
        opacity: 0.8;
    }

    .discard-button:hover {
        background-color: var(--color-delete-bg-hover);
        border-color: var(--color-delete-hover);
        color: var(--color-delete-hover);
        box-shadow: 0 0 0 0.5px #fff, 0 0 0 1px var(--color-delete-hover);
        transform: scale(1.05);
        opacity: 1;
    }

    .discard-button:active {
        transform: scale(0.95);
    }
</style>
