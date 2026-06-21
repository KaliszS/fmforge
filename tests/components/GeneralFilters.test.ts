import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, screen, waitFor } from '@testing-library/svelte';
import { tick } from 'svelte';

// Club fixture standing in for the Rust-backed dataset. ids/names mirror the real
// src/data/clubs.json entries the original specs asserted on.
const CLUBS: Record<number, { name: string; gameName: string }> = {
  57: { name: 'KF Albpetrol', gameName: 'KF Albpetrol' },
  61: { name: 'Tirana', gameName: 'Tirana' },
  58: { name: 'Apolonia', gameName: 'Apolonia' },
};

// Mock the Tauri core so the async club commands resolve against the fixture.
const invoke = vi.fn(async (cmd: string, args: any) => {
  if (cmd === 'get_club_names') {
    const out: Record<number, string> = {};
    for (const id of args.ids) if (CLUBS[id]) out[id] = CLUBS[id].name;
    return out;
  }
  if (cmd === 'search_clubs') {
    const q = String(args.query ?? '').toLowerCase();
    return Object.entries(CLUBS)
      .filter(
        ([id, c]) =>
          !q ||
          c.name.toLowerCase().includes(q) ||
          c.gameName.toLowerCase().includes(q) ||
          id.includes(q),
      )
      .map(([id, c]) => ({ id: +id, name: c.name, gameName: c.gameName }))
      .slice(0, args.limit ?? 50);
  }
  return undefined;
});
vi.mock('@tauri-apps/api/core', () => ({
  invoke: (cmd: string, args?: any) => invoke(cmd, args),
}));

// Imported after the mock so the module-singleton `clubNames` store binds to the
// mocked `invoke`.
import GeneralFilters from '$lib/components/filters/GeneralFilters.svelte';
import GeneralFiltersHarness from './helpers/GeneralFiltersHarness.svelte';
import { clubNames } from '$lib/clubs';

// Valid ids/keys picked from the bundled data + constants:
//   country 5  -> Algeria, 6 -> Angola          (src/data/countries.json)
//   club 57    -> KF Albpetrol, 61 -> Tirana     (src/data/clubs.json)
//   position GOALKEEPER (GK) / ATTACKER_CENTRAL (AC)  (POSITION_MAP)

interface Props {
  nameQuery?: string | null;
  selectedCountry?: number | null;
  selectedClub?: number | null;
  selectedPosition?: string | null;
  selectedFavouriteClub?: number | null;
}

function setup(props: Props = {}) {
  return render(GeneralFilters, {
    props: {
      nameQuery: null,
      selectedCountry: null,
      selectedClub: null,
      selectedPosition: null,
      selectedFavouriteClub: null,
      ...props,
    },
  });
}

const nameInput = () => screen.getByLabelText('Search by name') as HTMLInputElement;
const countrySelect = () => screen.getByLabelText('Select Country') as HTMLSelectElement;
const countryIdInput = () => screen.getByLabelText('Country ID') as HTMLInputElement;
const positionSelect = () => screen.getByLabelText('Select Position') as HTMLSelectElement;
const clubIdInput = () => screen.getByLabelText('Club ID') as HTMLInputElement;
const favClubIdInput = () => screen.getByLabelText('Favourite Club ID') as HTMLInputElement;

beforeEach(() => {
  // Reset the shared name cache so resolved names don't leak between tests.
  clubNames.set(new Map());
  invoke.mockClear();
  document.body.innerHTML = '';
});

