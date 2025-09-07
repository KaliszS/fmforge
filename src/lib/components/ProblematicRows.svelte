<script lang="ts">
    let {
        problematicRows = $bindable(),
        showProblematicDetails = $bindable(),
    }: {
        problematicRows: number[];
        showProblematicDetails: boolean;
    } = $props();

    function toggleProblematicDetails() {
        showProblematicDetails = !showProblematicDetails;
    }
</script>

{#if problematicRows && problematicRows.length > 0}
    <section class="problematic-rows">
        <article class="problematic-header" onclick={toggleProblematicDetails}>
            <span class="problematic-title">
                ⚠️ {problematicRows.length} rows have invalid data (need 19 fields)
            </span>
            <span class="problematic-toggle">
                {showProblematicDetails ? "▼" : "▶"}
            </span>
        </article>
        {#if showProblematicDetails}
            <div class="problematic-details">
                <p class="problematic-description">
                    The following rows in the source file have fewer than 19 fields and were skipped:
                </p>
                <div class="problematic-list">
                    {#each problematicRows as row, index}
                        <span class="problematic-row">
                            Row {row}
                            {#if index < problematicRows.length - 1}, {/if}
                        </span>
                    {/each}
                </div>
            </div>
        {/if}
    </section>
{/if}

<style>
    .problematic-rows {
        background-color: #fff3cd;
        border: 1px solid #ffeaa7;
        border-radius: var(--radius-md);
        margin-bottom: var(--spacing-md);
        overflow: hidden;
    }

    .problematic-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-sm) var(--spacing-md);
        cursor: pointer;
        transition: background-color var(--transition-fast);
    }

    .problematic-header:hover {
        background-color: #ffeaa7;
    }

    .problematic-title {
        font-weight: 600;
        color: #856404;
        font-size: var(--font-sm);
    }

    .problematic-toggle {
        font-size: var(--font-sm);
        color: #856404;
        font-weight: bold;
        transition: transform var(--transition-fast);
    }

    .problematic-details {
        padding: 0 var(--spacing-md) var(--spacing-md);
        border-top: 1px solid #ffeaa7;
        background-color: #fffbf0;
    }

    .problematic-description {
        margin: var(--spacing-sm) 0;
        font-size: var(--font-sm);
        color: #856404;
    }

    .problematic-list {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-xs);
        max-height: 8rem;
        overflow-y: auto;
        padding: var(--spacing-xs);
        background-color: var(--color-background);
        border-radius: var(--radius-sm);
        border: 1px solid var(--color-border-light);
    }

    .problematic-row {
        font-size: var(--font-xs);
        color: var(--color-text-muted);
        background-color: var(--color-background-light);
        padding: var(--spacing-xs);
        border-radius: var(--radius-sm);
        border: 1px solid var(--color-border);
    }
</style>
