import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import ClubEdit from '$lib/components/player/utils/ClubEdit.svelte';

// Real club ids from src/data/clubs.json:
//   57 -> "KF Albpetrol"
//   61 -> "Tirana"
const CLUB_ALBPETROL = 57;
const CLUB_ALBPETROL_NAME = 'KF Albpetrol';
const CLUB_TIRANA = 61;
const CLUB_TIRANA_NAME = 'Tirana';
// An id that does not exist in the dataset.
const MISSING_ID = 999999;

beforeEach(() => {
  document.body.innerHTML = '';
});

// The two ClubSelect search boxes are <input type="text"> distinguished by placeholder.
const clubSearch = () => screen.getByPlaceholderText('Select Club...') as HTMLInputElement;
const favSearch = () => screen.getByPlaceholderText('Select Favourite Team...') as HTMLInputElement;

// The two numeric "type or paste ID" inputs share title="lub wpisz ID";
// index 0 is the current club, index 1 is the favourite team.
const idInputs = () => screen.getAllByTitle('lub wpisz ID') as HTMLInputElement[];
const clubIdInput = () => idInputs()[0];
const favIdInput = () => idInputs()[1];

describe('ClubEdit — structure', () => {
  it('renders a current-club row and a favourite-team row', () => {
    render(ClubEdit, { props: { club_id: -1, favourite_team_id: null } });
    expect(screen.getByTitle('current club')).toBeInTheDocument();
    expect(screen.getByTitle('favourite team')).toBeInTheDocument();
  });

  it('renders two ClubSelect search boxes and two numeric id inputs', () => {
    render(ClubEdit, { props: { club_id: -1, favourite_team_id: null } });
    expect(clubSearch()).toBeInTheDocument();
    expect(favSearch()).toBeInTheDocument();
    expect(idInputs()).toHaveLength(2);
  });
});

describe('ClubEdit — club name lookup from clubMap (display via ClubSelect)', () => {
  it('seeds the club search box with the club name for a known id', async () => {
    render(ClubEdit, { props: { club_id: CLUB_ALBPETROL, favourite_team_id: null } });
    await tick();
    expect(clubSearch().value).toBe(CLUB_ALBPETROL_NAME);
  });

  it('seeds the favourite-team search box with the club name for a known id', async () => {
    render(ClubEdit, { props: { club_id: -1, favourite_team_id: CLUB_TIRANA } });
    await tick();
    expect(favSearch().value).toBe(CLUB_TIRANA_NAME);
  });

  it('leaves the search box empty when the club id is the empty value (-1)', async () => {
    render(ClubEdit, { props: { club_id: -1, favourite_team_id: null } });
    await tick();
    expect(clubSearch().value).toBe('');
  });

  it('leaves the search box empty when the club id is missing from clubMap', async () => {
    render(ClubEdit, { props: { club_id: MISSING_ID, favourite_team_id: null } });
    await tick();
    // No clubMap entry -> the $effect never assigns a name, search stays blank.
    expect(clubSearch().value).toBe('');
  });
});

describe('ClubEdit — numeric id input (current club)', () => {
  it('shows the numeric id for a set club', () => {
    render(ClubEdit, { props: { club_id: CLUB_ALBPETROL, favourite_team_id: null } });
    expect(clubIdInput().value).toBe(String(CLUB_ALBPETROL));
  });

  it('renders an empty id box when club_id is the empty value (-1)', () => {
    render(ClubEdit, { props: { club_id: -1, favourite_team_id: null } });
    expect(clubIdInput().value).toBe('');
  });

  it('parses a typed id and reflects it back (bindable)', async () => {
    render(ClubEdit, { props: { club_id: -1, favourite_team_id: null } });
    await fireEvent.input(clubIdInput(), { target: { value: String(CLUB_TIRANA) } });
    await tick();
    expect(clubIdInput().value).toBe(String(CLUB_TIRANA));
  });

  it('falls back to -1 (empty box) when the typed id is not a number', async () => {
    render(ClubEdit, { props: { club_id: CLUB_ALBPETROL, favourite_team_id: null } });
    await fireEvent.input(clubIdInput(), { target: { value: '' } });
    await tick();
    expect(clubIdInput().value).toBe('');
  });

  it('drives the club search box name when a known id is typed', async () => {
    render(ClubEdit, { props: { club_id: -1, favourite_team_id: null } });
    await fireEvent.input(clubIdInput(), { target: { value: String(CLUB_ALBPETROL) } });
    await tick();
    // club_id is bound; the ClubSelect $effect picks up the new id and shows its name.
    expect(clubSearch().value).toBe(CLUB_ALBPETROL_NAME);
  });
});

