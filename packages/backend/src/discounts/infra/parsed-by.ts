import { BadRequestException, HttpStatus, type PipeTransform } from '@nestjs/common';
import type { ZodType } from 'zod';

import type { RequestRejection } from '@app/types/request-rejection';

export class ParsedBy<Request> implements PipeTransform<unknown, Request> {
  constructor(private readonly schema: ZodType<Request>) {}

  transform(value: unknown): Request {
    const parsed = this.schema.safeParse(value, { reportInput: true });
    if (!parsed.success) {
      const issues = parsed.error.issues.filter((issue) => issue.path.length > 0);
      const rejection: RequestRejection = {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Missing or mistyped fields',
        fields: issues.map((issue) => issue.path.join('.')),
        missing: issues.filter((issue) => issue.input === undefined).map((issue) => issue.path.join('.')),
      };
      throw new BadRequestException(rejection);
    }
    return parsed.data;
  }
}
