<script lang="ts">
    import { getContext } from 'svelte';

    let {
        title,
        isOpen = $bindable(),
        onSave,
        children
    }: {
        title: string;
        isOpen: boolean;
        onSave: () => void;
        children: any;
    } = $props();

    const quickEditContext = getContext<{ start: () => void, save: () => void }>('quickEdit');

    $effect(() => {
        if (isOpen && quickEditContext) {
            quickEditContext.start();
        }
    });

    function close() {
        isOpen = false;
    }

    async function handleSave() {
        onSave();
        close();
        
        // Wait for Svelte to flush updates and for the modal to close
        await new Promise(resolve => setTimeout(resolve, 0));
        
        if (quickEditContext) {
            quickEditContext.save();
        }
    }
</script>

{#if isOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="modal-backdrop" onclick={close}>
        <div class="modal-content" onclick={(e) => e.stopPropagation()}>
            <h3>{title}</h3>
            <div class="modal-body">
                {@render children()}
            </div>
            <div class="modal-actions">
                <button class="cancel-btn" onclick={close}>Cancel</button>
                <button class="save-btn" onclick={handleSave}>Save</button>
            </div>
        </div>
    </div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        backdrop-filter: blur(2px);
    }
    .modal-content {
        background: var(--color-background);
        padding: var(--spacing-lg);
        border-radius: var(--radius-md);
        min-width: 300px;
        max-width: 90vw;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        border: 1px solid var(--color-border);
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
    }
    h3 {
        margin: 0;
        color: var(--color-text);
        font-size: var(--font-lg);
    }
    .modal-body {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
    }
    .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: var(--spacing-sm);
        margin-top: var(--spacing-sm);
    }
    button {
        padding: 0.5em 1em;
        border-radius: var(--radius-sm);
        cursor: pointer;
        font-weight: 600;
        transition: all 0.2s;
    }
    .cancel-btn {
        background: transparent;
        border: 1px solid var(--color-border);
        color: var(--color-text);
    }
    .cancel-btn:hover {
        background: var(--color-background-hover);
    }
    .save-btn {
        background: var(--color-primary);
        border: 1px solid var(--color-primary);
        color: white;
    }
    .save-btn:hover {
        background: var(--color-primary-hover);
    }
</style>
