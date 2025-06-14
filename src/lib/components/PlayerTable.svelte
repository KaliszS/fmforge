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
        border-radius: 12px;
        background-color: #fff;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
        overflow: hidden;
        font-family: Inter, Avenir, Helvetica, Arial, sans-serif;
    }
</style>
