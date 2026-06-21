import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import Skin from '$lib/components/player/utils/Skin.svelte';
import { getSkinColor } from '$lib/constants';

beforeEach(() => {
  document.body.innerHTML = '';
});

// Title is built as `Skin tone: ${skin_tone} / 20` => e.g. "Skin tone: 5 / 20"
const displayTitle = (tone: number) => `Skin tone: ${tone} / 20`;

describe('Skin — display mode', () => {
  it('renders the skin circle with the literal "S" label', () => {
    render(Skin, { props: { skin_tone: 5, edit_mode: false } });
    const circle = screen.getByTitle(displayTitle(5));
    expect(circle).toHaveTextContent('S');
  });

  it('uses the title format "Skin tone: <n> / 20"', () => {
    render(Skin, { props: { skin_tone: 12, edit_mode: false } });
    expect(screen.getByTitle('Skin tone: 12 / 20')).toBeInTheDocument();
  });

  it('maps skin_tone to the getSkinColor() background colour', () => {
    render(Skin, { props: { skin_tone: 10, edit_mode: false } });
    const circle = screen.getByTitle(displayTitle(10)) as HTMLDivElement;
    // getSkinColor(10) === hsl(30, 30%, 80%); jsdom normalises inline style to rgb().
    expect(getSkinColor(10)).toBe('hsl(30, 30%, 80%)');
    expect(circle.style.backgroundColor).toBe('rgb(219, 204, 189)');
  });

  it('reflects a different tone in both title and colour', () => {
    render(Skin, { props: { skin_tone: 1, edit_mode: false } });
    const circle = screen.getByTitle(displayTitle(1)) as HTMLDivElement;
    // getSkinColor(1) === hsl(30, 30%, 98%)
    expect(circle.style.backgroundColor).toBe('rgb(251, 250, 248)');
  });

  it('does NOT render the edit input in display mode', () => {
    render(Skin, { props: { skin_tone: 5, edit_mode: false } });
    expect(screen.queryByRole('spinbutton')).not.toBeInTheDocument();
  });
});

describe('Skin — edit mode', () => {
  const input = () => screen.getByRole('spinbutton') as HTMLInputElement;

  it('renders the number input seeded with the current tone and the palette icon', () => {
    render(Skin, { props: { skin_tone: 7, edit_mode: true } });
    expect(input().value).toBe('7');
    expect(screen.getByTitle('Skin tone')).toHaveTextContent('🎨');
  });

  it('exposes min=1 and max=20 on the input', () => {
    render(Skin, { props: { skin_tone: 7, edit_mode: true } });
    expect(input().min).toBe('1');
    expect(input().max).toBe('20');
  });

  it('does NOT render the display circle in edit mode', () => {
    render(Skin, { props: { skin_tone: 7, edit_mode: true } });
    expect(screen.queryByTitle(displayTitle(7))).not.toBeInTheDocument();
  });

  it('keeps a valid in-range value', async () => {
    render(Skin, { props: { skin_tone: 7, edit_mode: true } });
    await fireEvent.input(input(), { target: { value: '15' } });
    expect(input().value).toBe('15');
  });

  it('clamps a value above 20 down to 20', async () => {
    render(Skin, { props: { skin_tone: 7, edit_mode: true } });
    await fireEvent.input(input(), { target: { value: '99' } });
    expect(input().value).toBe('20');
  });

  it('clamps a value below 1 up to 1', async () => {
    render(Skin, { props: { skin_tone: 7, edit_mode: true } });
    await fireEvent.input(input(), { target: { value: '0' } });
    expect(input().value).toBe('1');
  });

  it('clamps a negative value up to 1', async () => {
    render(Skin, { props: { skin_tone: 7, edit_mode: true } });
    await fireEvent.input(input(), { target: { value: '-5' } });
    expect(input().value).toBe('1');
  });

  it('self-heals non-numeric (NaN) input back to the current tone', async () => {
    render(Skin, { props: { skin_tone: 7, edit_mode: true } });
    // A non-numeric entry parses to NaN; handleInput restores the field to the
    // current tone instead of leaving it blank.
    await fireEvent.input(input(), { target: { value: 'abc' } });
    await tick();
    expect(input().value).toBe('7');
  });

  it('accepts the boundary values 1 and 20 unchanged', async () => {
    render(Skin, { props: { skin_tone: 7, edit_mode: true } });
    await fireEvent.input(input(), { target: { value: '1' } });
    expect(input().value).toBe('1');
    await fireEvent.input(input(), { target: { value: '20' } });
    expect(input().value).toBe('20');
  });
});

