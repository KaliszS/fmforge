<script lang="ts">
    import { countryMap, clubMap, FOOT_OPTIONS, SORT_OPTIONS } from "$lib/constants";
    import { modSettings } from "$lib/stores/modSettings";

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
        effectiveBirthYear = $bindable(),
        nameQuery = $bindable(),
        sortBy = $bindable(),
        disabled = false,
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
        effectiveBirthYear: number | null;
        nameQuery: string | null;
        sortBy: string[] | null;
        disabled?: boolean;
    } = $props();

    let isExpanded = $state(false);
    let searchInput = $state(nameQuery ?? "");
    let debounceTimer: ReturnType<typeof setTimeout>;

    function handleSearchInput(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        searchInput = value;
        
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            nameQuery = value.trim() === "" ? null : value.trim();
        }, 300);
    }

    const countryOptions = Object.entries(countryMap).map(([id, { name }]) => ({
        id: +id,
        name,
    }));

    const clubOptions = Object.entries(clubMap).map(([id, name]) => ({
        id: +id,
        name,
    }));

    function toggleExpanded() {
        if (!disabled) {
            isExpanded = !isExpanded;
        }
    }

    function handleKeydown(event: KeyboardEvent) {
        if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            toggleExpanded();
        }
    }

    function clearAllFilters() {
        if (!disabled) {
            selectedCountry = null;
            selectedClub = null;
            minCA = null;
            maxCA = null;
            minPA = null;
            maxPA = null;
            preferredFoot = null;
            favouriteNumber = null;
            birthYear = null;
            nameQuery = null;
            searchInput = "";
        }
    }

    // Convert birth year based on mod settings
    $effect(() => {
        if (!birthYear || !$modSettings.canToggle) {
            effectiveBirthYear = birthYear;
            return;
        }
        
        if ($modSettings.showRealBirthDates) {
            const fmEdition = parseInt($modSettings.fmEdition);
            const retroYear = parseInt($modSettings.retroYear);
            effectiveBirthYear = birthYear + (fmEdition - 1 - retroYear);
        } else {
            effectiveBirthYear = birthYear;
        }
    });

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
        nameQuery !== null
    );
</script>

