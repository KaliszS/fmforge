<script lang="ts">
    let { 
        currentView = $bindable(),
        onViewChange = () => {}
    }: {
        currentView: 'scout' | 'analyst';
        onViewChange?: (view: 'scout' | 'analyst') => void;
    } = $props();

    function switchView(view: 'scout' | 'analyst') {
        if (view !== currentView) {
            currentView = view;
            onViewChange(view);
        }
    }
</script>

<div class="view-switcher">
    <div class="view-tabs">
        <button 
            class="view-tab" 
            class:active={currentView === 'scout'}
            onclick={() => switchView('scout')}
            aria-pressed={currentView === 'scout'}
        >
            <span class="tab-icon">🔍</span>
            <span class="tab-label">Scout</span>
        </button>
        
        <button 
            class="view-tab" 
            class:active={currentView === 'analyst'}
            onclick={() => switchView('analyst')}
            aria-pressed={currentView === 'analyst'}
        >
            <span class="tab-icon">📊</span>
            <span class="tab-label">Analyst</span>
        </button>
    </div>
</div>

<style>
    .view-switcher {
        margin-bottom: var(--spacing-lg);
        background: var(--color-background);
        border-radius: var(--radius-lg);
        border: 1px solid var(--color-border-light);
        box-shadow: 0 2px 8px var(--color-shadow-light);
        overflow: hidden;
    }

    .view-tabs {
        display: flex;
        background: linear-gradient(135deg, var(--color-background-light) 0%, var(--color-background) 100%);
    }

    .view-tab {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-md) var(--spacing-lg);
        background: transparent;
        border: none;
        cursor: pointer;
        font-size: var(--font-base);
        font-weight: 600;
        color: var(--color-text-muted);
        transition: all var(--transition-fast);
        position: relative;
        user-select: none;
        min-height: 2.5rem;
    }

    .view-tab:first-child {
        border-right: 1px solid var(--color-border-light);
    }

    .view-tab:hover {
        background: var(--color-background-hover);
        color: var(--color-text);
    }

    .view-tab.active {
        background: var(--color-primary);
        color: white;
        box-shadow: 0 2px 8px var(--color-shadow-primary);
    }

    .view-tab.active::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 2px;
        background: var(--color-background-page);
        border-radius: 1px 1px 0 0;
    }

    .tab-icon {
        font-size: 1.2rem;
        filter: drop-shadow(0 1px 2px var(--color-shadow-light));
    }

    .tab-label {
        font-size: var(--font-base);
        font-weight: 600;
    }

    .view-tab:focus {
        outline: 2px solid var(--color-primary);
        outline-offset: -2px;
    }

    /* Dark theme improvements */
    [data-theme="dark"] .view-switcher {
        border-color: var(--color-border);
        box-shadow: 0 2px 8px var(--color-shadow);
    }

    [data-theme="dark"] .view-tab.active::after {
        background: var(--color-background-page);
    }

    @media (max-width: 768px) {
        .view-tab {
            padding: var(--spacing-sm) var(--spacing-md);
            font-size: var(--font-sm);
        }
        
        .tab-label {
            font-size: var(--font-sm);
        }
    }
</style>
