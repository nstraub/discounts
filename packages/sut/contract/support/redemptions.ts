import { spicesDiscount } from '@sut/support/example-discounts';

import { type Http, setupSut } from './app';

type ExampleDiscount = typeof spicesDiscount;

export const setupSutWithACouponFor = async (discount: ExampleDiscount = spicesDiscount) => {
  const sut = await setupSut();
  const published: { id: string } = (await sut.http.post('/discounts').send(discount)).body;
  const code: string = (await sut.http.post(`/discounts/${published.id}/coupons`).send({})).body.token;
  return { ...sut, published, code };
};

export const setupSutWithAnotherCouponOfTheSameDiscount = async () => {
  const sut = await setupSutWithACouponFor();
  const other: string = (await sut.http.post(`/discounts/${sut.published.id}/coupons`).send({})).body.token;
  return { ...sut, other };
};

export const redeemAtTheStoreOf = (http: Http, code: string, discount: ExampleDiscount = spicesDiscount) =>
  http.post('/redemptions').send({ code, storeName: discount.storeName, storeAddress: discount.storeAddress });
