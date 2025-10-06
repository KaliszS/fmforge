<script lang="ts">
    import type { PlayerRecord } from "$lib/types";
    import PlayerItem from "./PlayerItem.svelte";
    import AddPlayerRow from "./AddPlayerRow.svelte";
    import { modifiedPlayers, originalPlayers, showOnlyEdited } from "$lib/stores/editedPlayers";

    let { players = $bindable() }: { players: PlayerRecord[] } = $props();
    
    let newlyAddedPlayers = $derived.by(() => {
        let result: PlayerRecord[] = [];
        $modifiedPlayers.forEach((player, id) => {
            const original = $originalPlayers.get(id);
            if (original === null) {
                result.push({ id, player });
            }
        });
        return result;
    });
</script>

<ul class="player-list">
    {#if players.length > 0}
        <AddPlayerRow />
    {/if}
    
    {#if !$showOnlyEdited}
        {#each newlyAddedPlayers as playerRecord}
            <PlayerItem bind:player={playerRecord.player} playerId={playerRecord.id} />
        {/each}
    {/if}
    
    {#each players as playerRecord}
        <PlayerItem bind:player={playerRecord.player} playerId={playerRecord.id} />
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
