// Load @testing-library/jest-dom's matcher type augmentation for Vitest's
// `expect` so svelte-check recognises toBeInTheDocument/toHaveTextContent/etc.
// in test files. The runtime registration lives in vitest.setup.ts.
import '@testing-library/jest-dom/vitest';
