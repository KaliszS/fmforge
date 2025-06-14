<script lang="ts">
    let {
        height = $bindable(),
        weight = $bindable(),
        edit_mode,
    }: { height: number; weight: number; edit_mode: boolean } = $props();
</script>

{#if edit_mode}
    <input type="number" bind:value={height} title="Height in cm" />
    <input type="number" bind:value={weight} title="Weight in kg" />
{:else}
    <section class="height-icon" title={`Height: ${height} cm`}>
        📏 <span>{height}</span>
    </section>
    <section class="weidth-icon" title={`Weight: ${weight} kg`}>
        🏋️ <span>{weight}</span>
    </section>
{/if}

<style>
    input[type="number"] {
        padding: 4px 6px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 0.9rem;
        min-width: 100px;
    }

    .height-icon,
    .weidth-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.75em 0.7em;
        font-size: 0.7em;
        gap: 0.25em;
        border-radius: 0.5em;
        border: 1px solid #ccc;
        background-color: #f9f9f9;
    }

    .height-icon span,
    .weidth-icon span {
        font-weight: 600;
        font-size: 1rem;
        line-height: 1;
    }
</style>