describe('Skin — edit mode re-renders on prop change', () => {
  it('updates the input when skin_tone prop changes', async () => {
    const { rerender } = render(Skin, { props: { skin_tone: 3, edit_mode: true } });
    const input = () => screen.getByRole('spinbutton') as HTMLInputElement;
    expect(input().value).toBe('3');
    await rerender({ skin_tone: 9, edit_mode: true });
    await tick();
    expect(input().value).toBe('9');
  });
});

describe('Skin — quick edit round trip (bindable)', () => {
  const circle = (tone: number) => screen.getByTitle(displayTitle(tone)) as HTMLDivElement;
  const modalInput = () =>
    document.querySelector('.modal-content input') as HTMLInputElement;

  it('opens the modal on double-click and seeds it with the current tone', async () => {
    render(Skin, { props: { skin_tone: 8, edit_mode: false } });
    await fireEvent.dblClick(circle(8));
    expect(screen.getByText('Edit Skin Tone')).toBeInTheDocument();
    expect(modalInput().value).toBe('8');
  });

  it('writes a new tone back to the display and updates the colour', async () => {
    render(Skin, { props: { skin_tone: 8, edit_mode: false } });
    await fireEvent.dblClick(circle(8));

    await fireEvent.input(modalInput(), { target: { value: '15' } });
    await fireEvent.click(screen.getByText('Save'));
    await tick();

    expect(screen.queryByText('Edit Skin Tone')).not.toBeInTheDocument();
    const updated = circle(15);
    // getSkinColor(15) === hsl(30, 30%, 70%) -> jsdom rgb(201, 179, 156)
    expect(updated.style.backgroundColor).toBe('rgb(201, 179, 156)');
  });

  it('clamps the modal value above 20 down to 20 on save', async () => {
    render(Skin, { props: { skin_tone: 8, edit_mode: false } });
    await fireEvent.dblClick(circle(8));
    await fireEvent.input(modalInput(), { target: { value: '50' } });
    await fireEvent.click(screen.getByText('Save'));
    await tick();
    expect(screen.getByTitle(displayTitle(20))).toBeInTheDocument();
  });

  it('clamps the modal value below 1 up to 1 on save', async () => {
    render(Skin, { props: { skin_tone: 8, edit_mode: false } });
    await fireEvent.dblClick(circle(8));
    await fireEvent.input(modalInput(), { target: { value: '0' } });
    await fireEvent.click(screen.getByText('Save'));
    await tick();
    expect(screen.getByTitle(displayTitle(1))).toBeInTheDocument();
  });

  it('Cancel discards the edit and leaves the tone unchanged', async () => {
    render(Skin, { props: { skin_tone: 8, edit_mode: false } });
    await fireEvent.dblClick(circle(8));
    await fireEvent.input(modalInput(), { target: { value: '15' } });
    await fireEvent.click(screen.getByText('Cancel'));
    await tick();
    expect(screen.queryByText('Edit Skin Tone')).not.toBeInTheDocument();
    expect(screen.getByTitle(displayTitle(8))).toBeInTheDocument();
  });

  it('does NOT open the modal when in edit mode (openQuickEdit guard)', async () => {
    // In edit mode there is no display circle, and openQuickEdit early-returns.
    render(Skin, { props: { skin_tone: 8, edit_mode: true } });
    expect(screen.queryByText('Edit Skin Tone')).not.toBeInTheDocument();
    expect(screen.queryByTitle(displayTitle(8))).not.toBeInTheDocument();
  });
});
