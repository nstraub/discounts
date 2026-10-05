import { z } from 'zod';

export const publishDiscountRequest = z.object({
  item: z.string(),
  rate: z.number(),
  storeName: z.string(),
  storeAddress: z.string(),
});

export type PublishDiscountRequest = z.infer<typeof publishDiscountRequest>;
