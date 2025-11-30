<script lang="ts">
    import { getSkinColor } from "$lib/constants";

    let {
        skin_tone = $bindable(),
        edit_mode,
    }: { skin_tone: number; edit_mode: boolean } = $props();

    function handleInput(e: Event) {
        const target = e.target as HTMLInputElement;
        let val = parseInt(target.value);
        if (isNaN(val)) return;
        
        // Allow typing but clamp on blur or if out of bounds significantly?
        // User asked for validation: "moge wpisac cokolwiek... a to musi byc integer z zakresu 1-20"
        // Strict clamping on input might be annoying if typing "10" (typing 1 then 0).
        // But 1-20 is small.
        
        if (val < 1) val = 1;
        if (val > 20) val = 20;
        
        // Only update if changed to avoid cursor jumping if possible, though with simple number input it might be ok
        if (skin_tone !== val) {
            skin_tone = val;
        }
        // Force value back to clamped
        if (parseInt(target.value) !== val) {
            target.value = val.toString();
        }
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
