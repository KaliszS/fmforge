<script lang="ts">
    import { HAIR_COLORS } from "$lib/constants";
    import QuickEditModal from "$lib/components/common/QuickEditModal.svelte";

    let {
        hair_color = $bindable(),
        edit_mode,
    }: { hair_color: number; edit_mode: boolean } = $props();

    let quickEdit = $state(false);
    let temp_hair = $state(0);

    function openQuickEdit() {
        if (edit_mode) return;
        temp_hair = hair_color;
        quickEdit = true;
    }

    function saveQuickEdit() {
        hair_color = temp_hair;
    }
</script>

{#if edit_mode}
    <select class="input input-select hair-select" bind:value={hair_color} title="Hair colour">
        {#each HAIR_COLORS as hc}
            <option value={hc.id}>{hc.label}</option>
        {/each}
    </select>
{:else}
    {@const hc = HAIR_COLORS.find((h) => h.id === hair_color) ?? {
        label: "Unknown",
        color: "#999",
    }}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="hair-circle"
        title={`Hair colour: ${hc.label}`}
        style="background-color: {hc.color}"
        ondblclick={openQuickEdit}
    >
        H
    </div>

    <QuickEditModal title="Edit Hair Color" bind:isOpen={quickEdit} onSave={saveQuickEdit}>
        <label style="display:flex; flex-direction:column; gap:0.5em;">
            <span>Hair Color</span>
            <select class="input input-select" bind:value={temp_hair}>
                {#each HAIR_COLORS as hc}
                    <option value={hc.id}>{hc.label}</option>
                {/each}
            </select>
        </label>
    </QuickEditModal>
{/if}

<style>
    .hair-circle {
        width: 2em;
        height: 2em;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: var(--font-sm);
        font-weight: bold;
        color: #f5f5dc;
        border: 1px solid #666;
        box-shadow: 0 0 0 0.5px #fff, 0 0 0 1px #666;
    }

    /* Edit mode styling */
    :global(.edit-mode) .hair-select {
        min-width: 6rem;
    }
</style>
