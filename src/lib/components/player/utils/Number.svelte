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
        class="input input-number number-input"
        placeholder="Number"
    />
{:else if favourite_number !== null && favourite_number !== undefined}
    <span class="tag" title="favourite number">⭐ {favourite_number}</span>
{:else}
    <span class="tag tag-empty" title="no favourite number">⭐ 0</span>
{/if}

<style>
    .number-input {
        min-width: 6.25rem;
    }

    /* Edit mode styling */
    :global(.edit-mode) .number-input {
        min-width: 3rem;
        text-align: center;
    }
</style>
