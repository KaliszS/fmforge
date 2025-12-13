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
        background: var(--color-background);
        border: 1px solid var(--color-border);
        border-radius: 12px;
        padding: var(--spacing-lg);
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        height: 100%;
        box-shadow: 0 2px 5px rgba(0,0,0,0.05);
        transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .stat-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        border-color: var(--color-primary);
    }

    .stat-number {
        font-size: 2.2rem;
        font-weight: 800;
        color: var(--color-primary);
        margin-bottom: 4px;
        line-height: 1.1;
        letter-spacing: -0.5px;
    }

    .stat-label {
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: 600;
        color: var(--color-text-muted);
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
