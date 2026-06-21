import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import {
  selectedPlayers,
  showOnlySelected,
  toggleSelection,
  selectAll,
  deselectAll,
  setSelection,
  deselectPlayer,
} from '$lib/stores/selectionStore';

beforeEach(() => {
  selectedPlayers.set(new Set());
  showOnlySelected.set(false);
});

describe('toggleSelection', () => {
  it('adds an unselected id and removes a selected one', () => {
    toggleSelection(1);
    expect(get(selectedPlayers).has(1)).toBe(true);
    toggleSelection(1);
    expect(get(selectedPlayers).has(1)).toBe(false);
  });
});

describe('selectAll', () => {
  it('adds ids without dropping the existing selection', () => {
    setSelection([1]);
    selectAll([2, 3]);
    expect(get(selectedPlayers)).toEqual(new Set([1, 2, 3]));
  });
});

describe('setSelection', () => {
  it('replaces the whole selection', () => {
    setSelection([1, 2]);
    setSelection([9]);
    expect(get(selectedPlayers)).toEqual(new Set([9]));
  });
});

describe('deselectPlayer', () => {
  it('removes a single id and leaves the rest', () => {
    setSelection([1, 2, 3]);
    deselectPlayer(2);
    expect(get(selectedPlayers)).toEqual(new Set([1, 3]));
  });
});

describe('deselectAll', () => {
  it('clears the selection and turns off the show-only filter', () => {
    setSelection([1, 2]);
    showOnlySelected.set(true);
    deselectAll();
    expect(get(selectedPlayers).size).toBe(0);
    expect(get(showOnlySelected)).toBe(false);
  });
});
