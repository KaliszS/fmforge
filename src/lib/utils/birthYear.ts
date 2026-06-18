import type { ModSettings } from "$lib/stores/modSettings";

export function getBirthYearOffset(settings: ModSettings): number {
    if (!settings.showRealBirthDates || !settings.canToggle) return 0;
    const fmEdition = parseInt(settings.fmEdition);
    const retroYear = parseInt(settings.retroYear);
    if (isNaN(fmEdition) || isNaN(retroYear)) return 0;
    return fmEdition - 1 - retroYear;
}
