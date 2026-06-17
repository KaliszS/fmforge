export interface AnalystTab {
    id: string;
    name: string;
    icon: string;
}

export const ANALYST_TABS: AnalystTab[] = [
    { id: 'overview',   name: 'Overview',   icon: '📊' },
    { id: 'abilities',  name: 'Abilities',  icon: '⚽' },
    { id: 'geography',  name: 'Geography',  icon: '🌍' },
    { id: 'physical',   name: 'Physical',   icon: '👤' },
    { id: 'positional', name: 'Positional', icon: '🏃' },
    { id: 'appearance', name: 'Appearance', icon: '🎨' },
    { id: 'temporal',   name: 'Temporal',   icon: '📅' },
    { id: 'clubs',      name: 'Clubs',      icon: '🏆' },
];
