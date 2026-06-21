import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the Tauri core so `invoke` is a spy we can inspect. We assert on the exact
// payload the frontend sends to Rust — the camelCase->snake_case filter mapping is
// hand-written and easy to break.
const invoke = vi.fn().mockResolvedValue({ players: [], total: 0 });
vi.mock('@tauri-apps/api/core', () => ({
  invoke: (...args: unknown[]) => invoke(...args),
}));

import {
  loadPlayersPage,
  getFilteredPlayerIds,
  getTopPlayers,
  type BirthDateRange,
} from '$lib/api/player';

beforeEach(() => {
  invoke.mockClear();
});

/** Extract the `filters` object from the last invoke() call. */
function lastFilters() {
  const [, payload] = invoke.mock.calls.at(-1)!;
  return (payload as { filters: Record<string, unknown> }).filters;
}

describe('loadPlayersPage', () => {
  it('calls the get_players_page command with offset and limit', async () => {
    await loadPlayersPage(40, 20, null, null, null, null, null, null, null, null, null, null, null, null, null);
    const [cmd, payload] = invoke.mock.calls.at(-1)!;
    expect(cmd).toBe('get_players_page');
    expect(payload).toMatchObject({ offset: 40, limit: 20 });
  });

  it('maps falsy numeric filters (0) to null via `|| null`', async () => {
    // countryId / club / CA / PA / favouriteNumber all use `value || null`,
    // so a 0 collapses to null. This is the documented behaviour we lock in.
    await loadPlayersPage(0, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, '', 0, '', null);
    const f = lastFilters();
    expect(f.country).toBeNull();
    expect(f.club).toBeNull();
    expect(f.min_ca).toBeNull();
    expect(f.favourite_number).toBeNull();
    expect(f.position).toBeNull();
    expect(f.name_query).toBeNull();
  });

  it('preserves preferred_foot === 0 (uses raw value, not `|| null`)', async () => {
    // preferred_foot is the one numeric field passed straight through, so foot "0"
    // (a real, meaningful value) must survive rather than becoming null.
    await loadPlayersPage(0, 20, null, null, null, null, null, null, 0, null, null, null, null, null, null);
    expect(lastFilters().preferred_foot).toBe(0);
  });

  it('forwards real filter values unchanged', async () => {
    await loadPlayersPage(
      0, 20,
      /* country */ 5,
      /* club */ 12,
      /* minCA */ 100, /* maxCA */ 180,
      /* minPA */ 120, /* maxPA */ 200,
      /* foot */ 1,
      /* favNumber */ 10,
      /* birthYear */ 2000,
      /* position */ 'ST',
      /* favClub */ 7,
      /* nameQuery */ 'messi',
      /* sortBy */ ['ca', 'pa'],
    );
    const f = lastFilters();
    expect(f).toMatchObject({
      country: 5,
      club: 12,
      min_ca: 100,
      max_ca: 180,
      min_pa: 120,
      max_pa: 200,
      preferred_foot: 1,
      favourite_number: 10,
      position: 'ST',
      favourite_club: 7,
      name_query: 'messi',
      sort_by: ['ca', 'pa'],
    });
  });

  it('expands a single birthYear into both min and max bounds', async () => {
    await loadPlayersPage(0, 20, null, null, null, null, null, null, null, null, 1995, null, null, null, null);
    const f = lastFilters();
    expect(f.birth_year_min).toBe(1995);
    expect(f.birth_year_max).toBe(1995);
  });

  it('maps a birth date range, keeping 0 day/month via `?? null`', async () => {
    const range: BirthDateRange = { dayFrom: 0, monthFrom: 1, dayTo: 31, monthTo: 12 };
    await loadPlayersPage(0, 20, null, null, null, null, null, null, null, null, null, null, null, null, null, null, range);
    const f = lastFilters();
    // `?? null` keeps 0 (unlike `|| null`) — important for day/month edge values.
    expect(f.birth_day_from).toBe(0);
    expect(f.birth_month_from).toBe(1);
    expect(f.birth_day_to).toBe(31);
    expect(f.birth_month_to).toBe(12);
  });

  it('nulls out birth date range fields when no range is given', async () => {
    await loadPlayersPage(0, 20, null, null, null, null, null, null, null, null, null, null, null, null, null);
    const f = lastFilters();
    expect(f.birth_day_from).toBeNull();
    expect(f.birth_month_to).toBeNull();
  });

  it('passes playerIds through (including null default)', async () => {
    await loadPlayersPage(0, 20, null, null, null, null, null, null, null, null, null, null, null, null, null, [1, 2, 3]);
    expect(lastFilters().player_ids).toEqual([1, 2, 3]);
  });
});

describe('getFilteredPlayerIds', () => {
  it('returns the array resolved by invoke', async () => {
    invoke.mockResolvedValueOnce([10, 20, 30]);
    const ids = await getFilteredPlayerIds(null, null, null, null, null, null, null, null, null, null, null, null, null);
    expect(ids).toEqual([10, 20, 30]);
    expect(invoke.mock.calls.at(-1)![0]).toBe('get_filtered_player_ids');
  });
});

describe('getTopPlayers', () => {
  it('passes the limit alongside the filters', async () => {
    invoke.mockResolvedValueOnce([]);
    await getTopPlayers(null, null, null, null, null, null, null, null, null, null, null, null, 25);
    const [cmd, payload] = invoke.mock.calls.at(-1)!;
    expect(cmd).toBe('get_top_players');
    expect((payload as { limit: number }).limit).toBe(25);
  });

  it('defaults the limit to 10', async () => {
    invoke.mockResolvedValueOnce([]);
    await getTopPlayers(null, null, null, null, null, null, null, null, null, null, null);
    expect((invoke.mock.calls.at(-1)![1] as { limit: number }).limit).toBe(10);
  });
});