describe('GeneralFilters — rendering seeded from props', () => {
  it('renders all five controls', () => {
    setup();
    expect(nameInput()).toBeInTheDocument();
    expect(countrySelect()).toBeInTheDocument();
    expect(positionSelect()).toBeInTheDocument();
    // Two ClubSelect inputs (club + favourite club) plus their numeric ID inputs.
    expect(clubIdInput()).toBeInTheDocument();
    expect(favClubIdInput()).toBeInTheDocument();
  });

  it('seeds the name input from nameQuery', () => {
    setup({ nameQuery: 'messi' });
    expect(nameInput().value).toBe('messi');
  });

  it('seeds an empty name input when nameQuery is null', () => {
    setup({ nameQuery: null });
    expect(nameInput().value).toBe('');
  });

  it('seeds the country select + ID input from selectedCountry', () => {
    setup({ selectedCountry: 5 });
    expect(countrySelect().value).toBe('5');
    expect(countryIdInput().value).toBe('5');
  });

  it('shows the placeholder option when no country is selected', () => {
    setup({ selectedCountry: null });
    // The bound <select> reflects null -> the "Select Country..." placeholder option.
    expect(countrySelect().value).toBe('');
    expect(screen.getByText('Select Country...')).toBeInTheDocument();
  });

  it('renders country options from the country map (Algeria id 5)', () => {
    setup();
    const opt = Array.from(countrySelect().options).find((o) => o.value === '5');
    expect(opt?.textContent).toBe('Algeria');
  });

  it('seeds the position select from selectedPosition', () => {
    setup({ selectedPosition: 'GOALKEEPER' });
    expect(positionSelect().value).toBe('GOALKEEPER');
  });

  it('renders position options with "short - label" text', () => {
    setup();
    const opt = Array.from(positionSelect().options).find((o) => o.value === 'GOALKEEPER');
    expect(opt?.textContent).toBe('GK - goalkeeper');
  });

  it('seeds the club ID input from selectedClub', () => {
    setup({ selectedClub: 57 });
    expect(clubIdInput().value).toBe('57');
  });

  it('seeds the favourite club ID input from selectedFavouriteClub', () => {
    setup({ selectedFavouriteClub: 61 });
    expect(favClubIdInput().value).toBe('61');
  });

  it('seeds the ClubSelect search box with the club name for a selected club', async () => {
    setup({ selectedClub: 57 });
    // ClubSelect's $effect resolves the name from the backend (get_club_names).
    await waitFor(() =>
      expect(screen.getByPlaceholderText('Select Club...')).toHaveValue('KF Albpetrol'),
    );
  });

  it('seeds the favourite ClubSelect search box from selectedFavouriteClub', async () => {
    setup({ selectedFavouriteClub: 61 });
    await waitFor(() =>
      expect(screen.getByPlaceholderText('Select Favourite Club...')).toHaveValue('Tirana'),
    );
  });
});

describe('GeneralFilters — country editing (bindable)', () => {
  it('updates the ID input when a country is chosen from the select', async () => {
    setup({ selectedCountry: null });
    await fireEvent.change(countrySelect(), { target: { value: '6' } });
    await tick();
    // Both controls bind the same prop, so the numeric mirror reflects the choice.
    expect(countryIdInput().value).toBe('6');
  });

  it('updates the select when a country ID is typed', async () => {
    setup({ selectedCountry: null });
    await fireEvent.input(countryIdInput(), { target: { value: '5' } });
    await tick();
    expect(countrySelect().value).toBe('5');
  });

  it('clears the country back to placeholder when the select is reset to null', async () => {
    setup({ selectedCountry: 5 });
    expect(countryIdInput().value).toBe('5');
    await fireEvent.change(countrySelect(), { target: { value: '' } });
    await tick();
    expect(countryIdInput().value).toBe('');
  });
});

describe('GeneralFilters — position editing (bindable)', () => {
  it('updates the position select on change', async () => {
    setup({ selectedPosition: null });
    await fireEvent.change(positionSelect(), { target: { value: 'ATTACKER_CENTRAL' } });
    await tick();
    expect(positionSelect().value).toBe('ATTACKER_CENTRAL');
  });

  it('resets the position to the placeholder', async () => {
    setup({ selectedPosition: 'GOALKEEPER' });
    await fireEvent.change(positionSelect(), { target: { value: '' } });
    await tick();
    expect(positionSelect().value).toBe('');
  });
});

