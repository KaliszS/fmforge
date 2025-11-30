<script lang="ts">
    import { FOOT_OPTIONS } from "$lib/constants";
    import QuickEditModal from "$lib/components/common/QuickEditModal.svelte";

    let {
        preferred_foot = $bindable(),
        edit_mode,
    }: { preferred_foot: number; edit_mode: boolean } = $props();

    let quickEdit = $state(false);
    let temp_foot = $state(0);

    function openQuickEdit() {
        if (edit_mode) return;
        temp_foot = preferred_foot;
        quickEdit = true;
    }

    function saveQuickEdit() {
        preferred_foot = temp_foot;
    }
</script>

{#if edit_mode}
    <select class="input input-select foot-select" bind:value={preferred_foot}>
        {#each FOOT_OPTIONS as foot}
            <option value={foot.value}>
                {foot.icon}
                {foot.label}
            </option>
        {/each}
    </select>
{:else}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div style="display:contents" ondblclick={openQuickEdit}>
        {#each FOOT_OPTIONS as foot (foot.value)}
            {#if foot.value === preferred_foot}
                <span class={"tag foot " + foot.style} title={foot.label}>
                    {foot.icon}
                </span>
            {/if}
        {/each}
    </div>

    <QuickEditModal title="Edit Preferred Foot" bind:isOpen={quickEdit} onSave={saveQuickEdit}>
        <label style="display:flex; flex-direction:column; gap:0.5em;">
            <span>Preferred Foot</span>
            <select class="input input-select" bind:value={temp_foot}>
                {#each FOOT_OPTIONS as foot}
                    <option value={foot.value}>
                        {foot.icon} {foot.label}
                    </option>
                {/each}
            </select>
        </label>
    </QuickEditModal>
{/if}

<style>
    /* Edit mode styling */
    :global(.edit-mode) .foot-select {
        min-width: 4rem;
        width: auto;
    }
</style>