<script lang="ts">
    import { clubMap } from "$lib/constants";
    import ClubEdit from "./utils/ClubEdit.svelte";
    import QuickEditModal from "$lib/components/common/QuickEditModal.svelte";

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
        return clubMap[id]?.name ?? `${id}`;
    }

    let quickEdit = $state(false);
    let temp_club_id = $state(0);
    let temp_fav_team_id = $state<number | null>(null);

    function openQuickEdit() {
        if (edit_mode) return;
        temp_club_id = club_id;
        temp_fav_team_id = favourite_team_id ?? null;
        quickEdit = true;
    }

    function saveQuickEdit() {
        club_id = temp_club_id;
        favourite_team_id = temp_fav_team_id;
    }
</script>

{#if edit_mode}
    <ClubEdit bind:club_id bind:favourite_team_id />
{:else}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="club-info" ondblclick={openQuickEdit}>
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

    <QuickEditModal title="Edit Clubs" bind:isOpen={quickEdit} onSave={saveQuickEdit}>
        <ClubEdit bind:club_id={temp_club_id} bind:favourite_team_id={temp_fav_team_id} />
    </QuickEditModal>
{/if}

<style>
    .club-entry[title="current club"] {
        margin-bottom: -0.2em;
    }
</style>
