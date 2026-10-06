import { describe, expect, it } from 'vitest';

import { CouponToken } from '@backend/discounts/application/domain/coupon-token';
import { produceDiscount, spicesDiscount, spicesDiscountWithItsHook } from '@sut/support/example-discounts';
import { atTheSpicesStore } from '@sut/support/example-stores';
import { testDatabaseUrl } from '@sut/support/test-database';

import { keepADiscountWithASaleCounted, setupSut } from '../support/discount-repository';
import { insertADiscountRow } from '../support/discounts-table';

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
  it('should save a discount at a changed rate and load it back equal, in a separate transaction', async () => {
    const { keep, repository, loadOnItsOwnConnection } = await setupSut();
    const discount = await keep(spicesDiscount);
    discount.changeRate('25');

    await repository.save(discount);

    const loaded = await loadOnItsOwnConnection();
    expect(loaded.map((kept) => kept.toJSON())).to.deep.equal([{ id: discount.toJSON().id, ...spicesDiscount, rate: '25', coupons: [] }]);
  });
  it('should change only the discount named, the other keeping its rate', async () => {
    const { keep, repository, loadOnItsOwnConnection } = await setupSut();
    const spices = await keep(spicesDiscount);
    const produce = await keep(produceDiscount);
    spices.changeRate('25');

    await repository.save(spices);

    const loaded = await loadOnItsOwnConnection();
    expect(loaded.map((kept) => kept.toJSON())).to.have.deep.members([
      { id: spices.toJSON().id, ...spicesDiscount, rate: '25', coupons: [] },
      { id: produce.toJSON().id, ...produceDiscount, coupons: [] },
    ]);
  });
  describe('with a hook', () => {
    it('should save a discount with a hook and load it back equal, in a separate transaction', async () => {
      const { keep, loadOnItsOwnConnection } = await setupSut();
      const discount = await keep(spicesDiscountWithItsHook);

      const [loaded] = await loadOnItsOwnConnection();

      expect(loaded?.toJSON()).to.deep.equal(discount.toJSON());
    });
    it('should keep a hook with quotes, semicolons and SQL keywords verbatim', async () => {
      const { keep, loadOnItsOwnConnection } = await setupSut();
      const hook = `New supplier'; DROP TABLE app.discounts; -- "fresh" OR 1=1`;
      await keep({ ...spicesDiscount, hook });

      const [loaded] = await loadOnItsOwnConnection();

      expect(loaded?.toJSON().hook).to.equal(hook);
    });
    it('should keep a hook with accents, apostrophes and emoji verbatim', async () => {
      const { keep, loadOnItsOwnConnection } = await setupSut();
      const hook = "Tomates d'Ángel, recién llegados 🍅";
      await keep({ ...spicesDiscount, hook });

      const [loaded] = await loadOnItsOwnConnection();

      expect(loaded?.toJSON().hook).to.equal(hook);
    });
  });
  describe('its rate', () => {
    describe('type', () => {
      it('should keep a rate of 33.3 exactly and load it back as 33.3', async () => {
        const { keep, loadOnItsOwnConnection } = await setupSut();
        await keep({ ...spicesDiscount, rate: '33.3' });

        const [loaded] = await loadOnItsOwnConnection();

        expect(loaded?.toJSON().rate).to.equal('33.3');
      });
    });

    describe('state', () => {
      it('should read back as written the rates published before the rate rules', async () => {
        const { client, loadOnItsOwnConnection } = await setupSut();
        const ratesTheRulesRefuse = ['a fifth', '150', '12.25', '0'];
        for (const rate of ratesTheRulesRefuse) {
          await insertADiscountRow(client, { ...spicesDiscount, id: `kept-at-${rate}`, rate });
        }

        const loaded = await loadOnItsOwnConnection();

        expect(loaded.map((kept) => kept.toJSON().rate)).to.have.members(ratesTheRulesRefuse);
      });
    });
  });
  describe('beside another discount', () => {
    it('should leave an earlier discount and its coupons, redeemed, unused and counted, as they were when another discount is kept', async () => {
      const { client, keep, repository, loadOnItsOwnConnection } = await setupSut();
      const earlier = await keepADiscountWithASaleCounted(client, testDatabaseUrl);
      const redeemedSinceTheCount = CouponToken.keptAs('R4WZ0BH8NE');
      earlier.issueCoupon(redeemedSinceTheCount);
      earlier.issueCoupon(CouponToken.keptAs('3HJN5VQ8WT'));
      earlier.redeemCoupon(redeemedSinceTheCount, atTheSpicesStore);
      await repository.save(earlier);

      await keep(produceDiscount);

      const loaded = (await loadOnItsOwnConnection()).find((kept) => kept.toJSON().id === earlier.toJSON().id);
      expect(loaded?.toJSON(), 'the earlier discount loaded back').to.deep.equal(earlier.toJSON());
    });
  });
});
