<script lang="ts">
    let {
        ca = $bindable(),
        pa = $bindable(),
        edit_mode = false,
    }: { ca: number; pa: number; edit_mode: boolean } = $props();
</script>

{#if edit_mode}
    <article class="ability-edit">
        <label>
            CA:
            <input
                type="number"
                bind:value={ca}
                min="0"
                max="200"
                class="input input-number ability-input"
            />
        </label>
        <label>
            PA:
            <input
                type="number"
                bind:value={pa}
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
        gap: var(--spacing-xs);
        padding: var(--spacing-xs);
        background-color: var(--color-background-light);
        border-radius: var(--radius-sm);
        border: 1px solid var(--color-border-light);
    }

    .ability-edit label {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
        font-size: var(--font-sm);
        font-weight: 500;
        color: var(--color-text-light);
    }

    .ability-input {
        width: 4.375rem;
    }
</style>
