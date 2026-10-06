import { flushPromises, type VueWrapper } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import { discountTexts } from '@frontend/discounts/texts';

import { setupSut } from './publish-discount-form-of-an-app';

const setupSutRefusingAsMissing = (pieces: string[]) => {
  const { form, discounts } = setupSut();
  vi.mocked(discounts.publish).mockImplementation(async () => {
    discounts.missing = pieces;
  });
  return { form };
};

const askToPublish = async (form: VueWrapper): Promise<void> => {
  await form.get('[data-testid="publish-discount"]').trigger('click');
  await flushPromises();
};

const whatTheFieldTells = (form: VueWrapper, field: string) =>
  form.findAll(`[data-testid="${field}-field"] [role="status"]`).map((told) => told.text()).join(' ');

const whatTheFormTells = (form: VueWrapper) => form.findAll('[role="status"]').map((told) => told.text()).join(' ');

const theRequiredFields = ['discount-item', 'discount-rate', 'discount-store-name', 'discount-store-address'];

describe('Component PublishDiscountForm', () => {
  describe('publishing a discount with a piece left out', () => {
    it('should tell Mike the item is missing beside its field when refused for it', async () => {
      const { form } = setupSutRefusingAsMissing(['item']);

      await askToPublish(form);

      expect(whatTheFieldTells(form, 'discount-item'), "what the item's field tells").to.equal(discountTexts.itemMissing);
    });
    it('should tell Mike the rate is missing beside its field when refused for it', async () => {
      const { form } = setupSutRefusingAsMissing(['rate']);

      await askToPublish(form);

      expect(whatTheFieldTells(form, 'discount-rate'), "what the rate's field tells").to.equal(discountTexts.rateMissing);
    });
    it('should tell Mike the store name is missing beside its field when refused for it', async () => {
      const { form } = setupSutRefusingAsMissing(['storeName']);

      await askToPublish(form);

      expect(whatTheFieldTells(form, 'discount-store-name'), "what the store name's field tells").to.equal(discountTexts.storeNameMissing);
    });
    it('should tell Mike the store address is missing beside its field when refused for it', async () => {
      const { form } = setupSutRefusingAsMissing(['storeAddress']);

      await askToPublish(form);

      expect(whatTheFieldTells(form, 'discount-store-address'), "what the store address's field tells").to.equal(discountTexts.storeAddressMissing);
    });

    describe('state', () => {
      it('should not tell Mike anything is missing before a publish is refused', () => {
        const { form } = setupSut();

        expect(theRequiredFields.map((field) => whatTheFieldTells(form, field)), 'what the fields tell').to.deep.equal(['', '', '', '']);
      });
      it('should no longer tell Mike a piece is missing once he gives it and it is published', async () => {
        const { form, discounts } = setupSut();
        vi.mocked(discounts.publish)
          .mockImplementationOnce(async () => {
            discounts.missing = ['item'];
          })
          .mockImplementationOnce(async () => {
            discounts.missing = [];
          });
        await askToPublish(form);

        await form.get('[data-testid="discount-item"]').setValue('Peruvian spices');
        await askToPublish(form);

        expect(whatTheFieldTells(form, 'discount-item'), "what the item's field tells").to.equal('');
      });
    });

    describe('combination', () => {
      it('should tell Mike every piece missing at once, each beside its own field', async () => {
        const { form } = setupSutRefusingAsMissing(['item', 'rate', 'storeName', 'storeAddress']);

        await askToPublish(form);

        expect(theRequiredFields.map((field) => whatTheFieldTells(form, field)), 'what the fields tell').to.deep.equal([
          discountTexts.itemMissing,
          discountTexts.rateMissing,
          discountTexts.storeNameMissing,
          discountTexts.storeAddressMissing,
        ]);
      });
      it('should tell Mike the rate is missing, never that it is not valid, when listed so', async () => {
        const { form } = setupSutRefusingAsMissing(['rate']);

        await askToPublish(form);

        expect(whatTheFormTells(form), 'what the form tells').to.contain(discountTexts.rateMissing).and.not.contain(discountTexts.rateNotValid);
      });
    });
  });
});