describe('ClubEdit — numeric id input (favourite team)', () => {
  it('shows the numeric id for a set favourite team', () => {
    render(ClubEdit, { props: { club_id: -1, favourite_team_id: CLUB_TIRANA } });
    expect(favIdInput().value).toBe(String(CLUB_TIRANA));
  });

  it('renders an empty id box when favourite_team_id is null', () => {
    render(ClubEdit, { props: { club_id: -1, favourite_team_id: null } });
    expect(favIdInput().value).toBe('');
  });

  it('parses a typed id and reflects it back (bindable)', async () => {
    render(ClubEdit, { props: { club_id: -1, favourite_team_id: null } });
    await fireEvent.input(favIdInput(), { target: { value: String(CLUB_ALBPETROL) } });
    await tick();
    expect(favIdInput().value).toBe(String(CLUB_ALBPETROL));
  });

  it('falls back to null (empty box) when the typed id is cleared', async () => {
    render(ClubEdit, { props: { club_id: -1, favourite_team_id: CLUB_TIRANA } });
    await fireEvent.input(favIdInput(), { target: { value: '' } });
    await tick();
    expect(favIdInput().value).toBe('');
  });

  it('drives the favourite search box name when a known id is typed', async () => {
    render(ClubEdit, { props: { club_id: -1, favourite_team_id: null } });
    await fireEvent.input(favIdInput(), { target: { value: String(CLUB_TIRANA) } });
    await tick();
    expect(favSearch().value).toBe(CLUB_TIRANA_NAME);
  });
});

describe('ClubEdit — ClubSelect dropdown selection', () => {
  it('selecting a club from the dropdown updates the bound id and the numeric box', async () => {
    render(ClubEdit, { props: { club_id: -1, favourite_team_id: null } });

    // Focus opens the dropdown; type to narrow to a known club.
    await fireEvent.focus(clubSearch());
    await fireEvent.input(clubSearch(), { target: { value: CLUB_TIRANA_NAME } });
    await tick();

    // Click the matching dropdown option (label shows "#<id>").
    const option = screen.getByText(`#${CLUB_TIRANA}`);
    await fireEvent.click(option.closest('button')!);
    await tick();

    // The selection flows back through bind:value into the numeric id box.
    expect(clubIdInput().value).toBe(String(CLUB_TIRANA));
    expect(clubSearch().value).toBe(CLUB_TIRANA_NAME);
  });

  it('clearing the search box resets the club id to its empty value (-1)', async () => {
    render(ClubEdit, { props: { club_id: CLUB_ALBPETROL, favourite_team_id: null } });
    await tick();
    expect(clubIdInput().value).toBe(String(CLUB_ALBPETROL));

    await fireEvent.focus(clubSearch());
    await fireEvent.input(clubSearch(), { target: { value: '' } });
    await tick();

    // handleInput sets value = emptyValue (-1) on empty search -> numeric box blanks.
    expect(clubIdInput().value).toBe('');
  });
});

describe('ClubEdit — prop re-sync', () => {
  it('updates both displays when the bound ids change via rerender', async () => {
    const { rerender } = render(ClubEdit, { props: { club_id: -1, favourite_team_id: null } });
    await tick();
    expect(clubIdInput().value).toBe('');

    await rerender({ club_id: CLUB_ALBPETROL, favourite_team_id: CLUB_TIRANA });
    await tick();

    expect(clubIdInput().value).toBe(String(CLUB_ALBPETROL));
    expect(clubSearch().value).toBe(CLUB_ALBPETROL_NAME);
    expect(favIdInput().value).toBe(String(CLUB_TIRANA));
    expect(favSearch().value).toBe(CLUB_TIRANA_NAME);
  });
});
