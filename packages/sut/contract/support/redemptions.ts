import { spicesDiscount } from '@sut/support/example-discounts';

import { type Http, setupSut } from './app';

type ExampleDiscount = typeof spicesDiscount;

const issueACouponFor = async (http: Http, published: { id: string }): Promise<string> =>
  (await http.post(`/discounts/${published.id}/coupons`).send({})).body.token;

export const setupSutWithACouponFor = async (discount: ExampleDiscount = spicesDiscount) => {
  const sut = await setupSut();
  const published: { id: string } = (await sut.http.post('/discounts').send(discount)).body;
  const code = await issueACouponFor(sut.http, published);
  return { ...sut, published, code };
};

export const setupSutWithAnotherCouponOfTheSameDiscount = async () => {
  const sut = await setupSutWithACouponFor();
  const other = await issueACouponFor(sut.http, sut.published);
  return { ...sut, other };
};

export const redeemAtTheStoreOf = (http: Http, code: string, discount: ExampleDiscount = spicesDiscount) =>
  http.post('/redemptions').send({ code, storeName: discount.storeName, storeAddress: discount.storeAddress });

export const couponsIssuedFor = (http: Http, published: { id: string }, howMany: number): Promise<string[]> =>
  Promise.all(Array.from({ length: howMany }, () => issueACouponFor(http, published)));
