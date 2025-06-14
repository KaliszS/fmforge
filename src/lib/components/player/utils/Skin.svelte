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
    input[type="number"] {
        padding: 4px 6px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 0.9rem;
        min-width: 100px;
    }

    .skin-circle {
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
