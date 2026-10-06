import type { VueWrapper } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import ChangeRateForm from '@frontend/discounts/components/ChangeRateForm.vue';
import { publishedProduceDiscount, publishedSpicesDiscount } from '@sut/support/example-discounts';

import { anEntryControlFor } from '../an-entry-control';

const setupSut = ({ discount = publishedSpicesDiscount } = {}) => {
  const { control, discounts } = anEntryControlFor(ChangeRateForm, discount);
  return { form: control, discounts };
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
    it('should change the rate of another discount through that discount\'s own control', async () => {
      const { form, discounts } = setupSut({ discount: publishedProduceDiscount });

      await changeThroughTheForm(form, '15');

      expect(discounts.changeRate).to.have.been.calledWith('produce-id', { rate: '15' });
    });
    it('should change it to the rate exactly as Mike wrote it', async () => {
      const { form, discounts } = setupSut();

      await changeThroughTheForm(form, '12,5');

      expect(vi.mocked(discounts.changeRate).mock.lastCall?.[1].rate).to.equal('12,5');
    });

    describe('empty', () => {
      it('should change to a blank rate as left out, never as a rate of zero', async () => {
        const { form, discounts } = setupSut();

        await changeThroughTheForm(form, '');

        expect(vi.mocked(discounts.changeRate).mock.lastCall?.[1].rate).to.equal(undefined);
      });
      it('should change to a rate of nothing but spaces as left out, like a blank one', async () => {
        const { form, discounts } = setupSut();

        await changeThroughTheForm(form, '   ');

        expect(vi.mocked(discounts.changeRate).mock.lastCall?.[1].rate).to.equal(undefined);
      });
    });
  });
});
