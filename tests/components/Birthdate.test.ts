import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import Birthdate from '$lib/components/player/utils/Birthdate.svelte';
import { modSettings } from '$lib/stores/modSettings';

const DEFAULT_SETTINGS = {
  fmEdition: '',
  retroYear: '',
  showRealBirthDates: false,
  canToggle: false,
};

beforeEach(() => {
  document.body.innerHTML = '';
  modSettings.set({ ...DEFAULT_SETTINGS });
});

const display = () => screen.getByTitle('birthdate (DD/MM/YYYY)');
const editInput = () => screen.getByTitle('Birthdate') as HTMLInputElement;

describe('Birthdate — display formatting', () => {
  it('formats DD/MM/YYYY into "D Mon YYYY" with no leading zero on the day', () => {
    render(Birthdate, { props: { birthdate: '05/03/1990', edit_mode: false } });
    expect(display()).toHaveTextContent('5 Mar 1990');
  });

  it('formats a two-digit day correctly', () => {
    render(Birthdate, { props: { birthdate: '15/12/1988', edit_mode: false } });
    expect(display()).toHaveTextContent('15 Dec 1988');
  });

  it('renders an empty string when birthdate is empty', () => {
    render(Birthdate, { props: { birthdate: '', edit_mode: false } });
    expect(display().querySelector('strong')!.textContent).toBe('');
  });

  it('renders "???" for an out-of-range month index', () => {
    render(Birthdate, { props: { birthdate: '01/13/1990', edit_mode: false } });
    expect(display()).toHaveTextContent('1 ??? 1990');
  });

  it('renders "???" for a non-numeric / malformed month', () => {
    // monthStr undefined -> parseInt(NaN) - 1 -> NaN index -> "???"
    render(Birthdate, { props: { birthdate: 'garbage', edit_mode: false } });
    expect(display()).toHaveTextContent('???');
  });
});

describe('Birthdate — edit mode input seeding', () => {
  it('seeds the date input from the prop as zero-padded YYYY-MM-DD', () => {
    render(Birthdate, { props: { birthdate: '5/3/1990', edit_mode: true } });
    expect(editInput().value).toBe('1990-03-05');
  });

  it('keeps an already-padded value intact', () => {
    render(Birthdate, { props: { birthdate: '15/12/1988', edit_mode: true } });
    expect(editInput().value).toBe('1988-12-15');
  });

  it('seeds an empty input when birthdate is empty', () => {
    render(Birthdate, { props: { birthdate: '', edit_mode: true } });
    expect(editInput().value).toBe('');
  });

  it('does not render the display section in edit mode', () => {
    render(Birthdate, { props: { birthdate: '05/03/1990', edit_mode: true } });
    expect(screen.queryByTitle('birthdate (DD/MM/YYYY)')).not.toBeInTheDocument();
  });
});

describe('Birthdate — edit mode date change (date parsing -> DD/MM/YYYY)', () => {
  it('parses a YYYY-MM-DD change into DD/MM/YYYY and reflects it on the derived input', async () => {
    render(Birthdate, { props: { birthdate: '05/03/1990', edit_mode: true } });
    await fireEvent.change(editInput(), { target: { value: '2000-07-21' } });
    await tick();
    // The one-way `value={dateInputValue}` re-derives from the internally updated `birthdate`.
    expect(editInput().value).toBe('2000-07-21');
  });

  it('clears the bound value when the input is emptied', async () => {
    render(Birthdate, { props: { birthdate: '05/03/1990', edit_mode: true } });
    await fireEvent.change(editInput(), { target: { value: '' } });
    await tick();
    expect(editInput().value).toBe('');
  });
});

