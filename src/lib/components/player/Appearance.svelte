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
    <div class="skin-hair-group">
        <Skin bind:skin_tone {edit_mode} />
        <Hair bind:hair_color {edit_mode} />
    </div>
    <HeightWeight bind:height bind:weight {edit_mode} />
</div>

<style>
    .appearance {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-sm);
        align-items: center;
    }

    .skin-hair-group {
        display: contents;
    }

    /* Edit mode styling */
    :global(.edit-mode) .appearance {
        gap: var(--spacing-md);
        justify-content: center;
    }

    :global(.edit-mode) .skin-hair-group {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
    }
</style>
