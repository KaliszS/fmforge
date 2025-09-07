<script lang="ts">
    import { countryMap } from "$lib/countries";
    import { clubMap } from "$lib/clubs";
    import { FOOT_OPTIONS, SORT_OPTIONS } from "$lib/constants";

    let {
        selectedCountry = $bindable(),
        selectedClub = $bindable(),
        minCA = $bindable(),
        maxCA = $bindable(),
        minPA = $bindable(),
        maxPA = $bindable(),
        preferredFoot = $bindable(),
        favouriteNumber = $bindable(),
        birthYear = $bindable(),
        sortBy = $bindable(),
    }: {
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

    let isExpanded = $state(false);

    const countryOptions = Object.entries(countryMap).map(([id, { name }]) => ({
        id: +id,
        name,
    }));

    const clubOptions = Object.entries(clubMap).map(([id, name]) => ({
        id: +id,
        name,
    }));

    function toggleExpanded() {
        isExpanded = !isExpanded;
    }

    function handleKeydown(event: KeyboardEvent) {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            toggleExpanded();
        }
    }

    function clearAllFilters() {
        selectedCountry = null;
        selectedClub = null;
        minCA = null;
        maxCA = null;
        minPA = null;
        maxPA = null;
        preferredFoot = null;
        favouriteNumber = null;
        birthYear = null;
        sortBy = null;
    }

    const hasActiveFilters = $derived(
        selectedCountry !== null ||
        selectedClub !== null ||
        minCA !== null ||
        maxCA !== null ||
        minPA !== null ||
        maxPA !== null ||
        preferredFoot !== null ||
        favouriteNumber !== null ||
        birthYear !== null ||
        sortBy !== null
    );
</script>

