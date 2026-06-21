import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import Ethnicity from '$lib/components/player/utils/Ethnicity.svelte';
import { ETHNICITY_MAP } from '$lib/constants';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('Ethnicity — display mode (value -> label/swatch mapping)', () => {
  it('maps a known value to its title, emoji and background colour', () => {
    render(Ethnicity, { props: { ethnicity: 0, edit_mode: false } });
    const icon = screen.getByTitle('Northern European');
    expect(icon).toHaveTextContent('🧊');
    expect(icon).toHaveStyle({ backgroundColor: '#d6eaff' });
  });

  it('renders every enum branch with the correct title and emoji', () => {
    for (const [id, e] of ETHNICITY_MAP.entries()) {
      document.body.innerHTML = '';
      render(Ethnicity, { props: { ethnicity: id, edit_mode: false } });
      const icon = screen.getByTitle(e.title);
      expect(icon).toHaveTextContent(e.emoji);
    }
  });

  it('renders the explicit -1 "Unknown" map entry', () => {
    render(Ethnicity, { props: { ethnicity: -1, edit_mode: false } });
    const icon = screen.getByTitle('Unknown');
    expect(icon).toHaveTextContent('❓');
  });

  it('falls back to "Unknown" for a value absent from the map', () => {
    render(Ethnicity, { props: { ethnicity: 99, edit_mode: false } });
    const icon = screen.getByTitle('Unknown');
    expect(icon).toHaveTextContent('❓');
    expect(icon).toHaveStyle({ backgroundColor: '#ccc' });
  });
});

describe('Ethnicity — edit mode (select)', () => {
  it('renders a select titled "Ethnicity" instead of the icon swatch', () => {
    render(Ethnicity, { props: { ethnicity: 1, edit_mode: true } });
    const select = screen.getByTitle('Ethnicity') as HTMLSelectElement;
    expect(select.tagName).toBe('SELECT');
    expect(screen.queryByText('🌞')).not.toBeInTheDocument();
  });

  it('renders one option per map entry with matching labels', () => {
    render(Ethnicity, { props: { ethnicity: 0, edit_mode: true } });
    const select = screen.getByTitle('Ethnicity') as HTMLSelectElement;
    expect(select.options.length).toBe(ETHNICITY_MAP.size);
    for (const e of ETHNICITY_MAP.values()) {
      expect(
        Array.from(select.options).some((o) => o.textContent === e.title),
      ).toBe(true);
    }
  });

  it('preselects the option matching the current value', () => {
    render(Ethnicity, { props: { ethnicity: 4, edit_mode: true } });
    const select = screen.getByTitle('Ethnicity') as HTMLSelectElement;
    expect(select.value).toBe('4');
  });

  it('updates the bound value when a new option is selected', async () => {
    render(Ethnicity, { props: { ethnicity: 0, edit_mode: true } });
    const select = screen.getByTitle('Ethnicity') as HTMLSelectElement;
    await fireEvent.change(select, { target: { value: '3' } });
    expect(select.value).toBe('3');
  });
});

describe('Ethnicity — bindable / quick edit round trip', () => {
  it('opens the modal on double-click, edits and writes back to the display', async () => {
    const { container } = render(Ethnicity, {
      props: { ethnicity: 0, edit_mode: false },
    });

    await fireEvent.dblClick(container.querySelector('.ethnicity-icon')!);
    expect(screen.getByText('Edit Ethnicity')).toBeInTheDocument();

    const modalSelect = document.querySelector(
      '.modal-content select',
    ) as HTMLSelectElement;
    await fireEvent.change(modalSelect, { target: { value: '5' } });
    await fireEvent.click(screen.getByText('Save'));
    await tick();

    expect(screen.queryByText('Edit Ethnicity')).not.toBeInTheDocument();
    // value 5 -> South East Asian
    expect(screen.getByTitle('South East Asian')).toBeInTheDocument();
  });

  it('seeds the modal select with the current value when opened', async () => {
    const { container } = render(Ethnicity, {
      props: { ethnicity: 7, edit_mode: false },
    });
    await fireEvent.dblClick(container.querySelector('.ethnicity-icon')!);
    const modalSelect = document.querySelector(
      '.modal-content select',
    ) as HTMLSelectElement;
    expect(modalSelect.value).toBe('7');
  });

  it('does not open the modal in edit mode (no display icon to double-click)', () => {
    const { container } = render(Ethnicity, {
      props: { ethnicity: 0, edit_mode: true },
    });
    expect(container.querySelector('.ethnicity-icon')).toBeNull();
    expect(screen.queryByText('Edit Ethnicity')).not.toBeInTheDocument();
  });

  it('reflects an externally changed value prop in display mode', async () => {
    const { rerender } = render(Ethnicity, {
      props: { ethnicity: 0, edit_mode: false },
    });
    expect(screen.getByTitle('Northern European')).toBeInTheDocument();
    await rerender({ ethnicity: 4, edit_mode: false });
    await tick();
    expect(screen.getByTitle('Asian')).toBeInTheDocument();
  });
});
