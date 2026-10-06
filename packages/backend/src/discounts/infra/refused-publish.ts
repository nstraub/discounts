import { BadRequestException, HttpStatus } from '@nestjs/common';

import type { RequestRejection } from '@app/types/request-rejection';

import { PiecesMissingException } from '../application/domain/pieces-missing-exception.js';
import { RateNotValidException } from '../application/domain/rate-not-valid-exception.js';

const rateNotValid: RequestRejection = { statusCode: HttpStatus.BAD_REQUEST, message: 'The rate is not valid', fields: ['rate'] };

const piecesMissing = (pieces: readonly string[]): RequestRejection => ({
  statusCode: HttpStatus.BAD_REQUEST,
  message: 'Missing fields',
  fields: [...pieces],
  missing: [...pieces],
});

export const answerARefusedPublish = (refusal: unknown): never => {
  if (refusal instanceof PiecesMissingException) {
    throw new BadRequestException(piecesMissing(refusal.pieces));
  }
  if (refusal instanceof RateNotValidException) {
    throw new BadRequestException(rateNotValid);
  }
  throw refusal;
};
