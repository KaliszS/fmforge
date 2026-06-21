import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen, waitFor } from '@testing-library/svelte';
import { clubNames } from '$lib/clubs';

const CLUBS: Record<number, { name: string; gameName: string }> = {
  57: { name: 'KF Albpetrol', gameName: 'KF Albpetrol' },
  61: { name: 'Tirana', gameName: 'KF Tirana' },
};

const invoke = vi.fn(async (cmd: string, args: any) => {
  if (cmd === 'get_club_names') {
    const out: Record<number, string> = {};
    for (const id of args.ids) if (CLUBS[id]) out[id] = CLUBS[id].name;
    return out;
  }
  if (cmd === 'search_clubs') {
    return Object.entries(CLUBS).map(([id, c]) => ({ id: +id, name: c.name, gameName: c.gameName }));
  }
  return undefined;
});
vi.mock('@tauri-apps/api/core', () => ({ invoke: (cmd: string, args?: any) => invoke(cmd, args) }));

import Club from '$lib/components/player/Club.svelte';

beforeEach(() => {
  clubNames.set(new Map());
  invoke.mockClear();
  document.body.innerHTML = '';
});

describe('Club quick-edit modal + ClubSelect dropdown', () => {
  it('closes the dropdown after selecting a club inside the QuickEdit modal', async () => {
    const { container } = render(Club, { props: { club_id: 57, favourite_team_id: null, edit_mode: false } });

    // Double-click the club display to open the quick-edit modal.
    await fireEvent.dblClick(container.querySelector('.club-info')!);
    expect(await screen.findByText('Edit Clubs')).toBeInTheDocument();

    // Click the first ClubSelect input -> opens its dropdown.
    const input = document.querySelector('.modal-content .club-input') as HTMLInputElement;
    await fireEvent.click(input);

    // Pick a club from the dropdown.
    const option = await screen.findByText('Tirana');
    await fireEvent.click(option);

    // The dropdown options should be gone after selecting.
    await waitFor(() => {
      expect(screen.queryByText('Tirana')).not.toBeInTheDocument();
    });
  });
});
