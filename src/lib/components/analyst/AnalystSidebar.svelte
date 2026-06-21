<script lang="ts">
    import type { PlayerRecord, FilterProps } from "$lib/types";
    import { countryMap } from "$lib/constants";
    import { clubNames, ensureClubNames } from "$lib/clubs";
    import type { BirthDateRange } from "$lib/api/player";
    import { ANALYST_TABS } from './tabs';

    let { 
        players = $bindable(),
        statistics,
        loading,
        selectedCountry,
        selectedClub,
        minCA,
        maxCA,
        minPA,
        maxPA,
        preferredFoot,
        favouriteNumber,
        birthYear,
        birthDateRange = null,
        nameQuery,
        sortBy,
        activeTab = $bindable()
    }: {
        players: PlayerRecord[];
        statistics: any;
        loading: boolean;
        birthDateRange?: BirthDateRange | null;
        activeTab: string;
    } & FilterProps = $props();

    let filteredCount = $derived(statistics?.count ?? 0);


    function getCountryName(countryId: number): string {
        return countryMap[countryId]?.name || `Country ${countryId}`;
    }

    $effect(() => {
        ensureClubNames([selectedClub]);
    });

    function getClubName(clubId: number): string {
        return $clubNames.get(clubId) || `Club ${clubId}`;
    }
</script>

<div class="analyst-sidebar">
    <div class="filter-summary">
        <h4>Current Filters</h4>
        <div class="filter-stats">
            <div class="stat-item">
                <span class="stat-label">Players:</span>
                <span class="stat-value">
                    {#if loading}
                        <span class="loading-dots">...</span>
                    {:else}
                        {filteredCount}
                    {/if}
                </span>
            </div>
            {#if selectedCountry !== null}
                <div class="stat-item">
                    <span class="stat-label">Country:</span>
                    <span class="stat-value">{getCountryName(selectedCountry)}</span>
                </div>
            {/if}
            {#if selectedClub !== null}
                <div class="stat-item">
                    <span class="stat-label">Club:</span>
                    <span class="stat-value">{getClubName(selectedClub)}</span>
                </div>
            {/if}
            {#if minCA !== null || maxCA !== null}
                <div class="stat-item">
                    <span class="stat-label">CA:</span>
                    <span class="stat-value">{minCA || 'Any'} - {maxCA || 'Any'}</span>
                </div>
            {/if}
            {#if minPA !== null || maxPA !== null}
                <div class="stat-item">
                    <span class="stat-label">PA:</span>
                    <span class="stat-value">{minPA || 'Any'} - {maxPA || 'Any'}</span>
                </div>
            {/if}
            {#if preferredFoot !== null}
                <div class="stat-item">
                    <span class="stat-label">Foot:</span>
                    <span class="stat-value">{preferredFoot === 1 ? 'Right' : preferredFoot === 2 ? 'Left' : 'Both'}</span>
                </div>
            {/if}
            {#if favouriteNumber !== null}
                <div class="stat-item">
                    <span class="stat-label">Number:</span>
                    <span class="stat-value">{favouriteNumber}</span>
                </div>
            {/if}
            {#if birthYear !== null}
                <div class="stat-item">
                    <span class="stat-label">Birth Year:</span>
                    <span class="stat-value">{birthYear}</span>
                </div>
            {/if}
        </div>
    </div>
    
    <nav class="analysis-nav">
        <ul class="nav-list">
            {#each ANALYST_TABS as tab}
                <li class="nav-item">
                    <button 
                        class="nav-button" 
                        class:active={activeTab === tab.id}
                        onclick={() => activeTab = tab.id}
                    >
                        <span class="nav-icon">{tab.icon}</span>
                        <span class="nav-label">{tab.name}</span>
                    </button>
                </li>
            {/each}
        </ul>
    </nav>
</div>

<style>
    .analyst-sidebar {
        width: 280px;
        background: var(--color-background-light);
        border-right: 1px solid var(--color-border-light);
        display: flex;
        flex-direction: column;
    }

    .filter-summary {
        padding: var(--spacing-lg);
        border-bottom: 1px solid var(--color-border-light);
        background: var(--color-background);
        flex-shrink: 0;
    }

    .analysis-nav {
        flex: 1;
        padding: var(--spacing-lg) 0;
        overflow-y: auto;
    }

    .nav-list {
        list-style: none;
        margin: 0;
        padding: 0;
    }

    .nav-item {
        margin: 0;
    }

    .nav-button {
        width: 100%;
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        padding: var(--spacing-md) var(--spacing-lg);
        border: none;
        background: transparent;
        color: var(--color-text-muted);
        font-size: var(--font-sm);
        font-weight: 500;
        cursor: pointer;
        transition: all var(--transition-fast);
        text-align: left;
        border-left: 3px solid transparent;
    }

    .nav-button:hover {
        background: var(--color-background-hover);
        color: var(--color-text);
    }

    .nav-button.active {
        background: var(--color-primary-light);
        color: var(--color-primary);
        border-left-color: var(--color-primary);
        font-weight: 600;
    }

    .nav-icon {
        font-size: 1.2em;
        width: 1.5rem;
        text-align: center;
    }

    .nav-label {
        flex: 1;
    }


    .filter-summary h4 {
        margin: 0 0 var(--spacing-md) 0;
        font-size: var(--font-sm);
        color: var(--color-text);
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .filter-stats {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
    }

    .stat-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: var(--spacing-xs) 0;
        font-size: var(--font-xs);
    }

    .stat-label {
        color: var(--color-text-muted);
        font-weight: 500;
    }

    .stat-value {
        color: var(--color-text);
        font-weight: 600;
        background: var(--color-background-light);
        padding: 0.1rem 0.4rem;
        border-radius: var(--radius-sm);
    }


</style>
