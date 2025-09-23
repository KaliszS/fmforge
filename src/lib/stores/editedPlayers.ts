import { writable } from 'svelte/store';
import type { Player, PlayerRecord } from '$lib/types';

export const originalPlayers = writable<Map<number, Player>>(new Map());
export const modifiedPlayers = writable<Map<number, Player>>(new Map());
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

export function saveOriginalPlayer(id: number, player: Player) {
    originalPlayers.update(originals => {
        const newOriginals = new Map(originals);
        if (!newOriginals.has(id)) {
            newOriginals.set(id, clonePlayer(player));
        }
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

export function checkAndCleanupPlayer(id: number) {
    let shouldCleanup = false;
    
    originalPlayers.subscribe(originals => {
        modifiedPlayers.subscribe(modifiedMap => {
            const original = originals.get(id);
            const modified = modifiedMap.get(id);
            
            if (original && modified && arePlayersEqual(original, modified)) {
                shouldCleanup = true;
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

export function clearAllEditedPlayers() {
    document.dispatchEvent(new CustomEvent('restoreOriginalValues'));
    
    originalPlayers.set(new Map());
    modifiedPlayers.set(new Map());
    showOnlyEdited.set(false);
}

export function toggleShowOnlyEdited() {
    showOnlyEdited.update(show => !show);
}

export function getOriginalPlayer(id: number): Player | undefined {
    let result: Player | undefined;
    originalPlayers.subscribe(originals => {
        result = originals.get(id);
    })();
    return result;
}

export function getModifiedPlayersAsRecords(): PlayerRecord[] {
    let result: PlayerRecord[] = [];
    modifiedPlayers.subscribe(modified => {
        result = Array.from(modified.entries()).map(([id, player]) => ({
            id,
            player
        }));
    })();
    return result;
}

originalPlayers.subscribe(originals => {
    editedCount.set(originals.size);
});