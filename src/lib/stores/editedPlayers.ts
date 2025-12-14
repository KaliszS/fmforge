import { writable } from 'svelte/store';
import type { Player, PlayerRecord } from '$lib/types';

export const originalPlayers = writable<Map<number, Player | null>>(new Map());
export const modifiedPlayers = writable<Map<number, Player | null>>(new Map());
export const editedCount = writable<number>(0);
export const showOnlyEdited = writable<boolean>(false);

function arePlayersEqual(player1: Player, player2: Player): boolean {
    return (
        player1.first_name === player2.first_name &&
        player1.common_name === player2.common_name &&
        player1.last_name === player2.last_name &&
        player1.birth_date === player2.birth_date &&
        player1.nationality_id === player2.nationality_id &&
        player1.favourite_team_id === player2.favourite_team_id &&
        player1.ethnicity === player2.ethnicity &&
        player1.skin_tone === player2.skin_tone &&
        player1.hair_color === player2.hair_color &&
        player1.height === player2.height &&
        player1.weight === player2.weight &&
        player1.preferred_foot === player2.preferred_foot &&
        player1.position === player2.position &&
        player1.favourite_number === player2.favourite_number &&
        player1.birth_city === player2.birth_city &&
        player1.ca === player2.ca &&
        player1.pa === player2.pa &&
        player1.club_id === player2.club_id
    );
}

function clonePlayer(player: Player): Player {
    return JSON.parse(JSON.stringify(player));
}

export function saveOriginalPlayer(id: number, player: Player | null) {
    originalPlayers.update(originals => {
        const newOriginals = new Map(originals);
        if (!newOriginals.has(id)) {
            newOriginals.set(id, player ? clonePlayer(player) : null);
        }
        return newOriginals;
    });
}

export function saveOriginalPlayers(players: { id: number, player: Player | null }[]) {
    originalPlayers.update(originals => {
        const newOriginals = new Map(originals);
        players.forEach(({ id, player }) => {
            if (!newOriginals.has(id)) {
                newOriginals.set(id, player ? clonePlayer(player) : null);
            }
        });
        return newOriginals;
    });
}

export function saveModifiedPlayer(id: number, player: Player) {
    modifiedPlayers.update(modified => {
        const newModified = new Map(modified);
        newModified.set(id, clonePlayer(player));
        return newModified;
    });
}

export function saveModifiedPlayers(players: { id: number, player: Player }[]) {
    modifiedPlayers.update(modified => {
        const newModified = new Map(modified);
        players.forEach(({ id, player }) => {
            newModified.set(id, clonePlayer(player));
        });
        return newModified;
    });
}

export function checkAndCleanupPlayer(id: number) {
    let shouldCleanup = false;
    
    originalPlayers.subscribe(originals => {
        modifiedPlayers.subscribe(modifiedMap => {
            const original = originals.get(id);
            const modified = modifiedMap.get(id);
            
            // Cleanup if:
            // 1. Player is in originalPlayers AND
            // 2. Either:
            //    a. Player is NOT in modifiedPlayers (edit started but cancelled/not saved)
            //    b. Player IS in modifiedPlayers (not deleted) AND equals original
            if (original) {
                if (modified === undefined) {
                    shouldCleanup = true;
                } else if (modified !== null && arePlayersEqual(original, modified)) {
                    shouldCleanup = true;
                }
            }
        })();
    })();
    
    if (shouldCleanup) {
        originalPlayers.update(originals => {
            const newOriginals = new Map(originals);
            newOriginals.delete(id);
            return newOriginals;
        });
        
        modifiedPlayers.update(modified => {
            const newModified = new Map(modified);
            newModified.delete(id);
            return newModified;
        });
    }
}

export function addNewPlayerToStore(id: number, player: Player) {
    saveOriginalPlayer(id, null);
    saveModifiedPlayer(id, player);
}

