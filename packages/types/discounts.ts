import { z } from 'zod';

export const publishDiscountRequest = z.object({
  item: z.string(),
  rate: z.string(),
  storeName: z.string(),
  storeAddress: z.string(),
  hook: z.string().optional(),
});

export type PublishDiscountRequest = z.infer<typeof publishDiscountRequest>;

export const discountResponse = publishDiscountRequest.extend({ id: z.string() });

export type DiscountResponse = z.infer<typeof discountResponse>;

export const publishedDiscountsResponse = z.array(discountResponse);

export const changeRateRequest = z.object({ rate: z.string() });

export type ChangeRateRequest = z.infer<typeof changeRateRequest>;

export const requestRejection = z.object({
  statusCode: z.number(),
  message: z.string(),
  fields: z.array(z.string()).optional(),
});

export type RequestRejection = z.infer<typeof requestRejection>;
