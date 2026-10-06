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

export const couponResponse = z.object({ token: z.string(), storeName: z.string() });

export type CouponResponse = z.infer<typeof couponResponse>;

export const redemptionRequest = z.object({ code: z.string(), storeName: z.string(), storeAddress: z.string() });

export type RedemptionRequest = z.infer<typeof redemptionRequest>;

export const redemptionResponse = z.object({ item: z.string() });

export type RedemptionResponse = z.infer<typeof redemptionResponse>;

export const requestRejection = z.object({
  statusCode: z.number(),
  message: z.string(),
  fields: z.array(z.string()).optional(),
});

export type RequestRejection = z.infer<typeof requestRejection>;

export const countResponse = z.array(z.object({ id: z.string(), item: z.string(), rate: z.string(), discountedSales: z.number() }));
