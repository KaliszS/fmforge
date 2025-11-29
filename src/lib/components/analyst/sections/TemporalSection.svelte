<script lang="ts">
    import type { PlayerRecord } from "$lib/types";
    import { getPlayerStatistics } from "$lib/api/player";
    import { modSettings } from "$lib/stores/modSettings";

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
        sortBy,
        nameQuery
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
        sortBy: string[] | null;
        nameQuery: string | null;
    } = $props();

    let statistics = $state<any>(null);
    let loading = $state(true);
    let error = $state<string | null>(null);

    const MONTHS = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const sortedYears = $derived.by(() => {
        if (!statistics?.birth_year_counts) return [];
        
        const counts = statistics.birth_year_counts;
        const settings = $modSettings;
        
        let offset = 0;
        if (settings.showRealBirthDates && settings.canToggle && settings.fmEdition && settings.retroYear) {
            const fmEdition = parseInt(settings.fmEdition);
            const retroYear = parseInt(settings.retroYear);
            if (!isNaN(fmEdition) && !isNaN(retroYear)) {
                offset = fmEdition - 1 - retroYear;
            }
        }
        
        const yearCounts: Record<number, number> = {};
        Object.entries(counts).forEach(([yearStr, count]) => {
            const inGameYear = parseInt(yearStr);
            const displayYear = inGameYear - offset;
            yearCounts[displayYear] = (yearCounts[displayYear] || 0) + (count as number);
        });
        
        return Object.entries(yearCounts)
            .map(([year, count]) => [parseInt(year), count] as [number, number])
            .sort(([a], [b]) => a - b);
    });

    $effect(() => {
        const loadData = async () => {
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
                    nameQuery,
                    sortBy
                );
            } catch (err) {
                error = err instanceof Error ? err.message : 'Failed to load statistics';
                console.error('Error loading statistics:', err);
            } finally {
                loading = false;
            }
        };
        loadData();
    });

    function getSortedMonths(counts: Record<string, number>) {
        // Sort by month index (1-12)
        return Object.entries(counts)
            .map(([month, count]) => [parseInt(month), count] as [number, number])
            .sort(([a], [b]) => a - b);
    }
    
    function getMonthName(month: number) {
        return MONTHS[month - 1] || `Month ${month}`;
    }
    
    function getSeasonIcon(month: number) {
        if (month >= 3 && month <= 5) return "🌱"; // Spring
        if (month >= 6 && month <= 8) return "☀️"; // Summer
        if (month >= 9 && month <= 11) return "🍂"; // Autumn
        return "❄️"; // Winter
    }
</script>

<div class="analysis-section">
    {#if loading}
        <div class="loading-state">
            <div class="loading-spinner"></div>
            <p>Loading temporal statistics...</p>
        </div>
    {:else if error}
        <div class="error-state">
            <div class="error-icon">⚠️</div>
            <h4>Error Loading Statistics</h4>
            <p>{error}</p>
        </div>
    {:else if statistics}
        <div class="temporal-content">
            
            <!-- Birth Year Section -->
            <h3>Birth Year Distribution ({$modSettings.showRealBirthDates ? 'Real-Life' : 'In-Game'})</h3>
            {#if statistics.birth_year_counts && Object.keys(statistics.birth_year_counts).length > 0}
                <div class="stats-grid">
                    {#each sortedYears as [year, count]}
                        <div class="stat-card">
                            <div class="stat-icon-container year-icon">
                                <span class="stat-emoji">📅</span>
                            </div>
                            <div class="stat-info">
                                <div class="stat-name">{year}</div>
                                <div class="stat-count">{count} players</div>
                            </div>
                            <div class="stat-bar-container">
                                <div class="stat-bar" style="width: {(count / statistics.count) * 100}%"></div>
                            </div>
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="no-data">No birth year data available</div>
            {/if}

            <!-- Birth Month Section -->
            <h3 class="section-title">Birth Month Distribution</h3>
            {#if statistics.birth_month_counts && Object.keys(statistics.birth_month_counts).length > 0}
                <div class="stats-grid">
                    {#each getSortedMonths(statistics.birth_month_counts) as [month, count]}
                        <div class="stat-card">
                            <div class="stat-icon-container month-icon">
                                <span class="stat-emoji">{getSeasonIcon(month)}</span>
                            </div>
                            <div class="stat-info">
                                <div class="stat-name">{getMonthName(month)}</div>
                                <div class="stat-count">{count} players</div>
                            </div>
                            <div class="stat-bar-container">
                                <div class="stat-bar" style="width: {(count / statistics.count) * 100}%"></div>
                            </div>
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="no-data">No birth month data available</div>
            {/if}

        </div>
    {:else}
        <div class="placeholder">
            <div class="placeholder-icon">📅</div>
            <h4>No Data Available</h4>
            <p>No temporal statistics available for the current filters.</p>
        </div>
    {/if}
</div>

<style>
    .temporal-content h3 {
        margin: 0 0 var(--spacing-lg) 0;
        color: var(--color-text);
        font-size: var(--font-lg);
        font-weight: 600;
    }
    
    .section-title {
        margin-top: var(--spacing-xl);
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

    .stat-icon-container {
        width: 2.5rem;
        height: 2.5rem;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        border: 1px solid rgba(0,0,0,0.1);
        background-color: var(--color-background);
    }

    .year-icon {
        background-color: #e0f2fe;
        color: #0284c7;
    }

    .month-icon {
        background-color: #f0fdf4;
        color: #16a34a;
    }

    .stat-emoji {
        font-size: 1.2rem;
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
