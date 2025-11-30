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
