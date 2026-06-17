export type IconName =
    | 'chevron-left'
    | 'chevron-right'
    | 'chevron-up'
    | 'chevron-down'
    | 'arrow-up'
    | 'arrow-down'
    | 'arrows-up-down'
    | 'refresh'
    | 'x'
    | 'trash'
    | 'check'
    | 'pencil'
    | 'sun'
    | 'moon'
    | 'split-view';

export const icons: Record<IconName, { inner: string; strokeWidth?: number }> = {
    'chevron-left': {
        inner: '<path d="M15 18l-6-6 6-6"/>',
        strokeWidth: 3,
    },
    'chevron-right': {
        inner: '<path d="M9 18l6-6-6-6"/>',
        strokeWidth: 3,
    },
    'chevron-up': {
        inner: '<path d="M18 15l-6-6-6 6"/>',
        strokeWidth: 3,
    },
    'chevron-down': {
        inner: '<path d="M6 9l6 6 6-6"/>',
        strokeWidth: 3,
    },
    'arrow-up': {
        inner: '<path d="M12 19V5"/><path d="M5 12l7-7 7 7"/>',
        strokeWidth: 3,
    },
    'arrow-down': {
        inner: '<path d="M12 5v14"/><path d="M19 12l-7 7-7-7"/>',
        strokeWidth: 3,
    },
    'arrows-up-down': {
        inner: '<path d="M7 15l5 5 5-5"/><path d="M7 9l5-5 5 5"/>',
    },
    'refresh': {
        inner: '<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/>',
    },
    'x': {
        inner: '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    },
    'trash': {
        inner: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>',
    },
    'check': {
        inner: '<path d="M20 6L9 17l-5-5"/>',
    },
    'pencil': {
        inner: '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
    },
    'sun': {
        inner: '<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>',
    },
    'moon': {
        inner: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>',
    },
    'split-view': {
        inner: '<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="12" y1="3" x2="12" y2="21"/>',
    },
};
