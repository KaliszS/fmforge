<script lang="ts">
    import type { PlayerRecord } from "$lib/types";
    import PlayerItem from "./PlayerItem.svelte";

    let { players = $bindable() }: { players: PlayerRecord[] } = $props();
</script>

<ul class="player-list">
    {#each players as _, index}
        <PlayerItem bind:player={players[index].player} />
    {/each}
</ul>

<style>
    .player-list {
        list-style: none;
        padding: 0;
        margin: 0;
        max-width: 100%;
        width: 100%;
        border-radius: var(--radius-xl);
        background-color: var(--color-background);
        box-shadow: 0 0.1875rem 0.625rem var(--color-shadow-light);
        overflow: hidden;
    }
</style>
