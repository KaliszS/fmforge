<script lang="ts">
    import type { PlayerRecord } from "$lib/types";
    import { getTopPlayers } from "$lib/api/player";
    import { countryMap, clubMap } from "$lib/constants";
    import { getFlagComponent } from "$lib/flags";
    import DetailedStatCard from "../charts/DetailedStatCard.svelte";

    let { 
        statistics,
        loading: loadingStats,
        error: errorStats,
        players,
        selectedCountry,
        selectedClub,
        minCA,
        maxCA,
        minPA,
        maxPA,
        preferredFoot,
        favouriteNumber,
        birthYear,
        sortBy,
        nameQuery,
        allFilteredIds = null
    }: { 
        statistics: any;
        loading: boolean;
        error: string | null;
        players: PlayerRecord[];
        selectedCountry: number | null;
        selectedClub: number | null;
        minCA: number | null;
        maxCA: number | null;
        minPA: number | null;
        maxPA: number | null;
        preferredFoot: number | null;
        favouriteNumber: number | null;
        birthYear: number | null;
        sortBy: string[] | null;
        nameQuery: string | null;
        allFilteredIds?: number[] | null;
    } = $props();

    let topPlayers = $state<any>(null);
    let loadingTopPlayers = $state(true);
    let errorTopPlayers = $state<string | null>(null);
    let topPlayersLimit = $state(5);
    let showTallest = $state(true);
    let showHeaviest = $state(true);

    $effect(() => {
        if (topPlayersLimit < 1) topPlayersLimit = 1;
        if (topPlayersLimit > 20) topPlayersLimit = 20;
    });

    $effect(() => {
        topPlayersLimit;
        const loadData = async () => {
            loadingTopPlayers = true;
            errorTopPlayers = null;
            try {
                topPlayers = await getTopPlayers(
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
                    allFilteredIds,
                    topPlayersLimit
                );
            } catch (err) {
                errorTopPlayers = err instanceof Error ? err.message : 'Failed to load data';
                console.error('Error loading data:', err);
            } finally {
                loadingTopPlayers = false;
            }
        };
        loadData();
    });

    let loading = $derived(loadingStats || loadingTopPlayers);
    let error = $derived(errorStats || errorTopPlayers);

    function getPlayerName(player: any): string {
        if (player.player.common_name && player.player.common_name.trim() !== '') {
            return player.player.common_name;
        }
        return `${player.player.first_name} ${player.player.last_name}`;
    }

    function getClubName(clubId: number | null): string {
        if (clubId === null) return 'No Club';
        return clubMap[clubId]?.name || `Club ${clubId}`;
    }

    function getCountryCode(countryId: number): string {
        const country = countryMap[countryId];
        if (country && country.code) {
            return country.code;
        }
        return 'Un';
    }
</script>

