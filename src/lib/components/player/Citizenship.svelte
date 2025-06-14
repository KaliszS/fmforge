<script lang="ts">
    import FlagDisplay from "./utils/FlagDisplay.svelte";
    import FlagPicker from "./utils/FlagPicker.svelte";

    let {
        nation = $bindable(),
        edit_mode = false,
    }: { nation: number; edit_mode: boolean } = $props();
</script>

<article class="citizenship">
    {#if edit_mode}
        <FlagPicker bind:nation />
    {:else}
        <FlagDisplay bind:nation bind:edit_mode />
    {/if}
</article>

<style>
    .citizenship {
        flex-shrink: 0;
        margin-right: 0.5em;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25em;
    }
</style>
