<script lang="ts">
    import Ethnicity from "./utils/Ethnicity.svelte";
    import Skin from "./utils/Skin.svelte";
    import Hair from "./utils/Hair.svelte";
    import HeightWeight from "./utils/HeightWeight.svelte";

    let {
        ethnicity = $bindable(),
        skin_tone = $bindable(),
        hair_color = $bindable(),
        height = $bindable(),
        weight = $bindable(),
        edit_mode = $bindable(),
    }: {
        ethnicity: number;
        skin_tone: number;
        hair_color: number;
        height: number;
        weight: number;
        edit_mode: boolean;
    } = $props();
</script>

<div class="appearance">
    <Ethnicity bind:ethnicity {edit_mode} />
    <Skin bind:skin_tone {edit_mode} />
    <Hair bind:hair_color {edit_mode} />
    <HeightWeight bind:height bind:weight {edit_mode} />
</div>

<style>
    .appearance {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5em;
        align-items: center;
    }
</style>
