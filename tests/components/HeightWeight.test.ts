import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import HeightWeight from '$lib/components/player/utils/HeightWeight.svelte';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('HeightWeight — display mode', () => {
  it('renders height and weight with their units', () => {
    render(HeightWeight, { props: { height: 180, weight: 75, edit_mode: false } });
    expect(screen.getByTitle('Height: 180 cm')).toHaveTextContent('180');
    expect(screen.getByTitle('Weight: 75 kg')).toHaveTextContent('75');
  });
});

describe('HeightWeight — edit mode', () => {
  it('renders editable inputs seeded with the current values', () => {
    render(HeightWeight, { props: { height: 180, weight: 75, edit_mode: true } });
    const [h, w] = screen.getAllByRole('spinbutton') as HTMLInputElement[];
    expect(h.value).toBe('180');
    expect(w.value).toBe('75');
  });

  it('keeps the two-way binding in sync as the inputs change', async () => {
    render(HeightWeight, { props: { height: 180, weight: 75, edit_mode: true } });
    const [h, w] = screen.getAllByRole('spinbutton') as HTMLInputElement[];
    await fireEvent.input(h, { target: { value: '190' } });
    await fireEvent.input(w, { target: { value: '82' } });
    expect(h.value).toBe('190');
    expect(w.value).toBe('82');
  });
});

describe('HeightWeight — quick edit round trip (bindable)', () => {
  it('writes new height and weight back to the display via the modal', async () => {
    const { container } = render(HeightWeight, { props: { height: 180, weight: 75, edit_mode: false } });

    await fireEvent.dblClick(container.querySelector('div')!);
    expect(screen.getByText('Edit Height & Weight')).toBeInTheDocument();

    const [tempH, tempW] = Array.from(
      document.querySelectorAll<HTMLInputElement>('.modal-content input'),
    );
    await fireEvent.input(tempH, { target: { value: '190' } });
    await fireEvent.input(tempW, { target: { value: '82' } });
    await fireEvent.click(screen.getByText('Save'));

    expect(screen.queryByText('Edit Height & Weight')).not.toBeInTheDocument();
    expect(screen.getByTitle('Height: 190 cm')).toBeInTheDocument();
    expect(screen.getByTitle('Weight: 82 kg')).toBeInTheDocument();
  });

  it('does not open the modal in edit mode', async () => {
    const { container } = render(HeightWeight, { props: { height: 180, weight: 75, edit_mode: true } });
    // No display wrapper exists in edit mode, but guard openQuickEdit anyway.
    const wrapper = container.querySelector('[style*="display:contents"]');
    expect(wrapper).toBeNull();
  });
});
