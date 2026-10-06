import { queryAllByRole } from '@testing-library/dom';
import type { VueWrapper } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';

import RedeemCouponForm from '@frontend/discounts/components/RedeemCouponForm.vue';
import { discountTexts } from '@frontend/discounts/texts';
import { spicesDiscount, stephaniesProduceDiscount } from '@sut/support/example-discounts';

import { aFormOfferingTheStoresOf } from '../a-form-offering-the-stores';

const setupSut = () => aFormOfferingTheStoresOf(RedeemCouponForm, [spicesDiscount, stephaniesProduceDiscount]);

const setupSutTelling = (told: string) => {
  const sut = setupSut();
  vi.mocked(sut.till.redeemCoupon).mockImplementation(async () => {
    sut.till.told = told;
  });
  return sut;
};

const setupSutRedeemingTo = (item: string) => setupSutTelling(`${discountTexts.theDiscountAppliesTo} ${item}`);

const setupSutTellingAfterAnEarlierCouponApplied = (told: string) => {
  const sut = setupSutTelling(told);
  sut.till.told = `${discountTexts.theDiscountAppliesTo} ${spicesDiscount.item}`;
  return sut;
};

const redeemThroughTheForm = async (form: VueWrapper, storeShown: string, code: string): Promise<void> => {
  const picker = form.get<HTMLSelectElement>('select');
  picker.element.selectedIndex = [...picker.element.options].findIndex((option) => option.text.trim() === storeShown);
  await picker.trigger('change');
  await form.get('[data-testid="typed-coupon-code"]').setValue(code);
  await form.get('form').trigger('submit');
};

const noStorePicked = '';

const whatTheTillTells = () => queryAllByRole(document.body, 'status').map((told) => told.textContent).join(' ');

describe('Component RedeemCouponForm', () => {
  describe('redeeming the coupon Sue shows', () => {
    it('should redeem the code as typed at the store picked', async () => {
      const { form, till } = setupSut();

      await redeemThroughTheForm(form, "Mike's Groceries, 12 Market Street", '7k3qx 9m2pd');

      expect(till.redeemCoupon).to.have.been.calledWith({ code: '7k3qx 9m2pd', storeName: "Mike's Groceries", storeAddress: '12 Market Street' });
    });
    it('should redeem at another store when Stephanie picks another', async () => {
      const { form, till } = setupSut();

      await redeemThroughTheForm(form, "Stephanie's Market, 8 Orchard Lane", 'R4WZ0-BH8NE');

      expect(till.redeemCoupon).to.have.been.calledWith({ code: 'R4WZ0-BH8NE', storeName: "Stephanie's Market", storeAddress: '8 Orchard Lane' });
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
      it('should tell Stephanie to say which store she is at when none is picked, redeeming nothing', async () => {
        const { form, till } = setupSut();
        vi.mocked(till.noStoreSaid).mockImplementation(() => {
          till.told = discountTexts.sayWhichStoreYouAreAt;
        });

        await redeemThroughTheForm(form, noStorePicked, '7k3qx 9m2pd');

        expect(whatTheTillTells(), 'what the till tells').to.contain(discountTexts.sayWhichStoreYouAreAt);
        expect(vi.mocked(till.redeemCoupon).mock.calls, 'the redemptions asked for').to.deep.equal([]);
      });
    });

    describe('dependency failure', () => {
      it.todo('should tell Stephanie the coupon could not be checked and to try again');
    });

    describe('the rate at the till', () => {
      it.todo('should show the rate the coupon applies at');
    });
  });
  describe('a coupon already used', () => {
    it('should tell Stephanie the coupon has already been used', async () => {
      const { form } = setupSutTelling(discountTexts.couponAlreadyUsed);

      await redeemThroughTheForm(form, "Mike's Groceries, 12 Market Street", '7k3qx 9m2pd');

      expect(whatTheTillTells(), 'what the till tells').to.contain(discountTexts.couponAlreadyUsed);
    });
    it('should not say the discount applies when the coupon has already been used', async () => {
      const { form } = setupSutTellingAfterAnEarlierCouponApplied(discountTexts.couponAlreadyUsed);

      await redeemThroughTheForm(form, "Mike's Groceries, 12 Market Street", '7k3qx 9m2pd');

      expect(whatTheTillTells(), 'what the till tells after an earlier coupon applied').not.to.contain(discountTexts.theDiscountAppliesTo);
    });
  });
  describe('a coupon for another store', () => {
    it('should tell Stephanie the coupon is not for her store', async () => {
      const { form } = setupSutTelling(discountTexts.couponNotForYourStore);

      await redeemThroughTheForm(form, "Stephanie's Market, 8 Orchard Lane", '7k3qx 9m2pd');

      expect(whatTheTillTells(), 'what the till tells').to.contain(discountTexts.couponNotForYourStore);
    });
    it('should not say the discount applies when the coupon is not for her store', async () => {
      const { form } = setupSutTellingAfterAnEarlierCouponApplied(discountTexts.couponNotForYourStore);

      await redeemThroughTheForm(form, "Stephanie's Market, 8 Orchard Lane", '7k3qx 9m2pd');

      expect(whatTheTillTells(), 'what the till tells after an earlier coupon applied').not.to.contain(discountTexts.theDiscountAppliesTo);
    });
  });
});
