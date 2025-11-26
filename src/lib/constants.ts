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
// POSITION MAP
// ==========================================================================
export const POSITION_MAP: Record<
    string,
    {
        short: string;
        label: string;
        group: "goalkeeper" | "defender" | "midfielder" | "attacker";
    }
> = {
    GOALKEEPER: { short: "GK", label: "goalkeeper", group: "goalkeeper" },
    DEFENDER_LEFT_SIDE: {
        short: "LB",
        label: "left defender",
        group: "defender",
    },
    DEFENDER_RIGHT_SIDE: {
        short: "RB",
        label: "right defender",
        group: "defender",
    },
    DEFENDER_CENTRAL: {
        short: "FB",
        label: "central defender",
        group: "defender",
    },
    MIDFIELDER_LEFT_SIDE: {
        short: "LM",
        label: "left midfielder",
        group: "midfielder",
    },
    MIDFIELDER_RIGHT_SIDE: {
        short: "RM",
        label: "right midfielder",
        group: "midfielder",
    },
    MIDFIELDER_CENTRAL: {
        short: "MC",
        label: "central midfielder",
        group: "midfielder",
    },
    ATTACKING_MIDFIELDER_LEFT_SIDE: {
        short: "LA",
        label: "left attacking mid",
        group: "attacker",
    },
    ATTACKING_MIDFIELDER_RIGHT_SIDE: {
        short: "RA",
        label: "right attacking mid",
        group: "attacker",
    },
    ATTACKING_MIDFIELDER_CENTRAL: {
        short: "AM",
        label: "central attacking mid",
        group: "attacker",
    },
    ATTACKER_CENTRAL: {
        short: "AC",
        label: "central attacker",
        group: "attacker",
    },
};

// ==========================================================================
// UTILITY FUNCTIONS
// ==========================================================================
export function getFootOption(value: number) {
    return FOOT_OPTIONS.find(option => option.value === value);
}

export function getSortOption(value: string) {
    return SORT_OPTIONS.find(option => option.value === value);
}