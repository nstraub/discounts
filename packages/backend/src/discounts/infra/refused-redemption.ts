import { HttpStatus } from '@nestjs/common';

import type { RequestRejection } from '@app/types/request-rejection';

import { CouponAlreadyUsedException } from '../application/domain/coupon-already-used-exception.js';
import { CouponNotForThisStoreException } from '../application/domain/coupon-not-for-this-store-exception.js';
import { NoCouponHasTheCodeException } from '../application/domain/no-coupon-has-the-code-exception.js';

import { answeredWith, answerFrom } from './answered-refusals.js';

const alreadyUsed: RequestRejection = { statusCode: HttpStatus.CONFLICT, message: 'This coupon has already been used' };

const notForThisStore: RequestRejection = { statusCode: HttpStatus.UNPROCESSABLE_ENTITY, message: 'This coupon is not for this store' };

const noCouponHasTheCode: RequestRejection = { statusCode: HttpStatus.NOT_FOUND, message: 'No coupon has this code' };

export const answerARefusedRedemption = answerFrom([
  answeredWith(CouponNotForThisStoreException, () => notForThisStore),
  answeredWith(NoCouponHasTheCodeException, () => noCouponHasTheCode),
  answeredWith(CouponAlreadyUsedException, () => alreadyUsed),
]);
