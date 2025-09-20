import { writable } from 'svelte/store';

export interface ModSettings {
  fmEdition: string;
  retroYear: string;
  showRealBirthDates: boolean;
  canToggle: boolean;
}

export const modSettings = writable<ModSettings>({
  fmEdition: '',
  retroYear: '',
  showRealBirthDates: false,
  canToggle: false
});
