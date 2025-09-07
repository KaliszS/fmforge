<script lang="ts">
    import { clubMap } from "$lib/clubs";
    import ClubEdit from "./utils/ClubEdit.svelte";

    let {
        club_id = $bindable(),
        favourite_team_id = $bindable(),
        edit_mode = false,
    }: {
        club_id: number;
        favourite_team_id?: number | null;
        edit_mode: boolean;
    } = $props();

    function getClubName(id: number | null): string | null {
        if (id === null) return null;
        return clubMap[id] ?? `${id}`;
    }
</script>

{#if edit_mode}
    <ClubEdit bind:club_id bind:favourite_team_id />
{:else}
    <div class="club-info">
        <div class="club-entry" title="current club">
            <span class="icon">🏟️</span>
            <span class="value">{getClubName(club_id)}</span>
        </div>
        <div class="club-entry" title="favourite team">
            <span class="icon">❤️</span>
            <span class="value">
                {#if favourite_team_id}
                    {getClubName(favourite_team_id)}
                {:else}
                    <span class="tag tag-empty">empty</span>
                {/if}
            </span>
        </div>
    </div>
{/if}

<style>
    .club-entry[title="current club"] {
        margin-bottom: -0.2em;
    }
</style>
