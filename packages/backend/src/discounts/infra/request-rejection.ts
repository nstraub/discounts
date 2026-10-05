import { BadRequestException, type PipeTransform } from '@nestjs/common';
import type { ZodType } from 'zod';

import type { RequestRejection } from '@app/types/discounts';

export class ParsedBy<Request> implements PipeTransform<unknown, Request> {
  constructor(private readonly schema: ZodType<Request>) {}

  transform(value: unknown): Request {
    const parsed = this.schema.safeParse(value);
    if (!parsed.success) {
      const rejection: RequestRejection = { fields: parsed.error.issues.map((issue) => issue.path.join('.')) };
      throw new BadRequestException(rejection);
    }
    return parsed.data;
  }
}
