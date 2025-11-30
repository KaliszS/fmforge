<script lang="ts">
    import type { Player } from "$lib/types";
    import Citizenship from "./player/Citizenship.svelte";
    import Personal from "./player/Personal.svelte";
    import Ability from "./player/Ability.svelte";
    import Club from "./player/Club.svelte";
    import FootNumber from "./player/FootNumber.svelte";
    import Appearance from "./player/Appearance.svelte";
    import { 
        saveOriginalPlayer, 
        saveModifiedPlayer, 
        checkAndCleanupPlayer,
        getOriginalPlayer,
        originalPlayers,
        modifiedPlayers,
        markPlayerForDeletion,
        removePlayerFromStores
    } from "$lib/stores/editedPlayers";
    import { onMount, onDestroy } from 'svelte';
    import RefreshButton from "./RefreshButton.svelte";

    let { 
        player = $bindable(), 
        playerId 
    }: { 
        player: Player;
        playerId: number;
    } = $props();
    
    let edit_mode = $state(false);
    let isPlayerEdited = $derived($originalPlayers.has(playerId));
    let isNewlyAdded = $derived.by(() => {
        const originals = $originalPlayers;
        const isEdited = originals.has(playerId);
        if (!isEdited) return false;
        const original = originals.get(playerId);
        return original === null;
    });

    let isDeleted = $derived.by(() => {
        const originals = $originalPlayers;
        const isEdited = originals.has(playerId);
        if (!isEdited) return false;
        const original = originals.get(playerId);
        const modified = $modifiedPlayers.get(playerId);
        return original !== null && modified === null;
    });

    function toggleEdit() {
        if (!edit_mode) {
            saveOriginalPlayer(playerId, player);
            edit_mode = true;
        } else {
            saveModifiedPlayer(playerId, player);
            checkAndCleanupPlayer(playerId);
            edit_mode = false;
        }
    }

    function handleDelete() {
        markPlayerForDeletion(playerId, player);
    }

    function handleRevert() {
        removePlayerFromStores(playerId);
    }

    function restoreOriginalValues() {
        const originalPlayer = getOriginalPlayer(playerId);
        if (originalPlayer) {
            player = { ...originalPlayer };
            edit_mode = false;
        }
    }

    function handleRestoreEvent() {
        restoreOriginalValues();
    }

    function handleDiscard() {
        restoreOriginalValues();
        removePlayerFromStores(playerId);
    }

    onMount(() => {
        document.addEventListener('restoreOriginalValues', handleRestoreEvent);
    });

    onDestroy(() => {
        document.removeEventListener('restoreOriginalValues', handleRestoreEvent);
    });
</script>

