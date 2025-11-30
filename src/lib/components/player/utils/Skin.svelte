<script lang="ts">
    import { getSkinColor } from "$lib/constants";
    import QuickEditModal from "$lib/components/common/QuickEditModal.svelte";

    let {
        skin_tone = $bindable(),
        edit_mode,
    }: { skin_tone: number; edit_mode: boolean } = $props();

    function handleInput(e: Event) {
        const target = e.target as HTMLInputElement;
        let val = parseInt(target.value);
        if (isNaN(val)) return;
        
        if (val < 1) val = 1;
        if (val > 20) val = 20;
        
        if (skin_tone !== val) {
            skin_tone = val;
        }
        if (parseInt(target.value) !== val) {
            target.value = val.toString();
        }
    }

    let quickEdit = $state(false);
    let temp_skin = $state(0);

    function openQuickEdit() {
        if (edit_mode) return;
        temp_skin = skin_tone;
        quickEdit = true;
    }

    function saveQuickEdit() {
        skin_tone = temp_skin;
    }

    function handleTempInput(e: Event) {
        const target = e.target as HTMLInputElement;
        let val = parseInt(target.value);
        if (isNaN(val)) return;
        if (val < 1) val = 1;
        if (val > 20) val = 20;
        if (temp_skin !== val) temp_skin = val;
        if (parseInt(target.value) !== val) target.value = val.toString();
    }
</script>

{#if edit_mode}
    <div class="skin-edit" title="Skin tone">
        <span>🎨</span>
        <input
            type="number"
            min="1"
            max="20"
            bind:value={skin_tone}
            oninput={handleInput}
            class="input input-number"
        />
    </div>
{:else}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="skin-circle"
        title={`Skin tone: ${skin_tone}` + "/ 20"}
        style="background-color: {getSkinColor(skin_tone)}"
        ondblclick={openQuickEdit}
    >
        S
    </div>

    <QuickEditModal title="Edit Skin Tone" bind:isOpen={quickEdit} onSave={saveQuickEdit}>
        <label style="display:flex; flex-direction:column; gap:0.5em;">
            <span>Skin Tone (1-20)</span>
            <input
                type="number"
                min="1"
                max="20"
                value={temp_skin}
                oninput={handleTempInput}
                class="input"
            />
        </label>
    </QuickEditModal>
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
        color: #444;
        border: 1px solid #666;
        box-shadow: 0 0 0 0.5px #fff, 0 0 0 1px #666;
    }
    
    .skin-edit {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        background-color: var(--color-background);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        padding: 2px 6px;
    }
    
    .skin-edit:focus-within {
        border-color: var(--color-primary);
    }

    /* Edit mode styling */
    :global(.edit-mode) input[type="number"] {
        min-width: 3rem;
        text-align: center;
        border: none;
        background: transparent;
        padding: 0;
    }
    
    :global(.edit-mode) input[type="number"]:focus {
        box-shadow: none;
    }
</style>
