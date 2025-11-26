<script lang="ts">
    let { 
        value, 
        label, 
        subValue = null, 
        subLabel = null 
    }: { 
        value: string | number; 
        label: string; 
        subValue?: string | number | null; 
        subLabel?: string | null; 
    } = $props();
</script>

<div class="stat-card">
    <div class="stat-number">{value}</div>
    <div class="stat-label">{label}</div>
    {#if subValue}
        <div class="stat-sub">
            <span class="sub-value">{subValue}</span>
            {#if subLabel}
                <span class="sub-label">{subLabel}</span>
            {/if}
        </div>
    {/if}
</div>

<style>
    .stat-card {
        background: var(--color-background-light);
        border: 1px solid var(--color-border-light);
        border-radius: var(--radius-lg);
        padding: var(--spacing-lg);
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
    }

    .stat-number {
        font-size: 2rem;
        font-weight: 700;
        color: var(--color-primary);
        margin-bottom: var(--spacing-xs);
        line-height: 1.2;
    }

    .stat-label {
        font-size: var(--font-sm);
        color: var(--color-text-muted);
        font-weight: 500;
    }

    .stat-sub {
        margin-top: var(--spacing-sm);
        font-size: var(--font-xs);
        color: var(--color-text-muted);
    }

    .sub-value {
        font-weight: 600;
        color: var(--color-text);
    }

    [data-theme="dark"] .stat-card {
        background: var(--color-background);
        border-color: var(--color-border);
    }
</style>
