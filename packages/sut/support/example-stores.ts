import { Store } from '@backend/discounts/application/domain/store';

import { spicesDiscount, stephaniesProduceDiscount, theStoreOf } from './example-discounts';

export const atTheSpicesStore = new Store(theStoreOf(spicesDiscount));

export const atStephaniesStore = new Store(theStoreOf(stephaniesProduceDiscount));
