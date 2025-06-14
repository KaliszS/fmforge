<script lang="ts">
    import Foot from "./utils/Foot.svelte";
    import Number from "./utils/Number.svelte";

    let {
        preferred_foot = $bindable(),
        favourite_number = $bindable(),
        edit_mode = false,
    }: {
        preferred_foot: number;
        favourite_number?: number | null;
        edit_mode: boolean;
    } = $props();
</script>

{#if edit_mode}
    <div class="details-grid">
        <div class="column">
            <Foot {preferred_foot} {edit_mode} />
            <Number {favourite_number} {edit_mode} />
        </div>
    </div>
{:else}
    <div class="details-grid">
        <div class="column compact">
            <Foot {preferred_foot} {edit_mode} />
            <Number {favourite_number} {edit_mode} />
        </div>
    </div>
{/if}

<style>
    .details-grid {
        display: flex;
        gap: 0.75rem;
        align-items: flex-start;
        flex-wrap: wrap;
    }

    .column {
        display: flex;
        flex-direction: column;
        gap: 0.25em;
    }

    .column.compact {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }
</style>
