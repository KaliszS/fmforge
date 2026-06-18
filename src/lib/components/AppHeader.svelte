<script lang="ts">
    import type { InvalidRow } from "$lib/api/file";
    import type { BirthDateRange } from "$lib/api/player";
    import ThemeToggle from "./ThemeToggle.svelte";
    import ModSettings from "./ModSettings.svelte";
    import FilePanel from "./FilePanel.svelte";
    import PageSizeControl from "./PageSizeControl.svelte";
    import Icon from "./common/Icon.svelte";

    let {
        currentPage = $bindable(),
        pageSize = $bindable(),
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
        invalidRows = $bindable(),
        editTypeFilter = $bindable(),
        triggerRefresh,
        onToggleDualView
    }: {
        currentPage: number;
        pageSize: number;
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
        invalidRows: InvalidRow[];
        editTypeFilter: 'all' | 'modified' | 'added' | 'deleted';
        triggerRefresh: () => void;
        onToggleDualView?: () => void;
    } = $props();
</script>

<section class="top-bar">
    <div class="file-and-settings">
        <FilePanel
            bind:currentPage
            bind:selectedCountry
            bind:selectedClub
            bind:selectedPosition
            bind:selectedFavouriteClub
            bind:minCA
            bind:maxCA
            bind:minPA
            bind:maxPA
            bind:preferredFoot
            bind:favouriteNumber
            bind:birthYear
            bind:effectiveBirthYear
            bind:birthDateRange
            bind:nameQuery
            bind:sortBy
            bind:invalidRows
            bind:editTypeFilter
            {triggerRefresh}
        />
        <ModSettings />
    </div>

    <div class="top-bar-right">
        <div class="controls-group">
            <PageSizeControl bind:pageSize />
            <button
                class="dual-view-btn"
                onclick={onToggleDualView}
                title="Toggle Secondary Window"
            >
                <div class="dual-view-icon">
                    <Icon name="split-view" size="1.2em" />
                </div>
            </button>
            <ThemeToggle />
        </div>
    </div>
</section>

<style>
    .top-bar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        padding: var(--spacing-sm) var(--spacing-md);
        background-color: var(--color-background);
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        box-shadow: 0 0.1875rem 0.5rem var(--color-shadow);
        min-height: 4rem;
        z-index: 1000;
    }

    .file-and-settings {
        display: flex;
        align-items: center;
        gap: var(--spacing-xl);
        flex: 1;
    }

    .top-bar-right {
        display: flex;
        align-items: center;
        min-width: 12rem;
        margin-left: auto;
    }

    .controls-group {
        display: flex;
        flex-direction: row;
        gap: var(--spacing-lg);
        align-items: center;
        width: 100%;
        justify-content: flex-end;
    }

    .dual-view-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.5rem;
        height: 2.5rem;
        border: 1.5px solid var(--color-border);
        border-radius: var(--radius-lg);
        background-color: var(--color-background);
        color: var(--color-text);
        cursor: pointer;
        transition:
            background-color var(--transition-normal),
            border-color var(--transition-normal),
            box-shadow var(--transition-normal),
            transform var(--transition-fast);
        box-shadow: 0 0.125rem 0.3125rem var(--color-shadow);
        user-select: none;
        position: relative;
        overflow: hidden;
    }

    .dual-view-btn:hover {
        background-color: var(--color-background-hover);
        border-color: var(--color-primary);
        box-shadow: 0 0.3125rem 0.9375rem var(--color-shadow-primary);
        transform: translateY(-0.125rem);
    }

    .dual-view-btn:active {
        transform: translateY(0);
        box-shadow: 0 0.125rem 0.3125rem var(--color-shadow);
    }

    .dual-view-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .dual-view-btn:hover .dual-view-icon {
        transform: scale(1.05);
    }

    .dual-view-btn:active .dual-view-icon {
        transform: scale(0.95);
    }

    :global([data-theme="dark"]) .dual-view-btn:hover {
        box-shadow: 0 0.3125rem 0.9375rem var(--color-shadow-primary), 0 0 1rem var(--color-shadow-primary);
    }
</style>
