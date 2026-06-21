import { describe, it, expect, beforeEach } from 'vitest';
import { analystStore } from '$lib/stores/analystStore';

beforeEach(() => {
  analystStore.clear();
});

describe('analystStore cache', () => {
  it('returns null on a miss', () => {
    expect(analystStore.getCache({ country: 1 })).toBeNull();
  });

  it('returns cached data when params match (deep-equal via JSON)', () => {
    analystStore.setCache({ country: 1, club: 2 }, { total: 42 });
    // A structurally identical (but different reference) object still hits.
    expect(analystStore.getCache({ country: 1, club: 2 })).toEqual({ total: 42 });
  });

  it('misses when params differ', () => {
    analystStore.setCache({ country: 1 }, { total: 42 });
    expect(analystStore.getCache({ country: 2 })).toBeNull();
  });

  it('is sensitive to key order (JSON.stringify based)', () => {
    analystStore.setCache({ a: 1, b: 2 }, 'x');
    // Different serialization order => treated as a different query.
    expect(analystStore.getCache({ b: 2, a: 1 })).toBeNull();
  });

  it('clear() drops the cache', () => {
    analystStore.setCache({ country: 1 }, 'data');
    analystStore.clear();
    expect(analystStore.getCache({ country: 1 })).toBeNull();
  });
});
