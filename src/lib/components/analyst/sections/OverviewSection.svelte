<script lang="ts">
    import type { PlayerRecord } from "$lib/types";
    import PositionChart from "../charts/PositionChart.svelte";
    import SimpleStatCard from "../charts/SimpleStatCard.svelte";

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
                <SimpleStatCard 
                    value={statistics.count} 
                    label="Total Players" 
                />
                
                {#if statistics.ca_stats}
                    <SimpleStatCard 
                        value={Math.round(statistics.ca_stats.mean)} 
                        label="Avg CA" 
                        subValue={`${statistics.ca_stats.min} - ${statistics.ca_stats.max}`}
                        subLabel="Range"
                    />
                {/if}
                
                {#if statistics.pa_stats}
                    <SimpleStatCard 
                        value={Math.round(statistics.pa_stats.mean)} 
                        label="Avg PA" 
                        subValue={`${statistics.pa_stats.min} - ${statistics.pa_stats.max}`}
                        subLabel="Range"
                    />
                {/if}
                
                {#if statistics.height_stats}
                    <SimpleStatCard 
                        value={`${Math.round(statistics.height_stats.mean)}cm`} 
                        label="Avg Height" 
                    />
                {/if}
                
                {#if statistics.weight_stats}
                    <SimpleStatCard 
                        value={`${Math.round(statistics.weight_stats.mean)}kg`} 
                        label="Avg Weight" 
                    />
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
        max-width: 800px;
        margin-left: auto;
        margin-right: auto;
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

    .position-breakdown {
        margin-top: var(--spacing-xl);
    }

    .position-breakdown h4 {
        margin: 0 0 var(--spacing-md) 0;
        color: var(--color-text);
        font-size: var(--font-base);
        font-weight: 600;
    }
</style>
