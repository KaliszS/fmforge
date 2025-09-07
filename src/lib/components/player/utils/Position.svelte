<script lang="ts">
    let {
        position = $bindable(),
        edit_mode,
    }: { position: string; edit_mode: boolean } = $props();

    const positionMap: Record<
        string,
        {
            short: string;
            label: string;
            group: "goalkeeper" | "defender" | "midfielder" | "attacker";
        }
    > = {
        GOALKEEPER: { short: "GK", label: "goalkeeper", group: "goalkeeper" },
        DEFENDER_LEFT_SIDE: {
            short: "LB",
            label: "left defender",
            group: "defender",
        },
        DEFENDER_RIGHT_SIDE: {
            short: "RB",
            label: "right defender",
            group: "defender",
        },
        DEFENDER_CENTRAL: {
            short: "FB",
            label: "central defender",
            group: "defender",
        },
        MIDFIELDER_LEFT_SIDE: {
            short: "LM",
            label: "left midfielder",
            group: "midfielder",
        },
        MIDFIELDER_RIGHT_SIDE: {
            short: "RM",
            label: "right midfielder",
            group: "midfielder",
        },
        MIDFIELDER_CENTRAL: {
            short: "MC",
            label: "central midfielder",
            group: "midfielder",
        },
        ATTACKING_MIDFIELDER_LEFT_SIDE: {
            short: "LA",
            label: "left attacking mid",
            group: "attacker",
        },
        ATTACKING_MIDFIELDER_RIGHT_SIDE: {
            short: "RA",
            label: "right attacking mid",
            group: "attacker",
        },
        ATTACKING_MIDFIELDER_CENTRAL: {
            short: "AM",
            label: "central attacking mid",
            group: "attacker",
        },
        ATTACKER_CENTRAL: {
            short: "AC",
            label: "central attacker",
            group: "attacker",
        },
    };
</script>

{#if edit_mode}
    <select class="select" bind:value={position}>
        {#each Object.entries(positionMap) as [key, value]}
            <option value={key}>{value.label}</option>
        {/each}
    </select>
{:else}
    <span
        class="badge badge-{positionMap[position]?.group}"
        title={positionMap[position]?.label}
    >
        {positionMap[position]?.short}
    </span>
{/if}

<style>
    /* Edit mode styling */
    :global(.edit-mode) select {
        min-width: 6rem;
    }
</style>

