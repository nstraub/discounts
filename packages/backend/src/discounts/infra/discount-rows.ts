import { discounts } from './schema.js';

export const theColumnsOfADiscount = {
  id: discounts.id,
  item: discounts.item,
  rate: discounts.rate,
  storeName: discounts.storeName,
  storeAddress: discounts.storeAddress,
  hook: discounts.hook,
};

export const withNoHookWhenNoneIsKept = <Row extends { hook: string | null }>({ hook, ...row }: Row) => (hook === null ? row : { ...row, hook });
