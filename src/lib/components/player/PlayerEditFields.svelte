<script lang="ts">
    import type { Player } from "$lib/types";
    import Citizenship from "./Citizenship.svelte";
    import Personal from "./Personal.svelte";
    import Ability from "./Ability.svelte";
    import Club from "./Club.svelte";
    import FootNumber from "./FootNumber.svelte";
    import Appearance from "./Appearance.svelte";

    let { player = $bindable() }: { player: Player } = $props();
</script>

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
                edit_mode={true}
            />
            <Citizenship bind:nation={player.nationality_id} edit_mode={true} />
        </div>
    </div>

    <div class="edit-section football">
        <div class="section-header">Football</div>
        <div class="section-content">
            <Club
                bind:club_id={player.club_id}
                bind:favourite_team_id={player.favourite_team_id}
                edit_mode={true}
            />
            <div class="row-group">
                <FootNumber
                    bind:preferred_foot={player.preferred_foot}
                    bind:favourite_number={player.favourite_number}
                    edit_mode={true}
                />
                <Ability bind:ca={player.ca} bind:pa={player.pa} edit_mode={true} />
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
                edit_mode={true}
            />
        </div>
    </div>
</div>

<style>
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
</style>
