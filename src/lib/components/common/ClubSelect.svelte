<script lang="ts">
    import { clubMap } from "$lib/constants";
    
    // Convert clubMap to array once
    const allClubs = Object.entries(clubMap).map(([id, data]) => ({
        id: +id,
        name: data.name,
        gameName: data.gameName
    }));

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
    let filteredClubs = $state<{id: number, name: string, gameName: string}[]>([]);
    let inputElement: HTMLInputElement;
    let containerElement: HTMLDivElement;

    // Sync searchTerm with value
    $effect(() => {
        // If value matches a club, set the name
        if (value !== emptyValue && value !== null && value !== undefined && clubMap[value as number]) {
            // Only update if we are not actively searching/selecting to avoid jumping
            if (!isOpen) {
                searchTerm = clubMap[value as number].name;
            }
        } else if (value === emptyValue || value === null || value === undefined) {
            if (!isOpen) {
                searchTerm = "";
            }
        }
    });

    function handleInput(e: Event) {
        const target = e.target as HTMLInputElement;
        searchTerm = target.value;
        
        if (searchTerm === "") {
            value = emptyValue;
        }
        
        isOpen = true;
        filterClubs();
    }

    function filterClubs() {
        if (!searchTerm) {
            filteredClubs = allClubs.slice(0, 50);
            return;
        }
        
        const lowerTerm = searchTerm.toLowerCase();
        filteredClubs = allClubs.filter(club => 
            club.name.toLowerCase().includes(lowerTerm) || 
            club.gameName.toLowerCase().includes(lowerTerm) ||
            club.id.toString().includes(lowerTerm)
        ).slice(0, 50);
    }

    function selectClub(club: {id: number, name: string}) {
        value = club.id;
        searchTerm = club.name;
        isOpen = false;
    }
    
    function handleFocus() {
        if (disabled) return;
        isOpen = true;
        filterClubs();
    }
    
    // Handle clicking outside
    function handleDocumentClick(e: MouseEvent) {
        if (containerElement && !containerElement.contains(e.target as Node)) {
            isOpen = false;
            // Reset search term if no valid selection was made or if we just clicked away
            if (value !== emptyValue && value !== null && value !== undefined && clubMap[value as number]) {
                searchTerm = clubMap[value as number].name;
            } else {
                searchTerm = "";
                // If user typed something but didn't select, should we clear value?
                // If searchTerm is empty, we already cleared value in handleInput.
                // If searchTerm is not empty but doesn't match, we might want to clear or revert.
                // For now, let's assume revert to last valid value (which is what the effect does when isOpen becomes false? No, effect runs on value change)
                // Actually, if I just close, the effect above `if (!isOpen)` will run? 
                // No, effect runs when dependencies change. `isOpen` is a dependency? No, it's inside the `if`.
                // Wait, $effect tracks dependencies.
            }
        }
    }

    // We can use a window click listener or just onblur on the container if it was focusable, 
    // but input blur is tricky with dropdown clicks.
    // Using a svelte:window listener is safer for "click outside".
</script>

<svelte:window onclick={handleDocumentClick} />

<div class="club-select-container" bind:this={containerElement}>
    <div class="input-wrapper">
        {#if icon}
            <span class="input-icon">{icon}</span>
        {/if}
        <input
            {id}
            type="text"
            bind:value={searchTerm}
            oninput={handleInput}
            onfocus={handleFocus}
            {placeholder}
            {disabled}
            class="club-input {inputClass}"
            class:has-icon={!!icon}
            autocomplete="off"
        />
        {#if value !== emptyValue && value !== null && value !== undefined && !disabled}
            <button class="clear-btn" onclick={() => { value = emptyValue; searchTerm = ""; filterClubs(); inputElement?.focus(); }} title="Clear">
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
