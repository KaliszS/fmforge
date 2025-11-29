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
        <div class="save-section">
            <div class="save-buttons">
                <button class="btn btn-sm" onclick={selectSaveLocation}>Choose save location</button>
                <button 
                    class="btn btn-sm" 
                    class:has-edits={$editedCount > 0}
                    onclick={saveToFile} 
                    disabled={!save_path}
                >
                    Save changes
                    {#if $editedCount > 0}
                        <span class="edit-count">({$editedCount})</span>
                    {/if}
                </button>
            </div>
            {#if save_path}
                <div class="save-path-info">
                    <span class="save-label">Save to:</span>
                    <span class="save-path">{save_path}</span>
                </div>
            {/if}
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
        flex-direction: column;
        gap: var(--spacing-xs);
        align-items: center;
    }

    .save-section {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
        align-items: center;
    }

    .save-buttons {
        display: flex;
        gap: var(--spacing-sm);
        align-items: center;
    }

    .page-size-input {
        width: 4rem;
    }

    .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background-color: var(--color-background-light);
        color: var(--color-text-muted);
    }

    .btn-sm {
        padding: var(--spacing-xs) var(--spacing-sm);
        font-size: var(--font-sm);
        min-height: auto;
    }

    .save-path-info {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: var(--spacing-sm);
        max-width: 20rem;
    }

    .save-label {
        font-size: var(--font-xs);
        color: var(--color-text-muted);
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .save-path {
        font-size: var(--font-xs);
        color: var(--color-primary);
        background-color: var(--color-background-light);
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--radius-sm);
        border: 1px solid var(--color-primary);
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: right;
        font-weight: 500;
        box-shadow: 0 1px 3px var(--color-shadow-light);
    }

    .btn.has-edits {
        background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
        color: white;
        font-weight: 700;
        font-size: var(--font-sm);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        box-shadow: 0 0.25rem 1rem var(--color-shadow-primary);
        border: 2px solid var(--color-primary);
        animation: pulse 1.5s infinite;
        position: relative;
        overflow: hidden;
    }

    .btn.has-edits::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
        animation: shine 2s infinite;
    }

    .btn.has-edits:hover {
        background: linear-gradient(135deg, var(--color-primary-hover) 0%, var(--color-primary) 100%);
        transform: translateY(-2px) scale(1.05);
        box-shadow: 0 0.5rem 1.5rem var(--color-shadow-primary);
    }

    .edit-count {
        margin-left: var(--spacing-xs);
        font-size: var(--font-xs);
        opacity: 0.9;
    }

    @keyframes pulse {
        0%, 100% {
            box-shadow: 0 0.25rem 1rem var(--color-shadow-primary);
        }
        50% {
            box-shadow: 0 0.5rem 1.5rem var(--color-shadow-primary), 0 0 0 0.5rem rgba(var(--color-primary-rgb), 0.4);
        }
    }

    @keyframes shine {
        0% {
            left: -100%;
        }
        100% {
            left: 100%;
        }
    }
</style>