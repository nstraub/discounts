import { HttpStatus, NotFoundException } from '@nestjs/common';

import type { RequestRejection } from '@app/types/request-rejection';

import { NoSuchDiscountException } from '../application/domain/no-such-discount-exception.js';

const noSuchDiscount: RequestRejection = { statusCode: HttpStatus.NOT_FOUND, message: 'There is no such discount' };

export const answerAMissingDiscount = (refusal: unknown): never => {
  if (refusal instanceof NoSuchDiscountException) {
    throw new NotFoundException(noSuchDiscount);
  }
  throw refusal;
};
