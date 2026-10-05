import { describe, expect, it } from 'vitest';

import { setupSut } from '../support/discount-repository';

describe('the published discounts read from PostgreSQL', () => {
  it('should list no discount when none is kept', async () => {
    const { repository } = await setupSut();

    const kept = await repository.all();

    expect(kept).to.deep.equal([]);
  });
  it.todo('should list every kept discount, as the in-memory repository does');
});
