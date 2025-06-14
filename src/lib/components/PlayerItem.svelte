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

    <button class="edit-toggle" onclick={toggleEdit}>
        {edit_mode ? "💾" : "⚙︎"}
    </button>
</li>

<style>
    .player-item {
        display: grid;
        grid-template-columns:
            5em
            17em
            7em
            2em
            12em
            15em
            auto;
        gap: 1em;
        align-items: center;
        padding: 0.1em 0.5em;
        border-bottom: 0.1em solid #ddd;
    }

    .player-item.edit-mode {
        display: flex;
        flex-wrap: wrap;
        gap: 1em;
        align-items: center;
    }

    .player-item:hover {
        background-color: #f0f4ff;
    }

    .edit-toggle {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 1.35rem;
    }
</style>
