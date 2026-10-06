import { describe, expect, it } from 'vitest';

import { setupSut } from '../support/discount-repository';
import { constraintsAndColumnsOfTheDiscountsTable, insertACoupon, insertADiscountWithout } from '../support/discounts-table';

describe('the discounts table refusing what Discount refuses', () => {
  it('should refuse a discount without an item: 23502, NOT NULL mirrors "a discount has an item"', async () => {
    const { client } = await setupSut();

    const outcome = await insertADiscountWithout(client, 'item');

    expect(outcome).to.equal('23502');
  });
  it('should refuse a discount without a rate: 23502, NOT NULL mirrors "a discount has a rate"', async () => {
    const { client } = await setupSut();

    const outcome = await insertADiscountWithout(client, 'rate');

    expect(outcome).to.equal('23502');
  });
  it('should refuse a discount without a store name: 23502, NOT NULL mirrors "a discount names its store"', async () => {
    const { client } = await setupSut();

    const outcome = await insertADiscountWithout(client, 'store_name');

    expect(outcome).to.equal('23502');
  });
  it('should refuse a discount without a store address: 23502, NOT NULL mirrors "a discount names its store\'s address"', async () => {
    const { client } = await setupSut();

    const outcome = await insertADiscountWithout(client, 'store_address');

    expect(outcome).to.equal('23502');
  });
  it('should trace every constraint to a rule of Discount: no length cap on text, no CHECK on the rate', async () => {
    const { client } = await setupSut();

    const { constraints, columns } = await constraintsAndColumnsOfTheDiscountsTable(client);

    expect(constraints, 'only the primary key, for the identity each discount has').to.deep.equal([{ kind: 'p' }]);
    expect(columns, 'unbounded text, the rate as written included, each required piece NOT NULL').to.have.deep.members([
      { name: 'id', type: 'text', nullable: 'NO' },
      { name: 'item', type: 'text', nullable: 'NO' },
      { name: 'rate', type: 'text', nullable: 'NO' },
      { name: 'store_name', type: 'text', nullable: 'NO' },
      { name: 'store_address', type: 'text', nullable: 'NO' },
      { name: 'hook', type: 'text', nullable: 'YES' },
    ]);
  });
  describe('the hook', () => {
    it('should accept a discount without a hook: the hook column nullable mirrors "a discount may carry a hook"', async () => {
      const { client } = await setupSut();

      const outcome = await insertADiscountWithout(client, 'hook');

      expect(outcome).to.equal('accepted');
    });
  });
  describe('its coupons', () => {
    it('should refuse two coupons with one token: 23505, unique mirrors "a coupon is identified by its token alone"', async () => {
      const { client } = await setupSut();
      await insertADiscountWithout(client, 'hook');
      await insertACoupon(client, { token: '7K3QX9M2PD', discount_id: 'constraint-id' });

      const outcome = await insertACoupon(client, { token: '7K3QX9M2PD', discount_id: 'constraint-id' });

      expect(outcome).to.equal('23505');
    });
    it('should refuse a coupon without a token: 23502, NOT NULL mirrors "a coupon has a token"', async () => {
      const { client } = await setupSut();
      await insertADiscountWithout(client, 'hook');

      const outcome = await insertACoupon(client, { discount_id: 'constraint-id' });

      expect(outcome).to.equal('23502');
    });
    it('should refuse a coupon of no kept discount: 23503, the foreign key mirrors "a coupon belongs to its discount"', async () => {
      const { client } = await setupSut();

      const outcome = await insertACoupon(client, { token: '7K3QX9M2PD', discount_id: 'an-id-no-discount-has' });

      expect(outcome).to.equal('23503');
    });
  });
  describe('a coupon\'s redemption', () => {
    it('should trace every constraint on a coupon\'s redemption to a rule of Discount, keeping no time and no one with it', async () => {
      const { client } = await setupSut();

      const { rows } = await client.query(
        "SELECT column_name AS name, data_type AS type, is_nullable AS nullable, column_default AS default FROM information_schema.columns WHERE table_schema = 'app' AND table_name = 'coupons' ORDER BY ordinal_position",
      );

      expect(rows.map(({ name }) => name), 'only whether it was used and counted, with no time and no one').to.deep.equal(['id', 'token', 'discount_id', 'redeemed', 'counted']);
      expect(rows.find(({ name }) => name === 'redeemed'), 'NOT NULL, false by default, mirrors "a coupon is unused from its issue until redeemed"').to.deep.equal({
        name: 'redeemed',
        type: 'boolean',
        nullable: 'NO',
        default: 'false',
      });
    });
  });
  describe('a count of a discount\'s sales', () => {
    it.todo('should trace every constraint on counting a discount\'s sales to a rule of Discount, keeping no time and no one with it');
  });
});
