import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';

import PublishDiscountForm from '@frontend/discounts/components/PublishDiscountForm.vue';
import { discountTexts } from '@frontend/discounts/texts';

const setupSut = () => mount(PublishDiscountForm);

describe('Component PublishDiscountForm', () => {
  describe('what the form asks for', () => {
    it('should ask for the item under its caption', () => {
      const field = setupSut().get('[data-testid="discount-item-field"]');

      expect(field.text()).to.equal(discountTexts.item);
      expect(field.find('[data-testid="discount-item"]').exists()).to.equal(true);
    });
    it.todo('should ask for the rate under its caption');
    it.todo('should ask for the store name under its caption');
    it.todo('should ask for the store address under its caption');
    it.todo('should offer to publish under its caption');
  });
});