<div class="analysis-section">
    {#if loading}
        <div class="loading-state">
            <div class="loading-spinner"></div>
            <p>Loading physical statistics...</p>
        </div>
    {:else if error}
        <div class="error-state">
            <div class="error-icon">⚠️</div>
            <h4>Error Loading Statistics</h4>
            <p>{error}</p>
        </div>
    {:else if statistics}
        <div class="physical-content">
            <h3>Physical Distribution Analysis</h3>
            
            <div class="stats-grid">
                {#if statistics.height_stats}
                    <DetailedStatCard 
                        title="Height (cm)" 
                        icon="📏" 
                        stats={statistics.height_stats} 
                    />
                {/if}

                {#if statistics.weight_stats}
                    <DetailedStatCard 
                        title="Weight (kg)" 
                        icon="⚖️" 
                        stats={statistics.weight_stats} 
                    />
                {/if}
            </div>

            <div class="top-lists-container">
                <div class="top-list-section">
                    <div class="top-list-header">
                        <h4>{showTallest ? 'Tallest' : 'Shortest'} Players</h4>
                        <button 
                            class="toggle-btn" 
                            onclick={() => showTallest = !showTallest}
                            title={showTallest ? "Show Shortest" : "Show Tallest"}
                        >
                            {showTallest ? '⬇️' : '⬆️'}
                        </button>
                    </div>
                    {#if loadingTopPlayers}
                        <div class="loading-spinner-small"></div>
                    {:else if topPlayers}
                        {@const heightList = showTallest ? topPlayers.top_height : topPlayers.top_shortest}
                        {#if heightList && heightList.length > 0}
                            <div class="players-list">
                                {#each heightList as player, index}
                                    {@const FlagComponent = getFlagComponent(getCountryCode(player.player.nationality_id))}
                                    <div class="player-list-item">
                                        <div class="player-rank">#{index + 1}</div>
                                        <div class="player-flag">
                                            <FlagComponent size="20" />
                                        </div>
                                        <div class="player-info">
                                            <div class="player-name">{getPlayerName(player)}</div>
                                            <div class="player-club">{getClubName(player.player.club_id)}</div>
                                        </div>
                                        <div class="player-value">{player.player.height} cm</div>
                                    </div>
                                {/each}
                            </div>
                        {:else}
                            <div class="no-data-small">No data available</div>
                        {/if}
                    {:else}
                        <div class="no-data-small">No data available</div>
                    {/if}
                </div>

                <div class="top-list-section">
                    <div class="top-list-header">
                        <h4>{showHeaviest ? 'Heaviest' : 'Lightest'} Players</h4>
                        <button 
                            class="toggle-btn" 
                            onclick={() => showHeaviest = !showHeaviest}
                            title={showHeaviest ? "Show Lightest" : "Show Heaviest"}
                        >
                            {showHeaviest ? '⬇️' : '⬆️'}
                        </button>
                    </div>
                    {#if loadingTopPlayers}
                        <div class="loading-spinner-small"></div>
                    {:else if topPlayers}
                        {@const weightList = showHeaviest ? topPlayers.top_weight : topPlayers.top_lightest}
                        {#if weightList && weightList.length > 0}
                            <div class="players-list">
                                {#each weightList as player, index}
                                    {@const FlagComponent = getFlagComponent(getCountryCode(player.player.nationality_id))}
                                    <div class="player-list-item">
                                        <div class="player-rank">#{index + 1}</div>
                                        <div class="player-flag">
                                            <FlagComponent size="20" />
                                        </div>
                                        <div class="player-info">
                                            <div class="player-name">{getPlayerName(player)}</div>
                                            <div class="player-club">{getClubName(player.player.club_id)}</div>
                                        </div>
                                        <div class="player-value">{player.player.weight} kg</div>
                                    </div>
                                {/each}
                            </div>
                        {:else}
                            <div class="no-data-small">No data available</div>
                        {/if}
                    {:else}
                        <div class="no-data-small">No data available</div>
                    {/if}
                </div>
            </div>
        </div>
    {:else}
        <div class="placeholder">
            <div class="placeholder-icon">👤</div>
            <h4>No Data Available</h4>
            <p>No physical statistics available for the current filters.</p>
        </div>
    {/if}
</div>

<style>
    .physical-content h3 {
        margin: 0 0 var(--spacing-lg) 0;
        color: var(--color-text);
        font-size: var(--font-lg);
        font-weight: 600;
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: var(--spacing-lg);
        margin-bottom: var(--spacing-xl);
    }

    .top-lists-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: var(--spacing-xl);
        margin-top: var(--spacing-xl);
    }

    .top-list-section {
        background: var(--color-background-light);
        border: 1px solid var(--color-border-light);
        border-radius: var(--radius-lg);
        padding: var(--spacing-lg);
    }

    .top-list-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-md);
    }

    .top-list-header h4 {
        margin: 0;
        color: var(--color-text);
        font-size: var(--font-base);
        font-weight: 600;
    }

    .toggle-btn {
        background: var(--color-background);
        border: 1px solid var(--color-border-light);
        border-radius: var(--radius-sm);
        padding: 4px 8px;
        cursor: pointer;
        font-size: 1.2rem;
        transition: all var(--transition-fast);
    }

    .toggle-btn:hover {
        background: var(--color-background-hover);
        border-color: var(--color-primary);
    }

    .players-list {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
    }

    .player-list-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        padding: var(--spacing-sm);
        background: var(--color-background);
        border-radius: var(--radius-md);
        border: 1px solid var(--color-border-light);
    }

    .player-rank {
        font-weight: 600;
        color: var(--color-text-muted);
        width: 24px;
        text-align: center;
    }

    .player-flag {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
    }

    .player-info {
        flex: 1;
        min-width: 0;
    }

    .player-name {
        font-weight: 600;
        color: var(--color-text);
        font-size: var(--font-sm);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .player-club {
        color: var(--color-text-muted);
        font-size: var(--font-xs);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .player-value {
        font-weight: 700;
        color: var(--color-primary);
        font-size: var(--font-sm);
        background: var(--color-primary-light);
        padding: 2px 8px;
        border-radius: var(--radius-sm);
    }

    .loading-state, .error-state {
        text-align: center;
        padding: var(--spacing-xl);
    }

    .loading-spinner {
        width: 2rem;
        height: 2rem;
        border: 3px solid var(--color-border-light);
        border-top: 3px solid var(--color-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto var(--spacing-md);
    }

    .loading-spinner-small {
        width: 1.5rem;
        height: 1.5rem;
        border: 2px solid var(--color-border-light);
        border-top: 2px solid var(--color-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: var(--spacing-lg) auto;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .error-icon {
        font-size: 3rem;
        margin-bottom: var(--spacing-md);
    }

    .placeholder {
        text-align: center;
        color: var(--color-text-muted);
        padding: var(--spacing-xl) 0;
    }

    .placeholder-icon {
        font-size: 3rem;
        margin-bottom: var(--spacing-lg);
        opacity: 0.6;
    }

    .placeholder h4 {
        margin: 0 0 var(--spacing-md) 0;
        font-size: var(--font-lg);
        color: var(--color-text);
        font-weight: 600;
    }

    .placeholder p {
        margin: 0;
        font-size: var(--font-base);
        line-height: 1.6;
        max-width: 500px;
        margin: 0 auto;
    }

    .no-data-small {
        text-align: center;
        color: var(--color-text-muted);
        padding: var(--spacing-md);
        font-size: var(--font-sm);
    }
</style>
