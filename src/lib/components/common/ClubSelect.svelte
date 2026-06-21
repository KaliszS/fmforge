<script lang="ts">
    import { clubNames, clubNameFrom, ensureClubNames, searchClubs, type ClubLite } from "$lib/clubs";

    let {
        value = $bindable(),
        placeholder = "Select Club...",
        disabled = false,
        id = undefined,
        emptyValue = null,
        inputClass = "",
        icon = undefined
    }: {
        value: number | null | undefined;
        placeholder?: string;
        disabled?: boolean;
        id?: string;
        emptyValue?: any;
        inputClass?: string;
        icon?: string;
    } = $props();

    let searchTerm = $state("");
    let isOpen = $state(false);
    let filteredClubs = $state<ClubLite[]>([]);
    let inputElement = $state<HTMLInputElement>();
    let containerElement: HTMLDivElement;
    let searchTimer: ReturnType<typeof setTimeout> | undefined;

    function hasValue(): boolean {
        return value !== emptyValue && value !== null && value !== undefined;
    }

    // Keep the input text in sync with the selected value, resolving its name
    // from the backend when needed. Skip while the dropdown is open so we don't
    // clobber what the user is typing. (Closing the dropdown re-runs this and
    // restores the selected club's name.)
    $effect(() => {
        if (hasValue()) {
            ensureClubNames([value as number]);
            if (!isOpen) {
                searchTerm = clubNameFrom($clubNames, value as number) ?? "";
            }
        } else if (!isOpen) {
            searchTerm = "";
        }
    });

    // Close when user clicks outside the container. Using mousedown (not click)
    // so the listener fires before the dropdown button's onclick handler —
    // but we guard against inside clicks so selecting still works.
    $effect(() => {
        if (!isOpen) return;
        function onOutsideMousedown(e: MouseEvent) {
            if (containerElement && !containerElement.contains(e.target as Node)) {
                isOpen = false;
            }
        }
        document.addEventListener('mousedown', onOutsideMousedown, true);
        return () => document.removeEventListener('mousedown', onOutsideMousedown, true);
    });

    function runSearch() {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(async () => {
            filteredClubs = await searchClubs(searchTerm, 50);
        }, 150);
    }

    function handleInput(e: Event) {
        const target = e.target as HTMLInputElement;
        searchTerm = target.value;

        if (searchTerm === "") {
            value = emptyValue;
        }

        isOpen = true;
        runSearch();
    }

    function openDropdown() {
        if (disabled) return;
        isOpen = true;
        runSearch();
    }

    function selectClub(club: ClubLite) {
        value = club.id;
        searchTerm = club.name;
        isOpen = false;
    }
</script>

<div class="club-select-container" bind:this={containerElement}>
    <div class="input-wrapper">
        {#if icon}
            <span class="input-icon">{icon}</span>
        {/if}
        <input
            {id}
            bind:this={inputElement}
            type="text"
            bind:value={searchTerm}
            oninput={handleInput}
            onclick={openDropdown}
            {placeholder}
            {disabled}
            class="club-input {inputClass}"
            class:has-icon={!!icon}
            autocomplete="off"
        />
        {#if value !== emptyValue && value !== null && value !== undefined && !disabled}
            <button class="clear-btn" onclick={() => { value = emptyValue; searchTerm = ""; runSearch(); inputElement?.focus(); }} title="Clear">
                ✕
            </button>
        {/if}
    </div>

    {#if isOpen}
        <div class="dropdown">
            {#each filteredClubs as club}
                <button
                    class="dropdown-item"
                    onclick={() => selectClub(club)}
                    type="button"
                    class:selected={value === club.id}
                >
                    <div class="club-info">
                        <span class="club-name">{club.name}</span>
                        {#if club.name !== club.gameName}
                            <span class="game-name">({club.gameName})</span>
                        {/if}
                    </div>
                    <span class="club-id">#{club.id}</span>
                </button>
            {/each}
            {#if filteredClubs.length === 0}
                <div class="no-results">No clubs found</div>
            {/if}
        </div>
    {/if}
</div>

<style>
    .club-select-container {
        position: relative;
        width: 100%;
        min-width: 12rem;
    }

    .input-wrapper {
        position: relative;
        display: flex;
        align-items: center;
    }

    .input-icon {
        position: absolute;
        left: 0.75rem;
        z-index: 1;
        pointer-events: none;
        opacity: 0.7;
        font-size: 1rem;
    }

    .club-input {
        width: 100%;
        padding: 0.5rem 0.75rem;
        font-size: var(--font-sm);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-md);
        background: var(--color-background);
        color: var(--color-text);
        transition: all var(--transition-fast);
    }

    .club-input::placeholder {
        color: var(--color-placeholder);
        opacity: 1;
    }

    .club-input.has-icon {
        padding-left: 2.25rem;
    }

    .club-input:focus {
        outline: none;
        border-color: var(--color-primary);
        box-shadow: 0 0 0 2px var(--color-primary-transparent);
    }

    .clear-btn {
        position: absolute;
        right: 0.5rem;
        background: none;
        border: none;
        color: var(--color-text-muted);
        cursor: pointer;
        font-size: 0.8rem;
        padding: 0.2rem;
    }
    
    .clear-btn:hover {
        color: var(--color-text);
    }

    .dropdown {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        max-height: 300px;
        overflow-y: auto;
        background: var(--color-background);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        box-shadow: var(--shadow-md);
        z-index: 1000;
        margin-top: 4px;
    }

    .dropdown-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        padding: 0.5rem;
        border: none;
        background: none;
        text-align: left;
        cursor: pointer;
        color: var(--color-text);
        border-bottom: 1px solid var(--color-border-light);
    }

    .dropdown-item:last-child {
        border-bottom: none;
    }

    .dropdown-item:hover, .dropdown-item.selected {
        background-color: var(--color-background-hover);
    }
    
    .dropdown-item.selected {
        background-color: var(--color-primary-transparent);
    }

    .club-info {
        display: flex;
        flex-direction: column;
    }

    .club-name {
        font-weight: 500;
    }

    .game-name {
        font-size: 0.8rem;
        color: var(--color-text-muted);
    }

    .club-id {
        font-size: 0.8rem;
        color: var(--color-text-muted);
        font-family: monospace;
    }

    .no-results {
        padding: 0.5rem;
        color: var(--color-text-muted);
        text-align: center;
    }
</style>
