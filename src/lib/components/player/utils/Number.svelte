<script lang="ts">
    let {
        favourite_number = $bindable(),
        edit_mode,
    }: { favourite_number?: number | null; edit_mode: boolean } = $props();

    function handleNumberInput(e: Event) {
        const target = e.target as HTMLInputElement;
        const val = target.value.trim();
        const num = parseInt(val);
        
        if (val === "" || isNaN(num) || num <= 0) {
            favourite_number = null;
        } else {
            favourite_number = num;
        }
    }
</script>

{#if edit_mode}
    <div class="number-edit" title="Favourite Number">
        <span class="icon">⭐</span>
        <input
            type="number"
            min="1"
            max="99"
            value={favourite_number ?? ""}
            oninput={handleNumberInput}
            class="input input-number number-input"
            placeholder="--"
        />
    </div>
{:else if favourite_number !== null && favourite_number !== undefined && favourite_number > 0}
    <span class="tag" title="favourite number">⭐ {favourite_number}</span>
{:else}
    <span class="tag tag-empty" title="no favourite number">⭐ --</span>
{/if}

<style>
    .number-input {
        min-width: 6.25rem;
    }
    
    .number-edit {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        background-color: transparent;
        border: none;
        padding: 2px 6px;
    }
    
    .number-edit:focus-within {
        border-color: transparent;
    }
    
    .number-edit .icon {
        font-size: 0.8rem;
    }

    /* Edit mode styling */
    :global(.edit-mode) .number-input {
        min-width: 2.5rem;
        text-align: center;
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        background: var(--color-background);
        padding: 2px;
    }
    
    :global(.edit-mode) .number-input:focus {
        border-color: var(--color-primary);
        box-shadow: 0 0 0 1px var(--color-primary);
    }
</style>
