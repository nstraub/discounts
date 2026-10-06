import { HttpStatus } from '@nestjs/common';

import type { RequestRejection } from '@app/types/request-rejection';

import { NoSuchDiscountException } from '../application/domain/no-such-discount-exception.js';

import { answeredWith, answerFrom } from './answered-refusals.js';

const noSuchDiscount: RequestRejection = { statusCode: HttpStatus.NOT_FOUND, message: 'There is no such discount' };

export const answerAMissingDiscount = answerFrom([answeredWith(NoSuchDiscountException, () => noSuchDiscount)]);
