// Contract tests: the real app_test database.
import { describe, it } from 'vitest';

describe('the published discounts read from PostgreSQL', () => {
  it.todo('should list no discount when none is kept');
  it.todo('should list every kept discount, as the in-memory repository does');
});