<section class="filters-container">
    <div 
        class="filters-header" 
        onclick={toggleExpanded}
        onkeydown={handleKeydown}
        role="button"
        tabindex="0"
        aria-expanded={isExpanded}
        aria-label="Toggle filters panel"
    >
        <div class="filters-title">
            <span class="filters-icon">🔍</span>
            <h3>Filters & Sorting</h3>
            {#if hasActiveFilters}
                <span class="active-indicator">{[selectedCountry, selectedClub, minCA, maxCA, minPA, maxPA, preferredFoot, favouriteNumber, birthYear, sortBy].filter(v => v !== null).length}</span>
            {/if}
        </div>
        <div class="filters-actions">
            {#if hasActiveFilters}
                <button class="btn-clear" onclick={clearAllFilters} title="Clear all filters">
                    ✕
                </button>
            {/if}
            <div class="expand-icon" class:expanded={isExpanded}>
                ▼
            </div>
        </div>
    </div>

    {#if isExpanded}
        <div class="filters-content">
            <div class="filter-grid">
                <!-- Basic Filters Row -->
                <div class="filter-group">
                    <div class="filter-item">
                        <label for="countrySelect" class="filter-label">
                            <span class="filter-icon">🌍</span>
                            Country
                        </label>
                        <div class="filter-controls">
                            <select id="countrySelect" bind:value={selectedCountry} class="input select-input">
                                <option value={null}>Any Country</option>
                                {#each countryOptions as { id, name }}
                                    <option value={id}>{name}</option>
                                {/each}
                            </select>
                            <input
                                type="number"
                                bind:value={selectedCountry}
                                placeholder="ID"
                                class="input input-number filter-input"
                            />
                        </div>
                    </div>

                    <div class="filter-item">
                        <label for="clubSelect" class="filter-label">
                            <span class="filter-icon">🏟️</span>
                            Club
                        </label>
                        <div class="filter-controls">
                            <select id="clubSelect" bind:value={selectedClub} class="input select-input">
                                <option value={null}>Any Club</option>
                                {#each clubOptions as { id, name }}
                                    <option value={id}>{name}</option>
                                {/each}
                            </select>
                            <input
                                type="number"
                                bind:value={selectedClub}
                                placeholder="ID"
                                class="input input-number filter-input"
                            />
                        </div>
                    </div>
                </div>

                <!-- Ability Filters Row -->
                <div class="filter-group">
                    <div class="filter-item">
                        <label for="minCA" class="filter-label">
                            <span class="filter-icon">⚡</span>
                            CA Range
                        </label>
                        <div class="range-inputs">
                            <input
                                id="minCA"
                                type="number"
                                bind:value={minCA}
                                placeholder="Min"
                                class="input input-number range-input"
                            />
                            <span class="range-separator">-</span>
                            <input
                                id="maxCA"
                                type="number"
                                bind:value={maxCA}
                                placeholder="Max"
                                class="input input-number range-input"
                            />
                        </div>
                    </div>

                    <div class="filter-item">
                        <label for="minPA" class="filter-label">
                            <span class="filter-icon">⭐</span>
                            PA Range
                        </label>
                        <div class="range-inputs">
                            <input
                                id="minPA"
                                type="number"
                                bind:value={minPA}
                                placeholder="Min"
                                class="input input-number range-input"
                            />
                            <span class="range-separator">-</span>
                            <input
                                id="maxPA"
                                type="number"
                                bind:value={maxPA}
                                placeholder="Max"
                                class="input input-number range-input"
                            />
                        </div>
                    </div>
                </div>

                <!-- Additional Filters Row -->
                <div class="filter-group">
                    <div class="filter-item">
                        <label for="preferredFoot" class="filter-label">
                            <span class="filter-icon">🦶</span>
                            Preferred Foot
                        </label>
                        <select id="preferredFoot" bind:value={preferredFoot} class="input select-input">
                            <option value={null}>Any</option>
                            {#each FOOT_OPTIONS as { value, label, icon }}
                                <option value={value}>{icon} {label}</option>
                            {/each}
                        </select>
                    </div>

                    <div class="filter-item">
                        <label for="favouriteNumber" class="filter-label">
                            <span class="filter-icon">🔢</span>
                            Favourite Number
                        </label>
                        <input
                            id="favouriteNumber"
                            type="number"
                            bind:value={favouriteNumber}
                            placeholder="e.g. 10"
                            class="input input-number filter-input"
                        />
                    </div>
                </div>

                <!-- Birth Year & Sorting Row -->
                <div class="filter-group">
                    <div class="filter-item">
                        <label for="birthYear" class="filter-label">
                            <span class="filter-icon">📅</span>
                            Birth Year
                        </label>
                        <input
                            id="birthYear"
                            type="number"
                            bind:value={birthYear}
                            placeholder="e.g. 2005"
                            class="input input-number filter-input"
                        />
                    </div>

                    <div class="filter-item">
                        <label for="sortBy" class="filter-label">
                            <span class="filter-icon">📊</span>
                            Sort By
                        </label>
                        <select id="sortBy" bind:value={sortBy} class="input select-input">
                            <option value={null}>Default Order</option>
                            {#each SORT_OPTIONS as { value, label, icon }}
                                <option value={value}>{icon} {label}</option>
                            {/each}
                        </select>
                    </div>
                </div>
            </div>
        </div>
    {/if}
</section>

<style>
    .filters-container {
        margin-bottom: var(--spacing-lg);
        background: var(--color-background);
        border-radius: var(--radius-lg);
        border: 1px solid var(--color-border-light);
        box-shadow: 0 2px 8px var(--color-shadow-light);
        overflow: hidden;
        transition: all var(--transition-normal);
    }

    .filters-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--spacing-lg);
        background: linear-gradient(135deg, var(--color-background-light) 0%, var(--color-background) 100%);
        cursor: pointer;
        user-select: none;
        transition: background-color var(--transition-fast);
    }

    .filters-header:hover {
        background: linear-gradient(135deg, var(--color-background-hover) 0%, var(--color-background-light) 100%);
    }

    .filters-header:focus {
        outline: 2px solid var(--color-primary);
        outline-offset: -2px;
    }

    .filters-title {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
    }

    .filters-icon {
        font-size: 1.2rem;
        filter: drop-shadow(0 1px 2px var(--color-shadow-light));
    }

    .filters-title h3 {
        margin: 0;
        font-size: var(--font-lg);
        font-weight: 600;
        color: var(--color-text);
    }

    .active-indicator {
        background: var(--color-primary);
        color: white;
        border-radius: 50%;
        width: 1.5rem;
        height: 1.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: var(--font-xs);
        font-weight: 600;
        box-shadow: 0 2px 4px var(--color-shadow-primary);
    }

    .filters-actions {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
    }

    .btn-clear {
        background: var(--color-background);
        border: 1px solid var(--color-border);
        border-radius: 50%;
        width: 2rem;
        height: 2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        font-size: var(--font-sm);
        color: var(--color-text-muted);
        transition: all var(--transition-fast);
    }

    .btn-clear:hover {
        background: #ffebee;
        border-color: #f44336;
        color: #d32f2f;
        transform: scale(1.1);
    }

    .expand-icon {
        font-size: var(--font-sm);
        color: var(--color-text-muted);
        transition: transform var(--transition-fast);
    }

    .expand-icon.expanded {
        transform: rotate(180deg);
    }

    .filters-content {
        padding: var(--spacing-lg);
        background: var(--color-background);
        border-top: 1px solid var(--color-border-light);
    }

    .filter-grid {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-lg);
    }

    .filter-group {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(20rem, 1fr));
        gap: var(--spacing-lg);
        align-items: end;
    }

    .filter-item {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
    }

    .filter-label {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        font-size: var(--font-sm);
        font-weight: 600;
        color: var(--color-text);
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .filter-icon {
        font-size: 1.1rem;
        filter: drop-shadow(0 1px 2px var(--color-shadow-light));
    }

    .filter-controls {
        display: flex;
        gap: var(--spacing-xs);
        align-items: center;
    }

    .select-input {
        flex: 1;
        min-width: 8rem;
        cursor: pointer;
        background: var(--color-background);
    }

    .filter-input {
        width: 4rem;
        text-align: center;
    }

    .range-inputs {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
    }

    .range-input {
        width: 4rem;
        text-align: center;
    }

    .range-separator {
        font-weight: 600;
        color: var(--color-text-muted);
        font-size: var(--font-sm);
    }

    .input:focus {
        border-color: var(--color-primary);
        box-shadow: 0 0 0 2px var(--color-shadow-primary);
    }

    .input:hover {
        border-color: var(--color-primary);
    }

    @media (max-width: 768px) {
        .filter-group {
            grid-template-columns: 1fr;
        }
        
        .filters-header {
            padding: var(--spacing-md);
        }
        
        .filters-content {
            padding: var(--spacing-md);
        }
    }
</style>