import { z } from 'zod';

export const requestRejection = z.object({
  statusCode: z.number(),
  message: z.string(),
  fields: z.array(z.string()).optional(),
});

export type RequestRejection = z.infer<typeof requestRejection>;
