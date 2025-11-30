<script lang="ts">
    import QuickEditModal from "$lib/components/common/QuickEditModal.svelte";

    let {
        height = $bindable(),
        weight = $bindable(),
        edit_mode,
    }: { height: number; weight: number; edit_mode: boolean } = $props();

    let quickEdit = $state(false);
    let temp_height = $state(0);
    let temp_weight = $state(0);

    function openQuickEdit() {
        if (edit_mode) return;
        temp_height = height;
        temp_weight = weight;
        quickEdit = true;
    }

    function saveQuickEdit() {
        height = temp_height;
        weight = temp_weight;
    }
</script>

{#if edit_mode}
    <div class="hw-edit">
        <label title="Height in cm">
            <span>📏</span>
            <input type="number" class="input input-number" bind:value={height} />
        </label>
        <label title="Weight in kg">
            <span>🏋️</span>
            <input type="number" class="input input-number" bind:value={weight} />
        </label>
    </div>
{:else}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div style="display:contents" ondblclick={openQuickEdit}>
        <section class="height-icon" title={`Height: ${height} cm`}>
            📏 <span>{height}</span>
        </section>
        <section class="weidth-icon" title={`Weight: ${weight} kg`}>
            🏋️ <span>{weight}</span>
        </section>
    </div>

    <QuickEditModal title="Edit Height & Weight" bind:isOpen={quickEdit} onSave={saveQuickEdit}>
        <div class="quick-edit-fields">
            <label>
                <span>Height (cm)</span>
                <input type="number" class="input" bind:value={temp_height} />
            </label>
            <label>
                <span>Weight (kg)</span>
                <input type="number" class="input" bind:value={temp_weight} />
            </label>
        </div>
    </QuickEditModal>
{/if}

<style>
    .quick-edit-fields {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
    }
    .quick-edit-fields label {
        display: flex;
        flex-direction: column;
        gap: 0.5em;
    }
    .height-icon,
    .weidth-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.75em 0.7em;
        font-size: 0.7em;
        gap: var(--spacing-xs);
        border-radius: var(--radius-sm);
        border: 1px solid var(--color-border);
        background-color: var(--color-background-light);
    }

    .height-icon span,
    .weidth-icon span {
        font-weight: 600;
        font-size: var(--font-base);
        line-height: 1;
    }
    
    .hw-edit {
        display: flex;
        gap: var(--spacing-sm);
    }
    
    .hw-edit label {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        background-color: var(--color-background);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        padding: 2px 6px;
    }
    
    .hw-edit label:focus-within {
        border-color: var(--color-primary);
    }

    /* Edit mode styling */
    :global(.edit-mode) input[type="number"] {
        min-width: 2.5rem;
        width: 3rem;
        text-align: center;
        border: none;
        background: transparent;
        padding: 0;
    }
    
    :global(.edit-mode) input[type="number"]:focus {
        box-shadow: none;
    }
</style>
