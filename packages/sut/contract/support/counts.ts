import { spicesDiscount, theStoreOf } from '@sut/support/example-discounts';

import type { Http } from './app';

export const countTheStoreOf = (http: Http, discount: typeof spicesDiscount = spicesDiscount) =>
  http.post('/stores/counts').send(theStoreOf(discount));
