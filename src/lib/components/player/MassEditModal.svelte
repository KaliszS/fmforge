<script lang="ts">
    import { selectedPlayers } from '$lib/stores/selectionStore';
    import { saveModifiedPlayers, saveOriginalPlayers, modifiedPlayers, originalPlayers } from '$lib/stores/editedPlayers';
    import { loadPlayersPage } from '$lib/api/player';
    import type { Player } from '$lib/types';
    import ClubSelect from '$lib/components/common/ClubSelect.svelte';
    import { ETHNICITY_MAP, HAIR_COLORS, FOOT_OPTIONS, POSITION_MAP, countryMap } from '$lib/constants';

    let { isOpen = $bindable(), onClose }: { isOpen: boolean, onClose: () => void } = $props();

    // Inputs as strings to support "+10", "-5", etc.
    let caInput = $state("");
    let paInput = $state("");
    let heightInput = $state("");
    let weightInput = $state("");
    let birthYearInput = $state("");
    
    // Absolute values
    let newClubId: number | null = $state(null);
    let newFavClubId: number | null = $state(null);
    let newFavNumber: string = $state("");
    let newPreferredFoot: number | null = $state(null);
    let newEthnicity: number | null = $state(null);
    let newSkinTone: string = $state(""); // 1-20
    let newHairColor: number | null = $state(null);
    let newBirthCity: string = $state("");
    let newPosition: string = $state("");
    let newNationality: number | null = $state(null);
    
    let isSaving = $state(false);

    // Helper for numeric values
    function parseValue(current: number, input: string, min: number, max: number): number {
        if (!input) return current;
        
        let result = current;
        const trimmed = input.trim();
        
        if (trimmed.startsWith('+')) {
            const delta = parseInt(trimmed.substring(1));
            if (!isNaN(delta)) result += delta;
        } else if (trimmed.startsWith('-')) {
            const delta = parseInt(trimmed.substring(1));
            if (!isNaN(delta)) result -= delta;
        } else {
            const val = parseInt(trimmed);
            if (!isNaN(val)) result = val;
        }
        
        return Math.max(min, Math.min(max, result));
    }

    // Helper for date year
    function updateDateYear(dateStr: string, yearInput: string): string {
        if (!dateStr || !yearInput) return dateStr;
        
        // Try to parse DD/MM/YYYY or DD.MM.YYYY
        let separator = '/';
        if (dateStr.includes('.')) separator = '.';
        
        const parts = dateStr.split(separator);
        if (parts.length !== 3) return dateStr; // Unknown format
        
        let year = parseInt(parts[2]);
        if (isNaN(year)) return dateStr;
        
        const trimmed = yearInput.trim();
        if (trimmed.startsWith('+')) {
            const delta = parseInt(trimmed.substring(1));
            if (!isNaN(delta)) year += delta;
        } else if (trimmed.startsWith('-')) {
            const delta = parseInt(trimmed.substring(1));
            if (!isNaN(delta)) year -= delta;
        } else {
            const val = parseInt(trimmed);
            if (!isNaN(val)) year = val;
        }
        
        return `${parts[0]}${separator}${parts[1]}${separator}${year}`;
    }

    async function handleSave() {
        if (isSaving) return;
        isSaving = true;
        
        try {
            const ids = Array.from($selectedPlayers);
            
            // Fetch all selected players to ensure we have data
            const players = await loadPlayersPage(
                0, 
                ids.length, 
                null, null, null, null, null, null, null, null, null, null, null, 
                ids
            );
            
            const currentModified = $modifiedPlayers;
            const currentOriginals = $originalPlayers;
            
            const updates: { id: number, player: Player }[] = [];
            const originalsToSave: { id: number, player: Player | null }[] = [];
            
            const fetchedPlayersMap = new Map(players.map(p => [p.id, p.player]));

            ids.forEach(id => {
                let playerToUpdate: Player | null = null;

                // Resolve the current state of the player
                if (currentModified.has(id)) {
                    playerToUpdate = currentModified.get(id);
                } else if (currentOriginals.has(id)) {
                    const original = currentOriginals.get(id);
                    if (original) playerToUpdate = JSON.parse(JSON.stringify(original));
                } else if (fetchedPlayersMap.has(id)) {
                    const fetched = fetchedPlayersMap.get(id);
                    if (fetched) {
                        playerToUpdate = JSON.parse(JSON.stringify(fetched));
                        originalsToSave.push({ id, player: fetched });
                    }
                }

                if (playerToUpdate) {
                    // Apply changes
                    if (caInput) playerToUpdate.ca = parseValue(playerToUpdate.ca, caInput, 1, 200);
                    if (paInput) playerToUpdate.pa = parseValue(playerToUpdate.pa, paInput, 1, 200);
                    if (heightInput) playerToUpdate.height = parseValue(playerToUpdate.height, heightInput, 100, 250);
                    if (weightInput) playerToUpdate.weight = parseValue(playerToUpdate.weight, weightInput, 30, 150);
                    
                    if (birthYearInput) playerToUpdate.birth_date = updateDateYear(playerToUpdate.birth_date, birthYearInput);

                    if (newClubId !== null) playerToUpdate.club_id = newClubId;
                    if (newFavClubId !== null) playerToUpdate.favourite_team_id = newFavClubId;
                    
                    if (newFavNumber) {
                        const num = parseInt(newFavNumber);
                        if (!isNaN(num)) playerToUpdate.favourite_number = num;
                    }
                    
                    if (newPreferredFoot !== null) playerToUpdate.preferred_foot = newPreferredFoot;
                    if (newEthnicity !== null) playerToUpdate.ethnicity = newEthnicity;
                    if (newSkinTone) playerToUpdate.skin_tone = parseValue(playerToUpdate.skin_tone, newSkinTone, 1, 20);
                    if (newHairColor !== null) playerToUpdate.hair_color = newHairColor;
                    if (newBirthCity) playerToUpdate.birth_city = newBirthCity;
                    if (newPosition) playerToUpdate.position = newPosition;
                    if (newNationality !== null) playerToUpdate.nationality_id = newNationality;

                    updates.push({ id, player: playerToUpdate });
                }
            });

            if (originalsToSave.length > 0) saveOriginalPlayers(originalsToSave);
            if (updates.length > 0) saveModifiedPlayers(updates);
            
            onClose();
            // Reset fields
            caInput = "";
            paInput = "";
            heightInput = "";
            weightInput = "";
            birthYearInput = "";
            newClubId = null;
            newFavClubId = null;
            newFavNumber = "";
            newPreferredFoot = null;
            newEthnicity = null;
            newSkinTone = "";
            newHairColor = null;
            newBirthCity = "";
            newPosition = "";
            newNationality = null;
            
        } catch (e) {
            console.error("Mass edit failed", e);
            alert("Failed to apply mass edit.");
        } finally {
            isSaving = false;
        }
    }

    function handleClose() {
        onClose();
    }
    
    const countryOptions = Object.entries(countryMap).sort((a, b) => a[1].name.localeCompare(b[1].name));
    const positionOptions = Object.entries(POSITION_MAP).map(([key, val]) => ({ key, label: val.label }));
