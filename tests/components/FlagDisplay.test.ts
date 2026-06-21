import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import FlagDisplay from '$lib/components/player/utils/FlagDisplay.svelte';

// svelte-flag-icons renders a real <svg role="img" aria-label="<lowercase code>"> in jsdom,
// so we assert on the rendered flag element rather than icon internals.
// Data references (src/data/countries.json):
//   106  -> { code: "Af", name: "Afghanistan" }  (aria-label "af")
//   1649 -> { code: "Ar", name: "Argentina"   }  (aria-label "ar")
// Unknown ids fall back to { code: "Un", name: "Unknown id=<n>" } (aria-label "un").

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('FlagDisplay — valid nationality', () => {
  it('renders the country name as the article title for a known id', () => {
    render(FlagDisplay, { props: { nation: 106, edit_mode: false } });
    expect(screen.getByTitle('Afghanistan')).toBeInTheDocument();
  });

  it('renders the matching flag icon (role=img with the country aria-label)', () => {
    render(FlagDisplay, { props: { nation: 106, edit_mode: false } });
    const flag = screen.getByRole('img');
    expect(flag.tagName.toLowerCase()).toBe('svg');
    expect(flag).toHaveAttribute('aria-label', 'af');
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
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'ar');
  });
});

describe('FlagDisplay — unknown / missing nationality', () => {
  it('falls back to an Unknown title for an id that is not in the map', () => {
    render(FlagDisplay, { props: { nation: 999999, edit_mode: false } });
    expect(screen.getByTitle('Unknown id=999999')).toBeInTheDocument();
  });

  it('falls back to the Un flag icon for an unknown id', () => {
    render(FlagDisplay, { props: { nation: 999999, edit_mode: false } });
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'un');
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
    expect(screen.getByRole('img')).toHaveAttribute('aria-label', 'ar');
  });
});
