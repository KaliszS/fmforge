<script lang="ts">
    import QuickEditModal from "$lib/components/common/QuickEditModal.svelte";

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

    let quickEdit = $state(false);
    let temp_first = $state('');
    let temp_common = $state('');
    let temp_last = $state('');

    function openQuickEdit() {
        if (edit_mode) return;
        temp_first = first_name;
        temp_common = common_name || '';
        temp_last = last_name;
        quickEdit = true;
    }

    function saveQuickEdit() {
        first_name = temp_first;
        common_name = temp_common || undefined;
        last_name = temp_last;
    }
</script>

{#if edit_mode}
    <div class="name-inputs">
        <input type="text" class="input input-text" bind:value={first_name} placeholder="First name" title="First Name" />
        <input type="text" class="input input-text" bind:value={common_name} placeholder="Common name" title="Common Name" />
        <input type="text" class="input input-text" bind:value={last_name} placeholder="Last name" title="Last Name" />
    </div>
{:else}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <span class="name" title={full_name} ondblclick={openQuickEdit}>
        {#if common_name}
            {common_name}
        {:else}
            {first_name}
            {last_name}
        {/if}
    </span>

    <QuickEditModal title="Edit Name" bind:isOpen={quickEdit} onSave={saveQuickEdit}>
        <div class="quick-edit-fields">
            <label>
                <span>First Name</span>
                <input type="text" class="input" bind:value={temp_first} />
            </label>
            <label>
                <span>Common Name</span>
                <input type="text" class="input" bind:value={temp_common} />
            </label>
            <label>
                <span>Last Name</span>
                <input type="text" class="input" bind:value={temp_last} />
            </label>
        </div>
    </QuickEditModal>
{/if}

<style>
    .quick-edit-fields {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
    }
    .quick-edit-fields label {
        display: flex;
        flex-direction: column;
        gap: 0.25em;
        font-size: var(--font-sm);
        color: var(--color-text-muted);
    }
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