</script>

{#if isOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="modal-backdrop" onclick={handleClose} role="presentation">
        <div class="modal-content" onclick={(e) => e.stopPropagation()} role="dialog">
            <header class="modal-header">
                <h2>Mass Edit Players</h2>
                <span class="subtitle">Editing {$selectedPlayers.size} players</span>
            </header>
            
            <div class="modal-body">
                <div class="info-box">
                    <p>Enter a value to set it directly (e.g. <code>150</code>), or use <code>+</code>/<code>-</code> for relative changes (e.g. <code>+5</code>, <code>-2</code>).</p>
                </div>

                <div class="form-grid">
                    <!-- Identity -->
                    <div class="section-title full-width">Identity</div>

                    <div class="form-group">
                        <label for="position-select">Position</label>
                        <select id="position-select" bind:value={newPosition} class="text-input">
                            <option value="">No Change</option>
                            {#each positionOptions as p}
                                <option value={p.key}>{p.label}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="birth-year-input">Birth Year</label>
                        <input id="birth-year-input" type="text" bind:value={birthYearInput} placeholder="e.g. 2000 or +1" class="text-input" />
                    </div>

                    <div class="form-group">
                        <label for="birth-city-input">Birth City</label>
                        <input id="birth-city-input" type="text" bind:value={newBirthCity} placeholder="City name" class="text-input" />
                    </div>

                    <div class="form-group">
                        <label for="nationality-select">Nationality</label>
                        <select id="nationality-select" bind:value={newNationality} class="text-input">
                            <option value={null}>No Change</option>
                            {#each countryOptions as [id, c]}
                                <option value={+id}>{c.name}</option>
                            {/each}
                        </select>
                    </div>

                    <!-- Football -->
                    <div class="section-title full-width">Football</div>
                    
                    <div class="form-group full-width">
                        <label for="club-select">Transfer to Club</label>
                        <div class="club-select-wrapper">
                            <ClubSelect bind:value={newClubId} placeholder="Select destination club..." />
                        </div>
                    </div>

                    <div class="form-group full-width">
                        <label for="fav-club-select">Set Favourite Club</label>
                        <div class="club-select-wrapper">
                            <ClubSelect bind:value={newFavClubId} placeholder="Select favourite club..." />
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="foot-select">Preferred Foot</label>
                        <select id="foot-select" bind:value={newPreferredFoot} class="text-input">
                            <option value={null}>No Change</option>
                            {#each FOOT_OPTIONS as foot}
                                <option value={foot.value}>{foot.label}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="fav-number-input">Favourite Number</label>
                        <input id="fav-number-input" type="number" bind:value={newFavNumber} placeholder="1-99" class="text-input" />
                    </div>

                    <div class="form-group">
                        <label for="ca-input">Current Ability (CA)</label>
                        <input id="ca-input" type="text" bind:value={caInput} placeholder="e.g. 140 or +5" class="text-input" />
                    </div>

                    <div class="form-group">
                        <label for="pa-input">Potential Ability (PA)</label>
                        <input id="pa-input" type="text" bind:value={paInput} placeholder="e.g. 160 or -2" class="text-input" />
                    </div>

                    <!-- Physical -->
                    <div class="section-title full-width">Physical</div>

                    <div class="form-group">
                        <label for="height-input">Height (cm)</label>
                        <input id="height-input" type="text" bind:value={heightInput} placeholder="e.g. 185 or +1" class="text-input" />
                    </div>

                    <div class="form-group">
                        <label for="weight-input">Weight (kg)</label>
                        <input id="weight-input" type="text" bind:value={weightInput} placeholder="e.g. 75 or -3" class="text-input" />
                    </div>

                    <div class="form-group">
                        <label for="skin-input">Skin Tone (1-20)</label>
                        <input id="skin-input" type="text" bind:value={newSkinTone} placeholder="e.g. 10" class="text-input" />
                    </div>

                    <div class="form-group">
                        <label for="ethnicity-select">Ethnicity</label>
                        <select id="ethnicity-select" bind:value={newEthnicity} class="text-input">
                            <option value={null}>No Change</option>
                            {#each Array.from(ETHNICITY_MAP.entries()) as [id, e]}
                                <option value={id}>{e.title}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="hair-select">Hair Color</label>
                        <select id="hair-select" bind:value={newHairColor} class="text-input">
                            <option value={null}>No Change</option>
                            {#each HAIR_COLORS as hc}
                                <option value={hc.id}>{hc.label}</option>
                            {/each}
                        </select>
                    </div>
                </div>
            </div>

            <footer class="modal-footer">
                <button class="btn-secondary" onclick={handleClose} disabled={isSaving}>Cancel</button>
                <button class="btn-primary" onclick={handleSave} disabled={isSaving}>
                    {#if isSaving}
                        Saving...
                    {:else}
                        Apply Changes
                    {/if}
                </button>
            </footer>
        </div>
    </div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        backdrop-filter: blur(2px);
    }

    .modal-content {
        background: var(--bg-secondary, #1e1e1e);
        border-radius: 12px;
        width: 90%;
        max-width: 600px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
        border: 1px solid var(--border-color, #333);
        display: flex;
        flex-direction: column;
        max-height: 90vh;
    }

    .modal-header {
        padding: 20px 24px;
        border-bottom: 1px solid var(--border-color, #333);
    }

    .modal-header h2 {
        margin: 0;
        font-size: 1.25rem;
        color: var(--text-primary, #fff);
    }

    .subtitle {
        font-size: 0.875rem;
        color: var(--text-secondary, #aaa);
        margin-top: 4px;
        display: block;
    }

    .modal-body {
        padding: 24px;
        overflow-y: auto;
    }

    .info-box {
        background: var(--bg-tertiary, #2a2a2a);
        padding: 12px;
        border-radius: 6px;
        margin-bottom: 20px;
        font-size: 0.875rem;
        color: var(--text-secondary, #ccc);
        border-left: 3px solid var(--accent-color, #3b82f6);
    }

    .info-box p {
        margin: 0;
    }

    .info-box code {
        background: rgba(255, 255, 255, 0.1);
        padding: 2px 4px;
        border-radius: 4px;
        font-family: monospace;
    }

    .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 20px;
    }

    .section-title {
        font-size: 0.9rem;
        font-weight: 600;
        color: var(--accent-color, #3b82f6);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-top: 10px;
        padding-bottom: 5px;
        border-bottom: 1px solid var(--border-color, #333);
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;
    }

    .full-width {
        grid-column: 1 / -1;
    }

    label {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--text-secondary, #ccc);
    }

    .text-input {
        background: var(--bg-input, #111);
        border: 1px solid var(--border-color, #444);
        border-radius: 6px;
        padding: 10px 12px;
        color: var(--text-primary, #fff);
        font-size: 0.9rem;
        transition: border-color 0.2s;
        width: 100%;
        box-sizing: border-box;
    }

    .text-input:focus {
        outline: none;
        border-color: var(--accent-color, #3b82f6);
    }

    .club-select-wrapper {
        /* Ensure ClubSelect fits nicely */
    }

    .hint {
        font-size: 0.75rem;
        color: var(--text-muted, #666);
    }

    .modal-footer {
        padding: 16px 24px;
        border-top: 1px solid var(--border-color, #333);
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        background: var(--bg-secondary, #1e1e1e);
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
    }

    button {
        padding: 10px 20px;
        border-radius: 6px;
        font-weight: 500;
        font-size: 0.9rem;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
    }

    .btn-secondary {
        background: transparent;
        color: var(--text-secondary, #ccc);
        border: 1px solid var(--border-color, #444);
    }

    .btn-secondary:hover {
        background: var(--bg-tertiary, #333);
        color: var(--text-primary, #fff);
    }

    .btn-primary {
        background: var(--accent-color, #3b82f6);
        color: white;
    }

    .btn-primary:hover {
        background: var(--accent-hover, #2563eb);
    }

    .btn-primary:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
</style>
