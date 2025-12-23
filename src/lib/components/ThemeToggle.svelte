<script lang="ts">
    import { onMount } from 'svelte';
    import { emit } from '@tauri-apps/api/event';

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
        {#if isDark}
            <!-- Sun icon for light mode -->
            <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
            </svg>
        {:else}
            <!-- Moon icon for dark mode -->
            <svg width="1.2em" height="1.2em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
        {/if}
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
