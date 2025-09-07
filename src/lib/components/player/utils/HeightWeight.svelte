<script lang="ts">
    let {
        height = $bindable(),
        weight = $bindable(),
        edit_mode,
    }: { height: number; weight: number; edit_mode: boolean } = $props();
</script>

{#if edit_mode}
    <input type="number" class="input input-number" bind:value={height} title="Height in cm" />
    <input type="number" class="input input-number" bind:value={weight} title="Weight in kg" />
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

    /* Edit mode styling */
    :global(.edit-mode) input[type="number"] {
        min-width: 3rem;
        text-align: center;
    }
</style>
