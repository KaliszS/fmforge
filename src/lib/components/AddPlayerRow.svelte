<script lang="ts">
    import type { Player } from "$lib/types";
    import { addNewPlayer } from "$lib/api/player";
    import { addNewPlayerToStore } from "$lib/stores/editedPlayers";
    import PlayerEditFields from "./player/PlayerEditFields.svelte";
    import EditActions from "./player/EditActions.svelte";

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
        <div class="add-player-form edit-mode">
            <PlayerEditFields bind:player={newPlayer} />
            <EditActions 
                onSave={saveNewPlayer} 
                onDiscard={cancelAdding} 
                saveDisabled={!isValid}
                saveTitle="Save new player"
                discardTitle="Cancel adding"
            />
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
        display: flex;
        flex-direction: row;
        align-items: stretch;
        gap: var(--spacing-lg);
        padding: var(--spacing-lg);
        background-color: var(--color-background);
        border: 1px solid var(--color-border-focus);
        border-radius: var(--radius-md);
        box-shadow: 0 8px 24px var(--color-shadow);
        position: relative;
        z-index: 10;
    }

    /* edit-fields styles removed as they are now in PlayerEditFields.svelte */

    /* edit-actions styles removed as they are now in EditActions.svelte */

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

</style>

