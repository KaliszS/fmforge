<script lang="ts">
    // Test-only harness: binds GeneralFilters' $bindable props to local $state
    // and exposes the current values via a snapshot object, so specs can observe
    // the bindable write-back (e.g. the debounced nameQuery).
    import GeneralFilters from "$lib/components/filters/GeneralFilters.svelte";

    let {
        nameQuery = $bindable(null),
        selectedCountry = $bindable(null),
        selectedClub = $bindable(null),
        selectedPosition = $bindable(null),
        selectedFavouriteClub = $bindable(null),
        snapshot,
    }: {
        nameQuery?: string | null;
        selectedCountry?: number | null;
        selectedClub?: number | null;
        selectedPosition?: string | null;
        selectedFavouriteClub?: number | null;
        snapshot: Record<string, unknown>;
    } = $props();

    $effect(() => {
        snapshot.nameQuery = nameQuery;
        snapshot.selectedCountry = selectedCountry;
        snapshot.selectedClub = selectedClub;
        snapshot.selectedPosition = selectedPosition;
        snapshot.selectedFavouriteClub = selectedFavouriteClub;
    });
</script>

<GeneralFilters
    bind:nameQuery
    bind:selectedCountry
    bind:selectedClub
    bind:selectedPosition
    bind:selectedFavouriteClub
/>
