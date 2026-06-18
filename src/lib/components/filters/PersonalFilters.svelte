<script lang="ts">
    import { FOOT_OPTIONS } from "$lib/constants";
    import { modSettings } from "$lib/stores/modSettings";
    import type { BirthDateRange } from "$lib/api/player";

    const MONTHS = [
        { value: 1,  label: 'Jan' }, { value: 2,  label: 'Feb' },
        { value: 3,  label: 'Mar' }, { value: 4,  label: 'Apr' },
        { value: 5,  label: 'May' }, { value: 6,  label: 'Jun' },
        { value: 7,  label: 'Jul' }, { value: 8,  label: 'Aug' },
        { value: 9,  label: 'Sep' }, { value: 10, label: 'Oct' },
        { value: 11, label: 'Nov' }, { value: 12, label: 'Dec' },
    ];
    const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

    let {
        preferredFoot = $bindable(),
        favouriteNumber = $bindable(),
        birthYear = $bindable(),
        effectiveBirthYear = $bindable(),
        birthDateRange = $bindable(),
    }: {
        preferredFoot: number | null;
        favouriteNumber: number | null;
        birthYear: number | null;
        effectiveBirthYear: number | null;
        birthDateRange: BirthDateRange | null;
    } = $props();

    let birthDateRangeExpanded = $state(false);
    let birthDayFrom   = $state(1);
    let birthMonthFrom = $state(1);
    let birthDayTo     = $state(31);
    let birthMonthTo   = $state(12);

    $effect(() => {
        if (birthDateRangeExpanded) {
            const isDefault = birthDayFrom === 1 && birthMonthFrom === 1 && birthDayTo === 31 && birthMonthTo === 12;
            birthDateRange = isDefault ? null : { dayFrom: birthDayFrom, monthFrom: birthMonthFrom, dayTo: birthDayTo, monthTo: birthMonthTo };
        } else {
            birthDateRange = null;
        }
    });

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

    function toggleBirthDateRange() {
        birthDateRangeExpanded = !birthDateRangeExpanded;
        if (!birthDateRangeExpanded) {
            birthDayFrom = 1; birthMonthFrom = 1;
            birthDayTo = 31;  birthMonthTo = 12;
        }
    }

    const hasBirthDateRangeFilter = $derived(
        birthDateRange !== null &&
        !(birthDateRange.dayFrom === 1 && birthDateRange.monthFrom === 1 &&
          birthDateRange.dayTo === 31  && birthDateRange.monthTo === 12)
    );
</script>

<div class="filter-row three-cols">
    <div class="filter-item">
        <div class="input-wrapper">
            <span class="input-icon">🦶</span>
            <select
                id="preferredFoot"
                bind:value={preferredFoot}
                class="filter-input filter-select"
                class:placeholder={preferredFoot === null}
                aria-label="Select Preferred Foot"
            >
                <option value={null}>Preferred Foot...</option>
                {#each FOOT_OPTIONS as { value, label, icon }}
                    <option value={value}>{icon} {label}</option>
                {/each}
            </select>
        </div>
    </div>

    <div class="filter-item">
        <div class="input-wrapper">
            <span class="input-icon">🔢</span>
            <input
                id="favouriteNumber"
                type="number"
                bind:value={favouriteNumber}
                placeholder="Favourite Number"
                class="filter-input input-number"
                aria-label="Favourite Number"
            />
        </div>
    </div>

    <div class="filter-item">
        <div class="birth-year-container">
            <div class="input-wrapper">
                <span class="input-icon">📅</span>
                <input
                    id="birthYear"
                    type="number"
                    bind:value={birthYear}
                    placeholder={$modSettings.canToggle ? `Birth Year (${$modSettings.showRealBirthDates ? 'Real' : 'Game'})` : "Birth Year"}
                    class="filter-input input-number"
                    aria-label="Birth Year"
                />
            </div>
            <button
                class="btn-expand-date-range"
                class:active={birthDateRangeExpanded}
                class:has-filter={hasBirthDateRangeFilter}
                onclick={toggleBirthDateRange}
                title={birthDateRangeExpanded ? "Collapse date range" : "Expand date range filter"}
                aria-label={birthDateRangeExpanded ? "Collapse date range" : "Expand date range filter"}
            >
                {birthDateRangeExpanded ? '−' : '+'}
            </button>
        </div>
        {#if birthDateRangeExpanded}
            <div class="birth-date-range-panel">
                <div class="date-range-row">
                    <span class="date-range-label">From:</span>
                    <select bind:value={birthDayFrom} class="filter-input filter-select date-select" aria-label="Day from">
                        {#each DAYS as day}<option value={day}>{day}</option>{/each}
                    </select>
                    <select bind:value={birthMonthFrom} class="filter-input filter-select date-select" aria-label="Month from">
                        {#each MONTHS as { value, label }}<option value={value}>{label}</option>{/each}
                    </select>
                </div>
                <div class="date-range-row">
                    <span class="date-range-label">To:</span>
                    <select bind:value={birthDayTo} class="filter-input filter-select date-select" aria-label="Day to">
                        {#each DAYS as day}<option value={day}>{day}</option>{/each}
                    </select>
                    <select bind:value={birthMonthTo} class="filter-input filter-select date-select" aria-label="Month to">
                        {#each MONTHS as { value, label }}<option value={value}>{label}</option>{/each}
                    </select>
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    .birth-year-container {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
    }

    .btn-expand-date-range {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 1.75rem;
        height: 1.75rem;
        padding: 0;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        background: var(--color-background);
        color: var(--color-text-muted);
        font-size: 1.25rem;
        font-weight: 600;
        cursor: pointer;
        transition: all var(--transition-fast);
        flex-shrink: 0;
    }

    .btn-expand-date-range:hover {
        border-color: var(--color-primary);
        color: var(--color-primary);
        background: var(--color-background-hover);
    }

    .btn-expand-date-range.active {
        background: var(--color-primary);
        border-color: var(--color-primary);
        color: white;
    }

    .btn-expand-date-range.has-filter:not(.active) {
        border-color: var(--color-primary);
        color: var(--color-primary);
    }

    .birth-date-range-panel {
        margin-top: var(--spacing-sm);
        padding: var(--spacing-sm);
        background: var(--color-background-light);
        border: 1px solid var(--color-border-light);
        border-radius: var(--radius-md);
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
    }

    .date-range-row {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
    }

    .date-range-label {
        font-size: var(--font-sm);
        font-weight: 500;
        color: var(--color-text-muted);
        min-width: 3rem;
    }

    .date-select {
        min-width: 4rem !important;
        padding: 0.375rem 1.75rem 0.375rem 0.5rem !important;
        font-size: var(--font-sm);
    }
</style>
