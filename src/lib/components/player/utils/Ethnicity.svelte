<script lang="ts">
    import { ETHNICITY_MAP } from "$lib/constants";
    import QuickEditModal from "$lib/components/common/QuickEditModal.svelte";

    let {
        ethnicity = $bindable(),
        edit_mode,
    }: { ethnicity: number; edit_mode: boolean } = $props();

    let quickEdit = $state(false);
    let temp_ethnicity = $state(0);

    function openQuickEdit() {
        if (edit_mode) return;
        temp_ethnicity = ethnicity;
        quickEdit = true;
    }

    function saveQuickEdit() {
        ethnicity = temp_ethnicity;
    }
</script>

{#if edit_mode}
    <select class="input input-select ethnicity-select" bind:value={ethnicity} title="Ethnicity">
        {#each Array.from(ETHNICITY_MAP.entries()) as [id, e]}
            <option value={id}>{e.title}</option>
        {/each}
    </select>
{:else}
    {@const eth = ETHNICITY_MAP.get(ethnicity) ?? {
        title: "Unknown",
        bg: "#ccc",
        emoji: "❓",
    }}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="ethnicity-icon"
        title={eth.title}
        style="background-color: {eth.bg}"
        ondblclick={openQuickEdit}
    >
        {eth.emoji}
    </div>

    <QuickEditModal title="Edit Ethnicity" bind:isOpen={quickEdit} onSave={saveQuickEdit}>
        <label style="display:flex; flex-direction:column; gap:0.5em;">
            <span>Ethnicity</span>
            <select class="input input-select" bind:value={temp_ethnicity}>
                {#each Array.from(ETHNICITY_MAP.entries()) as [id, e]}
                    <option value={id}>{e.title}</option>
                {/each}
            </select>
        </label>
    </QuickEditModal>
{/if}

<style>
    .ethnicity-icon {
        width: 2em;
        height: 2em;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: var(--font-sm);
        font-weight: bold;
        color: #444;
        border: 1px solid #666;
        box-shadow: 0 0 0 0.5px #fff, 0 0 0 1px #666;
    }

    /* Edit mode styling */
    :global(.edit-mode) .ethnicity-select {
        min-width: 8rem;
    }
</style>
