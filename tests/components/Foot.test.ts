import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import Foot from '$lib/components/player/utils/Foot.svelte';

// FOOT_OPTIONS (from $lib/constants):
//   0 -> "Right Only"        🦶➡️
//   1 -> "Left Only"         ⬅️🦶
//   2 -> "Right Preferred"   🦶→
//   3 -> "Left Preferred"    ←🦶
//   4 -> "Both"              🦶🦶

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('Foot — display mode mapping (value -> label/icon)', () => {
  const cases: [number, string, string][] = [
    [0, 'Right Only', '🦶➡️'],
    [1, 'Left Only', '⬅️🦶'],
    [2, 'Right Preferred', '🦶→'],
    [3, 'Left Preferred', '←🦶'],
    [4, 'Both', '🦶🦶'],
  ];

  for (const [value, label, icon] of cases) {
    it(`renders value ${value} as "${label}" with its icon`, () => {
      render(Foot, { props: { preferred_foot: value, edit_mode: false } });
      const tag = screen.getByTitle(label);
      expect(tag).toBeInTheDocument();
      expect(tag).toHaveTextContent(icon);
    });
  }

  it('applies the matching style class to the display tag', () => {
    render(Foot, { props: { preferred_foot: 4, edit_mode: false } });
    const tag = screen.getByTitle('Both');
    // style "both" -> classes "tag foot both"
    expect(tag.className).toContain('tag');
    expect(tag.className).toContain('foot');
    expect(tag.className).toContain('both');
  });

  it('renders no foot tag for an unknown value (fallback)', () => {
    render(Foot, { props: { preferred_foot: 99, edit_mode: false } });
    // No FOOT_OPTIONS entry matches, so no <span class="tag foot"> is rendered.
    expect(document.querySelector('span.tag.foot')).toBeNull();
  });
});

describe('Foot — edit mode (select)', () => {
  it('renders a select seeded with the current value', () => {
    render(Foot, { props: { preferred_foot: 2, edit_mode: true } });
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('2');
  });

  it('renders one option per FOOT_OPTIONS entry', () => {
    render(Foot, { props: { preferred_foot: 0, edit_mode: true } });
    const options = screen.getAllByRole('option') as HTMLOptionElement[];
    expect(options).toHaveLength(5);
    expect(options.map((o) => o.value)).toEqual(['0', '1', '2', '3', '4']);
  });

  it('keeps the bound value in sync when a new option is selected', async () => {
    render(Foot, { props: { preferred_foot: 0, edit_mode: true } });
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    await fireEvent.change(select, { target: { value: '3' } });
    expect(select.value).toBe('3');
  });

  it('re-syncs the select when the preferred_foot prop changes', async () => {
    const { rerender } = render(Foot, { props: { preferred_foot: 0, edit_mode: true } });
    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('0');
    await rerender({ preferred_foot: 4 });
    await tick();
    expect(select.value).toBe('4');
  });
});

describe('Foot — quick edit round trip (bindable)', () => {
  it('writes a new foot back to the display via the modal', async () => {
    const { container } = render(Foot, { props: { preferred_foot: 0, edit_mode: false } });

    // Double-click the display wrapper to open the modal.
    await fireEvent.dblClick(container.querySelector('[style*="display:contents"]')!);
    expect(screen.getByText('Edit Preferred Foot')).toBeInTheDocument();

    // The modal select is seeded with the current value (0).
    const modalSelect = screen.getByRole('combobox') as HTMLSelectElement;
    expect(modalSelect.value).toBe('0');

    await fireEvent.change(modalSelect, { target: { value: '4' } });
    await fireEvent.click(screen.getByText('Save'));

    // Modal closes and the bound value flows back to the display.
    expect(screen.queryByText('Edit Preferred Foot')).not.toBeInTheDocument();
    expect(screen.getByTitle('Both')).toBeInTheDocument();
  });

  it('does not open the modal while in edit mode', async () => {
    render(Foot, { props: { preferred_foot: 1, edit_mode: true } });
    // In edit mode there is no display wrapper at all.
    expect(document.querySelector('[style*="display:contents"]')).toBeNull();
    expect(screen.queryByText('Edit Preferred Foot')).not.toBeInTheDocument();
  });
});
