import { describe, it, expect } from 'vitest';
import type { ModSettings } from '$lib/stores/modSettings';
import { getBirthYearOffset } from '$lib/utils/birthYear';

function settings(overrides: Partial<ModSettings> = {}): ModSettings {
  return {
    fmEdition: '2024',
    retroYear: '2000',
    showRealBirthDates: true,
    canToggle: true,
    ...overrides,
  };
}

describe('getBirthYearOffset', () => {
  it('computes fmEdition - 1 - retroYear when enabled', () => {
    // 2024 - 1 - 2000 = 23
    expect(getBirthYearOffset(settings())).toBe(23);
  });

  it('returns 0 when real birth dates are not shown', () => {
    expect(getBirthYearOffset(settings({ showRealBirthDates: false }))).toBe(0);
  });

  it('returns 0 when toggling is not allowed', () => {
    expect(getBirthYearOffset(settings({ canToggle: false }))).toBe(0);
  });

  it('returns 0 when fmEdition is not a number', () => {
    expect(getBirthYearOffset(settings({ fmEdition: '' }))).toBe(0);
  });

  it('returns 0 when retroYear is not a number', () => {
    expect(getBirthYearOffset(settings({ retroYear: 'abc' }))).toBe(0);
  });
});