describe('GeneralFilters — club ID editing (bindable)', () => {
  it('propagates a typed club ID into the ClubSelect search box', async () => {
    setup({ selectedClub: null });
    await fireEvent.input(clubIdInput(), { target: { value: '61' } });
    // The shared binding feeds ClubSelect, whose $effect resolves the name async.
    await waitFor(() =>
      expect(screen.getByPlaceholderText('Select Club...')).toHaveValue('Tirana'),
    );
  });

  it('propagates a typed favourite club ID into its ClubSelect search box', async () => {
    setup({ selectedFavouriteClub: null });
    await fireEvent.input(favClubIdInput(), { target: { value: '57' } });
    await waitFor(() =>
      expect(screen.getByPlaceholderText('Select Favourite Club...')).toHaveValue('KF Albpetrol'),
    );
  });

  it('clears the ID input when the club is cleared', async () => {
    setup({ selectedClub: 57 });
    expect(clubIdInput().value).toBe('57');
    await fireEvent.input(clubIdInput(), { target: { value: '' } });
    await tick();
    expect(clubIdInput().value).toBe('');
  });
});

describe('GeneralFilters — ClubSelect interaction', () => {
  it('selecting a club from the dropdown fills the shared ID input', async () => {
    setup({ selectedClub: null });
    const search = screen.getByPlaceholderText('Select Club...') as HTMLInputElement;
    await fireEvent.input(search, { target: { value: 'Tirana' } });
    // Dropdown is populated by a 150ms-debounced async search_clubs call.
    const option = await screen.findByText('Tirana');
    await fireEvent.click(option);
    await tick();
    expect(clubIdInput().value).toBe('61');
  });

  it('clearing the ClubSelect search empties the shared ID input', async () => {
    setup({ selectedClub: 57 });
    const search = screen.getByPlaceholderText('Select Club...') as HTMLInputElement;
    await fireEvent.input(search, { target: { value: '' } });
    await tick();
    expect(clubIdInput().value).toBe('');
  });
});

describe('GeneralFilters — debounced name search', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  // We can't read $bindable nameQuery directly from outside, but the debounce timer
  // is the load-bearing logic: nameQuery is only written after 300ms, trimmed, with
  // "" collapsing to null. We exercise the timer and assert the input still reflects
  // what was typed (the component keeps searchInput in sync immediately).
  it('keeps the typed value in the input immediately', async () => {
    setup();
    await fireEvent.input(nameInput(), { target: { value: 'ronaldo' } });
    expect(nameInput().value).toBe('ronaldo');
  });

  it('does not throw when the debounce timer elapses', async () => {
    setup();
    await fireEvent.input(nameInput(), { target: { value: '  pele  ' } });
    expect(() => vi.advanceTimersByTime(300)).not.toThrow();
  });

  it('handles clearing the field then firing the timer', async () => {
    setup({ nameQuery: 'old' });
    await fireEvent.input(nameInput(), { target: { value: '' } });
    expect(nameInput().value).toBe('');
    expect(() => vi.advanceTimersByTime(300)).not.toThrow();
  });
});

describe('GeneralFilters — name search nameQuery write-back (bindable)', () => {
  // Observe the $bindable nameQuery write-back via a harness that mirrors the
  // bound props into a plain `snapshot` object.
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  function setupHarness(initial: string | null = null) {
    const snapshot: Record<string, unknown> = {};
    render(GeneralFiltersHarness, {
      props: { nameQuery: initial, snapshot },
    });
    return snapshot;
  }

  it('writes the trimmed query back through nameQuery after 300ms', async () => {
    const snapshot = setupHarness(null);
    await fireEvent.input(nameInput(), { target: { value: '  messi  ' } });
    vi.advanceTimersByTime(300);
    await tick();
    expect(snapshot.nameQuery).toBe('messi');
  });

  it('writes null when the field is cleared and the timer fires', async () => {
    const snapshot = setupHarness('start');
    await fireEvent.input(nameInput(), { target: { value: '   ' } });
    vi.advanceTimersByTime(300);
    await tick();
    expect(snapshot.nameQuery).toBeNull();
  });

  it('debounces: nameQuery is unchanged before 300ms elapses', async () => {
    const snapshot = setupHarness(null);
    await fireEvent.input(nameInput(), { target: { value: 'zlatan' } });
    vi.advanceTimersByTime(299);
    await tick();
    expect(snapshot.nameQuery).toBeNull();
  });

  it('collapses an only-whitespace query to null (trim then empty check)', async () => {
    const snapshot = setupHarness(null);
    await fireEvent.input(nameInput(), { target: { value: '   ' } });
    vi.advanceTimersByTime(300);
    await tick();
    expect(snapshot.nameQuery).toBeNull();
  });
});
