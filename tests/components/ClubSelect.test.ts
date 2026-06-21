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
    const q = String(args.query ?? '').toLowerCase();
    return Object.entries(CLUBS)
      .filter(([id, c]) => !q || c.name.toLowerCase().includes(q) || id.includes(q))
      .map(([id, c]) => ({ id: +id, name: c.name, gameName: c.gameName }));
  }
  return undefined;
});
vi.mock('@tauri-apps/api/core', () => ({ invoke: (cmd: string, args?: any) => invoke(cmd, args) }));

import ClubSelect from '$lib/components/common/ClubSelect.svelte';

beforeEach(() => {
  clubNames.set(new Map());
  invoke.mockClear();
  document.body.innerHTML = '';
});

describe('ClubSelect dropdown', () => {
  it('closes the dropdown after selecting a club', async () => {
    render(ClubSelect, { props: { value: null } });
    const input = screen.getByRole('textbox') as HTMLInputElement;

    await fireEvent.click(input);
    // Wait for the (debounced) search results to appear.
    const option = await screen.findByText('KF Albpetrol');
    await fireEvent.click(option);

    // The dropdown should be gone after selection.
    await waitFor(() => {
      expect(screen.queryByText('KF Albpetrol')).not.toBeInTheDocument();
    });
  });
});
