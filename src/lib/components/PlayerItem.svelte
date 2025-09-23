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
        originalPlayers
    } from "$lib/stores/editedPlayers";
    import { onMount, onDestroy } from 'svelte';

    let { 
        player = $bindable(), 
        playerId 
    }: { 
        player: Player;
        playerId: number;
    } = $props();
    
    let edit_mode = $state(false);
    let isPlayerEdited = $derived($originalPlayers.has(playerId));

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

    onMount(() => {
        document.addEventListener('restoreOriginalValues', handleRestoreEvent);
    });

    onDestroy(() => {
        document.removeEventListener('restoreOriginalValues', handleRestoreEvent);
    });
</script>

<li class="player-item" class:edit-mode={edit_mode} class:edited={isPlayerEdited}>
    {#if edit_mode}
        <div class="edit-fields">
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
        </div>
        <div class="edit-actions">
            <button class="edit-button" onclick={toggleEdit} title={edit_mode ? "Save changes" : "Edit player"}>
                {#if edit_mode}
                    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 6L9 17l-5-5"/>
                    </svg>
                {:else}
                    <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                {/if}
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
        <button class="edit-button" onclick={toggleEdit} title={edit_mode ? "Save changes" : "Edit player"}>
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
            16.5em
            auto;
        gap: var(--spacing-md);
        align-items: center;
        padding: 0.1em 0.5em;
        border-bottom: 0.1em solid var(--color-border-light);
    }

    .player-item.edit-mode {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: var(--spacing-md);
        align-items: center;
        min-height: 4rem;
    }

    .edit-fields {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-md);
        align-items: center;
    }

    .edit-actions {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
        align-items: center;
        justify-content: center;
        height: 100%;
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

    .player-item:hover {
        background-color: var(--color-background-hover);
    }

    .player-item.edited {
        border-left: 4px solid var(--color-primary);
        background-color: rgba(var(--color-primary-rgb), 0.05);
        position: relative;
    }

    .player-item.edited::before {
        content: "✏️";
        position: absolute;
        top: var(--spacing-sm);
        right: var(--spacing-sm);
        font-size: var(--font-sm);
        opacity: 0.7;
    }

    .player-item.edited:hover {
        background-color: rgba(var(--color-primary-rgb), 0.1);
    }
</style>
