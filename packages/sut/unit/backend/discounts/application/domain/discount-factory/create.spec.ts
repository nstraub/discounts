import { mock } from 'vitest-mock-extended';
import { describe, expect, it, vi } from 'vitest';

import { DiscountDetails } from '@backend/discounts/application/domain/discount-details';
import { DiscountFactory } from '@backend/discounts/application/domain/discount-factory';
import type { DomainEventPublisher } from '@backend/discounts/application/domain/domain-event-publisher';
import { spicesDiscount } from '@sut/support/example-discounts';

vi.unmock('uuid');

const setupSut = () => {
  const factory = new DiscountFactory(mock<DomainEventPublisher>());
  return { discountWith: (details: ConstructorParameters<typeof DiscountDetails>[0]) => factory.create(new DiscountDetails(details)) };
};

describe('class DiscountFactory', () => {
  describe('creating a discount', () => {
    it('should hold the item, rate, store name and store address it was created with', () => {
      const { discountWith } = setupSut();

      const discount = discountWith(spicesDiscount);

      expect(discount.toJSON()).to.deep.include(spicesDiscount);
    });
    it('should give each discount an identity of its own, two identical discounts included', () => {
      const { discountWith } = setupSut();

      const first = discountWith(spicesDiscount);
      const second = discountWith(spicesDiscount);

      expect(first.toJSON().id).to.not.equal(second.toJSON().id);
    });

    describe('type', () => {
      it('should keep an item, store name and store address written with accents, apostrophes and emoji exactly as written', () => {
        const { discountWith } = setupSut();
        const writtenWithAccents = { item: 'Ají panca 🌶️', storeName: "D'Ángelo's Bodega", storeAddress: 'Calle Ñuñoa 4, piso 2' };

        const discount = discountWith({ ...spicesDiscount, ...writtenWithAccents });

        expect(discount.toJSON()).to.deep.include(writtenWithAccents);
      });
    });
  });
  describe('creating a discount with a hook', () => {
    it('should hold the hook it was created with', () => {
      const { discountWith } = setupSut();

      const discount = discountWith({ ...spicesDiscount, hook: 'Our spices now come from a new supplier' });

      expect(discount.toJSON().hook).to.equal('Our spices now come from a new supplier');
    });
    it('should hold no hook when created without one', () => {
      const { discountWith } = setupSut();

      const discount = discountWith(spicesDiscount);

      expect(discount.toJSON()).to.not.have.property('hook');
    });
  });
});
