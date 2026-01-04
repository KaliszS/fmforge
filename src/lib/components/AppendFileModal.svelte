<script lang="ts">
    import { appendPlayersFromFile } from "$lib/api/file";
    import { modSettings } from "$lib/stores/modSettings";

    let {
        isOpen = $bindable(),
        onSuccess
    }: {
        isOpen: boolean;
        onSuccess: (count: number) => void;
    } = $props();

    // Source file settings (the file being appended)
    let sourceGameYear = $state(2024);
    let sourceModYear = $state(1986);

    // Target settings (current database) - derived from modSettings
    let targetGameYear = $derived(parseInt($modSettings.fmEdition) || 2024);
    let targetModYear = $derived(parseInt($modSettings.retroYear) || 1986);

    let loading = $state(false);
    let error = $state<string | null>(null);

    async function handleAppend() {
        loading = true;
        error = null;
        
        try {
            const count = await appendPlayersFromFile(
                sourceGameYear,
                sourceModYear,
                targetGameYear,
                targetModYear
            );
            
            if (count !== null) {
                onSuccess(count);
                isOpen = false;
            }
        } catch (e) {
            error = e instanceof Error ? e.message : 'Failed to append file';
        } finally {
            loading = false;
        }
    }

    function handleClose() {
        isOpen = false;
        error = null;
    }

    function handleBackdropClick(e: MouseEvent) {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    }

    function handleKeydown(e: KeyboardEvent) {
        if (e.key === 'Escape') {
            handleClose();
        }
    }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if isOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_interactive_supports_focus -->
    <div class="modal-backdrop" onclick={handleBackdropClick} role="dialog" aria-modal="true">
        <div class="modal">
            <div class="modal-header">
                <h2>Append Players from File</h2>
                <button class="close-btn" onclick={handleClose} aria-label="Close">×</button>
            </div>
            
            <div class="modal-body">
                <p class="description">
                    Add players from another file to your current database. 
                    Birth dates will be automatically converted to match your current mod settings.
                </p>

                <div class="settings-row">
                    <div class="settings-group">
                        <h3>📁 Source File Settings</h3>
                        <p class="hint">Settings of the file you want to append</p>
                        
                        <div class="input-group">
                            <label for="source-game-year">FM Edition</label>
                            <input 
                                type="number" 
                                id="source-game-year"
                                bind:value={sourceGameYear}
                                min="2000"
                                max="2030"
                            />
                        </div>
                        
                        <div class="input-group">
                            <label for="source-mod-year">Mod Year</label>
                            <input 
                                type="number" 
                                id="source-mod-year"
                                bind:value={sourceModYear}
                                min="1900"
                                max="2030"
                            />
                        </div>
                    </div>

                    <div class="arrow">→</div>

                    <div class="settings-group target">
                        <h3>🎯 Target (Current Database)</h3>
                        <p class="hint">Your current mod settings</p>
                        
                        <div class="input-group">
                            <span class="readonly-label">FM Edition</span>
                            <div class="readonly-value">{targetGameYear}</div>
                        </div>
                        
                        <div class="input-group">
                            <span class="readonly-label">Mod Year</span>
                            <div class="readonly-value">{targetModYear}</div>
                        </div>
                    </div>
                </div>

                <div class="conversion-preview">
                    <span class="label">Year offset:</span>
                    <span class="value">
                        {(targetGameYear - targetModYear) - (sourceGameYear - sourceModYear)}
                    </span>
                    <span class="explanation">
                        (e.g. 1960 → {1960 + (targetGameYear - targetModYear) - (sourceGameYear - sourceModYear)})
                    </span>
                </div>

                {#if error}
                    <div class="error-message">{error}</div>
                {/if}
            </div>

            <div class="modal-footer">
                <button class="btn-cancel" onclick={handleClose} disabled={loading}>
                    Cancel
                </button>
                <button class="btn-append" onclick={handleAppend} disabled={loading}>
                    {#if loading}
                        <span class="spinner"></span>
                        Appending...
                    {:else}
                        📂 Select File & Append
                    {/if}
                </button>
            </div>
        </div>
    </div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        backdrop-filter: blur(4px);
    }

    .modal {
        background: var(--color-background);
        border-radius: 12px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        width: 90%;
        max-width: 600px;
        overflow: hidden;
        border: 1px solid var(--color-border);
    }

    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.5rem;
        border-bottom: 1px solid var(--color-border);
        background: var(--color-background-light);
    }

    .modal-header h2 {
        margin: 0;
        font-size: 1.25rem;
        color: var(--color-text);
    }

    .close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: var(--color-text-muted);
        cursor: pointer;
        padding: 0.25rem 0.5rem;
        line-height: 1;
        border-radius: 4px;
        transition: all 0.2s;
    }

    .close-btn:hover {
        background: var(--color-background-hover);
        color: var(--color-text);
    }

    .modal-body {
        padding: 1.5rem;
        background: var(--color-background);
    }

    .description {
        margin: 0 0 1.5rem;
        color: var(--color-text-muted);
        font-size: 0.9rem;
        line-height: 1.5;
    }

    .settings-row {
        display: flex;
        gap: 1rem;
        align-items: center;
        margin-bottom: 1.5rem;
    }

    .arrow {
        font-size: 1.5rem;
        color: var(--color-text-muted);
        flex-shrink: 0;
    }

    .settings-group {
        flex: 1;
        background: var(--color-background-light);
        border-radius: 8px;
        padding: 1rem;
        border: 1px solid var(--color-border);
    }

    .settings-group.target {
        background: var(--color-background-page);
        border-color: var(--color-primary);
    }

    .settings-group h3 {
        margin: 0 0 0.25rem;
        font-size: 0.95rem;
        color: var(--color-text);
    }

    .settings-group .hint {
        margin: 0 0 1rem;
        font-size: 0.75rem;
        color: var(--color-text-muted);
    }

    .input-group {
        margin-bottom: 0.75rem;
    }

    .input-group:last-child {
        margin-bottom: 0;
    }

    .input-group label,
    .input-group .readonly-label {
        display: block;
        font-size: 0.8rem;
        color: var(--color-text-muted);
        margin-bottom: 0.25rem;
    }

    .input-group input {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid var(--color-border);
        border-radius: 4px;
        background: var(--color-background);
        color: var(--color-text);
        font-size: 0.9rem;
    }

    .input-group input:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 2px var(--color-primary-light);
    }

    .readonly-value {
        padding: 0.5rem;
        background: var(--color-background);
        border: 1px solid var(--color-border);
        border-radius: 4px;
        color: var(--color-text);
        font-size: 0.9rem;
    }

    .conversion-preview {
        background: var(--color-background-light);
        border: 1px solid var(--color-border);
        border-radius: 6px;
        padding: 0.75rem 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.85rem;
    }

    .conversion-preview .label {
        color: var(--color-text-muted);
    }

    .conversion-preview .value {
        font-weight: 600;
        color: var(--color-primary);
    }

    .conversion-preview .explanation {
        color: var(--color-text-muted);
        font-size: 0.8rem;
    }

    .error-message {
        margin-top: 1rem;
        padding: 0.75rem;
        background: rgba(239, 68, 68, 0.1);
        border: 1px solid rgba(239, 68, 68, 0.3);
        border-radius: 6px;
        color: var(--color-delete);
        font-size: 0.85rem;
    }

    .modal-footer {
        display: flex;
        justify-content: flex-end;
        gap: 0.75rem;
        padding: 1rem 1.5rem;
        border-top: 1px solid var(--color-border);
        background: var(--color-background-light);
    }

    .btn-cancel,
    .btn-append {
        padding: 0.6rem 1.25rem;
        border-radius: 6px;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
    }

    .btn-cancel {
        background: var(--color-background);
        border: 1px solid var(--color-border);
        color: var(--color-text-muted);
    }

    .btn-cancel:hover:not(:disabled) {
        background: var(--color-background-hover);
        color: var(--color-text);
        border-color: var(--color-text-muted);
    }

    .btn-append {
        background: var(--color-primary);
        border: none;
        color: white;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .btn-append:hover:not(:disabled) {
        background: var(--color-primary-hover);
    }

    .btn-append:disabled,
    .btn-cancel:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .spinner {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: white;
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }
</style>
