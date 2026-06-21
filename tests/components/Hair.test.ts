import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import Hair from '$lib/components/player/utils/Hair.svelte';
import { HAIR_COLORS } from '$lib/constants';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('Hair — display mode (value -> label/swatch mapping)', () => {
  it('maps a known id to its label title and background colour', () => {
    render(Hair, { props: { hair_color: 1, edit_mode: false } });
    const circle = screen.getByTitle('Hair colour: Blond');
    expect(circle).toHaveTextContent('H');
    expect(circle).toHaveStyle({ backgroundColor: '#f4e08b' });
  });

  it('renders every enum branch with the correct title', () => {
    for (const hc of HAIR_COLORS) {
      document.body.innerHTML = '';
      render(Hair, { props: { hair_color: hc.id, edit_mode: false } });
      expect(screen.getByTitle(`Hair colour: ${hc.label}`)).toBeInTheDocument();
    }
  });

  it('renders the id 0 "Unknown/Random" entry from the list (not the fallback)', () => {
    render(Hair, { props: { hair_color: 0, edit_mode: false } });
    const circle = screen.getByTitle('Hair colour: Unknown/Random');
    expect(circle).toHaveStyle({ backgroundColor: '#999' });
  });

  it('falls back to "Unknown" for an id absent from the list', () => {
    render(Hair, { props: { hair_color: 99, edit_mode: false } });
    const circle = screen.getByTitle('Hair colour: Unknown');
    expect(circle).toHaveStyle({ backgroundColor: '#999' });
  });
});

describe('Hair — edit mode (select)', () => {
  it('renders a select titled "Hair colour" instead of the circle swatch', () => {
    render(Hair, { props: { hair_color: 1, edit_mode: true } });
    const select = screen.getByTitle('Hair colour') as HTMLSelectElement;
    expect(select.tagName).toBe('SELECT');
    expect(document.querySelector('.hair-circle')).toBeNull();
  });

  it('renders one option per hair colour with matching labels', () => {
    render(Hair, { props: { hair_color: 0, edit_mode: true } });
    const select = screen.getByTitle('Hair colour') as HTMLSelectElement;
    expect(select.options.length).toBe(HAIR_COLORS.length);
    for (const hc of HAIR_COLORS) {
      expect(
        Array.from(select.options).some((o) => o.textContent === hc.label),
      ).toBe(true);
    }
  });

  it('preselects the option matching the current value', () => {
    render(Hair, { props: { hair_color: 5, edit_mode: true } });
    const select = screen.getByTitle('Hair colour') as HTMLSelectElement;
    expect(select.value).toBe('5');
  });

  it('updates the bound value when a new option is selected', async () => {
    render(Hair, { props: { hair_color: 1, edit_mode: true } });
    const select = screen.getByTitle('Hair colour') as HTMLSelectElement;
    await fireEvent.change(select, { target: { value: '4' } });
    expect(select.value).toBe('4');
  });
});

describe('Hair — bindable / quick edit round trip', () => {
  it('opens the modal on double-click, edits and writes back to the display', async () => {
    const { container } = render(Hair, {
      props: { hair_color: 1, edit_mode: false },
    });

    await fireEvent.dblClick(container.querySelector('.hair-circle')!);
    expect(screen.getByText('Edit Hair Color')).toBeInTheDocument();

    const modalSelect = document.querySelector(
      '.modal-content select',
    ) as HTMLSelectElement;
    await fireEvent.change(modalSelect, { target: { value: '4' } });
    await fireEvent.click(screen.getByText('Save'));
    await tick();

    expect(screen.queryByText('Edit Hair Color')).not.toBeInTheDocument();
    // id 4 -> Red
    expect(screen.getByTitle('Hair colour: Red')).toBeInTheDocument();
  });

  it('seeds the modal select with the current value when opened', async () => {
    const { container } = render(Hair, {
      props: { hair_color: 3, edit_mode: false },
    });
    await fireEvent.dblClick(container.querySelector('.hair-circle')!);
    const modalSelect = document.querySelector(
      '.modal-content select',
    ) as HTMLSelectElement;
    expect(modalSelect.value).toBe('3');
  });

  it('does not open the modal in edit mode (no display circle to double-click)', () => {
    const { container } = render(Hair, {
      props: { hair_color: 1, edit_mode: true },
    });
    expect(container.querySelector('.hair-circle')).toBeNull();
    expect(screen.queryByText('Edit Hair Color')).not.toBeInTheDocument();
  });

  it('reflects an externally changed value prop in display mode', async () => {
    const { rerender } = render(Hair, {
      props: { hair_color: 1, edit_mode: false },
    });
    expect(screen.getByTitle('Hair colour: Blond')).toBeInTheDocument();
    await rerender({ hair_color: 5, edit_mode: false });
    await tick();
    expect(screen.getByTitle('Hair colour: Black')).toBeInTheDocument();
  });
});
