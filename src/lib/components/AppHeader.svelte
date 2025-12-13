<script lang="ts">
    import { selectFileAndLoad, selectSaveFile, savePlayersToFile, getInvalidRows, type InvalidRow } from "$lib/api/file";
    import { removePlayer, updatePlayers } from "$lib/api/player";
    import type { PlayerRecord } from "$lib/types";
    import ThemeToggle from "./ThemeToggle.svelte";
    import ModSettings from "./ModSettings.svelte";
    import { clearAllEditedPlayers, clearEditedPlayersStore, editedCount, modifiedPlayers, showOnlyEdited, getModifiedPlayersAsRecords, originalPlayers } from "$lib/stores/editedPlayers";
    import { selectedPlayers, showOnlySelected, deselectAll } from "$lib/stores/selectionStore";
    import { modSettings } from "$lib/stores/modSettings";

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
        invalidRows = $bindable(),
        showInvalidDetails = $bindable(),
        isLastPage = $bindable(),
        editTypeFilter = $bindable(),
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
        invalidRows: InvalidRow[];
        showInvalidDetails: boolean;
        isLastPage: boolean;
        editTypeFilter: 'all' | 'modified' | 'added' | 'deleted';
        triggerRefresh: () => void;
    } = $props();

    let source_path = $state("");
    let save_path = $state("");
    let saveFilteredOnly = $state(false);
    let convertBirthdates = $state(false);
    
    $effect(() => {
        // When saveFilteredOnly is enabled and showOnlySelected is active, 
        // the Save button should be enabled even without edits
        void $showOnlySelected;
        void saveFilteredOnly;
    });

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
        
        let filters = null;
        if (saveFilteredOnly) {
            // Determine player_ids based on active Group 2 filters
            let playerIds: number[] | null = null;
            
            // Start with edited players if that filter is active
            if ($showOnlyEdited) {
                const allEditedPlayers = getModifiedPlayersAsRecords();
                
                if (editTypeFilter === 'all') {
                    playerIds = allEditedPlayers.map(p => p.id);
                } else {
                    // Filter by edit type
                    playerIds = allEditedPlayers.filter(record => {
                        const original = $originalPlayers.get(record.id);
                        const modified = $modifiedPlayers.get(record.id);
                        switch (editTypeFilter) {
                            case 'modified':
                                return original !== null && modified !== null;
                            case 'added':
                                return original === null && modified !== null;
                            case 'deleted':
                                return original !== null && modified === null;
                            default:
                                return true;
                        }
                    }).map(p => p.id);
                }
                console.log('[SAVE] Base: edited players (', editTypeFilter, '):', playerIds?.length);
            }
            
            // Then narrow down by selected if there are any selected players
            // (User expects selection to act as a filter for saving, even if "Show Selected" view is not active)
            if ($selectedPlayers.size > 0) {
                const selectedIds = Array.from($selectedPlayers);
                if (playerIds) {
                    // Intersection: only players that are both edited AND selected
                    playerIds = playerIds.filter(id => selectedIds.includes(id));
                    console.log('[SAVE] Narrowed by selected:', playerIds.length);
                } else {
                    // Only selected filter is active
                    playerIds = selectedIds;
                    console.log('[SAVE] Filtering by selected players:', playerIds.length);
                }
            }
            
            filters = {
                // Group 1 filters (always apply if set)
                country: selectedCountry || null,
                club: selectedClub ? selectedClub : null,
                min_ca: minCA || null,
                max_ca: maxCA || null,
                min_pa: minPA || null,
                max_pa: maxPA || null,
                preferred_foot: preferredFoot,
                favourite_number: favouriteNumber || null,
                birth_year_min: birthYear || null,
                birth_year_max: birthYear || null,
                name_query: nameQuery || null,
                sort_by: sortBy || null,
                // Group 2 filter: player IDs from selected/edited
                player_ids: playerIds,
            };
            
            console.log('[SAVE] Filters:', filters);
        } else {
            console.log('[SAVE] No filters (saveFilteredOnly = false)');
        }
        
        await savePlayersToFile(save_path, filters);
        
        clearEditedPlayersStore();
        deselectAll();
        
        triggerRefresh();
    }

    async function selectFile() {
        const fmYear = parseInt($modSettings.fmEdition);
        const modYear = parseInt($modSettings.retroYear);
        const shouldConvert = convertBirthdates && !isNaN(fmYear) && !isNaN(modYear);

        const path = await selectFileAndLoad(shouldConvert, fmYear || 0, modYear || 0);
        if (path) {
            source_path = path;
            // If multiple files are loaded, we don't set a default save path to avoid overwriting one of them by mistake
            // The user will be forced to choose a save location
            save_path = path === "Multiple files loaded" ? "" : path;
            
            clearAllEditedPlayers();
            
            setTimeout(async () => {
                invalidRows = await getInvalidRows();
            }, 100);
            
            currentPage = 0;
        }
    }

    function incrementPageSize() {
        pageSize += 1;
    }

    function decrementPageSize() {
        if (pageSize > 1) pageSize -= 1;
    }

    $effect(() => {
        if (!$modSettings.canToggle) {
            convertBirthdates = false;
        }
    });
