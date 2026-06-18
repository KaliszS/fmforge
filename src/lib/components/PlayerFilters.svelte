<script lang="ts">
    import type { BirthDateRange } from "$lib/api/player";
    import Icon from "$lib/components/common/Icon.svelte";
    import GeneralFilters from "$lib/components/filters/GeneralFilters.svelte";
    import AttributeFilters from "$lib/components/filters/AttributeFilters.svelte";
    import PersonalFilters from "$lib/components/filters/PersonalFilters.svelte";

    let {
        selectedCountry = $bindable(),
        selectedClub = $bindable(),
        selectedPosition = $bindable(),
        selectedFavouriteClub = $bindable(),
        minCA = $bindable(),
        maxCA = $bindable(),
        minPA = $bindable(),
        maxPA = $bindable(),
        preferredFoot = $bindable(),
        favouriteNumber = $bindable(),
        birthYear = $bindable(),
        effectiveBirthYear = $bindable(),
        birthDateRange = $bindable(),
        nameQuery = $bindable(),
        sortBy = $bindable(),
        disabled = false,
    }: {
        selectedCountry: number | null;
        selectedClub: number | null;
        selectedPosition: string | null;
        selectedFavouriteClub: number | null;
        minCA: number | null;
        maxCA: number | null;
        minPA: number | null;
        maxPA: number | null;
        preferredFoot: number | null;
        favouriteNumber: number | null;
        birthYear: number | null;
        effectiveBirthYear: number | null;
        birthDateRange: BirthDateRange | null;
        nameQuery: string | null;
        sortBy: string[] | null;
        disabled?: boolean;
    } = $props();

    let isExpanded = $state(false);

    function toggleExpanded() {
        if (!disabled) isExpanded = !isExpanded;
    }

    function clearAllFilters() {
        if (disabled) return;
        selectedCountry = null;
        selectedClub = null;
        selectedPosition = null;
        selectedFavouriteClub = null;
        minCA = null;
        maxCA = null;
        minPA = null;
        maxPA = null;
        preferredFoot = null;
        favouriteNumber = null;
        birthYear = null;
        birthDateRange = null;
        nameQuery = null;
    }

    const activeFilterCount = $derived.by(() => [
        selectedCountry, selectedClub, selectedPosition, selectedFavouriteClub,
        minCA, maxCA, minPA, maxPA,
        preferredFoot, favouriteNumber, birthYear, birthDateRange, nameQuery,
    ].filter(v => v !== null).length);

    const hasActiveFilters = $derived(activeFilterCount > 0);
</script>

<section class="filters-container" class:disabled>
    <div class="filters-header" class:disabled>
        <button
            class="filters-toggle"
            onclick={toggleExpanded}
            disabled={disabled}
            aria-expanded={isExpanded}
            aria-label="Toggle filters panel"
        ></button>
        <div class="filters-center" aria-hidden="true">
            <span class="filters-icon">🔍</span>
            <h3>Filters</h3>
            {#if hasActiveFilters && !disabled}
                <span class="active-indicator">{activeFilterCount}</span>
            {/if}
        </div>
        <div class="filters-actions">
            {#if hasActiveFilters && !disabled}
                <button class="btn-clear" onclick={clearAllFilters} title="Clear all filters" aria-label="Clear all filters">
                    <Icon name="x" size="0.75em" />
                </button>
            {/if}
            <span class="expand-icon" aria-hidden="true">{isExpanded ? "▼" : "▶"}</span>
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
                    <div class="filter-section">
                        <GeneralFilters
                            bind:nameQuery
                            bind:selectedCountry
                            bind:selectedClub
                            bind:selectedPosition
                            bind:selectedFavouriteClub
                        />
                    </div>
                    <div class="filter-section">
                        <AttributeFilters
                            bind:minCA
                            bind:maxCA
                            bind:minPA
                            bind:maxPA
                        />
                    </div>
                    <div class="filter-section">
                        <PersonalFilters
                            bind:preferredFoot
                            bind:favouriteNumber
                            bind:birthYear
                            bind:effectiveBirthYear
                            bind:birthDateRange
                        />
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
        position: relative;
        background: var(--color-background-light);
        min-height: 3rem;
        border-bottom: 1px solid transparent;
    }

    .filters-header:has(.filters-toggle[aria-expanded="true"]) {
        border-bottom-color: var(--color-border-light);
    }

    .filters-header.disabled {
        background: var(--color-background-light);
    }

    .filters-toggle {
        position: absolute;
        inset: 0;
        background: transparent;
        border: none;
        cursor: pointer;
        z-index: 0;
    }

    .filters-toggle:disabled {
        cursor: not-allowed;
    }

    .filters-center {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-sm);
        pointer-events: none;
        position: relative;
        z-index: 1;
        padding: var(--spacing-md) 0;
    }

    .filters-icon {
        font-size: 1.1rem;
        opacity: 0.8;
    }

    .filters-center h3 {
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
        padding-right: var(--spacing-lg);
        flex-shrink: 0;
        position: relative;
        z-index: 2;
    }

    .expand-icon {
        font-size: var(--font-sm);
        color: var(--color-text-muted);
    }

    .btn-clear {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.5rem;
        height: 1.5rem;
        padding: 0;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        background: transparent;
        color: var(--color-text-muted);
        cursor: pointer;
        transition: all var(--transition-fast);
        flex-shrink: 0;
    }

    .btn-clear:hover {
        border-color: var(--color-danger, #dc3545);
        color: var(--color-danger, #dc3545);
        background: var(--color-background-hover);
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

    @media (max-width: 768px) {
        .filters-content {
            padding: var(--spacing-md);
        }
    }
</style>