describe('Birthdate — birth-year offset (real vs in-game dates)', () => {
  // realYear = inGameYear - (fmEdition - 1 - retroYear)
  // With fmEdition=2024, retroYear=2000 -> offset = 2024 - 1 - 2000 = 23
  it('display shows the real (offset) date when showRealBirthDates && canToggle', async () => {
    modSettings.set({
      fmEdition: '2024',
      retroYear: '2000',
      showRealBirthDates: true,
      canToggle: true,
    });
    render(Birthdate, { props: { birthdate: '05/03/2020', edit_mode: false } });
    await tick();
    // realYear = 2020 - 23 = 1997
    expect(display()).toHaveTextContent('5 Mar 1997');
  });

  it('display shows the raw in-game date when canToggle is false', async () => {
    modSettings.set({
      fmEdition: '2024',
      retroYear: '2000',
      showRealBirthDates: true,
      canToggle: false,
    });
    render(Birthdate, { props: { birthdate: '05/03/2020', edit_mode: false } });
    await tick();
    expect(display()).toHaveTextContent('5 Mar 2020');
  });

  it('edit-mode input shows the real (offset) date when toggled', async () => {
    modSettings.set({
      fmEdition: '2024',
      retroYear: '2000',
      showRealBirthDates: true,
      canToggle: true,
    });
    render(Birthdate, { props: { birthdate: '05/03/2020', edit_mode: true } });
    await tick();
    // 1997-03-05
    expect(editInput().value).toBe('1997-03-05');
  });

  it('changing the edit input while toggled stores the converted in-game date', async () => {
    modSettings.set({
      fmEdition: '2024',
      retroYear: '2000',
      showRealBirthDates: true,
      canToggle: true,
    });
    render(Birthdate, { props: { birthdate: '05/03/2020', edit_mode: true } });
    // User enters real date 1998-06-10 -> stored in-game = 1998 + 23 = 2021
    await fireEvent.change(editInput(), { target: { value: '1998-06-10' } });
    await tick();
    // Re-derived input shows the real date back: 1998-06-10
    expect(editInput().value).toBe('1998-06-10');
  });
});

describe('Birthdate — quick edit modal round trip (bindable)', () => {
  it('opens the modal on double-click and shows the seeded date', async () => {
    render(Birthdate, { props: { birthdate: '05/03/1990', edit_mode: false } });
    await fireEvent.dblClick(display());
    expect(screen.getByText('Edit Birthdate')).toBeInTheDocument();
    const modalInput = document.querySelector<HTMLInputElement>('.modal-content input')!;
    expect(modalInput.value).toBe('1990-03-05');
  });

  it('writes a new date back to the display via the modal Save', async () => {
    render(Birthdate, { props: { birthdate: '05/03/1990', edit_mode: false } });
    await fireEvent.dblClick(display());

    const modalInput = document.querySelector<HTMLInputElement>('.modal-content input')!;
    await fireEvent.change(modalInput, { target: { value: '2001-11-09' } });
    await fireEvent.click(screen.getByText('Save'));
    await tick();

    expect(screen.queryByText('Edit Birthdate')).not.toBeInTheDocument();
    expect(display()).toHaveTextContent('9 Nov 2001');
  });

  it('does not open the modal in edit mode (openQuickEdit guard)', async () => {
    render(Birthdate, { props: { birthdate: '05/03/1990', edit_mode: true } });
    // No display section to double-click; modal title must be absent.
    expect(screen.queryByText('Edit Birthdate')).not.toBeInTheDocument();
    expect(screen.queryByTitle('birthdate (DD/MM/YYYY)')).not.toBeInTheDocument();
  });

  it('Cancel closes the modal without changing the displayed date', async () => {
    render(Birthdate, { props: { birthdate: '05/03/1990', edit_mode: false } });
    await fireEvent.dblClick(display());

    const modalInput = document.querySelector<HTMLInputElement>('.modal-content input')!;
    await fireEvent.change(modalInput, { target: { value: '2001-11-09' } });
    await fireEvent.click(screen.getByText('Cancel'));
    await tick();

    expect(screen.queryByText('Edit Birthdate')).not.toBeInTheDocument();
    expect(display()).toHaveTextContent('5 Mar 1990');
  });

  it('quick edit honours the real-date offset on save', async () => {
    modSettings.set({
      fmEdition: '2024',
      retroYear: '2000',
      showRealBirthDates: true,
      canToggle: true,
    });
    render(Birthdate, { props: { birthdate: '05/03/2020', edit_mode: false } });
    await tick();
    await fireEvent.dblClick(display());

    const modalInput = document.querySelector<HTMLInputElement>('.modal-content input')!;
    // seeded with real date 1997-03-05
    expect(modalInput.value).toBe('1997-03-05');
    // enter a new real date 1998-06-10 -> in-game 1998 + 23 = 2021
    await fireEvent.change(modalInput, { target: { value: '1998-06-10' } });
    await fireEvent.click(screen.getByText('Save'));
    await tick();

    // display re-applies the offset: 2021 - 23 = 1998
    expect(display()).toHaveTextContent('10 Jun 1998');
  });
});