</script>

<section class="top-bar">
    <div class="top-bar-left">
        <div class="load-group">
            <button class="btn-load-main" onclick={selectFile} title="Load one or multiple .edt files">
                <span class="icon">📂</span>
                <span class="text">Load Files</span>
            </button>
            <div 
                class="load-toggle" 
                aria-disabled={!$modSettings.canToggle}
                data-tooltip="Set FM Edition & Mod Year first"
            >
                <label class="toggle-switch small">
                    <input type="checkbox" bind:checked={convertBirthdates} disabled={!$modSettings.canToggle}>
                    <span class="slider"></span>
                </label>
                <span class="toggle-label">Convert Dates</span>
            </div>
        </div>
    </div>
    
    <div class="top-bar-center">
        <div class="file-actions">
            <div class="save-group">
                <button 
                    class="btn-save-main" 
                    class:has-edits={$editedCount > 0}
                    onclick={saveToFile} 
                    disabled={!save_path}
                    title={!save_path ? "Please select a save location first" : "Save to file"}
                >
                    <span class="icon">💾</span>
                    <span class="label">Save</span>
                    {#if $editedCount > 0}
                        <span class="count-badge">{$editedCount}</span>
                    {/if}
                </button>
                <div class="save-toggle" title="Save only filtered players">
                    <label class="toggle-switch small">
                        <input type="checkbox" bind:checked={saveFilteredOnly}>
                        <span class="slider"></span>
                    </label>
                    <span class="toggle-label">Filtered</span>
                </div>
            </div>

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
                <div class="page-size-wrapper">
                    <input
                        id="pageSizeInput"
                        type="number"
                        min="1"
                        bind:value={pageSize}
                        class="input input-number page-size-input"
                    />
                    <div class="page-size-spinners">
                        <button class="spinner-btn" onclick={incrementPageSize} aria-label="Increase">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
                        </button>
                        <button class="spinner-btn" onclick={decrementPageSize} aria-label="Decrease">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>
                        </button>
                    </div>
                </div>
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

    .load-group {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        background-color: var(--color-background);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        height: auto;
        box-shadow: 0 1px 2px var(--color-shadow-light);
        transition: all 0.2s ease;
    }

    .load-group:hover {
        border-color: var(--color-primary);
        box-shadow: 0 2px 4px var(--color-shadow-light);
    }

    .btn-load-main {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-xs);
        padding: 2px var(--spacing-md);
        background: transparent;
        border: none;
        color: var(--color-text);
        font-weight: 600;
        font-size: var(--font-sm);
        cursor: pointer;
        transition: background-color 0.2s;
        border-radius: var(--radius-md) var(--radius-md) 0 0;
        height: 22px;
    }

    .btn-load-main:hover {
        background-color: var(--color-background-hover);
        color: var(--color-primary);
    }

    .btn-load-main .icon {
        font-size: 0.9em;
    }

    .load-toggle {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: var(--spacing-xs);
        padding: 0 var(--spacing-sm);
        background-color: var(--color-background-light);
        min-width: 70px;
        cursor: default;
        border-left: none;
        border-top: 1px solid var(--color-border-light);
        position: relative;
        border-radius: 0 0 var(--radius-md) var(--radius-md);
        height: 20px;
    }

    .load-toggle[aria-disabled="true"] {
        cursor: not-allowed;
        opacity: 0.7;
    }

    /* Tooltip for disabled state */
    .load-toggle[aria-disabled="true"]:hover::after {
        content: attr(data-tooltip);
        position: absolute;
        top: 100%;
        left: 0;
        transform: none;
        margin-top: 8px;
        padding: 6px 10px;
        background-color: var(--color-background);
        color: var(--color-text);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        font-size: 0.7rem;
        white-space: nowrap;
        z-index: 9999;
        box-shadow: 0 4px 12px var(--color-shadow);
        pointer-events: none;
    }

    .toggle-switch.small {
        width: 18px;
        height: 10px;
        margin-bottom: 0;
    }
    
    .toggle-switch.small .slider:before {
        height: 6px;
        width: 6px;
        left: 2px;
        bottom: 2px;
    }
    
    .toggle-switch.small input:checked + .slider:before {
        transform: translateX(8px);
    }

    .toggle-label {
        font-size: 0.5rem;
        text-transform: uppercase;
        color: var(--color-text-muted);
        font-weight: 700;
        line-height: 1;
        white-space: nowrap;
        letter-spacing: 0.5px;
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
        padding: 4px 8px 4px 12px;
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

    .page-size-wrapper {
        display: flex;
        align-items: stretch;
        background-color: var(--color-background);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        padding: 0;
        overflow: hidden;
        height: 26px;
    }

    .page-size-input {
        width: 2.5rem;
        text-align: center;
        border: none;
        padding: 0;
        font-size: var(--font-sm);
        font-weight: 600;
        background-color: transparent;
        color: var(--color-text);
        -moz-appearance: textfield;
    }

    .page-size-input::-webkit-outer-spin-button,
    .page-size-input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    .page-size-input:focus {
        outline: none;
    }

    .page-size-spinners {
        display: flex;
        flex-direction: column;
        border-left: 1px solid var(--color-border);
        width: 16px;
    }

    .spinner-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        flex: 1;
        background: var(--color-background-light);
        border: none;
        cursor: pointer;
        color: var(--color-text-muted);
        padding: 0;
        transition: all 0.1s;
        line-height: 0;
    }

    .spinner-btn:hover {
        background-color: var(--color-background-hover);
        color: var(--color-primary);
    }

    .spinner-btn:first-child {
        border-bottom: 1px solid var(--color-border);
    }

    .spinner-btn svg {
        width: 8px;
        height: 8px;
        display: block;
    }

    .file-actions {
        display: flex;
        align-items: stretch;
        gap: var(--spacing-sm);
        margin-right: var(--spacing-lg);
    }

    .save-group {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        background-color: var(--color-background);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        height: auto;
        box-shadow: 0 1px 2px var(--color-shadow-light);
        transition: all 0.2s ease;
    }

    .save-group:hover {
        border-color: var(--color-primary);
        box-shadow: 0 2px 4px var(--color-shadow-light);
    }

    .btn-save-main {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-xs);
        padding: 2px var(--spacing-md);
        background: transparent;
        border: none;
        color: var(--color-text);
        font-weight: 600;
        font-size: var(--font-sm);
        cursor: pointer;
        transition: all 0.2s ease;
        border-radius: var(--radius-md) var(--radius-md) 0 0;
        height: 22px;
        position: relative;
    }

    .btn-save-main:hover:not(:disabled) {
        background-color: var(--color-background-hover);
        color: var(--color-primary);
    }

    .btn-save-main:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background-color: var(--color-background-light);
    }

    .btn-save-main .icon {
        font-size: 0.9em;
    }

    .btn-save-main.has-edits {
        background: var(--color-primary);
        color: white !important;
    }

    /* Force white text on children elements to override global styles */
    .btn-save-main.has-edits .label,
    .btn-save-main.has-edits .icon {
        color: white !important;
    }

    .btn-save-main.has-edits:hover {
        background: var(--color-primary-hover);
        color: white !important;
    }

    .save-toggle {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        gap: var(--spacing-xs);
        padding: 0 var(--spacing-sm);
        background-color: var(--color-background-light);
        min-width: 70px;
        cursor: default;
        border-left: none;
        border-top: 1px solid var(--color-border-light);
        position: relative;
        border-radius: 0 0 var(--radius-md) var(--radius-md);
        height: 20px;
    }

    .toggle-switch {
        position: relative;
        display: inline-block;
        width: 28px;
        height: 16px;
    }

    .toggle-switch input {
        opacity: 0;
        width: 0;
        height: 0;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var(--color-border);
        transition: .4s;
        border-radius: 16px;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 12px;
        width: 12px;
        left: 2px;
        bottom: 2px;
        background-color: white;
        transition: .4s;
        border-radius: 50%;
    }

    input:checked + .slider {
        background-color: var(--color-primary);
    }

    input:focus + .slider {
        box-shadow: 0 0 1px var(--color-primary);
    }

    input:checked + .slider:before {
        transform: translateX(12px);
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