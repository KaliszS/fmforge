import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import type { Player } from '$lib/types';
import {
  originalPlayers,
  modifiedPlayers,
  deletedPlayers,
  editedCount,
  saveOriginalPlayer,
  saveOriginalPlayers,
  saveModifiedPlayer,
  checkAndCleanupPlayer,
  addNewPlayerToStore,
  markPlayerForDeletion,
  removePlayerFromStores,
  getOriginalPlayer,
  getModifiedPlayersAsRecords,
  clearEditedPlayersStore,
} from '$lib/stores/editedPlayers';

function makePlayer(overrides: Partial<Player> = {}): Player {
  return {
    record_type: 'DETAILED_FUTURE_REGEN',
    first_name: 'John',
    last_name: 'Doe',
    birth_date: '2000-01-01',
    nationality_id: 1,
    ethnicity: 0,
    skin_tone: 0,
    hair_color: 0,
    height: 180,
    weight: 75,
    preferred_foot: 1,
    position: 'ST',
    ca: 100,
    pa: 150,
    club_id: 10,
    ...overrides,
  };
}

beforeEach(() => {
  clearEditedPlayersStore();
});

describe('saveOriginalPlayer', () => {
  it('stores a deep clone, not a reference', () => {
    const p = makePlayer();
    saveOriginalPlayer(1, p);
    p.first_name = 'Mutated';
    expect(get(originalPlayers).get(1)!.first_name).toBe('John');
  });

  it('is idempotent — the first snapshot wins', () => {
    saveOriginalPlayer(1, makePlayer({ first_name: 'First' }));
    saveOriginalPlayer(1, makePlayer({ first_name: 'Second' }));
    expect(get(originalPlayers).get(1)!.first_name).toBe('First');
  });

  it('accepts a null original (used for newly added players)', () => {
    saveOriginalPlayer(99, null);
    expect(get(originalPlayers).has(99)).toBe(true);
    expect(get(originalPlayers).get(99)).toBeNull();
  });
});

describe('saveOriginalPlayers (batch)', () => {
  it('snapshots only ids not already present', () => {
    saveOriginalPlayer(1, makePlayer({ first_name: 'Existing' }));
    saveOriginalPlayers([
      { id: 1, player: makePlayer({ first_name: 'Override' }) },
      { id: 2, player: makePlayer({ first_name: 'New' }) },
    ]);
    expect(get(originalPlayers).get(1)!.first_name).toBe('Existing');
    expect(get(originalPlayers).get(2)!.first_name).toBe('New');
  });
});

describe('checkAndCleanupPlayer', () => {
  it('removes an edit that was reverted back to the original value', () => {
    const p = makePlayer();
    saveOriginalPlayer(1, p);
    saveModifiedPlayer(1, makePlayer({ ca: 200 })); // edited
    saveModifiedPlayer(1, p); // reverted to identical values
    checkAndCleanupPlayer(1);
    expect(get(originalPlayers).has(1)).toBe(false);
    expect(get(modifiedPlayers).has(1)).toBe(false);
  });

  it('cleans up when an edit was started but never modified', () => {
    saveOriginalPlayer(1, makePlayer());
    checkAndCleanupPlayer(1); // modified === undefined
    expect(get(originalPlayers).has(1)).toBe(false);
  });

  it('keeps a genuine, differing edit', () => {
    saveOriginalPlayer(1, makePlayer({ ca: 100 }));
    saveModifiedPlayer(1, makePlayer({ ca: 199 }));
    checkAndCleanupPlayer(1);
    expect(get(modifiedPlayers).get(1)!.ca).toBe(199);
    expect(get(originalPlayers).has(1)).toBe(true);
  });

  it('does not clean up a player marked for deletion (modified === null)', () => {
    saveOriginalPlayer(1, makePlayer());
    markPlayerForDeletion(1);
    checkAndCleanupPlayer(1);
    expect(get(modifiedPlayers).get(1)).toBeNull();
    expect(get(deletedPlayers).has(1)).toBe(true);
  });
});

describe('addNewPlayerToStore', () => {
  it('records a null original and the new player as modified', () => {
    addNewPlayerToStore(5, makePlayer({ first_name: 'Rookie' }));
    expect(get(originalPlayers).get(5)).toBeNull();
    expect(get(modifiedPlayers).get(5)!.first_name).toBe('Rookie');
  });
});

describe('markPlayerForDeletion', () => {
  it('marks an existing player: modified=null and id in deletedPlayers', () => {
    saveOriginalPlayer(1, makePlayer());
    markPlayerForDeletion(1);
    expect(get(modifiedPlayers).get(1)).toBeNull();
    expect(get(deletedPlayers).has(1)).toBe(true);
  });

  it('snapshots the original from the passed player when not yet tracked', () => {
    markPlayerForDeletion(2, makePlayer({ first_name: 'Snapshot' }));
    expect(getOriginalPlayer(2)!.first_name).toBe('Snapshot');
    expect(get(deletedPlayers).has(2)).toBe(true);
  });

  it('just discards a newly added player (original === null), without flagging deletion', () => {
    addNewPlayerToStore(3, makePlayer());
    markPlayerForDeletion(3);
    expect(get(originalPlayers).has(3)).toBe(false);
    expect(get(modifiedPlayers).has(3)).toBe(false);
    expect(get(deletedPlayers).has(3)).toBe(false);
  });
});

describe('removePlayerFromStores', () => {
  it('clears the id from all three stores', () => {
    saveOriginalPlayer(1, makePlayer());
    markPlayerForDeletion(1);
    removePlayerFromStores(1);
    expect(get(originalPlayers).has(1)).toBe(false);
    expect(get(modifiedPlayers).has(1)).toBe(false);
    expect(get(deletedPlayers).has(1)).toBe(false);
  });
});

describe('getModifiedPlayersAsRecords', () => {
  it('returns modified players as records', () => {
    saveOriginalPlayer(1, makePlayer({ ca: 100 }));
    saveModifiedPlayer(1, makePlayer({ ca: 150 }));
    const records = getModifiedPlayersAsRecords();
    expect(records).toEqual([{ id: 1, player: expect.objectContaining({ ca: 150 }) }]);
  });

  it('falls back to the original data for deleted players (modified === null)', () => {
    saveOriginalPlayer(7, makePlayer({ first_name: 'Deleted' }));
    markPlayerForDeletion(7);
    const record = getModifiedPlayersAsRecords().find((r) => r.id === 7)!;
    expect(record.player.first_name).toBe('Deleted');
  });
});

describe('editedCount', () => {
  it('tracks the number of originals being tracked', () => {
    expect(get(editedCount)).toBe(0);
    saveOriginalPlayer(1, makePlayer());
    saveOriginalPlayer(2, makePlayer());
    expect(get(editedCount)).toBe(2);
    removePlayerFromStores(1);
    expect(get(editedCount)).toBe(1);
  });
});

describe('clearEditedPlayersStore', () => {
  it('empties every store', () => {
    saveOriginalPlayer(1, makePlayer());
    saveModifiedPlayer(1, makePlayer());
    markPlayerForDeletion(1);
    clearEditedPlayersStore();
    expect(get(originalPlayers).size).toBe(0);
    expect(get(modifiedPlayers).size).toBe(0);
    expect(get(deletedPlayers).size).toBe(0);
  });
});
