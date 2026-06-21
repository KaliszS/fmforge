import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import Position from '$lib/components/player/utils/Position.svelte';
import { POSITION_MAP } from '$lib/constants';

// POSITION_MAP keys map to { short, label, group }, e.g.
//   GOALKEEPER -> { short: "GK", label: "goalkeeper", group: "goalkeeper" }

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('Position — display mode mapping (code -> short/label/group)', () => {
  for (const [key, value] of Object.entries(POSITION_MAP)) {
    it(`renders ${key} as "${value.short}" (${value.label})`, () => {
      render(Position, { props: { position: key, edit_mode: false } });
      const badge = screen.getByTitle(value.label);
      expect(badge).toHaveTextContent(value.short);
      expect(badge.className).toContain(`badge-${value.group}`);
    });
  }

  it('renders a neutral fallback badge for an unknown position', () => {
    render(Position, { props: { position: 'NOT_A_POSITION', edit_mode: false } });
    // Unmapped codes fall back to { group: 'unknown', label: 'Unknown', short: '?' }.
    const badge = document.querySelector('span.badge') as HTMLSpanElement;
    expect(badge).not.toBeNull();
    expect(badge.textContent?.trim()).toBe('?');
    expect(badge.getAttribute('title')).toBe('Unknown');
    expect(badge.className).toContain('badge-unknown');
  });
});

describe('Position — edit mode (select)', () => {
  const keys = Object.keys(POSITION_MAP);

  it('renders a select seeded with the current position', () => {
    render(Position, { props: { position: 'MIDFIELDER_CENTRAL', edit_mode: true } });
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('MIDFIELDER_CENTRAL');
  });

  it('renders one option per POSITION_MAP entry, labelled by label', () => {
    render(Position, { props: { position: 'GOALKEEPER', edit_mode: true } });
    const options = screen.getAllByRole('option') as HTMLOptionElement[];
    expect(options).toHaveLength(keys.length);
    expect(options.map((o) => o.value)).toEqual(keys);
    expect(options[0]).toHaveTextContent(POSITION_MAP[keys[0]].label);
  });

  it('keeps the bound value in sync when a new option is selected', async () => {
    render(Position, { props: { position: 'GOALKEEPER', edit_mode: true } });
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    await fireEvent.change(select, { target: { value: 'ATTACKER_CENTRAL' } });
    expect(select.value).toBe('ATTACKER_CENTRAL');
  });

  it('re-syncs the select when the position prop changes', async () => {
    const { rerender } = render(Position, { props: { position: 'GOALKEEPER', edit_mode: true } });
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('GOALKEEPER');
    await rerender({ position: 'DEFENDER_CENTRAL' });
    await tick();
    expect(select.value).toBe('DEFENDER_CENTRAL');
  });
});

describe('Position — quick edit round trip (bindable)', () => {
  it('writes a new position back to the display via the modal', async () => {
    const { container } = render(Position, { props: { position: 'GOALKEEPER', edit_mode: false } });

    await fireEvent.dblClick(container.querySelector('span.badge')!);
    expect(screen.getByText('Edit Position')).toBeInTheDocument();

    // Modal select seeded with the current position.
    const modalSelect = screen.getByRole('combobox') as HTMLSelectElement;
    expect(modalSelect.value).toBe('GOALKEEPER');

    await fireEvent.change(modalSelect, { target: { value: 'ATTACKER_CENTRAL' } });
    await fireEvent.click(screen.getByText('Save'));

    expect(screen.queryByText('Edit Position')).not.toBeInTheDocument();
    expect(screen.getByTitle('central attacker')).toHaveTextContent('AC');
  });

  it('does not open the modal while in edit mode', async () => {
    render(Position, { props: { position: 'GOALKEEPER', edit_mode: true } });
    expect(document.querySelector('span.badge')).toBeNull();
    expect(screen.queryByText('Edit Position')).not.toBeInTheDocument();
  });
});
