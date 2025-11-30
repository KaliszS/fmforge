<script lang="ts">
    import { countryMap } from "$lib/constants";

    let { nation = $bindable() }: { nation: number } = $props();

    const countryOptions = Object.entries(countryMap); // [nationality_id, {code, name}];

    // const getEditMode = () => edit_mode;
    // const setEditMode = (val: boolean) => (edit_mode = val);
</script>

<select bind:value={nation} class="input input-select flag-select">
    <!-- onchange={(e) =>
        handleSelectChange(
            e,
            (val) => (nation = val),
            () => toggleEditMode(getEditMode, setEditMode),
        )} -->
    {#each countryOptions as [id, { name }]}
        <option value={+id}>
            {name}
        </option>
    {/each}
</select>

<style>
    .flag-select {
        width: 100%;
        min-width: 10rem;
    }
</style>
