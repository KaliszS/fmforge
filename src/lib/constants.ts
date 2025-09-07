// ==========================================================================
// PREFERRED FOOT OPTIONS
// ==========================================================================
export const FOOT_OPTIONS = [
    { value: 0, label: "Right Only", icon: "🦶➡️", style: "only right" },
    { value: 1, label: "Left Only", icon: "⬅️🦶", style: "only left" },
    { value: 2, label: "Right Preferred", icon: "🦶→", style: "preferred right" },
    { value: 3, label: "Left Preferred", icon: "←🦶", style: "preferred left" },
    { value: 4, label: "Both", icon: "🦶🦶", style: "both" },
] as const;

// ==========================================================================
// SORT OPTIONS
// ==========================================================================
export const SORT_OPTIONS = [
    { value: "ca_desc", label: "CA (High to Low)", icon: "⚡⬇️" },
    { value: "ca_asc", label: "CA (Low to High)", icon: "⚡⬆️" },
    { value: "pa_desc", label: "PA (High to Low)", icon: "⭐⬇️" },
    { value: "pa_asc", label: "PA (Low to High)", icon: "⭐⬆️" },
    { value: "age_desc", label: "Age (Oldest First)", icon: "👴⬇️" },
    { value: "age_asc", label: "Age (Youngest First)", icon: "👶⬆️" },
    { value: "name_asc", label: "Name (A-Z)", icon: "🔤⬆️" },
    { value: "name_desc", label: "Name (Z-A)", icon: "🔤⬇️" },
] as const;

export type SortOption = typeof SORT_OPTIONS[number]['value'];

// ==========================================================================
// UTILITY FUNCTIONS
// ==========================================================================
export function getFootOption(value: number) {
    return FOOT_OPTIONS.find(option => option.value === value);
}

export function getSortOption(value: string) {
    return SORT_OPTIONS.find(option => option.value === value);
}