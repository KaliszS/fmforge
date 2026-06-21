import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import FlagDisplay from '$lib/components/player/utils/FlagDisplay.svelte';

// svelte-flag-icons renders a real <svg role="img"> in jsdom (v3 no longer sets a
// default aria-label, so flag identity is asserted via FlagDisplay's own
// <article title={country.name}> wrapper, not icon internals).
// Data references (src/data/countries.json):
//   106  -> { code: "Af", name: "Afghanistan" }
//   1649 -> { code: "Ar", name: "Argentina"   }
// Unknown ids fall back to { code: "Un", name: "Unknown id=<n>" }.

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('FlagDisplay — valid nationality', () => {
  it('renders the country name as the article title for a known id', () => {
    render(FlagDisplay, { props: { nation: 106, edit_mode: false } });
    expect(screen.getByTitle('Afghanistan')).toBeInTheDocument();
  });

  it('renders the flag as an svg with role=img', () => {
    render(FlagDisplay, { props: { nation: 106, edit_mode: false } });
    const flag = screen.getByRole('img');
    expect(flag.tagName.toLowerCase()).toBe('svg');
  });

  it('passes the fixed size="45" through to the rendered flag svg', () => {
    render(FlagDisplay, { props: { nation: 106, edit_mode: false } });
    const flag = screen.getByRole('img');
    expect(flag).toHaveAttribute('width', '45');
    expect(flag).toHaveAttribute('height', '45');
  });

  it('renders a different flag for a different known id', () => {
    render(FlagDisplay, { props: { nation: 1649, edit_mode: false } });
    expect(screen.getByTitle('Argentina')).toBeInTheDocument();
    expect(screen.getByRole('img').tagName.toLowerCase()).toBe('svg');
  });
});

describe('FlagDisplay — unknown / missing nationality', () => {
  it('falls back to an Unknown title for an id that is not in the map', () => {
    render(FlagDisplay, { props: { nation: 999999, edit_mode: false } });
    expect(screen.getByTitle('Unknown id=999999')).toBeInTheDocument();
  });

  it('still renders a flag svg (the Un fallback) for an unknown id', () => {
    render(FlagDisplay, { props: { nation: 999999, edit_mode: false } });
    expect(screen.getByRole('img').tagName.toLowerCase()).toBe('svg');
  });
});

describe('FlagDisplay — reactivity', () => {
  it('updates the flag and title when the nation prop changes', async () => {
    const { rerender } = render(FlagDisplay, { props: { nation: 106, edit_mode: false } });
    expect(screen.getByTitle('Afghanistan')).toBeInTheDocument();

    await rerender({ nation: 1649, edit_mode: false });
    await tick();

    expect(screen.queryByTitle('Afghanistan')).not.toBeInTheDocument();
    expect(screen.getByTitle('Argentina')).toBeInTheDocument();
    expect(screen.getByRole('img').tagName.toLowerCase()).toBe('svg');
  });
});
