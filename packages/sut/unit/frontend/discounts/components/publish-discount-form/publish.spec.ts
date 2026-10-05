import { createTestingPinia } from '@pinia/testing';
import { mount, type VueWrapper } from '@vue/test-utils';
import { describe, expect, it, onTestFinished, vi } from 'vitest';

import PublishDiscountForm from '@frontend/discounts/components/PublishDiscountForm.vue';
import { useDiscountsStore } from '@frontend/stores/discounts-store';

const setupSut = () => {
  const pinia = createTestingPinia({ createSpy: vi.fn });
  const form = mount(PublishDiscountForm, { attachTo: document.body, global: { plugins: [pinia] } });
  onTestFinished(() => form.unmount());
  return { form, discounts: useDiscountsStore(pinia) };
};

const spicesDiscount = { item: 'Peruvian spices', rate: '20', storeName: "Mike's Groceries", storeAddress: '12 Market Street' };

const publishThroughTheForm = async (form: VueWrapper, discount: typeof spicesDiscount): Promise<void> => {
  await form.get('[data-testid="discount-item"]').setValue(discount.item);
  await form.get('[data-testid="discount-rate"]').setValue(discount.rate);
  await form.get('[data-testid="discount-store-name"]').setValue(discount.storeName);
  await form.get('[data-testid="discount-store-address"]').setValue(discount.storeAddress);
  await form.get('[data-testid="publish-discount"]').trigger('click');
};

describe('Component PublishDiscountForm', () => {
  describe('publishing a discount', () => {
    it('should publish the item, rate, store name and store address as Mike gave them', async () => {
      const { form, discounts } = setupSut();

      await publishThroughTheForm(form, spicesDiscount);

      expect(discounts.publish).to.have.been.calledWith({
        item: 'Peruvian spices',
        rate: 20,
        storeName: "Mike's Groceries",
        storeAddress: '12 Market Street',
      });
    });
    it('should publish other pieces when Mike gives others', async () => {
      const { form, discounts } = setupSut();

      await publishThroughTheForm(form, { item: 'Fresh produce', rate: '10', storeName: 'Corner Grocery', storeAddress: '3 Hill Road' });

      expect(discounts.publish).to.have.been.calledWith({
        item: 'Fresh produce',
        rate: 10,
        storeName: 'Corner Grocery',
        storeAddress: '3 Hill Road',
      });
    });
    it('should clear every field once the discount is published', async () => {
      const { form } = setupSut();

      await publishThroughTheForm(form, spicesDiscount);

      expect(form.get<HTMLInputElement>('[data-testid="discount-item"]').element.value).to.equal('');
      expect(form.get<HTMLInputElement>('[data-testid="discount-rate"]').element.value).to.equal('');
      expect(form.get<HTMLInputElement>('[data-testid="discount-store-name"]').element.value).to.equal('');
      expect(form.get<HTMLInputElement>('[data-testid="discount-store-address"]').element.value).to.equal('');
    });
    it('should stay on the page, ready for the next discount, once the discount is published', async () => {
      const { form, discounts } = setupSut();
      await publishThroughTheForm(form, spicesDiscount);

      await publishThroughTheForm(form, { item: 'Fresh produce', rate: '10', storeName: "Mike's Groceries", storeAddress: '12 Market Street' });

      expect(discounts.publish).to.have.been.lastCalledWith({
        item: 'Fresh produce',
        rate: 10,
        storeName: "Mike's Groceries",
        storeAddress: '12 Market Street',
      });
    });

    describe('empty', () => {
      it('should publish a blank rate as left out, never as a rate of zero', async () => {
        const { form, discounts } = setupSut();

        await publishThroughTheForm(form, { ...spicesDiscount, rate: '' });

        expect(vi.mocked(discounts.publish).mock.lastCall?.at(0)?.rate).to.equal(undefined);
      });
    });

    describe('state', () => {
      it.todo('should publish once when Mike asks to publish twice before the first answer');
    });
  });
});
