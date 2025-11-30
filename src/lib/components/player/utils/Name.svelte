<script lang="ts">
    let {
        first_name = $bindable(),
        common_name = $bindable(),
        last_name = $bindable(),
        edit_mode,
    }: {
        first_name: string;
        common_name?: string;
        last_name: string;
        edit_mode: boolean;
    } = $props();

    let full_name = $derived(
        first_name +
            " " +
            (common_name ? '"' + common_name + '"' + " " : "") +
            last_name,
    );
</script>

{#if edit_mode}
    <div class="name-inputs">
        <input type="text" class="input input-text" bind:value={first_name} placeholder="First name" title="First Name" />
        <input type="text" class="input input-text" bind:value={common_name} placeholder="Common name" title="Common Name" />
        <input type="text" class="input input-text" bind:value={last_name} placeholder="Last name" title="Last Name" />
    </div>
{:else}
    <span class="name" title={full_name}>
        {#if common_name}
            {common_name}
        {:else}
            {first_name}
            {last_name}
        {/if}
    </span>
{/if}

<style>
    .name {
        font-weight: 600;
        font-size: var(--font-base);
        color: var(--color-text);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .name-inputs {
        display: flex;
        gap: var(--spacing-xs);
        flex-wrap: wrap;
    }
    
    .name-inputs input {
        flex: 1;
        min-width: 80px;
    }
</style>
