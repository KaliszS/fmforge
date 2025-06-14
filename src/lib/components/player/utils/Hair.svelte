<script lang="ts">
    let {
        hair_color = $bindable(),
        edit_mode,
    }: { hair_color: number; edit_mode: boolean } = $props();

    const hairColors = [
        { id: 0, label: "Unknown/Random", color: "#999" },
        { id: 1, label: "Blond", color: "#f4e08b" },
        { id: 2, label: "Light brown", color: "#b67d50" },
        { id: 3, label: "Dark brown", color: "#4e342e" },
        { id: 4, label: "Red", color: "#c1440e" },
        { id: 5, label: "Black", color: "#222" },
        { id: 6, label: "Grey", color: "#aaa" },
        { id: 7, label: "Bald", color: "#e0c7a5" },
    ];
</script>

{#if edit_mode}
    <select bind:value={hair_color} title="Hair colour">
        {#each hairColors as hc}
            <option value={hc.id}>{hc.label}</option>
        {/each}
    </select>
{:else}
    {@const hc = hairColors.find((h) => h.id === hair_color) ?? {
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
    select {
        padding: 4px 6px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 0.9rem;
        min-width: 100px;
    }

    .hair-circle {
        width: 2em;
        height: 2em;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.9rem;
        font-weight: bold;
        color: #fff;
    }
</style>
