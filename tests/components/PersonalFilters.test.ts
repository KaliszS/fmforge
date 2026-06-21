import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import { modSettings } from '$lib/stores/modSettings';
import Harness, { type HarnessState } from './helpers/PersonalFiltersHarness.svelte';

// PersonalFilters has no callbacks — it exposes its outputs purely through
// $bindable props that an $effect writes back to. A plain props object passed
// to render() does NOT receive Svelte 5 binding write-backs, so we wrap the
// component in a harness that owns reactive $state and reports the latest
// snapshot through a `read` callback. DOM-backed controls are also asserted
// directly off the rendered <input>/<select> elements.

function setup(overrides: Partial<HarnessState> = {}) {
  let latest: HarnessState = {
    preferredFoot: null,
    favouriteNumber: null,
    birthYear: null,
    effectiveBirthYear: null,
    birthDateRange: null,
    ...overrides,
  };
  const result = render(Harness, {
    props: { initial: overrides, read: (s: HarnessState) => { latest = s; } },
  });
  // `state` is a live getter onto the most recent snapshot.
  const state = {
    get preferredFoot() { return latest.preferredFoot; },
    get favouriteNumber() { return latest.favouriteNumber; },
    get birthYear() { return latest.birthYear; },
    get effectiveBirthYear() { return latest.effectiveBirthYear; },
    get birthDateRange() { return latest.birthDateRange; },
  };
  return { ...result, state };
}

const footSelect = () => screen.getByLabelText('Select Preferred Foot') as HTMLSelectElement;
const favNumberInput = () => screen.getByLabelText('Favourite Number') as HTMLInputElement;
const birthYearInput = () => screen.getByLabelText('Birth Year') as HTMLInputElement;
const expandBtn = () => screen.getByLabelText(/date range/i) as HTMLButtonElement;

beforeEach(() => {
  document.body.innerHTML = '';
  // Reset the shared modSettings store to its default (no toggle / game dates).
  modSettings.set({
    fmEdition: '',
    retroYear: '',
    showRealBirthDates: false,
    canToggle: false,
  });
});

describe('PersonalFilters — rendering seeded from props', () => {
  it('renders the three core controls', () => {
    setup();
    expect(footSelect()).toBeInTheDocument();
    expect(favNumberInput()).toBeInTheDocument();
    expect(birthYearInput()).toBeInTheDocument();
  });

  it('seeds the preferred-foot select from the prop', () => {
    setup({ preferredFoot: 1 });
    expect(footSelect().value).toBe('1');
  });

  it('shows the "Preferred Foot..." placeholder option when null', () => {
    setup({ preferredFoot: null });
    // null bound value selects the placeholder <option value={null}>.
    expect(footSelect().value).toBe('');
    expect(screen.getByText('Preferred Foot...')).toBeInTheDocument();
  });

  it('renders all five foot options plus the placeholder', () => {
    setup();
    expect(footSelect().options.length).toBe(6);
    expect(screen.getByText(/Right Only/)).toBeInTheDocument();
    expect(screen.getByText(/Both/)).toBeInTheDocument();
  });

  it('seeds the favourite-number input from the prop', () => {
    setup({ favouriteNumber: 10 });
    expect(favNumberInput().value).toBe('10');
  });

  it('seeds the birth-year input from the prop', () => {
    setup({ birthYear: 1998 });
    expect(birthYearInput().value).toBe('1998');
  });

  it('uses the plain "Birth Year" placeholder when the mod cannot toggle dates', () => {
    setup();
    expect(birthYearInput().placeholder).toBe('Birth Year');
  });
});

describe('PersonalFilters — modSettings-driven placeholder', () => {
  it('shows "Birth Year (Game)" when toggling is allowed and real dates are off', async () => {
    modSettings.set({ fmEdition: '2024', retroYear: '2020', showRealBirthDates: false, canToggle: true });
    setup();
    await tick();
    expect(birthYearInput().placeholder).toBe('Birth Year (Game)');
  });

  it('shows "Birth Year (Real)" when toggling is allowed and real dates are on', async () => {
    modSettings.set({ fmEdition: '2024', retroYear: '2020', showRealBirthDates: true, canToggle: true });
    setup();
    await tick();
    expect(birthYearInput().placeholder).toBe('Birth Year (Real)');
  });
});

describe('PersonalFilters — editing controls writes back to bound props', () => {
  it('writes the chosen preferred foot back to the bound prop', async () => {
    const { state } = setup({ preferredFoot: null });
    await fireEvent.change(footSelect(), { target: { value: '3' } });
    await tick();
    expect(state.preferredFoot).toBe(3);
    expect(footSelect().value).toBe('3');
  });

  it('preserves foot value 0 (Right Only) — a real, meaningful value', async () => {
    const { state } = setup({ preferredFoot: null });
    await fireEvent.change(footSelect(), { target: { value: '0' } });
    await tick();
    expect(state.preferredFoot).toBe(0);
  });

  it('writes a typed favourite number back to the bound prop', async () => {
    const { state } = setup();
    await fireEvent.input(favNumberInput(), { target: { value: '23' } });
    await tick();
    expect(state.favouriteNumber).toBe(23);
  });

  it('clears the favourite number to null on an empty field', async () => {
    const { state } = setup({ favouriteNumber: 9 });
    await fireEvent.input(favNumberInput(), { target: { value: '' } });
    await tick();
    expect(state.favouriteNumber).toBeNull();
  });

  it('writes a typed birth year back to the bound prop', async () => {
    const { state } = setup();
    await fireEvent.input(birthYearInput(), { target: { value: '2001' } });
    await tick();
    expect(state.birthYear).toBe(2001);
  });

  it('clears the birth year to null on an empty field', async () => {
    const { state } = setup({ birthYear: 1995 });
    await fireEvent.input(birthYearInput(), { target: { value: '' } });
    await tick();
    expect(state.birthYear).toBeNull();
  });
});

