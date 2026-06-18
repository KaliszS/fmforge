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
    let newSkinTone: string = $state("");
    let newHairColor: number | null = $state(null);
    let newBirthCity: string = $state("");
    let newPosition: string = $state("");
    let newNationality: number | null = $state(null);

    let isSaving = $state(false);

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

    function updateDateYear(dateStr: string, yearInput: string): string {
        if (!dateStr || !yearInput) return dateStr;
        let separator = dateStr.includes('.') ? '.' : '/';
        const parts = dateStr.split(separator);
        if (parts.length !== 3) return dateStr;
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
            const result = await loadPlayersPage(
                0, ids.length,
                null, null, null, null, null, null, null, null, null, null, null, null, null,
                ids
            );

            const currentModified = $modifiedPlayers;
            const currentOriginals = $originalPlayers;
            const updates: { id: number, player: Player }[] = [];
            const originalsToSave: { id: number, player: Player | null }[] = [];
            const fetchedPlayersMap = new Map(result.players.map(p => [p.id, p.player]));

            ids.forEach(id => {
                let playerToUpdate: Player | null = null;
                if (currentModified.has(id)) {
                    const mod = currentModified.get(id);
                    if (mod) playerToUpdate = JSON.parse(JSON.stringify(mod));
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
            caInput = ""; paInput = ""; heightInput = ""; weightInput = ""; birthYearInput = "";
            newClubId = null; newFavClubId = null; newFavNumber = "";
            newPreferredFoot = null; newEthnicity = null; newSkinTone = "";
            newHairColor = null; newBirthCity = ""; newPosition = ""; newNationality = null;
        } catch (e) {
            console.error("Mass edit failed", e);
            alert("Failed to apply mass edit.");
        } finally {
            isSaving = false;
        }
    }

    const countryOptions = Object.entries(countryMap).sort((a, b) => a[1].name.localeCompare(b[1].name));
    const positionOptions = Object.entries(POSITION_MAP).map(([key, val]) => ({ key, label: val.label }));
</script>

{#if isOpen}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="modal-backdrop" onclick={onClose} role="presentation">
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
                    <div class="section-title full-width">Identity</div>

                    <div class="form-group">
                        <label for="position-select">Position</label>
                        <select id="position-select" bind:value={newPosition} class="form-input">
                            <option value="">No Change</option>
                            {#each positionOptions as p}
                                <option value={p.key}>{p.label}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="birth-year-input">Birth Year</label>
                        <input id="birth-year-input" type="text" bind:value={birthYearInput} placeholder="e.g. 2000 or +1" class="form-input" />
                    </div>

                    <div class="form-group">
                        <label for="birth-city-input">Birth City</label>
                        <input id="birth-city-input" type="text" bind:value={newBirthCity} placeholder="City name" class="form-input" />
                    </div>

                    <div class="form-group">
                        <label for="nationality-select">Nationality</label>
                        <select id="nationality-select" bind:value={newNationality} class="form-input">
                            <option value={null}>No Change</option>
                            {#each countryOptions as [id, c]}
                                <option value={+id}>{c.name}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="section-title full-width">Football</div>

                    <div class="form-group full-width">
                        <label for="club-select">Transfer to Club</label>
                        <ClubSelect bind:value={newClubId} placeholder="Select destination club..." />
                    </div>

                    <div class="form-group full-width">
                        <label for="fav-club-select">Set Favourite Club</label>
                        <ClubSelect bind:value={newFavClubId} placeholder="Select favourite club..." />
                    </div>

                    <div class="form-group">
                        <label for="foot-select">Preferred Foot</label>
                        <select id="foot-select" bind:value={newPreferredFoot} class="form-input">
                            <option value={null}>No Change</option>
                            {#each FOOT_OPTIONS as foot}
                                <option value={foot.value}>{foot.label}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="fav-number-input">Favourite Number</label>
                        <input id="fav-number-input" type="number" bind:value={newFavNumber} placeholder="1-99" class="form-input" />
                    </div>

                    <div class="form-group">
                        <label for="ca-input">Current Ability (CA)</label>
                        <input id="ca-input" type="text" bind:value={caInput} placeholder="e.g. 140 or +5" class="form-input" />
                    </div>

                    <div class="form-group">
                        <label for="pa-input">Potential Ability (PA)</label>
                        <input id="pa-input" type="text" bind:value={paInput} placeholder="e.g. 160 or -2" class="form-input" />
                    </div>

                    <div class="section-title full-width">Physical</div>

                    <div class="form-group">
                        <label for="height-input">Height (cm)</label>
                        <input id="height-input" type="text" bind:value={heightInput} placeholder="e.g. 185 or +1" class="form-input" />
                    </div>

                    <div class="form-group">
                        <label for="weight-input">Weight (kg)</label>
                        <input id="weight-input" type="text" bind:value={weightInput} placeholder="e.g. 75 or -3" class="form-input" />
                    </div>

                    <div class="form-group">
                        <label for="skin-input">Skin Tone (1-20)</label>
                        <input id="skin-input" type="text" bind:value={newSkinTone} placeholder="e.g. 10" class="form-input" />
                    </div>

                    <div class="form-group">
                        <label for="ethnicity-select">Ethnicity</label>
                        <select id="ethnicity-select" bind:value={newEthnicity} class="form-input">
                            <option value={null}>No Change</option>
                            {#each Array.from(ETHNICITY_MAP.entries()) as [id, e]}
                                <option value={id}>{e.title}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="hair-select">Hair Color</label>
                        <select id="hair-select" bind:value={newHairColor} class="form-input">
                            <option value={null}>No Change</option>
                            {#each HAIR_COLORS as hc}
                                <option value={hc.id}>{hc.label}</option>
                            {/each}
                        </select>
                    </div>
                </div>
            </div>

            <footer class="modal-footer">
                <button class="btn-secondary" onclick={onClose} disabled={isSaving}>Cancel</button>
                <button class="btn-primary" onclick={handleSave} disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Apply Changes'}
                </button>
            </footer>
        </div>
    </div>
{/if}

<style>
    .modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        backdrop-filter: blur(2px);
    }

    .modal-content {
        background: var(--color-background-light);
        border-radius: var(--radius-xl);
        width: 90%;
        max-width: 600px;
        box-shadow: 0 10px 25px var(--color-shadow);
        border: 1px solid var(--color-border);
        display: flex;
        flex-direction: column;
        max-height: 90vh;
    }

    .modal-header {
        padding: var(--spacing-lg) var(--spacing-xl);
        border-bottom: 1px solid var(--color-border);
    }

    .modal-header h2 {
        margin: 0;
        font-size: var(--font-lg);
        color: var(--color-text);
    }

    .subtitle {
        font-size: var(--font-sm);
        color: var(--color-text-muted);
        margin-top: var(--spacing-xs);
        display: block;
    }

    .modal-body {
        padding: var(--spacing-xl);
        overflow-y: auto;
    }

    .info-box {
        background: var(--color-background);
        padding: var(--spacing-md);
        border-radius: var(--radius-md);
        margin-bottom: var(--spacing-lg);
        font-size: var(--font-sm);
        color: var(--color-text-secondary);
        border-left: 3px solid var(--color-primary);
    }

    .info-box p {
        margin: 0;
    }

    .info-box code {
        background: var(--color-background-hover);
        padding: 2px 4px;
        border-radius: var(--radius-sm);
        font-family: monospace;
    }

    .form-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: var(--spacing-lg);
    }

    .section-title {
        font-size: var(--font-sm);
        font-weight: 600;
        color: var(--color-primary);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-top: var(--spacing-sm);
        padding-bottom: var(--spacing-xs);
        border-bottom: 1px solid var(--color-border);
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
    }

    .full-width {
        grid-column: 1 / -1;
    }

    label {
        font-size: var(--font-sm);
        font-weight: 500;
        color: var(--color-text-secondary);
    }

    .form-input {
        background: var(--color-background);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        padding: var(--spacing-sm) var(--spacing-md);
        color: var(--color-text);
        font-size: var(--font-sm);
        transition: border-color var(--transition-fast);
        width: 100%;
        box-sizing: border-box;
    }

    .form-input:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 2px var(--color-primary-light);
    }

    .modal-footer {
        padding: var(--spacing-md) var(--spacing-xl);
        border-top: 1px solid var(--color-border);
        display: flex;
        justify-content: flex-end;
        gap: var(--spacing-md);
        background: var(--color-background-light);
        border-bottom-left-radius: var(--radius-xl);
        border-bottom-right-radius: var(--radius-xl);
    }

    .btn-secondary {
        padding: var(--spacing-sm) var(--spacing-lg);
        border-radius: var(--radius-md);
        font-weight: 500;
        font-size: var(--font-sm);
        cursor: pointer;
        transition: all var(--transition-fast);
        background: transparent;
        color: var(--color-text-secondary);
        border: 1px solid var(--color-border);
    }

    .btn-secondary:hover {
        background: var(--color-background-hover);
        color: var(--color-text);
    }

    .btn-primary {
        padding: var(--spacing-sm) var(--spacing-lg);
        border-radius: var(--radius-md);
        font-weight: 500;
        font-size: var(--font-sm);
        cursor: pointer;
        transition: all var(--transition-fast);
        background: var(--color-primary);
        color: white;
        border: none;
    }

    .btn-primary:hover {
        background: var(--color-primary-hover);
    }

    .btn-primary:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }
</style>
