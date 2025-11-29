<script lang="ts">
    import { selectFileAndLoad, selectSaveFile, savePlayersToFile, getProblematicRows } from "$lib/api/file";
    import { removePlayer, updatePlayers } from "$lib/api/player";
    import type { PlayerRecord } from "$lib/types";
    import ThemeToggle from "./ThemeToggle.svelte";
    import ModSettings from "./ModSettings.svelte";
    import { clearAllEditedPlayers, clearEditedPlayersStore, editedCount, modifiedPlayers } from "$lib/stores/editedPlayers";

    let {
        players = $bindable(),
        currentPage = $bindable(),
        pageSize = $bindable(),
        selectedCountry = $bindable(),
        selectedClub = $bindable(),
        minCA = $bindable(),
        maxCA = $bindable(),
        minPA = $bindable(),
        maxPA = $bindable(),
        preferredFoot = $bindable(),
        favouriteNumber = $bindable(),
        birthYear = $bindable(),
        effectiveBirthYear = $bindable(),
        nameQuery = $bindable(),
        sortBy = $bindable(),
        problematicRows = $bindable(),
        showProblematicDetails = $bindable(),
        isLastPage = $bindable(),
        triggerRefresh,
    }: {
        players: PlayerRecord[];
        currentPage: number;
        pageSize: number;
        selectedCountry: number | null;
        selectedClub: number | null;
        minCA: number | null;
        maxCA: number | null;
        minPA: number | null;
        maxPA: number | null;
        preferredFoot: number | null;
        favouriteNumber: number | null;
        birthYear: number | null;
        effectiveBirthYear: number | null;
        nameQuery: string | null;
        sortBy: string[] | null;
        problematicRows: number[];
        showProblematicDetails: boolean;
        isLastPage: boolean;
        triggerRefresh: () => void;
    } = $props();

    let source_path = $state("");
    let save_path = $state("");

    async function selectSaveLocation() {
        const path = await selectSaveFile();
        if (path) {
            save_path = path;
            alert(`Save location set to: ${path}`);
        }
    }

    async function saveToFile() {
        //  remove deleted players from backend
        for (const [id, player] of $modifiedPlayers) {
            if (player === null) {
                await removePlayer(id);
            }
        }
        
        // process additions and modifications
        const playersToUpdate: PlayerRecord[] = [];
        for (const [id, player] of $modifiedPlayers) {
            if (player !== null) {
                playersToUpdate.push({ id, player });
            }
        }
        
        if (playersToUpdate.length > 0) {
            await updatePlayers(playersToUpdate);
        }
        
        await savePlayersToFile(save_path);
        
        clearEditedPlayersStore();
        
        triggerRefresh();
    }

    async function selectFile() {
        const path = await selectFileAndLoad();
        if (path) {
            source_path = path;
            save_path = path;
            
            clearAllEditedPlayers();
            
            setTimeout(async () => {
                problematicRows = await getProblematicRows();
            }, 100);
            
            currentPage = 0;
        }
    }
</script>

