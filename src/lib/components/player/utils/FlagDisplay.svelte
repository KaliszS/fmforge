<script lang="ts">
    import { countryMap } from "$lib/constants";
    import { getFlagComponent } from "$lib/flags";

    let {
        nation = $bindable(),
        edit_mode = $bindable(),
    }: { nation: number; edit_mode: boolean } = $props();

    const country = $derived(
        countryMap[nation] ?? {
            code: "Un",
            name: "Unknown id=" + nation,
        },
    );

    const FlagImage = $derived(getFlagComponent(country.code));
</script>

<article class="flag" title={country.name}>
    <!-- <FlagImage onclick={() => toggleEditMode(getEditMode, setEditMode)} /> -->
    <FlagImage size="45" />
</article>

<style>
    .flag {
        margin: -1em 0em;
    }
</style>
