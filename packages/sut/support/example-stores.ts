import { Store } from '@backend/discounts/application/domain/store';

import { spicesDiscount, theStoreOf } from './example-discounts';

export const atTheSpicesStore = new Store(theStoreOf(spicesDiscount));
