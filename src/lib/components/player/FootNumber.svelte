<script lang="ts">
    import Foot from "./utils/Foot.svelte";
    import Number from "./utils/Number.svelte";

    let {
        preferred_foot = $bindable(),
        favourite_number = $bindable(),
        edit_mode = false,
    }: {
        preferred_foot: number;
        favourite_number?: number | null;
        edit_mode: boolean;
    } = $props();
</script>

{#if edit_mode}
    <div class="details-grid edit-mode">
        <Foot bind:preferred_foot {edit_mode} />
        <Number bind:favourite_number {edit_mode} />
    </div>
{:else}
    <div class="details-grid">
        <div class="column compact">
            <Foot {preferred_foot} {edit_mode} />
            <Number {favourite_number} {edit_mode} />
        </div>
    </div>
{/if}

<style>
    .details-grid {
        display: flex;
        gap: 0.75rem;
        align-items: flex-start;
        flex-wrap: wrap;
    }
    
    .details-grid.edit-mode {
        align-items: center;
        justify-content: center;
        width: 100%;
    }

    .column {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
    }

    .column.compact {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
    }

    /* Edit mode styling */
    :global(.edit-mode) .details-grid {
        /* Removed background and border as requested */
        justify-content: center;
    }

    :global(.edit-mode) .column {
        gap: var(--spacing-xs);
    }
</style>
