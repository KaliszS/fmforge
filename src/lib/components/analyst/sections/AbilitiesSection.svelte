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
        nameQuery,
        sortBy
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
        nameQuery: string | null;
        sortBy: string[] | null;
    } = $props();

    let topPlayers = $state<any>(null);
    let loadingTopPlayers = $state(true);
    let errorTopPlayers = $state<string | null>(null);
    let topPlayersLimit = $state(10);

    $effect(() => {
        if (topPlayersLimit < 1) topPlayersLimit = 1;
        if (topPlayersLimit > 100) topPlayersLimit = 100;
    });

    // Load top players when component mounts or filters change
    $effect(() => {
        // Re-run when topPlayersLimit changes
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
            <p>Loading ability statistics...</p>
        </div>
    {:else if error}
        <div class="error-state">
            <div class="error-icon">⚠️</div>
            <h4>Error Loading Statistics</h4>
            <p>{error}</p>
        </div>
    {:else if statistics}
        <div class="abilities-content">
            <div class="top-players-section">
                <div class="top-players-header">
                    <h4>Top Players by Potential Ability</h4>
                    <div class="limit-control">
                        <label for="top-players-limit">Show top:</label>
                        <input 
                            id="top-players-limit"
                            type="number" 
                            bind:value={topPlayersLimit}
                            min="1" 
                            max="100" 
                            step="1"
                            class="limit-input"
                        />
                        <span class="limit-label">players</span>
                    </div>
                </div>
                {#if loadingTopPlayers}
                    <div class="loading-state">
                        <div class="loading-spinner"></div>
                        <p>Loading top players...</p>
                    </div>
                {:else if topPlayers && topPlayers.top_pa && topPlayers.top_pa.length > 0}
                    <div class="players-grid">
                        {#each topPlayers.top_pa as player, index}
                            {@const FlagComponent = getFlagComponent(getCountryCode(player.player.nationality_id))}
                            <div class="player-card">
                                <div class="player-rank" class:medal-gold={index === 0} class:medal-silver={index === 1} class:medal-bronze={index === 2}>#{index + 1}</div>
                                <div class="player-flag">
                                    <FlagComponent size="35" />
                                </div>
                                <div class="player-info">
                                    <div class="player-name" class:medal-gold={index === 0} class:medal-silver={index === 1} class:medal-bronze={index === 2}>{getPlayerName(player)}</div>
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

            <h3>Ability Distribution Analysis</h3>
            <div class="stats-grid">
                {#if statistics.ca_stats}
                    <DetailedStatCard 
                        title="Current Ability (CA)" 
                        icon="⚡" 
                        stats={statistics.ca_stats} 
                    />
                {/if}

                {#if statistics.pa_stats}
                    <DetailedStatCard 
                        title="Potential Ability (PA)" 
                        icon="⭐" 
                        stats={statistics.pa_stats} 
                    />
                {/if}
            </div>
            {#if statistics.ca_stats && statistics.pa_stats}
                <div class="quartile-analysis">
                    <h4>Quartile Analysis</h4>
                    <div class="quartile-grid">
                        <div class="quartile-card">
                            <h5>CA Quartiles</h5>
                            <div class="quartile-bars">
                                <div class="quartile-bar">
                                    <span class="quartile-label">Q1 (25%)</span>
                                    <div class="quartile-value">{Math.round(statistics.ca_stats.q25)}</div>
                                </div>
                                <div class="quartile-bar">
                                    <span class="quartile-label">Q2 (50%)</span>
                                    <div class="quartile-value">{Math.round(statistics.ca_stats.median)}</div>
                                </div>
                                <div class="quartile-bar">
                                    <span class="quartile-label">Q3 (75%)</span>
                                    <div class="quartile-value">{Math.round(statistics.ca_stats.q75)}</div>
                                </div>
                            </div>
                        </div>
                        <div class="quartile-card">
                            <h5>PA Quartiles</h5>
                            <div class="quartile-bars">
                                <div class="quartile-bar">
                                    <span class="quartile-label">Q1 (25%)</span>
                                    <div class="quartile-value">{Math.round(statistics.pa_stats.q25)}</div>
                                </div>
                                <div class="quartile-bar">
                                    <span class="quartile-label">Q2 (50%)</span>
                                    <div class="quartile-value">{Math.round(statistics.pa_stats.median)}</div>
                                </div>
                                <div class="quartile-bar">
                                    <span class="quartile-label">Q3 (75%)</span>
                                    <div class="quartile-value">{Math.round(statistics.pa_stats.q75)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    {:else}
        <div class="placeholder">
            <div class="placeholder-icon">⚽</div>
            <h4>No Data Available</h4>
            <p>No ability statistics available for the current filters.</p>
        </div>
    {/if}
</div>

<style>
    .abilities-content h3 {
        margin: 0 0 var(--spacing-lg) 0;
        color: var(--color-text);
        font-size: var(--font-lg);
        font-weight: 600;
    }

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

    .player-card::before {
        display: none;
    }

    .player-rank {
        background: var(--color-background-light);
        color: var(--color-text-muted);
        width: 50px;
        height: 100%;
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

    .player-name.medal-gold {
        color: #ffd700;
        font-weight: 800;
        text-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
    }

    .player-name.medal-silver {
        color: #e8e8e8;
        font-weight: 800;
        text-shadow: 0 0 8px rgba(232, 232, 232, 0.6);
    }

    .player-name.medal-bronze {
        color: #cd7f32;
        font-weight: 800;
        text-shadow: 0 0 8px rgba(205, 127, 50, 0.6);
    }

    /* Medal colors for top 3 rank numbers */
    .player-rank.medal-gold {
        color: #ffd700;
        font-weight: 800;
        text-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
    }

    .player-rank.medal-silver {
        color: #e8e8e8;
        font-weight: 800;
        text-shadow: 0 0 8px rgba(232, 232, 232, 0.6);
    }

    .player-rank.medal-bronze {
        color: #cd7f32;
        font-weight: 800;
        text-shadow: 0 0 8px rgba(205, 127, 50, 0.6);
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

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: var(--spacing-lg);
        margin-bottom: var(--spacing-xl);
    }

    .quartile-analysis {
        margin-top: var(--spacing-xl);
    }

    .quartile-analysis h4 {
        margin: 0 0 var(--spacing-lg) 0;
        color: var(--color-text);
        font-size: var(--font-base);
        font-weight: 600;
    }

    .quartile-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: var(--spacing-lg);
    }

    .quartile-card {
        background: var(--color-background-light);
        border: 1px solid var(--color-border-light);
        border-radius: var(--radius-lg);
        padding: var(--spacing-lg);
    }

    .quartile-card h5 {
        margin: 0 0 var(--spacing-md) 0;
        color: var(--color-text);
        font-size: var(--font-sm);
        font-weight: 600;
        text-align: center;
    }

    .quartile-bars {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
    }

    .quartile-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-xs) 0;
        border-bottom: 1px solid var(--color-border-light);
    }

    .quartile-bar:last-child {
        border-bottom: none;
    }

    .quartile-label {
        color: var(--color-text-muted);
        font-size: var(--font-xs);
        font-weight: 500;
    }

    .quartile-value {
        color: var(--color-text);
        font-size: var(--font-sm);
        font-weight: 600;
        background: var(--color-primary-light);
        color: var(--color-primary);
        padding: 0.2rem 0.5rem;
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


</style>