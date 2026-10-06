import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import { describe, expect, it, onTestFinished } from 'vitest';

import RedeemCouponForm from '@frontend/discounts/components/RedeemCouponForm.vue';
import { useDiscountsStore } from '@frontend/stores/discounts-store';
import { spicesDiscount, stephaniesProduceDiscount } from '@sut/support/example-discounts';
import { aTestingDiscountsStore } from '@sut/unit/frontend/stores/discounts-store/a-testing-discounts-store';

const theStoreOf = ({ storeName, storeAddress }: typeof spicesDiscount) => ({ storeName, storeAddress });

const setupSut = () => {
  const { pinia, global } = aTestingDiscountsStore();
  const stores = [theStoreOf(spicesDiscount), theStoreOf(stephaniesProduceDiscount)];
  const form = mount(RedeemCouponForm, { attachTo: document.body, props: { stores }, global });
  onTestFinished(() => form.unmount());
  return { form, discounts: useDiscountsStore(pinia) };
};

const redeemThroughTheForm = async (form: VueWrapper, storeShown: string, code: string): Promise<void> => {
  const picker = form.get<HTMLSelectElement>('select');
  picker.element.selectedIndex = [...picker.element.options].findIndex((option) => option.text.trim() === storeShown);
  await picker.trigger('change');
  await form.get('[data-testid="typed-coupon-code"]').setValue(code);
  await form.get('form').trigger('submit');
};

describe('Component RedeemCouponForm', () => {
  describe('redeeming the coupon Sue shows', () => {
    it('should redeem the code as typed at the store picked', async () => {
      const { form, discounts } = setupSut();

      await redeemThroughTheForm(form, "Mike's Groceries, 12 Market Street", '7k3qx 9m2pd');

      expect(discounts.redeemCoupon).to.have.been.calledWith({ code: '7k3qx 9m2pd', storeName: "Mike's Groceries", storeAddress: '12 Market Street' });
    });
    it.todo('should say the discount applies once the coupon is redeemed');
    it.todo('should name the item the discount is for once the coupon is redeemed');

    describe('state', () => {
      it.todo('should say nothing applies before a coupon is redeemed');
      it.todo('should tell Stephanie to say which store she is at when none is picked, redeeming nothing');
    });

    describe('dependency failure', () => {
      it.todo('should tell Stephanie the coupon could not be checked and to try again');
    });

    describe('the rate at the till', () => {
      it.todo('should show the rate the coupon applies at');
    });
  });
});
