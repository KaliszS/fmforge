import { writable } from 'svelte/store';

export const selectedPlayers = writable<Set<number>>(new Set());
export const showOnlySelected = writable<boolean>(false);

export function toggleSelection(id: number) {
    selectedPlayers.update(selected => {
        const newSelected = new Set(selected);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        return newSelected;
    });
}

export function selectAll(ids: number[]) {
    selectedPlayers.update(selected => {
        const newSelected = new Set(selected);
        ids.forEach(id => newSelected.add(id));
        return newSelected;
    });
}

export function deselectAll() {
    selectedPlayers.set(new Set());
    showOnlySelected.set(false);
}

export function setSelection(ids: number[]) {
    selectedPlayers.set(new Set(ids));
}

export function deselectPlayer(id: number) {
    selectedPlayers.update(selected => {
        const newSelected = new Set(selected);
        newSelected.delete(id);
        return newSelected;
    });
}

