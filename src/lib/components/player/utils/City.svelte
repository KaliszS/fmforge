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
        class="city-input"
        placeholder="Enter city name"
    />
{:else}
    <span class="city-box" class:empty-city={!city} title="Birth city">
        🏠 <strong>{city || "empty"}</strong>
    </span>
{/if}

<style>
    .city-input {
        padding: 0.3em 0.6em;
        border-radius: 0.5em;
        border: 1px solid #888;
        font-size: 0.85em;
        width: 10em;
        text-align: center;
    }

    .city-box {
        border-radius: 0.5em;
        font-size: 0.75em;
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
</style>
