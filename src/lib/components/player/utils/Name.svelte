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
    <input type="text" bind:value={first_name} placeholder="First name" />
    <input type="text" bind:value={common_name} placeholder="Common name" />
    <input type="text" bind:value={last_name} placeholder="Last name" />
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
        font-size: 1rem;
        color: #222;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    input[type="text"] {
        padding: 6px 8px;
        font-size: 1rem;
        border: 1px solid #ccc;
        border-radius: 6px;
        outline-offset: 2px;
        transition: border-color 0.2s;
    }

    input[type="text"] {
        min-width: 120px;
        max-width: 200px;
    }

    input:focus {
        border-color: #396cd8;
        box-shadow: 0 0 5px rgba(57, 108, 216, 0.5);
    }
</style>
