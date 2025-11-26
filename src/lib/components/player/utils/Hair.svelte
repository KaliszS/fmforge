<script lang="ts">
    import { HAIR_COLORS } from "$lib/constants";

    let {
        hair_color = $bindable(),
        edit_mode,
    }: { hair_color: number; edit_mode: boolean } = $props();
</script>

{#if edit_mode}
    <select class="select" bind:value={hair_color} title="Hair colour">
        {#each HAIR_COLORS as hc}
            <option value={hc.id}>{hc.label}</option>
        {/each}
    </select>
{:else}
    {@const hc = HAIR_COLORS.find((h) => h.id === hair_color) ?? {
        label: "Unknown",
        color: "#999",
    }}
    <div
        class="hair-circle"
        title={`Hair colour: ${hc.label}`}
        style="background-color: {hc.color}"
    >
        H
    </div>
{/if}

<style>
    .hair-circle {
        width: 2em;
        height: 2em;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: var(--font-sm);
        font-weight: bold;
        color: #f5f5dc;
        border: 1px solid #666;
        box-shadow: 0 0 0 0.5px #fff, 0 0 0 1px #666;
    }

    /* Edit mode styling */
    :global(.edit-mode) select {
        min-width: 6rem;
    }
</style>
