<script lang="ts">
    let {
        size = 12,
        title = "Refresh",
        onClick = () => {},
        variant = "icon"
    }: {
        size?: number;
        title?: string;
        onClick?: () => void;
        variant?: "icon" | "button";
    } = $props();
</script>

<button 
    class="refresh-btn" 
    class:button-variant={variant === "button"}
    {title}
    onclick={onClick}
>
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
        <path d="M21 3v5h-5"/>
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
        <path d="M3 21v-5h5"/>
    </svg>
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
        transition: all 0.2s;
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