<li class="player-item" class:edit-mode={edit_mode} class:edited={isPlayerEdited} class:newly-added={isNewlyAdded} class:deleted={isDeleted}>
    {#if edit_mode}
        <div class="edit-fields">
            <div class="edit-section identity">
                <div class="section-header">Identity</div>
                <div class="section-content">
                    <Personal
                        bind:first_name={player.first_name}
                        bind:common_name={player.common_name}
                        bind:last_name={player.last_name}
                        bind:position={player.position}
                        bind:birthdate={player.birth_date}
                        bind:city={player.birth_city}
                        {edit_mode}
                    />
                    <Citizenship bind:nation={player.nationality_id} {edit_mode} />
                </div>
            </div>

            <div class="edit-section football">
                <div class="section-header">Football</div>
                <div class="section-content">
                    <Club
                        bind:club_id={player.club_id}
                        bind:favourite_team_id={player.favourite_team_id}
                        {edit_mode}
                    />
                    <div class="row-group">
                        <FootNumber
                            bind:preferred_foot={player.preferred_foot}
                            bind:favourite_number={player.favourite_number}
                            {edit_mode}
                        />
                        <Ability bind:ca={player.ca} bind:pa={player.pa} {edit_mode} />
                    </div>
                </div>
            </div>

            <div class="edit-section physical">
                <div class="section-header">Physical</div>
                <div class="section-content">
                    <Appearance
                        bind:ethnicity={player.ethnicity}
                        bind:skin_tone={player.skin_tone}
                        bind:hair_color={player.hair_color}
                        bind:height={player.height}
                        bind:weight={player.weight}
                        bind:edit_mode
                    />
                </div>
            </div>
        </div>
        <div class="edit-actions">
            <button class="edit-button" onclick={toggleEdit} title="Save changes" disabled={isDeleted}>
                <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 6L9 17l-5-5"/>
                </svg>
            </button>
            <button class="discard-button" onclick={handleDiscard} title="Discard changes" disabled={isDeleted}>
                <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 3h6v6"/>
                    <path d="M3 9a9 9 0 1 0 2-1.7L3 9"/>
                </svg>
            </button>
        </div>
    {:else}
        <Citizenship bind:nation={player.nationality_id} {edit_mode} />
        <Personal
            bind:first_name={player.first_name}
            bind:common_name={player.common_name}
            bind:last_name={player.last_name}
            bind:position={player.position}
            bind:birthdate={player.birth_date}
            bind:city={player.birth_city}
            {edit_mode}
        />
        <Ability bind:ca={player.ca} bind:pa={player.pa} {edit_mode} />
        <FootNumber
            bind:preferred_foot={player.preferred_foot}
            bind:favourite_number={player.favourite_number}
            {edit_mode}
        />
        <Club
            bind:club_id={player.club_id}
            bind:favourite_team_id={player.favourite_team_id}
            {edit_mode}
        />
        <Appearance
            bind:ethnicity={player.ethnicity}
            bind:skin_tone={player.skin_tone}
            bind:hair_color={player.hair_color}
            bind:height={player.height}
            bind:weight={player.weight}
            bind:edit_mode
        />
        <div class="action-buttons">
            <button class="edit-button" onclick={toggleEdit} title={edit_mode ? "Save changes" : "Edit player"} disabled={isDeleted}>
                {#if edit_mode}
                    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 6L9 17l-5-5"/>
                    </svg>
                {:else}
                    <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                {/if}
            </button>
            {#if isDeleted}
                <RefreshButton 
                    size={16}
                    title="Revert deletion"
                    onClick={handleRevert}
                    variant="button"
                />
            {:else}
                <button class="delete-button" onclick={handleDelete} title="Delete player">
                    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 6h18"/>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                        <line x1="10" y1="11" x2="10" y2="17"/>
                        <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                </button>
            {/if}
        </div>
    {/if}
</li>

<style>
    .player-item {
        display: grid;
        grid-template-columns:
            3em
            18em
            7em
            2em
            13em
            14.5em
            5em
            5em;
        gap: var(--spacing-md);
        align-items: center;
        padding: 0.1em 0.5em;
        border-bottom: 0.1em solid var(--color-border-light);
        border-left: 4px solid transparent;
    }

    .player-item.edit-mode {
        display: flex;
        flex-direction: row;
        align-items: stretch;
        gap: var(--spacing-lg);
        padding: var(--spacing-lg);
        background-color: var(--color-background);
        border: 1px solid var(--color-border-focus);
        border-radius: var(--radius-md);
        box-shadow: 0 8px 24px var(--color-shadow);
        margin: var(--spacing-md) 0;
        position: relative;
        z-index: 10;
        transition: all var(--transition-normal);
    }

    .player-item.edit-mode .action-buttons {
        align-self: center;
        margin-left: auto;
        height: fit-content;
        margin-top: auto;
        margin-bottom: auto;
    }

    .edit-fields {
        display: grid;
        grid-template-columns: 1.2fr 1fr 0.8fr;
        gap: var(--spacing-xl);
        width: 100%;
    }

    .edit-section {
        background-color: transparent;
        border: none;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
        position: relative;
    }

    /* Vertical separator lines between sections */
    .edit-section:not(:last-child)::after {
        content: '';
        position: absolute;
        right: calc(var(--spacing-xl) / -2);
        top: 0;
        bottom: 0;
        width: 1px;
        background-color: var(--color-border-light);
        opacity: 0.5;
    }

    .section-header {
        font-size: 0.7rem;
        text-transform: uppercase;
        color: var(--color-primary);
        font-weight: 800;
        letter-spacing: 0.05em;
        border-bottom: none;
        padding-bottom: 0;
        margin-bottom: var(--spacing-xs);
        opacity: 0.9;
    }

    .section-content {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
    }

    .row-group {
        display: flex;
        gap: var(--spacing-md);
        align-items: center;
        flex-wrap: wrap;
        justify-content: center;
    }

    .edit-actions {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
        align-items: center;
        justify-content: center;
        align-self: center;
        padding-top: 0; /* Centered vertically */
    }

    .edit-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        border: 1px solid #666;
        border-radius: var(--radius-sm);
        background-color: var(--color-background);
        color: var(--color-text);
        cursor: pointer;
        transition: all var(--transition-fast);
        box-shadow: 0 0 0 0.5px #fff, 0 0 0 1px #666;
    }
    
    /* Green accent for save button in edit mode */
    .player-item.edit-mode .edit-button {
        width: 2.5rem;
        height: 2.5rem;
        background-color: var(--color-newly-added-bg);
        border-color: var(--color-newly-added);
        color: var(--color-newly-added);
        box-shadow: 0 0 0 0.5px #fff, 0 0 0 1px var(--color-newly-added);
    }
    
    .player-item.edit-mode .edit-button:hover {
        background-color: var(--color-newly-added);
        color: white;
    }

    .edit-button:hover {
        background-color: var(--color-background-hover);
        border-color: var(--color-primary);
        box-shadow: 0 0 0 0.5px #fff, 0 0 0 1px var(--color-primary);
        transform: scale(1.05);
    }

    .edit-button:active {
        transform: scale(0.95);
    }

    .discard-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.5rem; /* Same size as edit button in edit mode */
        height: 2.5rem; /* Same size as edit button in edit mode */
        border: 1px solid var(--color-delete);
        border-radius: var(--radius-sm);
        background-color: var(--color-background);
        color: var(--color-delete);
        cursor: pointer;
        transition: all var(--transition-fast);
        box-shadow: 0 0 0 0.5px #fff, 0 0 0 1px var(--color-delete);
        opacity: 0.8;
    }

    .discard-button:hover {
        background-color: var(--color-delete-bg-hover);
        border-color: var(--color-delete-hover);
        color: var(--color-delete-hover);
        box-shadow: 0 0 0 0.5px #fff, 0 0 0 1px var(--color-delete-hover);
        transform: scale(1.05);
        opacity: 1;
    }

    .discard-button:active {
        transform: scale(0.95);
    }

    .edit-button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background-color: var(--color-background-light);
        color: var(--color-text-muted);
        border-color: var(--color-border);
    }

    .edit-button:disabled:hover {
        transform: none;
        background-color: var(--color-background-light);
        border-color: var(--color-border);
        box-shadow: 0 0 0 0.5px #fff, 0 0 0 1px var(--color-border);
    }

    .action-buttons {
        display: flex;
        gap: var(--spacing-sm);
        align-items: center;
    }

    .delete-button {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        border: 1px solid var(--color-delete);
        border-radius: var(--radius-sm);
        background-color: var(--color-background);
        color: var(--color-delete);
        cursor: pointer;
        transition: all var(--transition-fast);
        box-shadow: 0 0 0 0.5px #fff, 0 0 0 1px var(--color-delete);
    }

    .delete-button:hover {
        background-color: var(--color-delete-bg-hover);
        border-color: var(--color-delete-hover);
        color: var(--color-delete-hover);
        box-shadow: 0 0 0 0.5px #fff, 0 0 0 1px var(--color-delete-hover);
        transform: scale(1.05);
    }

    .delete-button:active {
        transform: scale(0.95);
    }


    .player-item:hover {
        background-color: var(--color-background-hover);
    }

    .player-item.edited {
        border-left: 4px solid var(--color-modified);
        background-color: var(--color-modified-bg);
        position: relative;
    }

    .player-item.edited:hover {
        background-color: var(--color-modified-bg-hover);
    }

    .player-item.edited.newly-added {
        border-left: 4px solid var(--color-newly-added);
        background-color: var(--color-newly-added-bg);
    }

    .player-item.edited.newly-added:hover {
        background-color: var(--color-newly-added-bg-hover);
    }

    .player-item.edited.deleted {
        border-left: 4px solid var(--color-deleted);
        background-color: var(--color-deleted-bg);
    }

    .player-item.edited.deleted:hover {
        background-color: var(--color-deleted-bg-hover);
    }

    .player-item.deleted {
        opacity: 0.7;
    }

    .player-item.deleted:hover {
        opacity: 0.7;
    }
    
    .player-item.deleted :global(.name) {
        text-decoration: line-through;
        text-decoration-color: var(--color-deleted);
        text-decoration-thickness: 2px;
    }
</style>
