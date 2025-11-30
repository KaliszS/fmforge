<script lang="ts">
    import { ETHNICITY_MAP } from "$lib/constants";

    let {
        ethnicity = $bindable(),
        edit_mode,
    }: { ethnicity: number; edit_mode: boolean } = $props();
</script>

{#if edit_mode}
    <select class="input input-select ethnicity-select" bind:value={ethnicity} title="Ethnicity">
        {#each Array.from(ETHNICITY_MAP.entries()) as [id, e]}
            <option value={id}>{e.title}</option>
        {/each}
    </select>
{:else}
    {@const eth = ETHNICITY_MAP.get(ethnicity) ?? {
        title: "Unknown",
        bg: "#ccc",
        emoji: "❓",
    }}
    <div
        class="ethnicity-icon"
        title={eth.title}
        style="background-color: {eth.bg}"
    >
        {eth.emoji}
    </div>
{/if}

<style>
    .ethnicity-icon {
        width: 2em;
        height: 2em;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: var(--font-sm);
        font-weight: bold;
        color: #444;
        border: 1px solid #666;
        box-shadow: 0 0 0 0.5px #fff, 0 0 0 1px #666;
    }

    /* Edit mode styling */
    :global(.edit-mode) .ethnicity-select {
        min-width: 8rem;
    }
</style>
