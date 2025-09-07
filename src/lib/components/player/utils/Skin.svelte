<script lang="ts">
    let {
        skin_tone = $bindable(),
        edit_mode,
    }: { skin_tone: number; edit_mode: boolean } = $props();

    function getSkinColor(tone: number) {
        return `hsl(30, 30%, ${100 - tone * 2}%)`;
    }
</script>

{#if edit_mode}
    <input
        type="number"
        min="1"
        max="20"
        bind:value={skin_tone}
        class="input input-number"
        title="Skin tone"
    />
{:else}
    <div
        class="skin-circle"
        title={`Skin tone: ${skin_tone}` + "/ 20"}
        style="background-color: {getSkinColor(skin_tone)}"
    >
        S
    </div>
{/if}

<style>
    .skin-circle {
        width: 2em;
        height: 2em;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: var(--font-sm);
        font-weight: bold;
        color: #fff;
    }

    /* Edit mode styling */
    :global(.edit-mode) input[type="number"] {
        min-width: 3rem;
        text-align: center;
    }
</style>
