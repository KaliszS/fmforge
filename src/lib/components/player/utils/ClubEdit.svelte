<script lang="ts">
    import { clubMap } from "$lib/constants";
    import ClubSelect from "$lib/components/common/ClubSelect.svelte";

    let {
        club_id = $bindable(),
        favourite_team_id = $bindable(),
    }: {
        club_id: number;
        favourite_team_id?: number | null;
    } = $props();

</script>

<div class="club-edit">
    <label title="current club">
        <span class="icon">🏟️</span>
        <div class="select-wrapper">
            <ClubSelect bind:value={club_id} emptyValue={-1} placeholder="Select Club..." />
        </div>
        <input
            type="number"
            min="0"
            value={club_id === -1 ? "" : club_id}
            oninput={(e) => {
                const value = parseInt((e.target as HTMLInputElement).value);
                club_id = isNaN(value) ? -1 : value;
            }}
            class="club-input"
            title="lub wpisz ID"
        />
    </label>

    <label title="favourite team">
        <span class="icon">❤️</span>
        <div class="select-wrapper">
            <ClubSelect bind:value={favourite_team_id} emptyValue={null} placeholder="Select Favourite Team..." />
        </div>
        <input
            type="number"
            min="0"
            value={favourite_team_id || ""}
            oninput={(e) => {
                const value = parseInt((e.target as HTMLInputElement).value);
                favourite_team_id = isNaN(value) ? null : value;
            }}
            class="club-input"
            title="lub wpisz ID"
        />
    </label>
</div>

<style>
    .club-edit {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
        padding: var(--spacing-xs);
        background-color: var(--color-background-light);
        border-radius: var(--radius-sm);
        border: 1px solid var(--color-border-light);
    }

    .club-edit label {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        padding: var(--spacing-xs);
        background-color: var(--color-background);
        border-radius: var(--radius-sm);
        border: 1px solid var(--color-border);
        transition: border-color var(--transition-fast);
    }

    .club-edit label:hover {
        border-color: var(--color-primary);
    }

    .select-wrapper {
        flex: 1;
        min-width: 8rem;
    }

    .club-input {
        width: 4rem;
        text-align: center;
    }

    .icon {
        font-size: 1.2rem;
        color: var(--color-text-muted);
    }
</style>
