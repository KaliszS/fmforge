<script lang="ts">
    import type { PlayerRecord } from "$lib/types";
    import { FOOT_OPTIONS, getFootOption, POSITION_MAP } from "$lib/constants";

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

    function getFootLabel(footId: string): string {
        const id = parseInt(footId);
        const option = getFootOption(id);
        return option ? option.label : `Unknown (${id})`;
    }
    
    function getFootIcon(footId: string): string {
        const id = parseInt(footId);
        const option = getFootOption(id);
        return option ? option.icon : '🦶';
    }

    function getSortedPositions(counts: Record<string, number>) {
        return Object.entries(counts).sort(([, a], [, b]) => b - a);
    }

    function getSortedFootCounts(counts: Record<string, number>) {
        return Object.entries(counts).sort(([, a], [, b]) => b - a);
    }
</script>

<div class="analysis-section">
    {#if loading}
        <div class="loading-state">
            <div class="loading-spinner"></div>
            <p>Loading positional statistics...</p>
        </div>
    {:else if error}
        <div class="error-state">
            <div class="error-icon">⚠️</div>
            <h4>Error Loading Statistics</h4>
            <p>{error}</p>
        </div>
    {:else if statistics}
        <div class="positional-content">
            <h3>Positional Distribution</h3>
            
            {#if Object.keys(statistics.position_counts).length > 0}
                <div class="positions-grid">
                    {#each getSortedPositions(statistics.position_counts) as [position, count]}
                        <div class="position-card">
                            <div class="position-badge-container">
                                <span class="badge badge-{POSITION_MAP[position]?.group || 'unknown'} position-badge">
                                    {POSITION_MAP[position]?.short || position.substring(0, 2)}
                                </span>
                            </div>
                            <div class="position-info">
                                <div class="position-name">{POSITION_MAP[position]?.label || position}</div>
                                <div class="position-count">{count} players</div>
                            </div>
                            <div class="position-bar-container">
                                <div class="position-bar" style="width: {(count / statistics.count) * 100}%"></div>
                            </div>
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="no-data">No position data available</div>
            {/if}

            <h3 class="section-title">Preferred Foot Analysis</h3>
            <div class="foot-stats-grid">
                {#each getSortedFootCounts(statistics.preferred_foot_counts) as [footId, count]}
                    <div class="foot-card">
                        <div class="foot-icon">{getFootIcon(footId)}</div>
                        <div class="foot-info">
                            <div class="foot-label">{getFootLabel(footId)}</div>
                            <div class="foot-count">{count} players</div>
                        </div>
                        <div class="foot-bar-container">
                            <div class="foot-bar" style="width: {(count / statistics.count) * 100}%"></div>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {:else}
        <div class="placeholder">
            <div class="placeholder-icon">🏃</div>
            <h4>No Data Available</h4>
            <p>No positional statistics available for the current filters.</p>
        </div>
    {/if}
</div>

<style>
    .positional-content h3 {
        margin: 0 0 var(--spacing-lg) 0;
        color: var(--color-text);
        font-size: var(--font-lg);
        font-weight: 600;
    }
    
    .section-title {
        margin-top: var(--spacing-xl);
    }

    .positions-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--spacing-md);
        margin-bottom: var(--spacing-xl);
    }

    .position-card {
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

    .position-badge-container {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .position-badge {
        font-size: 0.9rem;
        padding: 0.3em 0.5em;
        min-width: 2.5rem;
        text-align: center;
    }

    .position-info {
        flex: 1;
        z-index: 1;
    }

    .position-name {
        font-weight: 600;
        color: var(--color-text);
        font-size: var(--font-sm);
        margin-bottom: 2px;
    }

    .position-count {
        font-size: var(--font-xs);
        color: var(--color-text-muted);
    }

    .position-bar-container {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: var(--color-background);
    }

    .position-bar {
        height: 100%;
        background: var(--color-primary);
        opacity: 0.5;
    }

    .foot-stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--spacing-md);
    }

    .foot-card {
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

    .foot-icon {
        font-size: 2rem;
        flex-shrink: 0;
    }

    .foot-info {
        flex: 1;
        z-index: 1;
    }

    .foot-label {
        font-weight: 600;
        color: var(--color-text);
        font-size: var(--font-sm);
        margin-bottom: 2px;
    }

    .foot-count {
        font-size: var(--font-xs);
        color: var(--color-text-muted);
    }

    .foot-bar-container {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: var(--color-background);
    }

    .foot-bar {
        height: 100%;
        background: var(--color-primary);
        opacity: 0.5;
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
    }
</style>
