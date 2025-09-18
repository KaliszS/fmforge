<script lang="ts">
    let {
        ethnicity = $bindable(),
        edit_mode,
    }: { ethnicity: number; edit_mode: boolean } = $props();

    const ethnicityStyles = new Map<
        number,
        { title: string; bg: string; emoji: string }
    >([
        [-1, { title: "Unknown", bg: "#ccc", emoji: "❓" }],
        [0, { title: "Northern European", bg: "#d6eaff", emoji: "🧊" }],
        [1, { title: "Mediterranean / Hispanic", bg: "#ffe4b2", emoji: "🌞" }],
        [
            2,
            {
                title: "North African / Middle Eastern",
                bg: "#f8e0a3",
                emoji: "🐪",
            },
        ],
        [3, { title: "African / Caribbean", bg: "#fdd", emoji: "🌴" }],
        [4, { title: "Asian", bg: "#f0d9ff", emoji: "🍜" }],
        [5, { title: "South East Asian", bg: "#ddf4ff", emoji: "🌸" }],
        [6, { title: "Pacific Islander", bg: "#cceeff", emoji: "🌊" }],
        [7, { title: "Native American", bg: "#e0c4a8", emoji: "🪶" }],
        [8, { title: "Native Australian", bg: "#ffcaa6", emoji: "🦘" }],
        [9, { title: "Mixed Race White / Black", bg: "#bbb", emoji: "♻️" }],
        [10, { title: "East Asian", bg: "#ffebf0", emoji: "🐼" }],
    ]);
</script>

{#if edit_mode}
    <select class="select" bind:value={ethnicity} title="Ethnicity">
        {#each Array.from(ethnicityStyles.entries()) as [id, e]}
            <option value={id}>{e.title}</option>
        {/each}
    </select>
{:else}
    {@const eth = ethnicityStyles.get(ethnicity) ?? {
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
    :global(.edit-mode) select {
        min-width: 8rem;
    }
</style>
