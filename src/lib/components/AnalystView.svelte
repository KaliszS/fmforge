<script lang="ts">
    import type { PlayerRecord } from "$lib/types";

    let { 
        players = $bindable(),
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

    // This will be used for statistics calculations based on filtered players
    // For now, it's empty as requested
</script>

<div class="analyst-view">
    <div class="analyst-header">
        <h2>📊 Statistics & Analysis</h2>
        <p class="analyst-subtitle">Analyze player data based on current filters</p>
    </div>
    
    <div class="analyst-content">
        <div class="placeholder">
            <div class="placeholder-icon">📈</div>
            <h3>Statistics Coming Soon</h3>
            <p>This view will display comprehensive statistics and analysis based on your filtered player pool.</p>
            <div class="filter-summary">
                <h4>Current Filter Summary:</h4>
                <ul>
                    {#if selectedCountry !== null}
                        <li>Country: {selectedCountry}</li>
                    {/if}
                    {#if selectedClub !== null}
                        <li>Club: {selectedClub}</li>
                    {/if}
                    {#if minCA !== null || maxCA !== null}
                        <li>CA Range: {minCA || 'Any'} - {maxCA || 'Any'}</li>
                    {/if}
                    {#if minPA !== null || maxPA !== null}
                        <li>PA Range: {minPA || 'Any'} - {maxPA || 'Any'}</li>
                    {/if}
                    {#if preferredFoot !== null}
                        <li>Preferred Foot: {preferredFoot}</li>
                    {/if}
                    {#if favouriteNumber !== null}
                        <li>Favourite Number: {favouriteNumber}</li>
                    {/if}
                    {#if birthYear !== null}
                        <li>Birth Year: {birthYear}</li>
                    {/if}
                    {#if sortBy !== null}
                        <li>Sort By: {sortBy}</li>
                    {/if}
                </ul>
                <p class="player-count">Filtered Players: {players.length}</p>
            </div>
        </div>
    </div>
</div>

<style>
    .analyst-view {
        background: var(--color-background);
        border-radius: var(--radius-xl);
        box-shadow: 0 0.1875rem 0.625rem var(--color-shadow-light);
        overflow: hidden;
        min-height: 20rem;
    }

    .analyst-header {
        padding: var(--spacing-xl);
        background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
        color: white;
        text-align: center;
    }

    .analyst-header h2 {
        margin: 0 0 var(--spacing-sm) 0;
        font-size: var(--font-2xl);
        font-weight: 700;
        text-shadow: 0 2px 4px var(--color-shadow-primary);
    }

    .analyst-subtitle {
        margin: 0;
        font-size: var(--font-lg);
        opacity: 0.9;
        font-weight: 400;
    }

    .analyst-content {
        padding: var(--spacing-xl);
    }

    .placeholder {
        text-align: center;
        color: var(--color-text-muted);
    }

    .placeholder-icon {
        font-size: 4rem;
        margin-bottom: var(--spacing-lg);
        opacity: 0.6;
    }

    .placeholder h3 {
        margin: 0 0 var(--spacing-md) 0;
        font-size: var(--font-xl);
        color: var(--color-text);
    }

    .placeholder p {
        margin: 0 0 var(--spacing-lg) 0;
        font-size: var(--font-lg);
        line-height: 1.6;
    }

    .filter-summary {
        background: var(--color-background-light);
        border-radius: var(--radius-lg);
        padding: var(--spacing-lg);
        margin-top: var(--spacing-lg);
        text-align: left;
        border: 1px solid var(--color-border-light);
    }

    .filter-summary h4 {
        margin: 0 0 var(--spacing-md) 0;
        font-size: var(--font-lg);
        color: var(--color-text);
        font-weight: 600;
    }

    .filter-summary ul {
        margin: 0 0 var(--spacing-md) 0;
        padding-left: var(--spacing-lg);
        list-style: none;
    }

    .filter-summary li {
        margin-bottom: var(--spacing-xs);
        font-size: var(--font-sm);
        color: var(--color-text-muted);
        position: relative;
    }

    .filter-summary li::before {
        content: '•';
        color: var(--color-primary);
        font-weight: bold;
        position: absolute;
        left: -var(--spacing-md);
    }

    .player-count {
        margin: 0;
        padding: var(--spacing-sm) var(--spacing-md);
        background: var(--color-primary);
        color: white;
        border-radius: var(--radius-sm);
        font-weight: 600;
        font-size: var(--font-sm);
        display: inline-block;
    }

    @media (max-width: 768px) {
        .analyst-header {
            padding: var(--spacing-lg);
        }
        
        .analyst-content {
            padding: var(--spacing-lg);
        }
        
        .placeholder-icon {
            font-size: 3rem;
        }
    }
</style>
