<script lang="ts">
    import { FOOT_OPTIONS } from "$lib/constants";

    let {
        preferred_foot = $bindable(),
        edit_mode,
    }: { preferred_foot: number; edit_mode: boolean } = $props();
</script>

{#if edit_mode}
    <select class="input input-select foot-select" bind:value={preferred_foot}>
        {#each FOOT_OPTIONS as foot}
            <option value={foot.value}>
                {foot.icon}
                {foot.label}
            </option>
        {/each}
    </select>
{:else}
    {#each FOOT_OPTIONS as foot (foot.value)}
        {#if foot.value === preferred_foot}
            <span class={"tag foot " + foot.style} title={foot.label}>
                {foot.icon}
            </span>
        {/if}
    {/each}
{/if}

<style>
    /* Edit mode styling */
    :global(.edit-mode) .foot-select {
        min-width: 4rem;
        width: auto;
    }
</style>