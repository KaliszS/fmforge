<script lang="ts">
    import FlagDisplay from "./utils/FlagDisplay.svelte";
    import FlagPicker from "./utils/FlagPicker.svelte";
    import QuickEditModal from "$lib/components/common/QuickEditModal.svelte";

    let {
        nation = $bindable(),
        edit_mode = false,
    }: { nation: number; edit_mode: boolean } = $props();

    let quickEdit = $state(false);
    let temp_nation = $state(0);

    function openQuickEdit() {
        if (edit_mode) return;
        temp_nation = nation;
        quickEdit = true;
    }

    function saveQuickEdit() {
        nation = temp_nation;
    }
</script>

<article class="citizenship">
    {#if edit_mode}
        <FlagPicker bind:nation />
    {:else}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div ondblclick={openQuickEdit}>
            <FlagDisplay bind:nation bind:edit_mode />
        </div>

        <QuickEditModal title="Edit Citizenship" bind:isOpen={quickEdit} onSave={saveQuickEdit}>
            <FlagPicker bind:nation={temp_nation} />
        </QuickEditModal>
    {/if}
</article>

<style>
    .citizenship {
        flex-shrink: 0;
        margin-right: 0.5em;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-xs);
    }

    /* Edit mode styling */
    :global(.edit-mode) .citizenship {
        padding: var(--spacing-xs);
        background-color: var(--color-background-light);
        border-radius: var(--radius-sm);
        border: 1px solid var(--color-border-light);
        margin-right: 0;
    }
</style>
