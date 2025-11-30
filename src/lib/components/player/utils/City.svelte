<script lang="ts">
    import QuickEditModal from "$lib/components/common/QuickEditModal.svelte";

    let {
        city = $bindable(),
        edit_mode,
    }: { city?: string; edit_mode: boolean } = $props();

    let quickEdit = $state(false);
    let temp_city = $state('');

    function openQuickEdit() {
        if (edit_mode) return;
        temp_city = city || '';
        quickEdit = true;
    }

    function saveQuickEdit() {
        city = temp_city;
    }
</script>

{#if edit_mode}
    <input
        type="text"
        bind:value={city}
        class="input input-text city-input"
        placeholder="Enter city name"
    />
{:else}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <span class="city-box" class:empty-city={!city} title="Birth city" ondblclick={openQuickEdit}>
        🏠 <strong>{city || "empty"}</strong>
    </span>

    <QuickEditModal title="Edit City" bind:isOpen={quickEdit} onSave={saveQuickEdit}>
        <label style="display:flex; flex-direction:column; gap:0.5em;">
            <span>City Name</span>
            <input type="text" class="input" bind:value={temp_city} placeholder="Enter city name" />
        </label>
    </QuickEditModal>
{/if}

<style>
    .city-input {
        width: 100%;
        text-align: left;
        min-width: 6rem;
        max-width: 100%; /* Override global .input-text limit */
        flex: 1;
    }

    .city-box {
        border-radius: var(--radius-sm);
        font-size: var(--font-xs);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-top: -0.3em;
        color: var(--color-text-muted);
        align-items: center;
    }

    .empty-city {
        color: var(--color-text-disabled);
        font-style: italic;
    }
</style>
