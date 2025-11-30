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
    import { onMount, onDestroy, setContext } from 'svelte';
    import RefreshButton from "./RefreshButton.svelte";
    import PlayerEditFields from "./player/PlayerEditFields.svelte";
    import EditActions from "./player/EditActions.svelte";

    let { 
        player = $bindable(), 
        playerId 
    }: { 
        player: Player;
        playerId: number;
    } = $props();
    
    setContext('quickEdit', {
        start: () => {
            if (!$originalPlayers.has(playerId)) {
                saveOriginalPlayer(playerId, player);
            }
        },
        save: () => {
            saveModifiedPlayer(playerId, player);
            checkAndCleanupPlayer(playerId);
        }
    });

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

    function handleRestoreEvent(e: Event) {
        const customEvent = e as CustomEvent;
        // If event has a playerId detail, only restore that specific player
        if (customEvent.detail?.playerId !== undefined && customEvent.detail.playerId !== playerId) {
            return;
        }
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
        <PlayerEditFields bind:player={player} />
        <EditActions 
            onSave={toggleEdit} 
            onDiscard={handleDiscard} 
            isDeleted={isDeleted} 
        />
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

    .edit-button:hover {
        background-color: var(--color-background-hover);
        border-color: var(--color-primary);
        box-shadow: 0 0 0 0.5px #fff, 0 0 0 1px var(--color-primary);
        transform: scale(1.05);
    }

    .edit-button:active {
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

    /* Styles for edit-fields and related classes removed as they are now in PlayerEditFields.svelte and EditActions.svelte */

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
