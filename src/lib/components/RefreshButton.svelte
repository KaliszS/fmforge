<script lang="ts">
    import Icon from './common/Icon.svelte';

    let {
        size = 12,
        title = "Refresh",
        onclick = () => {},
        variant = "icon"
    }: {
        size?: number;
        title?: string;
        onclick?: () => void;
        variant?: "icon" | "button";
    } = $props();
</script>

<button
    class="refresh-btn"
    class:button-variant={variant === "button"}
    {title}
    aria-label={title}
    {onclick}
>
    <Icon name="refresh" size={size} />
</button>

<style>
    .refresh-btn {
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        padding: 2px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all var(--transition-fast);
        opacity: 0.7;
    }
    
    .refresh-btn:hover {
        opacity: 1;
        background-color: rgba(0, 0, 0, 0.1);
        transform: scale(1.1);
    }
    
    .refresh-btn.button-variant {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        border: 1px solid var(--color-primary);
        border-radius: var(--radius-sm);
        background-color: var(--color-background);
        color: var(--color-primary);
        cursor: pointer;
        transition: all var(--transition-fast);
        box-shadow: 0 0 0 0.5px #fff, 0 0 0 1px var(--color-primary);
        opacity: 1;
        padding: 0;
    }
    
    .refresh-btn.button-variant:hover {
        background-color: var(--color-primary-light);
        border-color: var(--color-primary-hover);
        color: var(--color-primary-hover);
        box-shadow: 0 0 0 0.5px #fff, 0 0 0 1px var(--color-primary-hover);
        transform: scale(1.05);
    }
    
    .refresh-btn.button-variant:active {
        transform: scale(0.95);
    }
</style>
