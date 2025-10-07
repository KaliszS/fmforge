<script lang="ts">
    import type { PlayerRecord } from "$lib/types";
    import { getPlayerStatistics } from "$lib/api/player";
    import PositionChart from "../charts/PositionChart.svelte";

    let { 
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
        sortBy
    }: { 
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
        sortBy: string | null;
    } = $props();

    let statistics = $state<any>(null);
    let loading = $state(true);
    let error = $state<string | null>(null);

    // Load statistics when component mounts or filters change
    $effect(async () => {
        loading = true;
        error = null;
        try {
            statistics = await getPlayerStatistics(
                selectedCountry,
                selectedClub,
                minCA,
                maxCA,
                minPA,
                maxPA,
                preferredFoot,
                favouriteNumber,
                birthYear,
                sortBy
            );
        } catch (err) {
            error = err instanceof Error ? err.message : 'Failed to load statistics';
            console.error('Error loading statistics:', err);
        } finally {
            loading = false;
        }
    });
</script>

<div class="analysis-section">
    {#if loading}
        <div class="loading-state">
            <div class="loading-spinner"></div>
            <p>Loading statistics...</p>
        </div>
    {:else if error}
        <div class="error-state">
            <div class="error-icon">⚠️</div>
            <h4>Error Loading Statistics</h4>
            <p>{error}</p>
        </div>
    {:else if statistics}
        <div class="statistics-content">
            <h3>Overview Statistics</h3>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">{statistics.count}</div>
                    <div class="stat-label">Total Players</div>
                </div>
                
                {#if statistics.ca_stats}
                    <div class="stat-card">
                        <div class="stat-number">{Math.round(statistics.ca_stats.mean)}</div>
                        <div class="stat-label">Avg CA</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">{statistics.ca_stats.min} - {statistics.ca_stats.max}</div>
                        <div class="stat-label">CA Range</div>
                    </div>
                {/if}
                
                {#if statistics.pa_stats}
                    <div class="stat-card">
                        <div class="stat-number">{Math.round(statistics.pa_stats.mean)}</div>
                        <div class="stat-label">Avg PA</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">{statistics.pa_stats.min} - {statistics.pa_stats.max}</div>
                        <div class="stat-label">PA Range</div>
                    </div>
                {/if}
                
                {#if statistics.height_stats}
                    <div class="stat-card">
                        <div class="stat-number">{Math.round(statistics.height_stats.mean)}cm</div>
                        <div class="stat-label">Avg Height</div>
                    </div>
                {/if}
                
                {#if statistics.weight_stats}
                    <div class="stat-card">
                        <div class="stat-number">{Math.round(statistics.weight_stats.mean)}kg</div>
                        <div class="stat-label">Avg Weight</div>
                    </div>
                {/if}
            </div>

            {#if Object.keys(statistics.position_counts).length > 0}
                <div class="position-breakdown">
                    <h4>Position Distribution</h4>
                    <PositionChart data={statistics.position_counts} />
                </div>
            {/if}
        </div>
    {:else}
        <div class="placeholder">
            <div class="placeholder-icon">📈</div>
            <h4>No Data Available</h4>
            <p>No statistics available for the current filters.</p>
        </div>
    {/if}
</div>

<style>
    .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: var(--spacing-lg);
        margin-top: var(--spacing-xl);
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
    }

    .stat-card {
        background: var(--color-background-light);
        border: 1px solid var(--color-border-light);
        border-radius: var(--radius-lg);
        padding: var(--spacing-lg);
        text-align: center;
    }

    .stat-number {
        font-size: 2rem;
        font-weight: 700;
        color: var(--color-primary);
        margin-bottom: var(--spacing-xs);
    }

    .stat-label {
        font-size: var(--font-sm);
        color: var(--color-text-muted);
        font-weight: 500;
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

    .statistics-content h3 {
        margin: 0 0 var(--spacing-sm) 0;
        color: var(--color-text);
        font-size: var(--font-lg);
    }

    .statistics-content p {
        margin: 0 0 var(--spacing-xl) 0;
        color: var(--color-text-muted);
        font-size: var(--font-sm);
    }

    .position-breakdown, .foot-breakdown {
        margin-top: var(--spacing-xl);
    }

    .position-breakdown h4, .foot-breakdown h4 {
        margin: 0 0 var(--spacing-md) 0;
        color: var(--color-text);
        font-size: var(--font-base);
        font-weight: 600;
    }

    [data-theme="dark"] .stat-card {
        background: var(--color-background);
        border-color: var(--color-border);
    }

</style>
