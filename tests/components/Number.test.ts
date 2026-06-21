import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import NumberField from '$lib/components/player/utils/Number.svelte';

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('Number — edit mode validation', () => {
  // The edit-mode <input value={favourite_number ?? ''}> reflects the bound value,
  // so after oninput normalisation we can read the normalised result straight off the DOM.
  const input = () => screen.getByPlaceholderText('--') as HTMLInputElement;

  it('shows the current favourite number', () => {
    render(NumberField, { props: { favourite_number: 10, edit_mode: true } });
    expect(input().value).toBe('10');
  });

  it('keeps a valid positive number', async () => {
    render(NumberField, { props: { favourite_number: null, edit_mode: true } });
    await fireEvent.input(input(), { target: { value: '23' } });
    expect(input().value).toBe('23');
  });

  it('normalises 0 to empty (null)', async () => {
    render(NumberField, { props: { favourite_number: 5, edit_mode: true } });
    await fireEvent.input(input(), { target: { value: '0' } });
    expect(input().value).toBe('');
  });

  it('normalises a negative number to empty (null)', async () => {
    render(NumberField, { props: { favourite_number: 5, edit_mode: true } });
    await fireEvent.input(input(), { target: { value: '-7' } });
    expect(input().value).toBe('');
  });

  it('normalises a cleared field to empty (null)', async () => {
    render(NumberField, { props: { favourite_number: 9, edit_mode: true } });
    await fireEvent.input(input(), { target: { value: '' } });
    expect(input().value).toBe('');
  });
});

describe('Number — display mode', () => {
  it('renders the starred number when set', () => {
    render(NumberField, { props: { favourite_number: 10, edit_mode: false } });
    expect(screen.getByTitle('favourite number')).toHaveTextContent('10');
  });

  it('renders the empty placeholder when null', () => {
    render(NumberField, { props: { favourite_number: null, edit_mode: false } });
    expect(screen.getByTitle('no favourite number')).toBeInTheDocument();
  });

  it('treats 0 as "no favourite number"', () => {
    render(NumberField, { props: { favourite_number: 0, edit_mode: false } });
    expect(screen.getByTitle('no favourite number')).toBeInTheDocument();
  });
});

describe('Number — quick edit round trip (bindable)', () => {
  it('writes a new number back through the QuickEdit modal', async () => {
    const { container } = render(NumberField, { props: { favourite_number: null, edit_mode: false } });

    // Double-click the display to open the modal.
    await fireEvent.dblClick(container.querySelector('[ondblclick], div')!);
    // The modal title confirms it opened.
    expect(screen.getByText('Edit Favourite Number')).toBeInTheDocument();

    // Type into the modal's input and save.
    const modalInput = screen.getByPlaceholderText('--') as HTMLInputElement;
    await fireEvent.input(modalInput, { target: { value: '7' } });
    await fireEvent.click(screen.getByText('Save'));

    // Modal closes and the bound value flows back to the display.
    expect(screen.queryByText('Edit Favourite Number')).not.toBeInTheDocument();
    expect(screen.getByTitle('favourite number')).toHaveTextContent('7');
  });

  it('invalid input in the modal clears the favourite number', async () => {
    const { container } = render(NumberField, { props: { favourite_number: 10, edit_mode: false } });

    await fireEvent.dblClick(container.querySelector('div')!);
    const modalInput = screen.getByPlaceholderText('--') as HTMLInputElement;
    await fireEvent.input(modalInput, { target: { value: '0' } });
    await fireEvent.click(screen.getByText('Save'));

    expect(screen.getByTitle('no favourite number')).toBeInTheDocument();
  });
});