describe('PersonalFilters — effectiveBirthYear $effect', () => {
  it('mirrors birthYear when toggling is disabled', async () => {
    const { state } = setup({ birthYear: 2000 });
    await tick();
    expect(state.effectiveBirthYear).toBe(2000);
  });

  it('keeps effectiveBirthYear null when birthYear is null', async () => {
    const { state } = setup({ birthYear: null });
    await tick();
    expect(state.effectiveBirthYear).toBeNull();
  });

  it('mirrors birthYear when toggling is on but real dates are off', async () => {
    modSettings.set({ fmEdition: '2024', retroYear: '2020', showRealBirthDates: false, canToggle: true });
    const { state } = setup({ birthYear: 2000 });
    await tick();
    expect(state.effectiveBirthYear).toBe(2000);
  });

  it('offsets birthYear by (fmEdition - 1 - retroYear) when showing real dates', async () => {
    // 2000 + (2024 - 1 - 2020) = 2000 + 3 = 2003
    modSettings.set({ fmEdition: '2024', retroYear: '2020', showRealBirthDates: true, canToggle: true });
    const { state } = setup({ birthYear: 2000 });
    await tick();
    expect(state.effectiveBirthYear).toBe(2003);
  });

  it('recomputes effectiveBirthYear when birthYear is edited', async () => {
    modSettings.set({ fmEdition: '2024', retroYear: '2020', showRealBirthDates: true, canToggle: true });
    const { state } = setup({ birthYear: null });
    await fireEvent.input(birthYearInput(), { target: { value: '1990' } });
    await tick();
    // 1990 + (2024 - 1 - 2020) = 1993
    expect(state.effectiveBirthYear).toBe(1993);
  });
});

describe('PersonalFilters — birth date range expansion', () => {
  it('hides the date-range panel by default', () => {
    setup();
    expect(screen.queryByLabelText('Day from')).not.toBeInTheDocument();
  });

  it('shows the +/− toggle button', () => {
    setup();
    expect(expandBtn()).toHaveTextContent('+');
  });

  it('reveals the From/To selects when expanded', async () => {
    setup();
    await fireEvent.click(expandBtn());
    await tick();
    expect(screen.getByLabelText('Day from')).toBeInTheDocument();
    expect(screen.getByLabelText('Month from')).toBeInTheDocument();
    expect(screen.getByLabelText('Day to')).toBeInTheDocument();
    expect(screen.getByLabelText('Month to')).toBeInTheDocument();
    expect(expandBtn()).toHaveTextContent('−');
  });

  it('defaults the From/To selects to 1/Jan and 31/Dec', async () => {
    setup();
    await fireEvent.click(expandBtn());
    await tick();
    expect((screen.getByLabelText('Day from') as HTMLSelectElement).value).toBe('1');
    expect((screen.getByLabelText('Month from') as HTMLSelectElement).value).toBe('1');
    expect((screen.getByLabelText('Day to') as HTMLSelectElement).value).toBe('31');
    expect((screen.getByLabelText('Month to') as HTMLSelectElement).value).toBe('12');
  });

  it('keeps birthDateRange null while the panel shows the default full range', async () => {
    const { state } = setup();
    await fireEvent.click(expandBtn());
    await tick();
    // Expanded but unchanged === default range, which the $effect maps to null.
    expect(state.birthDateRange).toBeNull();
  });

  it('writes a concrete birthDateRange once a bound is narrowed', async () => {
    const { state } = setup();
    await fireEvent.click(expandBtn());
    await tick();
    await fireEvent.change(screen.getByLabelText('Month from'), { target: { value: '6' } });
    await tick();
    expect(state.birthDateRange).toEqual({ dayFrom: 1, monthFrom: 6, dayTo: 31, monthTo: 12 });
  });

  it('keeps day value 1 / month value 1 in the range rather than dropping them', async () => {
    const { state } = setup();
    await fireEvent.click(expandBtn());
    await tick();
    // Narrow the "to" side so the range is non-default, but leave the "from"
    // side at 1/Jan — the literal 1s must survive into the emitted range.
    await fireEvent.change(screen.getByLabelText('Day to'), { target: { value: '15' } });
    await tick();
    expect(state.birthDateRange).toEqual({ dayFrom: 1, monthFrom: 1, dayTo: 15, monthTo: 12 });
  });

  it('resets the selects and nulls birthDateRange when collapsed again', async () => {
    const { state } = setup();
    await fireEvent.click(expandBtn());
    await tick();
    await fireEvent.change(screen.getByLabelText('Month from'), { target: { value: '6' } });
    await tick();
    expect(state.birthDateRange).not.toBeNull();

    // Collapse: toggleBirthDateRange resets the four selects to defaults.
    await fireEvent.click(expandBtn());
    await tick();
    expect(state.birthDateRange).toBeNull();
    expect(screen.queryByLabelText('Day from')).not.toBeInTheDocument();

    // Re-expanding shows the reset defaults.
    await fireEvent.click(expandBtn());
    await tick();
    expect((screen.getByLabelText('Month from') as HTMLSelectElement).value).toBe('1');
  });
});