<section class="top-bar">
    <div class="top-bar-left">
        <button class="btn" onclick={selectFile}>Load file</button>
    </div>
    
    <div class="top-bar-center">
        <div class="file-actions">
            <button 
                class="btn-save" 
                class:has-edits={$editedCount > 0}
                onclick={saveToFile} 
                disabled={!save_path}
                title={!save_path ? "Please select a save location first" : "Save changes to file"}
            >
                <span class="icon">💾</span>
                <span class="label">Save</span>
                {#if $editedCount > 0}
                    <span class="count-badge">{$editedCount}</span>
                {/if}
            </button>

            <button class="file-location" onclick={selectSaveLocation} title={save_path || "Click to choose save location"}>
                <span class="icon">📁</span>
                <div class="file-info">
                    <span class="label">Target File</span>
                    <span class="filename">
                        {save_path ? save_path.split(/[/\\]/).pop() : "Select file..."}
                    </span>
                </div>
                <span class="edit-icon">▼</span>
            </button>
        </div>
        <ModSettings />
    </div>
    
    <div class="top-bar-right">
        <div class="controls-group">
            <div class="page-size-control">
                <label for="pageSizeInput" class="label">Players per page:</label>
                <input
                    id="pageSizeInput"
                    type="number"
                    min="1"
                    bind:value={pageSize}
                    class="input input-number page-size-input"
                />
            </div>
            <ThemeToggle />
        </div>
    </div>
</section>

<style>
    .top-bar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        padding: var(--spacing-sm) var(--spacing-md);
        background-color: var(--color-background);
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: var(--spacing-md);
        box-shadow: 0 0.1875rem 0.5rem var(--color-shadow);
        min-height: 4rem;
        z-index: 1000;
    }

    .top-bar-left {
        display: flex;
        gap: var(--spacing-sm);
        align-items: center;
    }

    .top-bar-center {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
    }

    .top-bar-right {
        display: flex;
        align-items: center;
        min-width: 12rem;
    }

    .controls-group {
        display: flex;
        flex-direction: row;
        gap: var(--spacing-lg);
        align-items: center;
        width: 100%;
        justify-content: flex-end;
    }

    .page-size-control {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        background-color: var(--color-background-light);
        padding: 4px 12px;
        border-radius: var(--radius-md);
        border: 1px solid var(--color-border);
    }

    .page-size-control .label {
        font-size: 0.7rem;
        text-transform: uppercase;
        color: var(--color-text-muted);
        font-weight: 600;
        letter-spacing: 0.5px;
        margin: 0;
    }

    .page-size-input {
        width: 3.5rem;
        text-align: center;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        padding: 2px 4px;
        font-size: var(--font-sm);
        font-weight: 600;
        background-color: var(--color-background);
        color: var(--color-text);
    }

    .page-size-input:focus {
        border-color: var(--color-primary);
        outline: none;
        box-shadow: 0 0 0 2px var(--color-shadow-primary);
    }

    .file-actions {
        display: flex;
        align-items: stretch;
        gap: var(--spacing-sm);
        background-color: var(--color-background-light);
        padding: 4px;
        border-radius: var(--radius-md);
        border: 1px solid var(--color-border);
        margin-right: var(--spacing-lg);
    }

    .btn-save {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        padding: var(--spacing-xs) var(--spacing-md);
        background-color: var(--color-background);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        color: var(--color-text);
        font-weight: 600;
        font-size: var(--font-sm);
        cursor: pointer;
        transition: all 0.2s ease;
        position: relative;
    }

    .btn-save:hover:not(:disabled) {
        background-color: var(--color-background-hover);
        border-color: var(--color-primary);
        color: var(--color-primary);
    }

    .btn-save:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background-color: var(--color-background-light);
    }

    .btn-save .icon {
        font-size: 1.1em;
    }

    .btn-save.has-edits {
        background: var(--color-primary);
        color: white !important;
        border-color: var(--color-primary-hover);
        box-shadow: 0 2px 4px var(--color-shadow-primary);
    }

    /* Force white text on children elements to override global styles */
    .btn-save.has-edits .label,
    .btn-save.has-edits .icon {
        color: white !important;
    }

    .btn-save.has-edits:hover {
        background: var(--color-primary-hover);
        color: white !important;
        transform: translateY(-1px);
        box-shadow: 0 4px 8px var(--color-shadow-primary);
    }

    .count-badge {
        background-color: white;
        color: var(--color-primary);
        font-size: 0.75em;
        padding: 1px 5px;
        border-radius: 10px;
        font-weight: 800;
        margin-left: 4px;
    }

    .file-location {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-xs) var(--spacing-md);
        background-color: var(--color-background);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        cursor: pointer;
        text-align: left;
        min-width: 180px;
        max-width: 240px;
        transition: all 0.2s ease;
    }

    .file-location:hover {
        background-color: var(--color-background-hover);
        border-color: var(--color-text-muted);
    }

    .file-info {
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
    }

    .file-info .label {
        font-size: 0.65rem;
        text-transform: uppercase;
        color: var(--color-text-muted);
        font-weight: 600;
        letter-spacing: 0.5px;
        line-height: 1;
        margin-bottom: 2px;
    }

    .file-info .filename {
        font-size: var(--font-sm);
        font-weight: 500;
        color: var(--color-text);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .file-location .edit-icon {
        font-size: 0.7em;
        color: var(--color-text-muted);
        opacity: 0.5;
    }

    .file-location:hover .edit-icon {
        opacity: 1;
    }
</style>