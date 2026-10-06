import { queryAllByRole } from '@testing-library/dom';
import type { VueWrapper } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import RedeemCouponForm from '@frontend/discounts/components/RedeemCouponForm.vue';
import { discountTexts } from '@frontend/discounts/texts';
import { spicesDiscount, stephaniesProduceDiscount } from '@sut/support/example-discounts';

import { aFormOfferingTheStores } from '../a-form-offering-the-stores';

const theStoreOf = ({ storeName, storeAddress }: typeof spicesDiscount) => ({ storeName, storeAddress });

const setupSut = () => aFormOfferingTheStores(RedeemCouponForm, [theStoreOf(spicesDiscount), theStoreOf(stephaniesProduceDiscount)]);

const setupSutRedeemingTo = (item: string) => {
  const sut = setupSut();
  vi.mocked(sut.discounts.redeemCoupon).mockImplementation(async () => {
    sut.discounts.redemption = { item };
  });
  return sut;
};

const redeemThroughTheForm = async (form: VueWrapper, storeShown: string, code: string): Promise<void> => {
  const picker = form.get<HTMLSelectElement>('select');
  picker.element.selectedIndex = [...picker.element.options].findIndex((option) => option.text.trim() === storeShown);
  await picker.trigger('change');
  await form.get('[data-testid="typed-coupon-code"]').setValue(code);
  await form.get('form').trigger('submit');
};

const whatTheTillTells = () => queryAllByRole(document.body, 'status').map((told) => told.textContent).join(' ');

describe('Component RedeemCouponForm', () => {
  describe('redeeming the coupon Sue shows', () => {
    it('should redeem the code as typed at the store picked', async () => {
      const { form, discounts } = setupSut();

      await redeemThroughTheForm(form, "Mike's Groceries, 12 Market Street", '7k3qx 9m2pd');

      expect(discounts.redeemCoupon).to.have.been.calledWith({ code: '7k3qx 9m2pd', storeName: "Mike's Groceries", storeAddress: '12 Market Street' });
    });
    it('should redeem at another store when Stephanie picks another', async () => {
      const { form, discounts } = setupSut();

      await redeemThroughTheForm(form, "Stephanie's Market, 8 Orchard Lane", 'R4WZ0-BH8NE');

      expect(discounts.redeemCoupon).to.have.been.calledWith({ code: 'R4WZ0-BH8NE', storeName: "Stephanie's Market", storeAddress: '8 Orchard Lane' });
    });
    it('should say the discount applies once the coupon is redeemed', async () => {
      const { form } = setupSutRedeemingTo(spicesDiscount.item);

      await redeemThroughTheForm(form, "Mike's Groceries, 12 Market Street", '7k3qx 9m2pd');

      expect(whatTheTillTells(), 'what the till tells').to.contain(discountTexts.theDiscountAppliesTo);
    });
    it('should name the item the discount is for once the coupon is redeemed', async () => {
      const { form } = setupSutRedeemingTo(spicesDiscount.item);

      await redeemThroughTheForm(form, "Mike's Groceries, 12 Market Street", '7k3qx 9m2pd');

      expect(whatTheTillTells(), 'what the till tells').to.contain(`${discountTexts.theDiscountAppliesTo} Peruvian spices`);
    });
    it('should name another item when the coupon is for another discount', async () => {
      const { form } = setupSutRedeemingTo(stephaniesProduceDiscount.item);

      await redeemThroughTheForm(form, "Stephanie's Market, 8 Orchard Lane", 'R4WZ0BH8NE');

      expect(whatTheTillTells(), 'what the till tells').to.contain(`${discountTexts.theDiscountAppliesTo} Organic produce`);
    });

    describe('state', () => {
      it('should say nothing applies before a coupon is redeemed', () => {
        setupSut();

        expect(whatTheTillTells(), 'what the till tells').to.equal('');
      });
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
