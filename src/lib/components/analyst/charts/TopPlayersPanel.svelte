<script lang="ts">
    import type { FilterProps } from "$lib/types";
    import { getTopPlayers, type BirthDateRange } from "$lib/api/player";
    import { countryMap } from "$lib/constants";
    import { clubNames, ensureClubNames } from "$lib/clubs";
    import { getFlagComponent } from "$lib/flags";

    let {
        allFilteredIds = null,
        birthDateRange = null,
        selectedCountry,
        selectedClub,
        minCA,
        maxCA,
        minPA,
        maxPA,
        preferredFoot,
        favouriteNumber,
        birthYear,
        nameQuery,
        sortBy,
    }: {
        allFilteredIds?: number[] | null;
        birthDateRange?: BirthDateRange | null;
    } & FilterProps = $props();

    let topPlayers = $state<any>(null);
    let loading = $state(true);
    let error = $state<string | null>(null);
    let limit = $state(10);

    $effect(() => {
        if (limit < 1) limit = 1;
        if (limit > 100) limit = 100;
    });

    $effect(() => {
        limit;
        const load = async () => {
            loading = true;
            error = null;
            try {
                topPlayers = await getTopPlayers(
                    selectedCountry, selectedClub,
                    minCA, maxCA, minPA, maxPA,
                    preferredFoot, favouriteNumber,
                    birthYear, nameQuery, sortBy,
                    allFilteredIds, limit, birthDateRange
                );
            } catch (err) {
                error = err instanceof Error ? err.message : 'Failed to load data';
            } finally {
                loading = false;
            }
        };
        load();
    });

    function getPlayerName(player: any): string {
        if (player.player.common_name?.trim()) return player.player.common_name;
        return `${player.player.first_name} ${player.player.last_name}`;
    }

    // Resolve club names for the displayed top players.
    $effect(() => {
        ensureClubNames((topPlayers?.top_pa ?? []).map((p: any) => p.player.club_id));
    });

    function getClubName(clubId: number | null): string {
        if (clubId === null) return 'No Club';
        return $clubNames.get(clubId) || `Club ${clubId}`;
    }

    function getCountryCode(countryId: number): string {
        return countryMap[countryId]?.code || 'Un';
    }
</script>

<div class="top-players-section">
    <div class="top-players-header">
        <h4>Top Players by Potential Ability</h4>
        <div class="limit-control">
            <label for="top-players-limit">Show top:</label>
            <input
                id="top-players-limit"
                type="number"
                bind:value={limit}
                min="1"
                max="100"
                step="1"
                class="limit-input"
            />
            <span class="limit-label">players</span>
        </div>
    </div>

    {#if loading}
        <div class="loading-state">
            <div class="loading-spinner"></div>
            <p>Loading top players...</p>
        </div>
    {:else if error}
        <div class="error-state">
            <p>{error}</p>
        </div>
    {:else if topPlayers?.top_pa?.length > 0}
        <div class="players-grid">
            {#each topPlayers.top_pa as player, index}
                {@const FlagComponent = getFlagComponent(getCountryCode(player.player.nationality_id))}
                <div class="player-card">
                    <div class="player-rank" class:medal-gold={index === 0} class:medal-silver={index === 1} class:medal-bronze={index === 2}>
                        #{index + 1}
                    </div>
                    <div class="player-flag">
                        <FlagComponent size="35" />
                    </div>
                    <div class="player-info">
                        <div class="player-name" class:medal-gold={index === 0} class:medal-silver={index === 1} class:medal-bronze={index === 2}>
                            {getPlayerName(player)}
                        </div>
                        <div class="player-club">{getClubName(player.player.club_id)}</div>
                    </div>
                    <div class="player-pa">{player.player.pa}</div>
                </div>
            {/each}
        </div>
    {:else}
        <div class="no-data">
            <p>No top players data available</p>
        </div>
    {/if}
</div>

<style>
    .top-players-section {
        margin-bottom: var(--spacing-xl);
    }

    .top-players-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-lg);
        flex-wrap: wrap;
        gap: var(--spacing-md);
    }

    .top-players-header h4 {
        margin: 0;
        color: var(--color-text);
        font-size: var(--font-base);
        font-weight: 600;
    }

    .limit-control {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
    }

    .limit-control label {
        color: var(--color-text-muted);
        font-size: var(--font-sm);
        font-weight: 500;
    }

    .limit-input {
        width: 60px;
        padding: var(--spacing-xs) var(--spacing-sm);
        border: 1px solid var(--color-border-light);
        border-radius: var(--radius-sm);
        background: var(--color-background);
        color: var(--color-text);
        font-size: var(--font-sm);
        text-align: center;
        transition: all var(--transition-fast);
    }

    .limit-input:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 2px var(--color-primary-light);
    }

    .limit-label {
        color: var(--color-text-muted);
        font-size: var(--font-sm);
        font-weight: 500;
    }

    .players-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: var(--spacing-md);
        margin-bottom: var(--spacing-lg);
    }

    .player-card {
        background: var(--color-background-light);
        border: 1px solid var(--color-border-light);
        border-radius: var(--radius-lg);
        padding: var(--spacing-md);
        display: flex;
        align-items: center;
        gap: 0;
        transition: all var(--transition-fast);
        position: relative;
        overflow: hidden;
    }

    .player-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        border-color: var(--color-primary);
    }

    .player-rank {
        background: var(--color-background-light);
        color: var(--color-text-muted);
        width: 50px;
        border-radius: var(--radius-lg) 0 0 var(--radius-lg);
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 500;
        font-size: var(--font-lg);
        flex-shrink: 0;
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        margin: 0;
        border-right: 1px solid var(--color-border-light);
    }

    .player-name.medal-gold,
    .player-rank.medal-gold {
        color: var(--color-medal-gold);
        font-weight: 800;
        text-shadow: 0 0 8px var(--color-medal-gold-glow);
    }

    .player-name.medal-silver,
    .player-rank.medal-silver {
        color: var(--color-medal-silver);
        font-weight: 800;
        text-shadow: 0 0 8px var(--color-medal-silver-glow);
    }

    .player-name.medal-bronze,
    .player-rank.medal-bronze {
        color: var(--color-medal-bronze);
        font-weight: 800;
        text-shadow: 0 0 8px var(--color-medal-bronze-glow);
    }

    .player-flag {
        font-size: 5rem;
        flex-shrink: 0;
        margin-left: 2.8rem;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 3rem;
    }

    .player-info {
        flex: 1;
        min-width: 0;
        margin-left: .5rem;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .player-name {
        font-weight: 700;
        color: var(--color-text);
        font-size: var(--font-lg);
        margin-bottom: var(--spacing-xs);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.2;
    }

    .player-club {
        color: var(--color-text-muted);
        font-size: var(--font-base);
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.3;
    }

    .player-pa {
        background: var(--color-primary-light);
        color: var(--color-primary);
        padding: 4px 8px;
        border-radius: var(--radius-sm);
        font-weight: bold;
        font-size: var(--font-sm);
        flex-shrink: 0;
    }

    .no-data {
        text-align: center;
        color: var(--color-text-muted);
        padding: var(--spacing-lg);
        font-size: var(--font-sm);
    }
</style>
