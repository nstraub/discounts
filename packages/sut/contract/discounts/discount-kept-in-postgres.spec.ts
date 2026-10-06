import { describe, expect, it } from 'vitest';

import { spicesDiscount } from '@sut/support/example-discounts';

import { setupSut } from '../support/discount-repository';

describe('a discount kept in PostgreSQL', () => {
  it('should save a discount and load it back equal, in a separate transaction, its events excepted (not persisted)', async () => {
    const { keep, loadOnItsOwnConnection } = await setupSut();
    const discount = await keep(spicesDiscount);

    const [loaded] = await loadOnItsOwnConnection();

    expect(loaded?.toJSON()).to.deep.equal(discount.toJSON());
  });
  it('should keep an item, store name and store address with quotes, semicolons and SQL keywords verbatim', async () => {
    const { keep, loadOnItsOwnConnection } = await setupSut();
    const writtenAsSql = { item: "Spices'; DROP TABLE app.discounts; --", storeName: '"Mike" OR 1=1', storeAddress: '12 Market St; SELECT * FROM app.greetings' };
    await keep({ ...spicesDiscount, ...writtenAsSql });

    const [loaded] = await loadOnItsOwnConnection();

    expect(loaded?.toJSON()).to.deep.include(writtenAsSql);
  });
  it('should keep an item, store name and store address with accents, apostrophes and emoji verbatim', async () => {
    const { keep, loadOnItsOwnConnection } = await setupSut();
    const writtenWithAccents = { item: 'Ají panca 🌶️', storeName: "D'Ángelo's Bodega", storeAddress: 'Calle Ñuñoa 4, piso 2' };
    await keep({ ...spicesDiscount, ...writtenWithAccents });

    const [loaded] = await loadOnItsOwnConnection();

    expect(loaded?.toJSON()).to.deep.include(writtenWithAccents);
  });
  it.todo('should save a discount at a changed rate and load it back equal, in a separate transaction');
  it.todo('should change only the discount named, the other keeping its rate');
});
