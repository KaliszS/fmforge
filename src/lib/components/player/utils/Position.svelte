<script lang="ts">
    import { POSITION_MAP } from "$lib/constants";
    import QuickEditModal from "$lib/components/common/QuickEditModal.svelte";

    let {
        position = $bindable(),
        edit_mode,
    }: { position: string; edit_mode: boolean } = $props();

    let quickEdit = $state(false);
    let temp_position = $state('');

    function openQuickEdit() {
        if (edit_mode) return;
        temp_position = position;
        quickEdit = true;
    }

    function saveQuickEdit() {
        position = temp_position;
    }
</script>

{#if edit_mode}
    <select class="input input-select position-select" bind:value={position}>
        {#each Object.entries(POSITION_MAP) as [key, value]}
            <option value={key}>{value.label}</option>
        {/each}
    </select>
{:else}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <span
        class="badge badge-{POSITION_MAP[position]?.group}"
        title={POSITION_MAP[position]?.label}
        ondblclick={openQuickEdit}
    >
        {POSITION_MAP[position]?.short}
    </span>

    <QuickEditModal title="Edit Position" bind:isOpen={quickEdit} onSave={saveQuickEdit}>
        <label style="display:flex; flex-direction:column; gap:0.5em;">
            <span>Position</span>
            <select class="input input-select" bind:value={temp_position}>
                {#each Object.entries(POSITION_MAP) as [key, value]}
                    <option value={key}>{value.label}</option>
                {/each}
            </select>
        </label>
    </QuickEditModal>
{/if}

<style>
    /* Edit mode styling */
    :global(.edit-mode) .position-select {
        min-width: 6rem;
        width: 100%;
    }
</style>

