<script lang="ts">
    import type { InvalidRow } from "$lib/api/file";
    import { save } from "@tauri-apps/plugin-dialog";
    import { writeTextFile } from "@tauri-apps/plugin-fs";

    let {
        invalidRows = $bindable(),
        showInvalidDetails = $bindable(),
    }: {
        invalidRows: InvalidRow[];
        showInvalidDetails: boolean;
    } = $props();

    function toggleInvalidDetails() {
        showInvalidDetails = !showInvalidDetails;
    }

    async function exportInvalidRows() {
        try {
            const path = await save({
                filters: [{
                    name: "EDT File",
                    extensions: ["edt"]
                }],
                defaultPath: "invalid_rows.edt"
            });

            if (path) {
                const content = invalidRows.map(row => row.content).join("\n");
                
                await writeTextFile(path, content);
                alert("Export successful!");
            }
        } catch (error) {
            console.error("Failed to export:", error);
            alert("Failed to export invalid rows.");
        }
    }
</script>

{#if invalidRows && invalidRows.length > 0}
    <section class="invalid-rows">
        <article class="invalid-header" onclick={toggleInvalidDetails}>
            <span class="invalid-title">
                ⚠️ {invalidRows.length} rows have invalid data (need 19 fields)
            </span>
            <div class="header-actions">
                <button class="btn-export" onclick={(e) => { e.stopPropagation(); exportInvalidRows(); }}>
                    Export
                </button>
                <span class="invalid-toggle">
                    {showInvalidDetails ? "▼" : "▶"}
                </span>
            </div>
        </article>
        {#if showInvalidDetails}
            <div class="invalid-details">
                <p class="invalid-description">
                    The following rows in the source file have fewer than 19 fields and were skipped:
                </p>
                <div class="invalid-list">
                    {#each invalidRows as row}
                        <div class="invalid-row-item">
                            <div class="row-meta">
                                <span class="row-file">{row.file_path.split(/[/\\]/).pop()}</span>
                                <span class="row-number">Row {row.row_number}</span>
                            </div>
                            <code class="row-content">{row.content}</code>
                        </div>
                    {/each}
                </div>
            </div>
        {/if}
    </section>
{/if}

<style>
    .invalid-rows {
        background-color: #fff3cd;
        border: 1px solid #ffeaa7;
        border-radius: var(--radius-md);
        margin-bottom: var(--spacing-md);
        overflow: hidden;
    }

    .invalid-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-sm) var(--spacing-md);
        cursor: pointer;
        transition: background-color var(--transition-fast);
    }

    .invalid-header:hover {
        background-color: #ffeaa7;
    }

    .invalid-title {
        font-weight: 600;
        color: #856404;
        font-size: var(--font-sm);
    }

    .header-actions {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
    }

    .btn-export {
        background-color: #fff;
        border: 1px solid #856404;
        color: #856404;
        padding: 2px 8px;
        border-radius: var(--radius-sm);
        font-size: var(--font-xs);
        cursor: pointer;
        font-weight: 600;
        transition: all 0.2s;
    }

    .btn-export:hover {
        background-color: #fff3cd;
        transform: translateY(-1px);
    }

    .invalid-toggle {
        font-size: var(--font-sm);
        color: #856404;
        font-weight: bold;
        transition: transform var(--transition-fast);
    }

    .invalid-details {
        padding: 0 var(--spacing-md) var(--spacing-md);
        border-top: 1px solid #ffeaa7;
        background-color: #fffbf0;
    }

    .invalid-description {
        margin: var(--spacing-sm) 0;
        font-size: var(--font-sm);
        color: #856404;
    }

    .invalid-list {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
        max-height: 300px;
        overflow-y: auto;
        padding: var(--spacing-xs);
        background-color: var(--color-background);
        border-radius: var(--radius-sm);
        border: 1px solid var(--color-border-light);
    }

    .invalid-row-item {
        display: flex;
        flex-direction: column;
        gap: 2px;
        padding: var(--spacing-xs);
        background-color: var(--color-background-light);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
    }

    .row-meta {
        display: flex;
        gap: var(--spacing-sm);
        font-size: var(--font-xs);
        color: var(--color-text-muted);
        font-weight: 600;
    }

    .row-content {
        font-family: monospace;
        font-size: var(--font-xs);
        color: var(--color-text);
        word-break: break-all;
        background: rgba(0,0,0,0.05);
        padding: 2px 4px;
        border-radius: 2px;
    }

    /* Dark theme styling */
    :global([data-theme="dark"]) .invalid-rows {
        background-color: #3a2a1a;
        border: 1px solid #5f3a1e;
    }

    :global([data-theme="dark"]) .invalid-header:hover {
        background-color: #5f3a1e;
    }

    :global([data-theme="dark"]) .invalid-title,
    :global([data-theme="dark"]) .invalid-toggle {
        color: #ffb366;
    }

    :global([data-theme="dark"]) .invalid-details {
        border-top: 1px solid #5f3a1e;
        background-color: #2a1a0f;
    }

    :global([data-theme="dark"]) .invalid-description {
        color: #ffb366;
    }

    :global([data-theme="dark"]) .btn-export {
        background-color: #2a1a0f;
        border-color: #ffb366;
        color: #ffb366;
    }

    :global([data-theme="dark"]) .btn-export:hover {
        background-color: #3a2a1a;
    }
</style>
