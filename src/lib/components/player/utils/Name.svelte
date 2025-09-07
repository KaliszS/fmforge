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
    <input type="text" class="input input-text" bind:value={first_name} placeholder="First name" />
    <input type="text" class="input input-text" bind:value={common_name} placeholder="Common name" />
    <input type="text" class="input input-text" bind:value={last_name} placeholder="Last name" />
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
</style>
