<script lang="ts">
    import QuickEditModal from "$lib/components/common/QuickEditModal.svelte";

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

    let quickEdit = $state(false);
    let temp_number = $state<number | null>(null);

    function openQuickEdit() {
        if (edit_mode) return;
        temp_number = favourite_number ?? null;
        quickEdit = true;
    }

    function saveQuickEdit() {
        favourite_number = temp_number;
    }

    function handleTempNumberInput(e: Event) {
        const target = e.target as HTMLInputElement;
        const val = target.value.trim();
        const num = parseInt(val);
        if (val === "" || isNaN(num) || num <= 0) {
            temp_number = null;
        } else {
            temp_number = num;
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
{:else}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div style="display:contents" ondblclick={openQuickEdit}>
        {#if favourite_number !== null && favourite_number !== undefined && favourite_number > 0}
            <span class="tag" title="favourite number">⭐ {favourite_number}</span>
        {:else}
            <span class="tag tag-empty" title="no favourite number">⭐ --</span>
        {/if}
    </div>

    <QuickEditModal title="Edit Favourite Number" bind:isOpen={quickEdit} onSave={saveQuickEdit}>
        <label style="display:flex; flex-direction:column; gap:0.5em;">
            <span>Favourite Number</span>
            <input
                type="number"
                min="1"
                max="99"
                value={temp_number ?? ""}
                oninput={handleTempNumberInput}
                class="input"
                placeholder="--"
            />
        </label>
    </QuickEditModal>
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
