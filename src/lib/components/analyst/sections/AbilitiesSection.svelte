<script lang="ts">
    import type { FilterProps } from "$lib/types";
    import type { BirthDateRange } from "$lib/api/player";
    import DetailedStatCard from "../charts/DetailedStatCard.svelte";
    import TopPlayersPanel from "../charts/TopPlayersPanel.svelte";

    let {
        statistics,
        loading,
        error,
        players,
        birthDateRange = null,
        allFilteredIds = null,
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
        statistics: any;
        loading: boolean;
        error: string | null;
        players: any[];
        birthDateRange?: BirthDateRange | null;
        allFilteredIds?: number[] | null;
    } & FilterProps = $props();
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
            <TopPlayersPanel
                {selectedCountry} {selectedClub}
                {minCA} {maxCA} {minPA} {maxPA}
                {preferredFoot} {favouriteNumber}
                {birthYear} {nameQuery} {sortBy}
                {allFilteredIds} {birthDateRange}
            />

            <h3>Ability Distribution Analysis</h3>
            <div class="stats-grid">
                {#if statistics.ca_stats}
                    <DetailedStatCard title="Current Ability (CA)" icon="⚡" stats={statistics.ca_stats} />
                {/if}
                {#if statistics.pa_stats}
                    <DetailedStatCard title="Potential Ability (PA)" icon="⭐" stats={statistics.pa_stats} />
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
        font-size: var(--font-sm);
        font-weight: 600;
        background: var(--color-primary-light);
        color: var(--color-primary);
        padding: 0.2rem 0.5rem;
        border-radius: var(--radius-sm);
    }
</style>
