import { queryAllByRole } from '@testing-library/dom';
import { mount } from '@vue/test-utils';
import { describe, expect, it, onTestFinished } from 'vitest';

import ChangeRateForm from '@frontend/discounts/components/ChangeRateForm.vue';
import { discountTexts } from '@frontend/discounts/texts';
import { publishedSpicesDiscount } from '@sut/support/example-discounts';
import { aTestingDiscountsStore } from '@sut/unit/frontend/stores/discounts-store/a-testing-discounts-store';

const setupSut = ({ discount = publishedSpicesDiscount } = {}) =>
  mount(ChangeRateForm, {
    props: { discount, namedBy: 'entry-text' },
    global: aTestingDiscountsStore().global,
  });

const setupSutNamedBy = (namedBy: string, name: string) => {
  const naming = document.createElement('p');
  naming.id = namedBy;
  naming.textContent = name;
  document.body.append(naming);
  const form = mount(ChangeRateForm, {
    attachTo: document.body,
    props: { discount: publishedSpicesDiscount, namedBy },
    global: aTestingDiscountsStore().global,
  });
  onTestFinished(() => {
    form.unmount();
    naming.remove();
  });
};

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
    it('should take its name from the element naming its discount, for a person and a screen reader alike', () => {
      setupSutNamedBy('spices-text', 'Peruvian spices 20% Mike\'s Groceries 12 Market Street');

      expect(queryAllByRole(document.body, 'form', { name: 'Peruvian spices 20% Mike\'s Groceries 12 Market Street' })).to.have.length(1);
    });
    it('should take another name from the element naming another discount', () => {
      setupSutNamedBy('produce-text', 'Fresh produce 10% Corner Grocery 3 Hill Road');

      expect(queryAllByRole(document.body, 'form', { name: 'Fresh produce 10% Corner Grocery 3 Hill Road' })).to.have.length(1);
    });
  });
});
