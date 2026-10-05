import { z } from 'zod';

export const publishDiscountRequest = z.object({
  item: z.string(),
  rate: z.number(),
  storeName: z.string(),
  storeAddress: z.string(),
});

export type PublishDiscountRequest = z.infer<typeof publishDiscountRequest>;

export const discountResponse = publishDiscountRequest.extend({ id: z.string() });

export type DiscountResponse = z.infer<typeof discountResponse>;

export const requestRejection = z.object({
  statusCode: z.number(),
  message: z.string(),
  fields: z.array(z.string()).optional(),
});

export type RequestRejection = z.infer<typeof requestRejection>;
