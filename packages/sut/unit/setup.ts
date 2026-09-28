import { vi } from 'vitest';

vi.mock('uuid', async (importOriginal) => ({
  ...(await importOriginal<typeof import('uuid')>()),
  v4: () => 'test-uuid',
}));
