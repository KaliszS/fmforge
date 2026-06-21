import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import AttributeFilters from '$lib/components/filters/AttributeFilters.svelte';

beforeEach(() => {
  document.body.innerHTML = '';
});

interface Props {
  minCA?: number | null;
  maxCA?: number | null;
  minPA?: number | null;
  maxPA?: number | null;
}

function setup(props: Props = {}) {
  return render(AttributeFilters, {
    props: { minCA: null, maxCA: null, minPA: null, maxPA: null, ...props },
  });
}

const minCA = () => screen.getByLabelText('Minimum CA') as HTMLInputElement;
const maxCA = () => screen.getByLabelText('Maximum CA') as HTMLInputElement;
const minPA = () => screen.getByLabelText('Minimum PA') as HTMLInputElement;
const maxPA = () => screen.getByLabelText('Maximum PA') as HTMLInputElement;

describe('AttributeFilters — rendering', () => {
  it('renders all four numeric range inputs', () => {
    setup();
    expect(minCA()).toBeInTheDocument();
    expect(maxCA()).toBeInTheDocument();
    expect(minPA()).toBeInTheDocument();
    expect(maxPA()).toBeInTheDocument();
  });

  it('renders all inputs as type=number', () => {
    setup();
    for (const el of [minCA(), maxCA(), minPA(), maxPA()]) {
      expect(el.type).toBe('number');
    }
  });

  it('uses the documented placeholders', () => {
    setup();
    expect(screen.getByPlaceholderText('Min CA')).toBe(minCA());
    expect(screen.getByPlaceholderText('Max CA')).toBe(maxCA());
    expect(screen.getByPlaceholderText('Min PA')).toBe(minPA());
    expect(screen.getByPlaceholderText('Max PA')).toBe(maxPA());
  });

  it('shows an empty value when a prop is null', () => {
    setup();
    expect(minCA().value).toBe('');
    expect(maxCA().value).toBe('');
    expect(minPA().value).toBe('');
    expect(maxPA().value).toBe('');
  });

  it('seeds each input from its prop value', () => {
    setup({ minCA: 100, maxCA: 180, minPA: 120, maxPA: 200 });
    expect(minCA().value).toBe('100');
    expect(maxCA().value).toBe('180');
    expect(minPA().value).toBe('120');
    expect(maxPA().value).toBe('200');
  });
});

describe('AttributeFilters — editing updates the bound value', () => {
  it('reflects a typed value back to the input (minCA)', async () => {
    setup();
    await fireEvent.input(minCA(), { target: { value: '90' } });
    await tick();
    expect(minCA().value).toBe('90');
  });

  it('reflects a typed value back to the input (maxPA)', async () => {
    setup();
    await fireEvent.input(maxPA(), { target: { value: '199' } });
    await tick();
    expect(maxPA().value).toBe('199');
  });

  it('clears to empty when the field is emptied', async () => {
    setup({ minCA: 100 });
    expect(minCA().value).toBe('100');
    await fireEvent.input(minCA(), { target: { value: '' } });
    await tick();
    expect(minCA().value).toBe('');
  });

  it('edits each input independently without touching the others', async () => {
    setup({ minCA: 1, maxCA: 2, minPA: 3, maxPA: 4 });
    await fireEvent.input(minPA(), { target: { value: '150' } });
    await tick();
    expect(minPA().value).toBe('150');
    expect(minCA().value).toBe('1');
    expect(maxCA().value).toBe('2');
    expect(maxPA().value).toBe('4');
  });
});

describe('AttributeFilters — bindable round trip', () => {
  // bind:value on a type=number input parses to a number; reading it back through
  // the bound store confirms the two-way binding actually writes out.
  it('writes the parsed number back through the binding', async () => {
    const store: Props = { minCA: null, maxCA: null, minPA: null, maxPA: null };
    render(AttributeFilters, {
      props: {
        get minCA() { return store.minCA ?? null; },
        set minCA(v: number | null) { store.minCA = v; },
        maxCA: null,
        minPA: null,
        maxPA: null,
      },
    });
    await fireEvent.input(screen.getByLabelText('Minimum CA'), { target: { value: '123' } });
    await tick();
    expect(store.minCA).toBe(123);
  });

  it('writes null back through the binding when cleared', async () => {
    const store: Props = { minCA: 50, maxCA: null, minPA: null, maxPA: null };
    render(AttributeFilters, {
      props: {
        get minCA() { return store.minCA ?? null; },
        set minCA(v: number | null) { store.minCA = v; },
        maxCA: null,
        minPA: null,
        maxPA: null,
      },
    });
    await fireEvent.input(screen.getByLabelText('Minimum CA'), { target: { value: '' } });
    await tick();
    expect(store.minCA).toBeNull();
  });
});

describe('AttributeFilters — min<=max validation (swap on blur)', () => {
  // Bind all four props through a backing store so we can observe swaps.
  function bound(initial: Props) {
    const store: Props = { minCA: null, maxCA: null, minPA: null, maxPA: null, ...initial };
    render(AttributeFilters, {
      props: {
        get minCA() { return store.minCA ?? null; }, set minCA(v) { store.minCA = v; },
        get maxCA() { return store.maxCA ?? null; }, set maxCA(v) { store.maxCA = v; },
        get minPA() { return store.minPA ?? null; }, set minPA(v) { store.minPA = v; },
        get maxPA() { return store.maxPA ?? null; }, set maxPA(v) { store.maxPA = v; },
      },
    });
    return store;
  }

  it('swaps CA bounds when min > max on blur', async () => {
    const store = bound({ minCA: 180, maxCA: 100 });
    await fireEvent.blur(minCA());
    await tick();
    expect(store.minCA).toBe(100);
    expect(store.maxCA).toBe(180);
  });

  it('swaps PA bounds when min > max on blur', async () => {
    const store = bound({ minPA: 200, maxPA: 120 });
    await fireEvent.blur(maxPA());
    await tick();
    expect(store.minPA).toBe(120);
    expect(store.maxPA).toBe(200);
  });

  it('leaves an already-ordered range untouched', async () => {
    const store = bound({ minCA: 100, maxCA: 180 });
    await fireEvent.blur(minCA());
    await tick();
    expect(store.minCA).toBe(100);
    expect(store.maxCA).toBe(180);
  });

  it('does not swap when only one CA bound is set', async () => {
    const store = bound({ minCA: 150, maxCA: null });
    await fireEvent.blur(minCA());
    await tick();
    expect(store.minCA).toBe(150);
    expect(store.maxCA).toBeNull();
  });

  it('keeps CA and PA ranges independent', async () => {
    const store = bound({ minCA: 180, maxCA: 100, minPA: 120, maxPA: 200 });
    await fireEvent.blur(maxCA());
    await tick();
    expect(store.minCA).toBe(100);
    expect(store.maxCA).toBe(180);
    expect(store.minPA).toBe(120);
    expect(store.maxPA).toBe(200);
  });
});

describe('AttributeFilters — prop sync', () => {
  it('updates the rendered value when the prop changes (rerender)', async () => {
    const { rerender } = setup({ minCA: 100 });
    expect(minCA().value).toBe('100');
    await rerender({ minCA: 175, maxCA: null, minPA: null, maxPA: null });
    await tick();
    expect(minCA().value).toBe('175');
  });
});