<section class="filters-container" class:disabled>
    <div 
        class="filters-header" 
        class:disabled
        onclick={toggleExpanded}
        onkeydown={handleKeydown}
        role="button"
        tabindex="0"
        aria-expanded={isExpanded}
        aria-label="Toggle filters panel"
    >
        <div class="filters-title">
            <span class="filters-icon">🔍</span>
            <h3>Filters</h3>
            {#if hasActiveFilters && !disabled}
                <span class="active-indicator">{[selectedCountry, selectedClub, minCA, maxCA, minPA, maxPA, preferredFoot, favouriteNumber, birthYear, nameQuery].filter(v => v !== null).length}</span>
            {/if}
        </div>
        <div class="filters-actions">
            {#if hasActiveFilters && !disabled}
                <button class="btn-clear" onclick={(e) => { e.stopPropagation(); clearAllFilters(); }} title="Clear all filters">
                    ✕
                </button>
            {/if}
            <div class="expand-icon">
                {isExpanded ? "▼" : "▶"}
            </div>
        </div>
    </div>

    {#if isExpanded}
        <div class="filters-content">
            {#if disabled}
                <div class="disabled-message">
                    <div class="disabled-icon">🚫</div>
                    <h4>Filters are disabled for edited players view</h4>
                    <p>Switch back to normal view to use filters and sorting options.</p>
                </div>
            {:else}
                <div class="filter-grid">
                    <!-- General Section -->
                    <div class="filter-section">
                        <div class="filter-row three-cols">
                            <div class="filter-item">
                                <label for="nameSearch" class="filter-label">
                                    Name
                                </label>
                                <div class="input-group">
                                    <span class="input-icon">👤</span>
                                    <input
                                        id="nameSearch"
                                        type="text"
                                        value={searchInput}
                                        oninput={handleSearchInput}
                                        placeholder="Search by name..."
                                        class="input"
                                        style="width: 100%"
                                    />
                                </div>
                            </div>

                            <div class="filter-item">
                                <label for="countrySelect" class="filter-label">
                                    Country
                                </label>
                                <div class="input-group">
                                    <span class="input-icon">🌍</span>
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
                                        class="input input-number id-input"
                                    />
                                </div>
                            </div>

                            <div class="filter-item">
                                <label for="clubSelect" class="filter-label">
                                    Club
                                </label>
                                <div class="input-group">
                                    <span class="input-icon">🏟️</span>
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
                                        class="input input-number id-input"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Attributes Section -->
                    <div class="filter-section">
                        <div class="filter-row">
                            <div class="filter-item">
                                <label for="minCA" class="filter-label">
                                    CA Range
                                </label>
                                <div class="range-group">
                                    <div class="input-wrapper">
                                        <span class="input-icon">⚡</span>
                                        <input
                                            id="minCA"
                                            type="number"
                                            bind:value={minCA}
                                            placeholder="Min"
                                            class="input input-number range-input"
                                        />
                                    </div>
                                    <span class="range-separator">to</span>
                                    <div class="input-wrapper">
                                        <input
                                            id="maxCA"
                                            type="number"
                                            bind:value={maxCA}
                                            placeholder="Max"
                                            class="input input-number range-input"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div class="filter-item">
                                <label for="minPA" class="filter-label">
                                    PA Range
                                </label>
                                <div class="range-group">
                                    <div class="input-wrapper">
                                        <span class="input-icon">⭐</span>
                                        <input
                                            id="minPA"
                                            type="number"
                                            bind:value={minPA}
                                            placeholder="Min"
                                            class="input input-number range-input"
                                        />
                                    </div>
                                    <span class="range-separator">to</span>
                                    <div class="input-wrapper">
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
                        </div>
                    </div>

                    <!-- Personal Section -->
                    <div class="filter-section">
                        <div class="filter-row three-cols">
                            <div class="filter-item">
                                <label for="preferredFoot" class="filter-label">
                                    Preferred Foot
                                </label>
                                <div class="input-wrapper">
                                    <span class="input-icon">🦶</span>
                                    <select id="preferredFoot" bind:value={preferredFoot} class="input select-input">
                                        <option value={null}>Any</option>
                                        {#each FOOT_OPTIONS as { value, label, icon }}
                                            <option value={value}>{icon} {label}</option>
                                        {/each}
                                    </select>
                                </div>
                            </div>

                            <div class="filter-item">
                                <label for="favouriteNumber" class="filter-label">
                                    Favourite Number
                                </label>
                                <div class="input-wrapper">
                                    <span class="input-icon">🔢</span>
                                    <input
                                        id="favouriteNumber"
                                        type="number"
                                        bind:value={favouriteNumber}
                                        placeholder="e.g. 10"
                                        class="input input-number"
                                    />
                                </div>
                            </div>

                            <div class="filter-item">
                                <label for="birthYear" class="filter-label">
                                    Birth Year
                                    {#if $modSettings.canToggle}
                                        <span class="birth-year-mode-indicator">
                                            ({$modSettings.showRealBirthDates ? 'Real' : 'Game'})
                                        </span>
                                    {/if}
                                </label>
                                <div class="input-wrapper">
                                    <span class="input-icon">📅</span>
                                    <input
                                        id="birthYear"
                                        type="number"
                                        bind:value={birthYear}
                                        placeholder="Year"
                                        class="input input-number"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    {/if}
</section>

<style>
    .filters-container {
        margin-bottom: var(--spacing-lg);
        background: var(--color-background);
        border-radius: var(--radius-lg);
        border: 1px solid var(--color-border-light);
        box-shadow: 0 1px 3px var(--color-shadow-light);
        overflow: hidden;
        transition: all var(--transition-normal);
    }

    .filters-container.disabled {
        opacity: 0.6;
        background: var(--color-background-light);
        border-color: var(--color-border);
    }

    .filters-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--spacing-md) var(--spacing-lg);
        background: var(--color-background-light);
        cursor: pointer;
        user-select: none;
        transition: all var(--transition-fast);
        min-height: 3rem;
        border-bottom: 1px solid transparent;
    }

    .filters-header[aria-expanded="true"] {
        border-bottom-color: var(--color-border-light);
    }

    .filters-header.disabled {
        cursor: not-allowed;
        background: var(--color-background-light);
    }

    .filters-header:hover:not(.disabled) {
        background: var(--color-background-hover);
    }

    .filters-title {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
    }

    .filters-icon {
        font-size: 1.1rem;
        opacity: 0.8;
    }

    .filters-title h3 {
        margin: 0;
        font-size: var(--font-base);
        font-weight: 600;
        color: var(--color-text);
    }

    .active-indicator {
        background: var(--color-primary);
        color: white;
        border-radius: 50%;
        width: 1.25rem;
        height: 1.25rem;
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

    .expand-icon {
        font-size: var(--font-sm);
        color: var(--color-text-muted);
        transition: color var(--transition-fast);
    }

    .filters-content {
        padding: var(--spacing-lg);
        background: var(--color-background);
    }

    .filter-grid {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xl);
    }

    .filter-section {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
    }

    .filter-row {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: var(--spacing-xl);
    }

    .filter-row.three-cols {
        /* No special handling needed for flex */
    }

    .filter-item {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
    }

    .filter-label {
        font-size: var(--font-sm);
        font-weight: 500;
        color: var(--color-text);
        display: flex;
        align-items: center;
        width: 100%;
    }

    .birth-year-mode-indicator {
        font-size: var(--font-xs);
        font-weight: normal;
        color: var(--color-text-muted);
        margin-left: var(--spacing-xs);
    }

    /* Input Groups */
    .input-group, .input-wrapper {
        display: flex;
        align-items: center;
        position: relative;
        width: auto;
    }

    .input-group {
        gap: var(--spacing-sm);
    }

    .input-icon {
        position: absolute;
        left: 0.75rem;
        z-index: 1;
        font-size: 1rem;
        pointer-events: none;
        opacity: 0.7;
    }

    /* Inputs & Selects */
    .input {
        width: auto;
        min-width: 12rem;
        padding: 0.5rem 0.75rem;
        font-size: var(--font-sm);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        background-color: var(--color-background);
        color: var(--color-text);
        transition: all var(--transition-fast);
    }

    .input-wrapper .input,
    .input-group .select-input,
    .input-group input[type="text"] {
        padding-left: 2.25rem; /* Space for icon */
    }

    .input:hover {
        border-color: var(--color-border-focus);
    }

    .input:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 3px var(--color-shadow-primary);
    }

    .select-input {
        appearance: none;
        background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
        background-repeat: no-repeat;
        background-position: right 0.75rem center;
        background-size: 1em;
        padding-right: 2.5rem;
        min-width: 14rem;
    }

    .id-input {
        width: 5rem;
        min-width: 0;
        flex-shrink: 0;
        text-align: center;
        padding-left: 0.75rem !important;
    }

    /* Range Inputs */
    .range-group {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
    }

    .range-separator {
        font-size: var(--font-xs);
        color: var(--color-text-muted);
        font-weight: 500;
        text-transform: uppercase;
    }

    .range-input {
        text-align: center;
        width: 6rem;
        min-width: 0;
    }

    .input-wrapper .range-input {
        padding-left: 2.25rem;
    }

    /* Disabled State */
    .disabled-message {
        text-align: center;
        padding: var(--spacing-xl) var(--spacing-lg);
        background: var(--color-background-light);
        border-radius: var(--radius-md);
        border: 2px dashed var(--color-border);
    }

    .disabled-icon {
        font-size: 2rem;
        margin-bottom: var(--spacing-md);
        opacity: 0.7;
    }

    .disabled-message h4 {
        margin: 0 0 var(--spacing-sm) 0;
        font-size: var(--font-lg);
        font-weight: 600;
        color: var(--color-text);
    }

    .disabled-message p {
        margin: 0;
        font-size: var(--font-sm);
        color: var(--color-text-muted);
        line-height: 1.5;
    }

    /* Dark theme improvements */
    [data-theme="dark"] .filters-container {
        border-color: var(--color-border);
        box-shadow: 0 1px 3px var(--color-shadow);
    }

    [data-theme="dark"] .select-input {
        background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23a0a0a0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    }

    [data-theme="dark"] .btn-clear:hover {
        background: #4a1a1a;
        border-color: #ff6b6b;
        color: #ff8a8a;
    }

    [data-theme="dark"] .disabled-message {
        background: var(--color-background);
        border-color: var(--color-border);
    }

    @media (max-width: 768px) {
        .filter-row, .filter-row.three-cols {
            grid-template-columns: 1fr;
            gap: var(--spacing-md);
        }
        
        .filters-header {
            padding: var(--spacing-md);
        }
        
        .filters-content {
            padding: var(--spacing-md);
        }

        .input-group {
            flex-direction: column;
            align-items: stretch;
        }

        .id-input {
            width: 100%;
        }
    }
</style>