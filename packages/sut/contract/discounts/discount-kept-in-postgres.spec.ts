// Contract tests: the real app_test database.
import { describe, it } from 'vitest';

describe('a discount kept in PostgreSQL', () => {
  it.todo('should save a discount and load it back equal, in a separate transaction, its events excepted (not persisted)');
  it.todo('should keep an item, store name and store address with quotes, semicolons and SQL keywords verbatim');
  it.todo('should keep an item, store name and store address with accents, apostrophes and emoji verbatim');
});
