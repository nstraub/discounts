import { createTestingPinia } from '@pinia/testing';
import { mount } from '@vue/test-utils';
import { describe, expect, it, onTestFinished, vi } from 'vitest';

import PublishDiscountForm from '@frontend/discounts/components/PublishDiscountForm.vue';
import { useDiscountsStore } from '@frontend/stores/discounts-store';

const setupSut = () => {
  const pinia = createTestingPinia({ createSpy: vi.fn });
  const form = mount(PublishDiscountForm, { attachTo: document.body, global: { plugins: [pinia] } });
  onTestFinished(() => form.unmount());
  return { form, discounts: useDiscountsStore(pinia) };
};

describe('Component PublishDiscountForm', () => {
  describe('publishing a discount', () => {
    it('should publish the item, rate, store name and store address as Mike gave them', async () => {
      const { form, discounts } = setupSut();

      await form.get('[data-testid="discount-item"]').setValue('Peruvian spices');
      await form.get('[data-testid="discount-rate"]').setValue('20');
      await form.get('[data-testid="discount-store-name"]').setValue("Mike's Groceries");
      await form.get('[data-testid="discount-store-address"]').setValue('12 Market Street');
      await form.get('[data-testid="publish-discount"]').trigger('click');

      expect(discounts.publish).to.have.been.calledWith({
        item: 'Peruvian spices',
        rate: 20,
        storeName: "Mike's Groceries",
        storeAddress: '12 Market Street',
      });
    });
    it('should publish other pieces when Mike gives others', async () => {
      const { form, discounts } = setupSut();

      await form.get('[data-testid="discount-item"]').setValue('Fresh produce');
      await form.get('[data-testid="discount-rate"]').setValue('10');
      await form.get('[data-testid="discount-store-name"]').setValue('Corner Grocery');
      await form.get('[data-testid="discount-store-address"]').setValue('3 Hill Road');
      await form.get('[data-testid="publish-discount"]').trigger('click');

      expect(discounts.publish).to.have.been.calledWith({
        item: 'Fresh produce',
        rate: 10,
        storeName: 'Corner Grocery',
        storeAddress: '3 Hill Road',
      });
    });
    it.todo('should clear every field once the discount is published');
    it.todo('should stay on the page, ready for the next discount, once the discount is published');

    describe('empty', () => {
      it.todo('should publish a blank rate as left out, never as a rate of zero');
    });

    describe('state', () => {
      it.todo('should publish once when Mike asks to publish twice before the first answer');
    });
  });
});
