<script lang="ts">
    import type { Player } from "$lib/types";
    import Citizenship from "./player/Citizenship.svelte";
    import Personal from "./player/Personal.svelte";
    import Ability from "./player/Ability.svelte";
    import Club from "./player/Club.svelte";
    import FootNumber from "./player/FootNumber.svelte";
    import Appearance from "./player/Appearance.svelte";

    let { player = $bindable() }: { player: Player } = $props();
    let edit_mode = $state(false);

    function toggleEdit() {
        edit_mode = !edit_mode;
    }
</script>

<li class="player-item" class:edit-mode={edit_mode}>
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
            <button class="btn-icon" onclick={toggleEdit}>
                {edit_mode ? "💾" : "⚙︎"}
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
        <button class="btn-icon" onclick={toggleEdit}>
            {edit_mode ? "💾" : "⚙︎"}
        </button>
    {/if}
</li>

<style>
    .player-item {
        display: grid;
        grid-template-columns:
            5em
            18em
            7em
            2em
            13em
            15em
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

    .edit-actions .btn-icon {
        font-size: 2rem;
        padding: var(--spacing-sm);
        border-radius: var(--radius-md);
        background: none;
        border: none;
        cursor: pointer;
        transition: all var(--transition-fast);
    }

    .edit-actions .btn-icon:hover {
        transform: scale(1.1);
    }

    .player-item:hover {
        background-color: var(--color-background-hover);
    }
</style>
