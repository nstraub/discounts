import { createTestingPinia } from '@pinia/testing';
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { mock } from 'vitest-mock-extended';

import type { CouponResponse, DiscountResponse } from '@app/types/discounts';
import type { RestApi } from '@app/types/rest-api';
import IssuedCoupon from '@frontend/discounts/components/IssuedCoupon.vue';
import PublishDiscountForm from '@frontend/discounts/components/PublishDiscountForm.vue';
import DiscountsView from '@frontend/discounts/views/DiscountsView.vue';
import { restApiKey } from '@frontend/rest-api-key';
import { couponForTheProduceDiscount, couponForTheSpicesDiscount, publishedProduceDiscount, publishedSpicesDiscount } from '@sut/support/example-discounts';

const openThePageWhenPublished = async (published: DiscountResponse[], restApi = mock<RestApi>()) => {
  restApi.get.mockResolvedValue(published);
  const view = mount(DiscountsView, {
    global: { plugins: [createTestingPinia({ createSpy: vi.fn, stubActions: false })], provide: { [restApiKey]: restApi } },
  });
  await flushPromises();
  return view;
};

const openThePageIssuing = (coupon: CouponResponse, published: DiscountResponse[]) => {
  const restApi = mock<RestApi>();
  restApi.post.mockResolvedValue(coupon);
  return openThePageWhenPublished(published, restApi);
};

const decideToTry = async (view: VueWrapper): Promise<void> => {
  await view.get('[data-testid="get-coupon"]').trigger('click');
  await flushPromises();
};

describe('View DiscountsView', () => {
  describe('opening the page', () => {
    it('should show the published discounts when the page opens', async () => {
      const view = await openThePageWhenPublished([
        { id: 'spices-id', item: 'Peruvian spices', rate: '20', storeName: "Mike's Groceries", storeAddress: '12 Market Street' },
      ]);

      expect(view.findAll('[data-testid="published-item"]').map((item) => item.text())).to.deep.equal(['Peruvian spices']);
    });
    it('should show other published discounts when others are published', async () => {
      const view = await openThePageWhenPublished([
        { id: 'produce-id', item: 'Fresh produce', rate: '10', storeName: 'Corner Grocery', storeAddress: '3 Hill Road' },
        { id: 'herbs-id', item: 'Andean herbs', rate: '15', storeName: 'Corner Grocery', storeAddress: '3 Hill Road' },
      ]);

      expect(view.findAll('[data-testid="published-item"]').map((item) => item.text())).to.deep.equal(['Fresh produce', 'Andean herbs']);
    });
    it('should offer the form to publish a discount beside them', async () => {
      const view = await openThePageWhenPublished([]);

      expect(view.findComponent(PublishDiscountForm).exists()).to.equal(true);
    });
  });
  describe('the coupon Sue gets', () => {
    it('should show the coupon Sue has got once she decides to try a discount', async () => {
      const view = await openThePageIssuing(couponForTheSpicesDiscount, [publishedSpicesDiscount]);

      await decideToTry(view);

      expect(view.findAllComponents(IssuedCoupon).map((shown) => shown.props('coupon'))).to.deep.equal([couponForTheSpicesDiscount]);
    });
    it('should show the other coupon Sue has got for another discount', async () => {
      const view = await openThePageIssuing(couponForTheProduceDiscount, [publishedProduceDiscount]);

      await decideToTry(view);

      expect(view.findAllComponents(IssuedCoupon).map((shown) => shown.props('coupon'))).to.deep.equal([couponForTheProduceDiscount]);
    });
    it('should show no coupon until Sue decides to try a discount', async () => {
      const view = await openThePageIssuing(couponForTheSpicesDiscount, [publishedSpicesDiscount]);

      expect(view.findComponent(IssuedCoupon).exists(), 'a coupon shown before Sue decides').to.equal(false);
    });
  });
});
