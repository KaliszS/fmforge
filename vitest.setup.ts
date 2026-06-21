import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { clearMocks } from '@tauri-apps/api/mocks';

// Reset Tauri IPC mocks and any spies between tests so state never leaks across files.
afterEach(() => {
  clearMocks();
  vi.restoreAllMocks();
});
