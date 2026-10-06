import { mount, type VueWrapper } from '@vue/test-utils';
import { describe, expect, it, onTestFinished, vi } from 'vitest';

import ChangeRateForm from '@frontend/discounts/components/ChangeRateForm.vue';
import { useDiscountsStore } from '@frontend/stores/discounts-store';
import { aTestingDiscountsStore } from '@sut/unit/frontend/stores/discounts-store/a-testing-discounts-store';

const spicesDiscount = { id: 'spices-id', item: 'Peruvian spices', rate: '20', storeName: "Mike's Groceries", storeAddress: '12 Market Street' };

const setupSut = () => {
  const { pinia, global } = aTestingDiscountsStore();
  const form = mount(ChangeRateForm, { attachTo: document.body, props: { discount: spicesDiscount }, global });
  onTestFinished(() => form.unmount());
  return { form, discounts: useDiscountsStore(pinia) };
};

const changeThroughTheForm = async (form: VueWrapper, newRate: string): Promise<void> => {
  await form.get('[data-testid="new-rate"]').setValue(newRate);
  await form.get('[data-testid="change-rate"]').trigger('click');
};

describe('Component ChangeRateForm', () => {
  describe('changing the rate of its discount', () => {
    it('should change the rate of its own discount to the rate Mike gives', async () => {
      const { form, discounts } = setupSut();

      await changeThroughTheForm(form, '30');

      expect(discounts.changeRate).to.have.been.calledWith('spices-id', { rate: '30' });
    });
    it('should change it to the rate exactly as Mike wrote it', async () => {
      const { form, discounts } = setupSut();

      await changeThroughTheForm(form, '12,5');

      expect(vi.mocked(discounts.changeRate).mock.lastCall?.[1].rate).to.equal('12,5');
    });

    describe('empty', () => {
      it.todo('should change to a blank rate as left out, never as a rate of zero');
    });
  });
});
