<script lang="ts">
    import type { Player } from "$lib/types";
    import { addNewPlayer } from "$lib/api/player";
    import { addNewPlayerToStore } from "$lib/stores/editedPlayers";
    import Citizenship from "./player/Citizenship.svelte";
    import Personal from "./player/Personal.svelte";
    import Ability from "./player/Ability.svelte";
    import Club from "./player/Club.svelte";
    import FootNumber from "./player/FootNumber.svelte";
    import Appearance from "./player/Appearance.svelte";

    let isAdding = $state(false);
    let newPlayer: Player = $state({
        record_type: "DETAILED_FUTURE_REGEN",
        first_name: "",
        common_name: "",
        last_name: "",
        birth_date: "",
        nationality_id: -1,
        favourite_team_id: undefined,
        ethnicity: -1,
        skin_tone: -1,
        hair_color: -1,
        height: 0,
        weight: 0,
        preferred_foot: 0,
        position: "",
        favourite_number: undefined,
        birth_city: "",
        ca: 0,
        pa: 0,
        club_id: 0,
    });

    // Required fields for validation
    const requiredFields = [
        'first_name',
        'last_name', 
        'birth_date',
        'nationality_id',
        'ethnicity',
        'skin_tone',
        'hair_color',
        'height',
        'weight',
        'preferred_foot',
        'position',
        'ca',
        'pa',
        'club_id'
    ];

    let isValid = $derived(() => {
        const validationResults = requiredFields.map(field => {
            const value = newPlayer[field as keyof Player];
            let isValidField = false;
            
            if (field === 'height' || field === 'weight' || field === 'ca' || field === 'pa' || field === 'club_id' || field === 'preferred_foot') {
                isValidField = value !== undefined && value !== null && value !== -1;
            } else {
                isValidField = value !== undefined && value !== null && value !== "" && value !== -1;
            }
            
            if (!isValidField) {
                console.log(`Field ${field} is invalid:`, value);
            }
            
            return isValidField;
        });
        
        const allValid = validationResults.every(result => result);
        console.log('Validation results:', validationResults);
        console.log('All valid:', allValid);
        
        return allValid;
    });

    function startAdding() {
        isAdding = true;
    }

    function cancelAdding() {
        isAdding = false;
        // Reset form
        newPlayer = {
            record_type: "DETAILED_FUTURE_REGEN",
            first_name: "",
            common_name: "",
            last_name: "",
            birth_date: "",
            nationality_id: -1,
            favourite_team_id: undefined,
            ethnicity: -1,
            skin_tone: -1,
            hair_color: -1,
            height: 0,
            weight: 0,
            preferred_foot: 0,
            position: "",
            favourite_number: undefined,
            birth_city: "",
            ca: 0,
            pa: 0,
            club_id: 0,
        };
    }

    async function saveNewPlayer() {
        if (!isValid) return;
        
        try {
            const newId = await addNewPlayer();
            addNewPlayerToStore(newId, newPlayer);
            cancelAdding();
        } catch (error) {
            console.error("Error adding new player:", error);
            alert("Error adding new player. Please try again.");
        }
    }
</script>

<article class="add-player-row">
    {#if isAdding}
        <div class="add-player-form">
            <div class="form-fields">
                <Citizenship bind:nation={newPlayer.nationality_id} edit_mode={true} />
                <Personal
                    bind:first_name={newPlayer.first_name}
                    bind:common_name={newPlayer.common_name}
                    bind:last_name={newPlayer.last_name}
                    bind:birthdate={newPlayer.birth_date}
                    bind:position={newPlayer.position}
                    edit_mode={true}
                />
                <Ability bind:ca={newPlayer.ca} bind:pa={newPlayer.pa} edit_mode={true} />
                <Club bind:club_id={newPlayer.club_id} bind:favourite_team_id={newPlayer.favourite_team_id} edit_mode={true} />
                <FootNumber bind:preferred_foot={newPlayer.preferred_foot} bind:favourite_number={newPlayer.favourite_number} edit_mode={true} />
                <Appearance 
                    bind:ethnicity={newPlayer.ethnicity}
                    bind:skin_tone={newPlayer.skin_tone}
                    bind:hair_color={newPlayer.hair_color}
                    bind:height={newPlayer.height}
                    bind:weight={newPlayer.weight}
                    edit_mode={true}
                />
            </div>
            <div class="form-actions">
                <button class="btn btn-sm" onclick={cancelAdding}>Cancel</button>
                <button 
                    class="btn btn-sm" 
                    class:disabled={!isValid}
                    onclick={saveNewPlayer}
                    disabled={!isValid}
                >
                    Save
                </button>
            </div>
        </div>
    {:else}
        <div class="add-player-content">
            <button class="add-player-btn" type="button" onclick={startAdding}>
                <span class="add-icon">+</span>
                <span class="add-text">Add</span>
            </button>
        </div>
    {/if}
</article>

<style>
    .add-player-row {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: var(--spacing-xs) var(--spacing-lg);
        border-bottom: 2px dashed var(--color-border);
        background-color: var(--color-background-light);
        transition: background-color var(--transition-fast);
        position: relative;
        min-height: 2rem;
    }

    .add-player-row:hover:not(.adding) {
        background-color: var(--color-background-hover);
    }

    .add-player-content {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
    }

    .add-player-form {
        width: 100%;
        padding: var(--spacing-md);
    }

    .form-fields {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-md);
        align-items: center;
        margin-bottom: var(--spacing-md);
    }

    .form-actions {
        display: flex;
        justify-content: center;
        gap: var(--spacing-md);
    }

    .btn.disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background-color: var(--color-background-light);
        color: var(--color-text-muted);
    }

    .add-player-btn {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        padding: var(--spacing-xs) var(--spacing-md);
        border: .1rem dashed var(--color-primary);
        border-radius: var(--radius-md);
        background-color: transparent;
        color: var(--color-primary);
        font-size: var(--font-sm);
        font-weight: 600;
        cursor: pointer;
        transition: all var(--transition-normal);
        text-transform: uppercase;
        letter-spacing: 0.5px;
        min-height: 1.5rem;
    }

    .add-player-btn:hover {
        background-color: var(--color-primary-light);
        border-color: var(--color-primary-hover);
        color: var(--color-primary-hover);
        transform: scale(1.02);
        box-shadow: 0 0.25rem 0.75rem var(--color-shadow-primary);
    }

    .add-player-btn:active {
        transform: scale(0.98);
        box-shadow: 0 0.125rem 0.375rem var(--color-shadow-primary);
    }

    .add-icon {
        font-size: 1.4em;
        font-weight: 700;
        line-height: 1;
    }

    .add-text {
        font-size: 1em;
        font-weight: 600;
    }

    /* Dark theme adjustments */
    [data-theme="dark"] .add-player-row {
        background-color: var(--color-background);
        border-color: var(--color-border);
    }

    [data-theme="dark"] .add-player-row:hover {
        background-color: var(--color-background-hover);
    }

    [data-theme="dark"] .add-player-btn {
        border-color: var(--color-primary);
        color: var(--color-primary);
    }

    [data-theme="dark"] .add-player-btn:hover {
        background-color: var(--color-primary-light);
        border-color: var(--color-primary-hover);
        color: var(--color-primary-hover);
    }
</style>
