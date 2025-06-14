<script lang="ts">
    let {
        favourite_number = $bindable(),
        edit_mode,
    }: { favourite_number?: number | null; edit_mode: boolean } = $props();

    function handleNumberInput(e: Event) {
        const target = e.target as HTMLInputElement;
        const val = target.value.trim();
        favourite_number = val === "" ? null : parseInt(val);
    }
</script>

{#if edit_mode}
    <input
        type="number"
        min="1"
        max="99"
        value={favourite_number ?? ""}
        oninput={handleNumberInput}
        class="number-input"
        placeholder="Number"
    />
{:else if favourite_number !== null && favourite_number !== undefined}
    <span class="tag" title="favourite number">⭐ {favourite_number}</span>
{:else}
    <span class="tag empty-tag" title="no favourite number">⭐ 0</span>
{/if}

<style>
    .tag {
        background-color: #eef0f6;
        border-radius: 5px;
        padding: 0.25em;
        font-size: 0.75rem;
        color: #333;
        display: inline-flex;
        align-items: center;
        white-space: nowrap;
        line-height: 1.2;
    }

    .empty-tag {
        background-color: #f0f0f0;
        color: #999;
        font-style: italic;
    }
</style>
