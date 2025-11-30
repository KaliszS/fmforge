<script lang="ts">
    import Name from "./utils/Name.svelte";
    import Position from "./utils/Position.svelte";
    import Birthdate from "./utils/Birthdate.svelte";
    import City from "./utils/City.svelte";

    let {
        first_name = $bindable(),
        common_name = $bindable(),
        last_name = $bindable(),
        position = $bindable(),
        birthdate = $bindable(),
        city = $bindable(),
        edit_mode = false,
    }: {
        first_name: string;
        common_name?: string;
        last_name: string;
        position: string;
        birthdate: string;
        city?: string;
        edit_mode: boolean;
    } = $props();
</script>

{#if edit_mode}
    <Position bind:position {edit_mode} />
    <Name bind:first_name bind:common_name bind:last_name {edit_mode} />
    <section class="birth-city-row">
        <Birthdate bind:birthdate {edit_mode} />
        <City bind:city {edit_mode} />
    </section>
{:else}
    <article>
        <Position {position} {edit_mode} />
        <Name {first_name} {common_name} {last_name} {edit_mode} />
        <section>
            <Birthdate {birthdate} {edit_mode} />
            <City bind:city {edit_mode} />
        </section>
    </article>
{/if}

<style>
    section {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
    }

    .birth-city-row {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        width: 100%;
    }

    /* Edit mode styling */
    :global(.edit-mode) section {
        flex-direction: row;
        align-items: center;
        gap: var(--spacing-xs);
        /* Removed background and border as requested */
    }

    :global(.edit-mode) .birth-city-row {
        width: 100%;
    }

</style>
