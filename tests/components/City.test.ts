import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import City from '$lib/components/player/utils/City.svelte';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('City — display mode', () => {
  it('renders the birth city name inside the box', () => {
    render(City, { props: { city: 'London', edit_mode: false } });
    const box = screen.getByTitle('Birth city');
    expect(box).toHaveTextContent('London');
    // House emoji is always rendered alongside the value.
    expect(box.textContent).toContain('🏠');
  });

  it('falls back to "empty" when city is an empty string', () => {
    render(City, { props: { city: '', edit_mode: false } });
    const box = screen.getByTitle('Birth city');
    expect(box).toHaveTextContent('empty');
  });

  it('falls back to "empty" when city is undefined', () => {
    render(City, { props: { edit_mode: false } });
    const box = screen.getByTitle('Birth city');
    expect(box).toHaveTextContent('empty');
  });

  it('marks the box as empty (empty-city class) when there is no city', () => {
    render(City, { props: { city: '', edit_mode: false } });
    expect(screen.getByTitle('Birth city')).toHaveClass('empty-city');
  });

  it('does not mark the box as empty when a city is present', () => {
    render(City, { props: { city: 'Paris', edit_mode: false } });
    expect(screen.getByTitle('Birth city')).not.toHaveClass('empty-city');
  });

  it('does not render the edit input in display mode', () => {
    render(City, { props: { city: 'Madrid', edit_mode: false } });
    expect(screen.queryByPlaceholderText('Enter city name')).toBeNull();
  });
});

describe('City — edit mode', () => {
  const input = () => screen.getByPlaceholderText('Enter city name') as HTMLInputElement;

  it('renders an editable input seeded with the current city', () => {
    render(City, { props: { city: 'Berlin', edit_mode: true } });
    expect(input().value).toBe('Berlin');
  });

  it('renders an empty input when city is undefined', () => {
    render(City, { props: { edit_mode: true } });
    expect(input().value).toBe('');
  });

  it('keeps the two-way binding in sync as the input changes', async () => {
    render(City, { props: { city: 'Berlin', edit_mode: true } });
    await fireEvent.input(input(), { target: { value: 'Munich' } });
    expect(input().value).toBe('Munich');
  });

  it('does not render the display box in edit mode', () => {
    render(City, { props: { city: 'Berlin', edit_mode: true } });
    expect(screen.queryByTitle('Birth city')).toBeNull();
  });

  it('keeps raw whitespace while typing, then trims on blur', async () => {
    render(City, { props: { city: '', edit_mode: true } });
    await fireEvent.input(input(), { target: { value: '  Rome  ' } });
    expect(input().value).toBe('  Rome  ');
    await fireEvent.blur(input());
    expect(input().value).toBe('Rome');
  });
});

describe('City — quick edit round trip (bindable)', () => {
  it('writes a new city back to the display via the modal', async () => {
    render(City, { props: { city: 'London', edit_mode: false } });

    await fireEvent.dblClick(screen.getByTitle('Birth city'));
    expect(screen.getByText('Edit City')).toBeInTheDocument();

    // The modal seeds its input with the current city value.
    const modalInput = document.querySelector<HTMLInputElement>('.modal-content input')!;
    expect(modalInput.value).toBe('London');

    await fireEvent.input(modalInput, { target: { value: 'Lisbon' } });
    await fireEvent.click(screen.getByText('Save'));

    // Modal closes and the new value flows back to the display.
    expect(screen.queryByText('Edit City')).not.toBeInTheDocument();
    expect(screen.getByTitle('Birth city')).toHaveTextContent('Lisbon');
  });

  it('seeds the modal input with an empty string when city is undefined', async () => {
    render(City, { props: { edit_mode: false } });

    await fireEvent.dblClick(screen.getByTitle('Birth city'));
    const modalInput = document.querySelector<HTMLInputElement>('.modal-content input')!;
    expect(modalInput.value).toBe('');
  });

  it('saving an empty value falls back to the "empty" display', async () => {
    render(City, { props: { city: 'London', edit_mode: false } });

    await fireEvent.dblClick(screen.getByTitle('Birth city'));
    const modalInput = document.querySelector<HTMLInputElement>('.modal-content input')!;
    await fireEvent.input(modalInput, { target: { value: '' } });
    await fireEvent.click(screen.getByText('Save'));

    const box = screen.getByTitle('Birth city');
    expect(box).toHaveTextContent('empty');
    expect(box).toHaveClass('empty-city');
  });

  it('trims surrounding whitespace when saving through the modal', async () => {
    // saveQuickEdit trims temp_city before assigning (City.svelte).
    render(City, { props: { city: '', edit_mode: false } });

    await fireEvent.dblClick(screen.getByTitle('Birth city'));
    const modalInput = document.querySelector<HTMLInputElement>('.modal-content input')!;
    await fireEvent.input(modalInput, { target: { value: '  Oslo  ' } });
    await fireEvent.click(screen.getByText('Save'));

    const strong = screen.getByTitle('Birth city').querySelector('strong')!;
    expect(strong.textContent).toBe('Oslo');
  });

  it('does not open the modal when in edit mode (openQuickEdit guard)', () => {
    render(City, { props: { city: 'London', edit_mode: true } });
    // No display span exists in edit mode, and no modal title is rendered.
    expect(screen.queryByText('Edit City')).toBeNull();
  });
});
