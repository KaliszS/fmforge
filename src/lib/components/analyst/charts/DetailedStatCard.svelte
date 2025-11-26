<script lang="ts">
    let { 
        title, 
        icon, 
        stats 
    }: { 
        title: string; 
        icon: string; 
        stats: {
            mean: number;
            median: number;
            min: number;
            max: number;
            std_dev: number;
        }; 
    } = $props();
</script>

<div class="stat-card">
    <div class="stat-header">
        <h4>{title}</h4>
        <span class="stat-icon">{icon}</span>
    </div>
    <div class="stat-values">
        <div class="stat-row">
            <span class="stat-label">Average:</span>
            <span class="stat-value">{Math.round(stats.mean)}</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">Median:</span>
            <span class="stat-value">{Math.round(stats.median)}</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">Range:</span>
            <span class="stat-value">{Math.round(stats.min)} - {Math.round(stats.max)}</span>
        </div>
        <div class="stat-row">
            <span class="stat-label">Std Dev:</span>
            <span class="stat-value">{Math.round(stats.std_dev)}</span>
        </div>
    </div>
</div>

<style>
    .stat-card {
        background: var(--color-background-light);
        border: 1px solid var(--color-border-light);
        border-radius: var(--radius-lg);
        padding: var(--spacing-lg);
    }

    .stat-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-md);
    }

    .stat-header h4 {
        margin: 0;
        color: var(--color-text);
        font-size: var(--font-base);
        font-weight: 600;
    }

    .stat-icon {
        font-size: 1.5rem;
    }

    .stat-values {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
    }

    .stat-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .stat-label {
        color: var(--color-text-muted);
        font-size: var(--font-sm);
        font-weight: 500;
    }

    .stat-value {
        color: var(--color-text);
        font-size: var(--font-sm);
        font-weight: 600;
        background: var(--color-background);
        padding: 0.2rem 0.5rem;
        border-radius: var(--radius-sm);
    }

    [data-theme="dark"] .stat-card {
        background: var(--color-background);
        border-color: var(--color-border);
    }
</style>
