import { BadRequestException, HttpStatus } from '@nestjs/common';

import type { RequestRejection } from '@app/types/request-rejection';

const rateNotValid: RequestRejection = { statusCode: HttpStatus.BAD_REQUEST, message: 'The rate is not valid', fields: ['rate'] };

export const answerARefusedPublish = (): never => {
  throw new BadRequestException(rateNotValid);
};
