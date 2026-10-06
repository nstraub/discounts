import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import ChangeRateForm from '@frontend/discounts/components/ChangeRateForm.vue';
import { discountTexts } from '@frontend/discounts/texts';

const spicesDiscount = { id: 'spices-id', item: 'Peruvian spices', rate: '20', storeName: "Mike's Groceries", storeAddress: '12 Market Street' };

const setupSut = () => mount(ChangeRateForm, { props: { discount: spicesDiscount } });

describe('Component ChangeRateForm', () => {
  describe('what the control asks for', () => {
    it('should ask for the new rate under its caption', () => {
      const field = setupSut().get('[data-testid="new-rate-field"]');

      expect(field.text()).to.equal(discountTexts.newRate);
      expect(field.find('[data-testid="new-rate"]').exists()).to.equal(true);
    });
    it.todo('should offer to change the rate under its caption');
    it.todo('should name the discount it changes in its label, for a person and a screen reader alike');
  });
});
