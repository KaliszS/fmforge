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
        background: var(--color-background-light);
        border-radius: 12px;
        padding: 4px;
        border: 1px solid var(--color-border);
        box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
        width: 100%;
    }

    .view-tabs {
        display: flex;
        gap: 4px;
        background: transparent;
    }

    .view-tab {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        padding: 8px 24px;
        background: transparent;
        border: none;
        cursor: pointer;
        font-size: 0.95rem;
        font-weight: 600;
        color: var(--color-text-muted);
        transition: all 0.2s ease;
        position: relative;
        user-select: none;
        border-radius: 8px;
        min-height: 36px;
    }

    .view-tab:hover {
        color: var(--color-text);
        background-color: rgba(0,0,0,0.05);
    }

    .view-tab.active {
        background: var(--color-background);
        color: var(--color-primary);
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }

    .tab-icon {
        font-size: 1.1rem;
    }

    .tab-label {
        font-weight: 600;
    }

    .view-tab:focus {
        outline: none;
    }

    /* Dark theme improvements */
    [data-theme="dark"] .view-switcher {
        background: rgba(255,255,255,0.05);
        border-color: rgba(255,255,255,0.1);
    }

    [data-theme="dark"] .view-tab.active {
        background: var(--color-background-light);
        color: white;
    }
</style>
