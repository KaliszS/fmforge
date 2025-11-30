<script lang="ts">
    let {
        height = $bindable(),
        weight = $bindable(),
        edit_mode,
    }: { height: number; weight: number; edit_mode: boolean } = $props();
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
    <section class="height-icon" title={`Height: ${height} cm`}>
        📏 <span>{height}</span>
    </section>
    <section class="weidth-icon" title={`Weight: ${weight} kg`}>
        🏋️ <span>{weight}</span>
    </section>
{/if}

<style>
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
