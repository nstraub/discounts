import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import ChangeRateForm from '@frontend/discounts/components/ChangeRateForm.vue';
import { discountTexts } from '@frontend/discounts/texts';
import { publishedProduceDiscount, publishedSpicesDiscount } from '@sut/support/example-discounts';
import { aTestingDiscountsStore } from '@sut/unit/frontend/stores/discounts-store/a-testing-discounts-store';

const setupSut = ({ discount = publishedSpicesDiscount } = {}) =>
  mount(ChangeRateForm, {
    props: { discount },
    global: aTestingDiscountsStore().global,
  });

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

      expect(label).to.contain(publishedSpicesDiscount.item).and.to.contain(publishedSpicesDiscount.storeName);
    });
    it('should name another discount in the label of its own control', () => {
      const label = setupSut({ discount: publishedProduceDiscount }).get('[data-testid="change-rate-form"]').attributes('aria-label') ?? '';

      expect(label).to.contain(publishedProduceDiscount.item).and.to.contain(publishedProduceDiscount.storeName);
    });
  });
});