export function markPlayerForDeletion(id: number, player: Player) {
    let original: Player | null | undefined;
    originalPlayers.subscribe(originals => {
        original = originals.get(id);
    })();
    
    if (original === null) {
        // newly added player
        originalPlayers.update(originals => {
            const newOriginals = new Map(originals);
            newOriginals.delete(id);
            return newOriginals;
        });
        modifiedPlayers.update(modified => {
            const newModified = new Map(modified);
            newModified.delete(id);
            return newModified;
        });
        return; // Exit early - no need to mark for deletion
    }
    
    saveOriginalPlayer(id, player);
    modifiedPlayers.update(modified => {
        const newModified = new Map(modified);
        newModified.set(id, null);
        return newModified;
    });
}

export function revertPlayerDeletion(id: number) {
    removePlayerFromStores(id);
}

export function removePlayerFromStores(id: number) {
    originalPlayers.update(originals => {
        const newOriginals = new Map(originals);
        newOriginals.delete(id);
        return newOriginals;
    });
    
    modifiedPlayers.update(modified => {
        const newModified = new Map(modified);
        newModified.delete(id);
        return newModified;
    });
}

function revertPlayersByType(type: 'modified' | 'added' | 'deleted') {
    const idsToRevert: number[] = [];
    
    originalPlayers.subscribe(originals => {
        modifiedPlayers.subscribe(modified => {
            for (const [id, original] of originals) {
                const modifiedPlayer = modified.get(id);
                let shouldRevert = false;
                
                switch (type) {
                    case 'modified':
                        shouldRevert = original !== null && modifiedPlayer !== null;
                        break;
                    case 'added':
                        shouldRevert = original === null && modifiedPlayer !== null;
                        break;
                    case 'deleted':
                        shouldRevert = original !== null && modifiedPlayer === null;
                        break;
                }
                
                if (shouldRevert) {
                    idsToRevert.push(id);
                }
            }
        })();
    })();
    
    // Dispatch restore event for each player before removing from stores
    idsToRevert.forEach(id => {
        const event = new CustomEvent('restoreOriginalValues', { detail: { playerId: id } });
        document.dispatchEvent(event);
    });
    
    // Wait for components to restore values, then clean up stores
    setTimeout(() => {
        idsToRevert.forEach(id => removePlayerFromStores(id));
    }, 50);
}

export function revertModifiedPlayers() {
    revertPlayersByType('modified');
}

export function revertAddedPlayers() {
    revertPlayersByType('added');
}

export function revertDeletedPlayers() {
    revertPlayersByType('deleted');
}

export function clearEditedPlayersStore() { // for saving to file
    originalPlayers.set(new Map());
    modifiedPlayers.set(new Map());
    showOnlyEdited.set(false);
}


export function clearAllEditedPlayers() { // for resetting all changes to original values
    const event = new CustomEvent('restoreOriginalValues');
    document.dispatchEvent(event);
    
    // Clear after a short delay to allow components to restore values
    setTimeout(() => {
        clearEditedPlayersStore();
    }, 50);
}

export function toggleShowOnlyEdited(currentFilter: 'all' | 'modified' | 'added' | 'deleted' = 'all', onFilterReset?: () => void) {
    showOnlyEdited.update(show => {
        if (show && currentFilter !== 'all') {
            // If showing edited players with a specific filter, switch to 'all' instead of toggling off
            onFilterReset?.(); // Reset filter to 'all'
            return true; // Keep showing edited players, but switch to 'all' filter
        }
        return !show;
    });
}

export function getOriginalPlayer(id: number): Player | null | undefined {
    let result: Player | null | undefined;
    originalPlayers.subscribe(originals => {
        result = originals.get(id);
    })();
    return result;
}

export function getModifiedPlayersAsRecords(): PlayerRecord[] {
    let result: PlayerRecord[] = [];
    
    modifiedPlayers.subscribe(modified => {
        originalPlayers.subscribe(originals => {
            result = Array.from(modified.entries()).map(([id, player]) => ({
                id,
                player: player || originals.get(id) || {} as Player // Use original data for deleted players
            }));
        })();
    })();
    return result;
}

originalPlayers.subscribe(originals => {
    editedCount.set(originals.size);
});