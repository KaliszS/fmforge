<script lang="ts">
    let {
        city = $bindable(),
        edit_mode,
    }: { city?: string; edit_mode: boolean } = $props();
</script>

{#if edit_mode}
    <input
        type="text"
        bind:value={city}
        class="input input-text city-input"
        placeholder="Enter city name"
    />
{:else}
    <span class="city-box" class:empty-city={!city} title="Birth city">
        🏠 <strong>{city || "empty"}</strong>
    </span>
{/if}

<style>
    .city-input {
        width: 10em;
        text-align: center;
    }

    .city-box {
        border-radius: var(--radius-sm);
        font-size: var(--font-xs);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-top: -0.3em;
        color: #5c4527;
        align-items: center;
    }

    .empty-city {
        color: rgba(6, 6, 5, 0.5);
        font-style: italic;
    }

    /* Edit mode styling */
    :global(.edit-mode) .city-input {
        min-width: 6rem;
        max-width: 10rem;
    }
</style>
