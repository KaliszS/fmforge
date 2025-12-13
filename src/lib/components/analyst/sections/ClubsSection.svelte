<script lang="ts">
    import type { PlayerRecord } from "$lib/types";
    import { clubMap } from "$lib/constants";

    let { 
        statistics,
        loading,
        error,
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
        nameQuery
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
    } = $props();

    let limit = $state(30);
    let sortByCount = $state(true);

    const displayClubs = $derived.by(() => {
        if (!statistics?.club_counts) return [];
        
        const entries = Object.entries(statistics.club_counts)
            .map(([id, count]) => [parseInt(id), count] as [number, number]);
            
        // 1. Sort by count descending to find the top ones
        entries.sort(([, a], [, b]) => b - a);
        
        // 2. Take top N
        const top = entries.slice(0, limit);
        
        // 3. Sort based on preference
        if (sortByCount) {
            return top;
        }
        
        // Sort alphabetically by name
        return top.sort(([idA], [idB]) => {
            const nameA = getClubName(idA);
            const nameB = getClubName(idB);
            return nameA.localeCompare(nameB);
        });
    });

    function getClubName(id: number) {
        return clubMap[id]?.name || `Club ${id}`;
    }
</script>

<div class="analysis-section">
    {#if loading}
        <div class="loading-state">
            <div class="loading-spinner"></div>
            <p>Loading club statistics...</p>
        </div>
    {:else if error}
        <div class="error-state">
            <div class="error-icon">⚠️</div>
            <h4>Error Loading Statistics</h4>
            <p>{error}</p>
        </div>
    {:else if statistics}
        <div class="clubs-content">
            <div class="section-header">
                <h3>Club Distribution</h3>
                <div class="controls">
                    <button 
                        class="sort-btn" 
                        onclick={() => sortByCount = !sortByCount}
                        title={sortByCount ? "Switch to Alphabetical Sort" : "Switch to Count Sort"}
                    >
                        {sortByCount ? "Sort: Count ⬇" : "Sort: Name A-Z"}
                    </button>
                    <label for="limit-select" class="control-label">Show top:</label>
                    <select id="limit-select" bind:value={limit} class="select limit-select">
                        <option value={10}>10</option>
                        <option value={30}>30</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                        <option value={9999}>All</option>
                    </select>
                </div>
            </div>
            
            {#if statistics.club_counts && Object.keys(statistics.club_counts).length > 0}
                <div class="stats-grid">
                    {#each displayClubs as [id, count]}
                        <div class="stat-card">
                            <div class="stat-info">
                                <div class="stat-name">{getClubName(id)}</div>
                                <div class="stat-count">{count} players</div>
                            </div>
                            <div class="stat-bar-container">
                                <div class="stat-bar" style="width: {(count / statistics.count) * 100}%"></div>
                            </div>
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="no-data">No club data available</div>
            {/if}
        </div>
    {:else}
        <div class="placeholder">
            <div class="placeholder-icon">🏆</div>
            <h4>No Data Available</h4>
            <p>No club statistics available for the current filters.</p>
        </div>
    {/if}
</div>

<style>
    .clubs-content h3 {
        margin: 0;
        color: var(--color-text);
        font-size: var(--font-lg);
        font-weight: 600;
    }

    .section-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-lg);
        flex-wrap: wrap;
        gap: var(--spacing-md);
    }

    .controls {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
    }

    .control-label {
        font-size: var(--font-sm);
        color: var(--color-text-muted);
    }

    .limit-select {
        padding: 0.2em 0.5em;
        font-size: var(--font-sm);
    }

    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--spacing-md);
        margin-bottom: var(--spacing-xl);
    }

    .stat-card {
        background: var(--color-background-light);
        border: 1px solid var(--color-border-light);
        border-radius: var(--radius-md);
        padding: var(--spacing-md);
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        position: relative;
        overflow: hidden;
    }

    .stat-info {
        flex: 1;
        z-index: 1;
    }

    .stat-name {
        font-weight: 600;
        color: var(--color-text);
        font-size: var(--font-sm);
        margin-bottom: 2px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .stat-count {
        font-size: var(--font-xs);
        color: var(--color-text-muted);
    }

    .stat-bar-container {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: var(--color-background);
    }

    .stat-bar {
        height: 100%;
        background: var(--color-primary);
        opacity: 0.5;
    }

    .sort-btn {
        background: var(--color-background-light);
        border: 1px solid var(--color-border-light);
        color: var(--color-text);
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--radius-md);
        font-size: var(--font-sm);
        cursor: pointer;
        transition: all 0.2s;
        margin-right: var(--spacing-sm);
    }

    .sort-btn:hover {
        background: var(--color-background-hover);
        border-color: var(--color-border-hover);
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
    
    .no-data {
        text-align: center;
        color: var(--color-text-muted);
        padding: var(--spacing-lg);
        font-style: italic;
    }
</style>
