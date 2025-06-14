<script lang="ts">
    import { clubMap } from "$lib/clubs";

    let {
        club_id = $bindable(),
        favourite_team_id = $bindable(),
        edit_mode = false,
    }: {
        club_id: number;
        favourite_team_id?: number | null;
        edit_mode: boolean;
    } = $props();

    const clubOptions = Object.entries(clubMap).map(([id, name]) => ({
        id,
        name,
    }));

    function handleManualInput(
        field: "club_id" | "favourite_team_id",
        value: string,
    ) {
        const id = parseInt(value);
        const newValue = value.trim() === "" ? null : isNaN(id) ? null : id;
        if (field === "club_id") club_id = newValue as number;
        else favourite_team_id = newValue;
    }

    function getClubName(id: number | null): string | null {
        if (id === null) return null;
        return clubMap[id] ?? `${id}`;
    }
</script>

{#if edit_mode}
    <div class="club-edit">
        <label title="current club">
            <span class="icon">🏟️</span>
            <select bind:value={club_id}>
                <option disabled value={-1}>— wybierz klub —</option>
                {#each clubOptions as { id, name }}
                    <option value={id}>{name}</option>
                {/each}
            </select>
            <input
                type="number"
                min="0"
                value={club_id}
                oninput={(e) => handleManualInput("club_id", e.target.value)}
                class="club-input"
                title="lub wpisz ID"
            />
        </label>

        <label title="favourite team">
            <span class="icon">❤️</span>
            <select bind:value={favourite_team_id}>
                {#each clubOptions as { id, name }}
                    <option value={+id}>{name}</option>
                {/each}
            </select>
            <input
                type="number"
                min="0"
                value={favourite_team_id}
                oninput={(e) =>
                    handleManualInput("favourite_team_id", e.target.value)}
                class="club-input"
                title="lub wpisz ID"
            />
        </label>
    </div>
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
                    <span class="empty-tag">empty</span>
                {/if}
            </span>
        </div>
    </div>
{/if}

<style>
    .empty-tag {
        background-color: #f0f0f0;
        color: #999;
        font-size: 0.75rem;
        padding: 2px 6px;
        border-radius: 4px;
        font-style: italic;
    }

    .club-entry[title="current club"] {
        margin-bottom: -0.5em;
    }
</style>
