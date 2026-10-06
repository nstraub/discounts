import { flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import { describe, expect, it, onTestFinished, vi } from 'vitest';

import PublishDiscountForm from '@frontend/discounts/components/PublishDiscountForm.vue';
import { discountTexts } from '@frontend/discounts/texts';
import { useDiscountsStore } from '@frontend/stores/discounts-store';
import { aTestingDiscountsStore } from '@sut/unit/frontend/stores/discounts-store/a-testing-discounts-store';

const setupSutRefusingAsMissing = (pieces: string[]) => {
  const { pinia, global } = aTestingDiscountsStore();
  const form = mount(PublishDiscountForm, { attachTo: document.body, global });
  onTestFinished(() => form.unmount());
  const discounts = useDiscountsStore(pinia);
  vi.mocked(discounts.publish).mockImplementation(async () => {
    discounts.missing = pieces;
  });
  return { form };
};

const whatTheFieldTells = (form: VueWrapper, field: string) =>
  form.findAll(`[data-testid="${field}-field"] [role="status"]`).map((told) => told.text()).join(' ');

describe('Component PublishDiscountForm', () => {
  describe('publishing a discount with a piece left out', () => {
    it('should tell Mike the item is missing beside its field when refused for it', async () => {
      const { form } = setupSutRefusingAsMissing(['item']);

      await form.get('[data-testid="publish-discount"]').trigger('click');
      await flushPromises();

      expect(whatTheFieldTells(form, 'discount-item'), "what the item's field tells").to.equal(discountTexts.itemMissing);
    });
    it('should tell Mike the rate is missing beside its field when refused for it', async () => {
      const { form } = setupSutRefusingAsMissing(['rate']);

      await form.get('[data-testid="publish-discount"]').trigger('click');
      await flushPromises();

      expect(whatTheFieldTells(form, 'discount-rate'), "what the rate's field tells").to.equal(discountTexts.rateMissing);
    });
    it.todo('should tell Mike the store name is missing beside its field when refused for it');
    it.todo('should tell Mike the store address is missing beside its field when refused for it');

    describe('state', () => {
      it.todo('should not tell Mike anything is missing before a publish is refused');
      it.todo('should no longer tell Mike a piece is missing once he gives it and the discount is published');
    });

    describe('combination', () => {
      it.todo('should tell Mike every piece missing at once, each beside its own field');
      it.todo('should tell Mike the rate is missing, never that it is not valid, when the refusal lists it as missing');
    });
  });
});
