import { ConflictException, HttpStatus, UnprocessableEntityException } from '@nestjs/common';

import type { RequestRejection } from '@app/types/request-rejection';

import { CouponNotForThisStoreException } from '../application/domain/coupon-not-for-this-store-exception.js';

const alreadyUsed: RequestRejection = { statusCode: HttpStatus.CONFLICT, message: 'This coupon has already been used' };

const notForThisStore: RequestRejection = { statusCode: HttpStatus.UNPROCESSABLE_ENTITY, message: 'This coupon is not for this store' };

export const answerARefusedRedemption = (refusal: unknown): never => {
  if (refusal instanceof CouponNotForThisStoreException) {
    throw new UnprocessableEntityException(notForThisStore);
  }
  throw new ConflictException(alreadyUsed);
};
