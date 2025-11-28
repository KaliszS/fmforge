<script lang="ts">
    import type { PlayerRecord } from "$lib/types";
    import { getPlayerStatistics } from "$lib/api/player";
    import { countryMap } from "$lib/constants";
    import { getFlagComponent } from "$lib/flags";
    import SimpleStatCard from "../charts/SimpleStatCard.svelte";

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

    function getCountryName(id: string): string {
        const countryId = parseInt(id);
        return countryMap[countryId]?.name || `Country ${id}`;
    }

    function getCountryCode(id: string): string {
        const countryId = parseInt(id);
        return countryMap[countryId]?.code || 'Un';
    }

    function getSortedNationalities(counts: Record<string, number>) {
        return Object.entries(counts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 20); // Top 20
    }
</script>

<div class="geography-section">
    {#if loading}
        <div class="loading-state">
            <div class="loading-spinner"></div>
            <p>Loading geography statistics...</p>
        </div>
    {:else if error}
        <div class="error-state">
            <div class="error-icon">⚠️</div>
            <h4>Error Loading Statistics</h4>
            <p>{error}</p>
        </div>
    {:else if statistics}
        <div class="geography-content">
            <h3>Geographic Distribution</h3>
            
            <div class="stats-grid">
                <SimpleStatCard 
                    value={Object.keys(statistics.nationality_counts).length} 
                    label="Countries Represented" 
                />
            </div>

            <div class="nationality-list">
                <h4>Top Nationalities</h4>
                <div class="countries-grid">
                    {#each getSortedNationalities(statistics.nationality_counts) as [id, count]}
                        {@const FlagComponent = getFlagComponent(getCountryCode(id))}
                        <div class="country-card">
                            <div class="country-flag">
                                <FlagComponent size="30" />
                            </div>
                            <div class="country-info">
                                <div class="country-name">{getCountryName(id)}</div>
                                <div class="country-count">{count} players</div>
                            </div>
                            <div class="country-bar-container">
                                <div class="country-bar" style="width: {(count / statistics.count) * 100}%"></div>
                            </div>
                        </div>
                    {/each}
                </div>
            </div>
        </div>
    {:else}
        <div class="placeholder">
            <div class="placeholder-icon">🌍</div>
            <h4>No Data Available</h4>
            <p>No geography statistics available for the current filters.</p>
        </div>
    {/if}
</div>

<style>
    .geography-content h3 {
        margin: 0 0 var(--spacing-lg) 0;
        color: var(--color-text);
        font-size: var(--font-lg);
    }

    .stats-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: var(--spacing-lg);
        margin-bottom: var(--spacing-xl);
    }

    .nationality-list {
        margin-top: var(--spacing-xl);
    }

    .nationality-list h4 {
        margin: 0 0 var(--spacing-md) 0;
        color: var(--color-text);
        font-size: var(--font-base);
        font-weight: 600;
    }

    .countries-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: var(--spacing-md);
    }

    .country-card {
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

    .country-flag {
        flex-shrink: 0;
        width: 30px;
        display: flex;
        justify-content: center;
    }

    .country-info {
        flex: 1;
        z-index: 1;
    }

    .country-name {
        font-weight: 600;
        color: var(--color-text);
        font-size: var(--font-sm);
        margin-bottom: 2px;
    }

    .country-count {
        font-size: var(--font-xs);
        color: var(--color-text-muted);
    }

    .country-bar-container {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: var(--color-background);
    }

    .country-bar {
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
</style>
