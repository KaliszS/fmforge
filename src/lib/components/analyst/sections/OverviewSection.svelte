<script lang="ts">
    import type { PlayerRecord, FilterProps } from "$lib/types";
    import SimpleStatCard from "../charts/SimpleStatCard.svelte";
    import { countryMap } from "$lib/constants";
    import { clubNames, clubNameFrom, ensureClubNames } from "$lib/clubs";
    import { modSettings, type ModSettings } from "$lib/stores/modSettings";
    import { getBirthYearOffset } from "$lib/utils/birthYear";

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
    } & FilterProps = $props();

    // Find the highest-count entry; returns its numeric key + count.
    function getTopItem(counts: Record<string | number, number> | undefined): { key: number, count: number } | null {
        if (!counts || Object.keys(counts).length === 0) return null;

        let maxKey: number | null = null;
        let maxCount = -1;

        for (const [key, count] of Object.entries(counts)) {
            if (count > maxCount) {
                maxCount = count as number;
                maxKey = parseInt(key);
            }
        }

        if (maxKey === null) return null;
        return { key: maxKey, count: maxCount };
    }

    // Helper for foot stats
    function getDominantFoot(counts: Record<number, number>): { label: string, count: number } | null {
        if (!counts) return null;
        
        let right = (counts[0] || 0) + (counts[2] || 0);
        let left = (counts[1] || 0) + (counts[3] || 0);
        let both = counts[4] || 0;
        
        if (right === 0 && left === 0 && both === 0) return null;
        
        if (right >= left && right >= both) return { label: "Right", count: right };
        if (left >= right && left >= both) return { label: "Left", count: left };
        return { label: "Both", count: both };
    }    // Helper for age stats
    function getAgeStats(birthYearCounts: Record<number, number>, settings: ModSettings): { min: number, max: number, common: number } | null {
        if (!birthYearCounts || Object.keys(birthYearCounts).length === 0) return null;
        
        const years = Object.keys(birthYearCounts).map(y => parseInt(y));
        const min = Math.min(...years);
        const max = Math.max(...years);
        
        // Most common
        let commonYear = years[0];
        let maxCount = -1;
        for (const [year, count] of Object.entries(birthYearCounts)) {
            if (count > maxCount) {
                maxCount = count as number;
                commonYear = parseInt(year);
            }
        }

        const offset = getBirthYearOffset(settings);
        
        return { 
            min: min - offset, 
            max: max - offset, 
            common: commonYear - offset 
        };
    }

    let topNationality = $derived.by(() => {
        const t = getTopItem(statistics?.nationality_counts);
        return t ? { name: countryMap[t.key]?.name ?? String(t.key), count: t.count } : null;
    });
    let topClub = $derived.by(() => {
        const t = getTopItem(statistics?.club_counts);
        return t ? { name: clubNameFrom($clubNames, t.key) ?? String(t.key), count: t.count } : null;
    });
    // Resolve the top club's name from the backend if not already cached.
    $effect(() => {
        const t = getTopItem(statistics?.club_counts);
        if (t) ensureClubNames([t.key]);
    });
    let dominantFoot = $derived(getDominantFoot(statistics?.preferred_foot_counts));
    let ageStats = $derived(getAgeStats(statistics?.birth_year_counts, $modSettings));
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
                <!-- General -->
                <SimpleStatCard 
                    value={statistics.count} 
                    label="Total Players" 
                />
                
                {#if topNationality}
                    <SimpleStatCard 
                        value={topNationality.count} 
                        label="Top Nationality" 
                        subValue={topNationality.name}
                    />
                {/if}

                {#if topClub}
                    <SimpleStatCard 
                        value={topClub.count} 
                        label="Top Club" 
                        subValue={topClub.name}
                    />
                {/if}

                <!-- Attributes -->
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
                
                <!-- Physical -->
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

                <!-- Demographics -->
                {#if dominantFoot}
                    <SimpleStatCard 
                        value={dominantFoot.label} 
                        label="Dominant Foot" 
                        subValue={`${dominantFoot.count} players`}
                    />
                {/if}

                {#if ageStats}
                    <SimpleStatCard 
                        value={ageStats.common} 
                        label="Common Birth Year" 
                        subValue={`${ageStats.min} - ${ageStats.max}`}
                        subLabel="Range"
                    />
                {/if}
            </div>
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
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--spacing-lg);
        margin-top: var(--spacing-lg);
        width: 100%;
    }

    .statistics-content h3 {
        margin: 0 0 var(--spacing-sm) 0;
        color: var(--color-text);
        font-size: var(--font-lg);
    }

</style>
