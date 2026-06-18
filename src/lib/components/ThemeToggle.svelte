<script lang="ts">
    import { onMount } from 'svelte';
    import { emit } from '@tauri-apps/api/event';
    import Icon from './common/Icon.svelte';

    let isDark = $state(false);

    onMount(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            isDark = true;
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            isDark = false;
            document.documentElement.setAttribute('data-theme', 'light');
        }
    });

    async function toggleTheme() {
        isDark = !isDark;
        const theme = isDark ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Emit event for other windows
        await emit('theme-change', theme);
    }
</script>

<button 
    class="theme-toggle" 
    onclick={toggleTheme}
    title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
>
    <div class="theme-toggle-icon">
        <Icon name={isDark ? 'sun' : 'moon'} size="1.2em" />
    </div>
</button>

<style>
    .theme-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2.5rem;
        height: 2.5rem;
        border: 1.5px solid var(--color-border);
        border-radius: var(--radius-lg);
        background-color: var(--color-background);
        color: var(--color-text);
        cursor: pointer;
        transition: 
            background-color var(--transition-normal),
            border-color var(--transition-normal),
            box-shadow var(--transition-normal),
            transform var(--transition-fast);
        box-shadow: 0 0.125rem 0.3125rem var(--color-shadow);
        user-select: none;
        position: relative;
        overflow: hidden;
    }

    .theme-toggle:hover {
        background-color: var(--color-background-hover);
        border-color: var(--color-primary);
        box-shadow: 0 0.3125rem 0.9375rem var(--color-shadow-primary);
        transform: translateY(-0.125rem);
    }

    .theme-toggle:active {
        transform: translateY(0);
        box-shadow: 0 0.125rem 0.3125rem var(--color-shadow);
    }

    .theme-toggle-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
    }

    .theme-toggle:hover .theme-toggle-icon {
        transform: scale(1.05);
    }

    .theme-toggle:active .theme-toggle-icon {
        transform: scale(0.95);
    }

    /* Add a subtle glow effect in dark mode */
    :global([data-theme="dark"]) .theme-toggle:hover {
        box-shadow: 0 0.3125rem 0.9375rem var(--color-shadow-primary), 0 0 1rem var(--color-shadow-primary);
    }
</style>
