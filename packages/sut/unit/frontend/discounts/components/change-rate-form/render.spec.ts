import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import ChangeRateForm from '@frontend/discounts/components/ChangeRateForm.vue';
import { discountTexts } from '@frontend/discounts/texts';

const spicesDiscount = { id: 'spices-id', item: 'Peruvian spices', rate: '20', storeName: "Mike's Groceries", storeAddress: '12 Market Street' };

const produceDiscount = { id: 'produce-id', item: 'Fresh produce', rate: '10', storeName: 'Corner Grocery', storeAddress: '3 Hill Road' };

const setupSut = ({ discount = spicesDiscount } = {}) => mount(ChangeRateForm, { props: { discount } });

describe('Component ChangeRateForm', () => {
  describe('what the control asks for', () => {
    it('should ask for the new rate under its caption', () => {
      const field = setupSut().get('[data-testid="new-rate-field"]');

      expect(field.text()).to.equal(discountTexts.newRate);
      expect(field.find('[data-testid="new-rate"]').exists()).to.equal(true);
    });
    it('should offer to change the rate under its caption', () => {
      expect(setupSut().get('[data-testid="change-rate"]').text()).to.equal(discountTexts.changeRate);
    });
    it('should name the discount it changes in its label, for a person and a screen reader alike', () => {
      const label = setupSut().get('[data-testid="change-rate-form"]').attributes('aria-label') ?? '';

      expect(label).to.contain(spicesDiscount.item).and.to.contain(spicesDiscount.storeName);
    });
    it('should name another discount in the label of its own control', () => {
      const label = setupSut({ discount: produceDiscount }).get('[data-testid="change-rate-form"]').attributes('aria-label') ?? '';

      expect(label).to.contain(produceDiscount.item).and.to.contain(produceDiscount.storeName);
    });
  });
});
