<script lang="ts">
    let {
        preferred_foot = $bindable(),
        edit_mode,
    }: { preferred_foot: number; edit_mode: boolean } = $props();

    const footLabels = [
        { label: "right only", icon: "🦶➡️", value: 0, style: "only right" },
        { label: "left only", icon: "⬅️🦶", value: 1, style: "only left" },
        {
            label: "right preferred",
            icon: "🦶→",
            value: 2,
            style: "preferred right",
        },
        {
            label: "left preferred",
            icon: "←🦶",
            value: 3,
            style: "preferred left",
        },
        { label: "both", icon: "🦶🦶", value: 4, style: "both" },
    ];
</script>

{#if edit_mode}
    <select bind:value={preferred_foot}>
        {#each footLabels as foot}
            <option value={foot.value}>
                {foot.icon}
                {foot.label}
            </option>
        {/each}
    </select>
{:else}
    {#each footLabels as foot (foot.value)}
        {#if foot.value === preferred_foot}
            <span class={"tag foot " + foot.style} title={foot.label}>
                {foot.icon}
            </span>
        {/if}
    {/each}
{/if}

<style>
    select,
    .number-input {
        padding: 4px 6px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 0.85rem;
    }

    .tag {
        background-color: #eef0f6;
        border-radius: 5px;
        padding: 0.25em;
        font-size: 0.75rem;
        color: #333;
        display: inline-flex;
        align-items: center;
        white-space: nowrap;
        line-height: 1.2;
    }

    .tag.foot.only {
        background-color: #d4f0ff;
        color: #045;
    }

    .tag.foot.preferred {
        background-color: #ffe9c5;
        color: #754c00;
    }

    .tag.foot.both {
        background-color: #e0ffe0;
        color: #264d26;
    }
</style>
