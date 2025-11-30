<script lang="ts">
    let {
        ca = $bindable(),
        pa = $bindable(),
        edit_mode = false,
    }: { ca: number; pa: number; edit_mode: boolean } = $props();

    function handleInput(e: Event, type: 'ca' | 'pa') {
        const target = e.target as HTMLInputElement;
        let val = parseInt(target.value);
        
        if (isNaN(val)) val = 0;
        if (val < 0) val = 0;
        if (val > 200) val = 200;
        
        if (type === 'ca') ca = val;
        else pa = val;
    }
</script>

{#if edit_mode}
    <article class="ability-edit">
        <label>
            CA:
            <input
                type="number"
                value={ca}
                oninput={(e) => handleInput(e, 'ca')}
                min="0"
                max="200"
                class="input input-number ability-input"
            />
        </label>
        <label>
            PA:
            <input
                type="number"
                value={pa}
                oninput={(e) => handleInput(e, 'pa')}
                min="0"
                max="200"
                class="input input-number ability-input"
            />
        </label>
    </article>
{:else}
    <div class="ability-display">
        <div class="ability-half ability-ca" title="CA">
            <div class="ability-value">{ca}</div>
        </div>
        <div class="separator-vertical"></div>
        <div class="ability-half ability-pa" title="PA">
            <div class="ability-value">{pa}</div>
        </div>
    </div>
{/if}

<style>
    .ability-edit {
        display: flex;
        gap: var(--spacing-md);
    }

    .ability-edit label {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        font-size: var(--font-sm);
        font-weight: 700;
        color: var(--color-text-muted);
        background-color: var(--color-background);
        padding: 2px 6px;
        border-radius: var(--radius-sm);
        border: 1px solid var(--color-border);
    }
    
    .ability-edit label:focus-within {
        border-color: var(--color-primary);
        color: var(--color-primary);
    }

    .ability-input {
        width: 3.5rem;
        border: none;
        background: transparent;
        font-weight: normal;
        text-align: center;
        padding: 0;
    }
    
    .ability-input:focus {
        box-shadow: none;
    }
</style>
