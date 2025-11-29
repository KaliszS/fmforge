<script lang="ts">
    import type { PlayerRecord } from "$lib/types";
    import { ETHNICITY_MAP, HAIR_COLORS, getSkinColor } from "$lib/constants";

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

    function getSortedCounts(counts: Record<string, number>) {
        return Object.entries(counts).sort(([, a], [, b]) => b - a);
    }

    function getEthnicityInfo(idStr: string) {
        const id = parseInt(idStr);
        return ETHNICITY_MAP.get(id) || { title: `Unknown (${id})`, bg: "#ccc", emoji: "❓" };
    }

    function getHairColorInfo(idStr: string) {
        const id = parseInt(idStr);
        return HAIR_COLORS.find(h => h.id === id) || { label: `Unknown (${id})`, color: "#999" };
    }
</script>

<div class="analysis-section">
    {#if loading}
        <div class="loading-state">
            <div class="loading-spinner"></div>
            <p>Loading appearance statistics...</p>
        </div>
    {:else if error}
        <div class="error-state">
            <div class="error-icon">⚠️</div>
            <h4>Error Loading Statistics</h4>
            <p>{error}</p>
        </div>
    {:else if statistics}
        <div class="appearance-content">
            
            <!-- Ethnicity Section -->
            <h3>Ethnicity Distribution</h3>
            {#if statistics.ethnicity_counts && Object.keys(statistics.ethnicity_counts).length > 0}
                <div class="stats-grid">
                    {#each getSortedCounts(statistics.ethnicity_counts) as [id, count]}
                        {@const info = getEthnicityInfo(id)}
                        <div class="stat-card">
                            <div class="stat-icon-container" style="background-color: {info.bg}">
                                <span class="stat-emoji">{info.emoji}</span>
                            </div>
                            <div class="stat-info">
                                <div class="stat-name">{info.title}</div>
                                <div class="stat-count">{count} players</div>
                            </div>
                            <div class="stat-bar-container">
                                <div class="stat-bar" style="width: {(count / statistics.count) * 100}%"></div>
                            </div>
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="no-data">No ethnicity data available</div>
            {/if}

            <!-- Skin Tone Section -->
            <h3 class="section-title">Skin Tone Distribution</h3>
            {#if statistics.skin_tone_counts && Object.keys(statistics.skin_tone_counts).length > 0}
                <div class="stats-grid">
                    {#each getSortedCounts(statistics.skin_tone_counts) as [tone, count]}
                        <div class="stat-card">
                            <div class="stat-icon-container skin-tone-circle" style="background-color: {getSkinColor(parseInt(tone))}">
                                <span class="stat-emoji">S</span>
                            </div>
                            <div class="stat-info">
                                <div class="stat-name">Tone {tone}</div>
                                <div class="stat-count">{count} players</div>
                            </div>
                            <div class="stat-bar-container">
                                <div class="stat-bar" style="width: {(count / statistics.count) * 100}%"></div>
                            </div>
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="no-data">No skin tone data available</div>
            {/if}

            <!-- Hair Color Section -->
            <h3 class="section-title">Hair Color Distribution</h3>
            {#if statistics.hair_color_counts && Object.keys(statistics.hair_color_counts).length > 0}
                <div class="stats-grid">
                    {#each getSortedCounts(statistics.hair_color_counts) as [id, count]}
                        {@const info = getHairColorInfo(id)}
                        <div class="stat-card">
                            <div class="stat-icon-container hair-circle" style="background-color: {info.color}">
                                <span class="stat-emoji">H</span>
                            </div>
                            <div class="stat-info">
                                <div class="stat-name">{info.label}</div>
                                <div class="stat-count">{count} players</div>
                            </div>
                            <div class="stat-bar-container">
                                <div class="stat-bar" style="width: {(count / statistics.count) * 100}%"></div>
                            </div>
                        </div>
                    {/each}
                </div>
            {:else}
                <div class="no-data">No hair color data available</div>
            {/if}

        </div>
    {:else}
        <div class="placeholder">
            <div class="placeholder-icon">🎨</div>
            <h4>No Data Available</h4>
            <p>No appearance statistics available for the current filters.</p>
        </div>
    {/if}
</div>

<style>
    .appearance-content h3 {
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
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
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
    }

    .skin-tone-circle, .hair-circle {
        color: #fff;
        text-shadow: 0 1px 2px rgba(0,0,0,0.5);
        font-weight: bold;
    }
    
    /* Ensure text is visible on light backgrounds for skin/hair circles if needed, 
       but usually white text with shadow works okay. 
       Let's refine specific cases if needed. */

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
