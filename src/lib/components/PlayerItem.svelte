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
    import { deselectPlayer } from "$lib/stores/selectionStore";
    import { onMount, onDestroy, setContext } from 'svelte';
    import RefreshButton from "./RefreshButton.svelte";
    import PlayerEditFields from "./player/PlayerEditFields.svelte";
    import EditActions from "./player/EditActions.svelte";
    import SelectionTrigger from "./player/SelectionTrigger.svelte";
    import Icon from "./common/Icon.svelte";

    let { 
        player = $bindable(), 
        playerId,
        readOnly = false
    }: { 
        player: Player;
        playerId: number;
        readOnly?: boolean;
    } = $props();
    
    // Use modified player from store if available, otherwise use the prop
    let displayPlayer = $derived($modifiedPlayers.get(playerId) ?? player);

    setContext('quickEdit', {
        start: () => {
            if (readOnly) return;
            if (!$originalPlayers.has(playerId)) {
                saveOriginalPlayer(playerId, player);
            }
        },
        save: () => {
            if (readOnly) return;
            saveModifiedPlayer(playerId, displayPlayer);
            checkAndCleanupPlayer(playerId);
        },
        cancel: () => {
            if (readOnly) return;
            checkAndCleanupPlayer(playerId);
        },
        readOnly
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
        deselectPlayer(playerId);
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
    {#if !readOnly}
        <SelectionTrigger {playerId} />
    {/if}
    {#if edit_mode}
        <PlayerEditFields bind:player={player} />
        <EditActions 
            onSave={toggleEdit} 
            onDiscard={handleDiscard} 
            isDeleted={isDeleted} 
        />
    {:else}
        <Citizenship bind:nation={displayPlayer.nationality_id} {edit_mode} />
        <Personal
            bind:first_name={displayPlayer.first_name}
            bind:common_name={displayPlayer.common_name}
            bind:last_name={displayPlayer.last_name}
            bind:position={displayPlayer.position}
            bind:birthdate={displayPlayer.birth_date}
            bind:city={displayPlayer.birth_city}
            {edit_mode}
        />
        <Ability bind:ca={displayPlayer.ca} bind:pa={displayPlayer.pa} {edit_mode} />
        <FootNumber
            bind:preferred_foot={displayPlayer.preferred_foot}
            bind:favourite_number={displayPlayer.favourite_number}
            {edit_mode}
        />
        <Club
            bind:club_id={displayPlayer.club_id}
            bind:favourite_team_id={displayPlayer.favourite_team_id}
            {edit_mode}
        />
        <Appearance
            bind:ethnicity={displayPlayer.ethnicity}
            bind:skin_tone={displayPlayer.skin_tone}
            bind:hair_color={displayPlayer.hair_color}
            bind:height={displayPlayer.height}
            bind:weight={displayPlayer.weight}
            bind:edit_mode
        />
        {#if !readOnly}
        <div class="action-buttons">
            <button class="edit-button" onclick={toggleEdit} title={edit_mode ? "Save changes" : "Edit player"} aria-label={edit_mode ? "Save changes" : "Edit player"} disabled={isDeleted}>
                <Icon name={edit_mode ? 'check' : 'pencil'} size={edit_mode ? '1em' : '1.2em'} />
            </button>
            {#if isDeleted}
                <RefreshButton 
                    size={16}
                    title="Revert deletion"
                    onclick={handleRevert}
                    variant="button"
                />
            {:else}
                <button class="delete-button" onclick={handleDelete} title="Delete player" aria-label="Delete player">
                    <Icon name="trash" />
                </button>
            {/if}
        </div>
        {/if}
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
        position: relative; /* For absolute positioning of selection trigger */
        overflow: visible; /* Allow selection trigger to overflow */
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
