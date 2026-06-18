<script lang="ts">
    import Icon from "./common/Icon.svelte";

    let { pageSize = $bindable() }: { pageSize: number } = $props();

    function increment() { pageSize += 1; }
    function decrement() { if (pageSize > 1) pageSize -= 1; }
</script>

<div class="page-size-control">
    <label for="pageSizeInput" class="label">Players per page:</label>
    <div class="page-size-wrapper">
        <input
            id="pageSizeInput"
            type="number"
            min="1"
            bind:value={pageSize}
            class="input input-number page-size-input"
        />
        <div class="page-size-spinners">
            <button class="spinner-btn" onclick={increment} aria-label="Increase">
                <Icon name="chevron-up" size="0.75em" />
            </button>
            <button class="spinner-btn" onclick={decrement} aria-label="Decrease">
                <Icon name="chevron-down" size="0.75em" />
            </button>
        </div>
    </div>
</div>

<style>
    .page-size-control {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        background-color: var(--color-background-light);
        padding: 4px 8px 4px 12px;
        border-radius: 100px;
        border: 1px solid var(--color-border);
    }

    .page-size-control .label {
        font-size: 0.7rem;
        text-transform: uppercase;
        color: var(--color-text-muted);
        font-weight: 600;
        letter-spacing: 0.5px;
        margin: 0;
    }

    .page-size-wrapper {
        display: flex;
        align-items: stretch;
        background-color: var(--color-background);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-sm);
        padding: 0;
        overflow: hidden;
        height: 26px;
    }

    .page-size-input {
        width: 2.5rem;
        text-align: center;
        border: none;
        padding: 0;
        font-size: var(--font-sm);
        font-weight: 600;
        background-color: transparent;
        color: var(--color-text);
        -moz-appearance: textfield;
    }

    .page-size-input::-webkit-outer-spin-button,
    .page-size-input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    .page-size-input:focus {
        outline: none;
    }

    .page-size-spinners {
        display: flex;
        flex-direction: column;
        border-left: 1px solid var(--color-border);
        width: 16px;
    }

    .spinner-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        flex: 1;
        background: var(--color-background-light);
        border: none;
        cursor: pointer;
        color: var(--color-text-muted);
        padding: 0;
        transition: all 0.1s;
        line-height: 0;
    }

    .spinner-btn:hover {
        background-color: var(--color-background-hover);
        color: var(--color-primary);
    }

    .spinner-btn:first-child {
        border-bottom: 1px solid var(--color-border);
    }
</style>
