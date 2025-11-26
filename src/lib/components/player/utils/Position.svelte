<script lang="ts">
    import { POSITION_MAP } from "$lib/constants";

    let {
        position = $bindable(),
        edit_mode,
    }: { position: string; edit_mode: boolean } = $props();
</script>

{#if edit_mode}
    <select class="select" bind:value={position}>
        {#each Object.entries(POSITION_MAP) as [key, value]}
            <option value={key}>{value.label}</option>
        {/each}
    </select>
{:else}
    <span
        class="badge badge-{POSITION_MAP[position]?.group}"
        title={POSITION_MAP[position]?.label}
    >
        {POSITION_MAP[position]?.short}
    </span>
{/if}

<style>
    /* Edit mode styling */
    :global(.edit-mode) select {
        min-width: 6rem;
    }
</style>

