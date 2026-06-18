<script lang="ts">
    import { countryMap, POSITION_MAP } from "$lib/constants";
    import ClubSelect from "$lib/components/common/ClubSelect.svelte";

    let {
        nameQuery = $bindable(),
        selectedCountry = $bindable(),
        selectedClub = $bindable(),
        selectedPosition = $bindable(),
        selectedFavouriteClub = $bindable(),
    }: {
        nameQuery: string | null;
        selectedCountry: number | null;
        selectedClub: number | null;
        selectedPosition: string | null;
        selectedFavouriteClub: number | null;
    } = $props();

    let searchInput = $state(nameQuery ?? "");
    let debounceTimer: ReturnType<typeof setTimeout>;

    const countryOptions = Object.entries(countryMap).map(([id, { name }]) => ({
        id: +id,
        name,
    }));

    function handleSearchInput(event: Event) {
        const value = (event.target as HTMLInputElement).value;
        searchInput = value;
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            nameQuery = value.trim() === "" ? null : value.trim();
        }, 300);
    }
</script>

<div class="filter-row three-cols">
    <div class="filter-item">
        <div class="input-group">
            <span class="input-icon">👤</span>
            <input
                id="nameSearch"
                type="text"
                value={searchInput}
                oninput={handleSearchInput}
                placeholder="Search by name..."
                class="filter-input"
                style="width: 100%"
                aria-label="Search by name"
            />
        </div>
    </div>

    <div class="filter-item">
        <div class="input-group">
            <span class="input-icon">🌍</span>
            <select
                id="countrySelect"
                bind:value={selectedCountry}
                class="filter-input filter-select"
                class:placeholder={selectedCountry === null}
                aria-label="Select Country"
            >
                <option value={null}>Select Country...</option>
                {#each countryOptions as { id, name }}
                    <option value={id}>{name}</option>
                {/each}
            </select>
            <input
                type="number"
                bind:value={selectedCountry}
                placeholder="ID"
                class="filter-input input-number filter-id-input"
                aria-label="Country ID"
            />
        </div>
    </div>

    <div class="filter-item">
        <div class="input-group">
            <div style="flex: 1; min-width: 12rem;">
                <ClubSelect bind:value={selectedClub} emptyValue={null} placeholder="Select Club..." icon="🏟️" />
            </div>
            <input
                type="number"
                bind:value={selectedClub}
                placeholder="ID"
                class="filter-input input-number filter-id-input"
                aria-label="Club ID"
            />
        </div>
    </div>
</div>

<div class="filter-row two-cols">
    <div class="filter-item">
        <div class="input-group">
            <span class="input-icon">📍</span>
            <select
                id="positionSelect"
                bind:value={selectedPosition}
                class="filter-input filter-select"
                class:placeholder={selectedPosition === null}
                aria-label="Select Position"
            >
                <option value={null}>Select Position...</option>
                {#each Object.entries(POSITION_MAP) as [key, { label, short }]}
                    <option value={key}>{short} - {label}</option>
                {/each}
            </select>
        </div>
    </div>

    <div class="filter-item">
        <div class="input-group">
            <div style="flex: 1; min-width: 12rem;">
                <ClubSelect bind:value={selectedFavouriteClub} emptyValue={null} placeholder="Select Favourite Club..." icon="❤️" />
            </div>
            <input
                type="number"
                bind:value={selectedFavouriteClub}
                placeholder="ID"
                class="filter-input input-number filter-id-input"
                aria-label="Favourite Club ID"
            />
        </div>
    </div>
</div>
