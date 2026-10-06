import { HttpStatus } from '@nestjs/common';

import type { RequestRejection } from '@app/types/request-rejection';

import { PiecesMissingException } from '../application/domain/pieces-missing-exception.js';
import { RateNotValidException } from '../application/domain/rate-not-valid-exception.js';

import { answeredWith, answerFrom } from './answered-refusals.js';

const rateNotValid: RequestRejection = { statusCode: HttpStatus.BAD_REQUEST, message: 'The rate is not valid', fields: ['rate'] };

const piecesMissing = ({ pieces }: PiecesMissingException): RequestRejection => ({
  statusCode: HttpStatus.BAD_REQUEST,
  message: 'Missing fields',
  fields: [...pieces],
  missing: [...pieces],
});

export const answerARefusedPublish = answerFrom([
  answeredWith(PiecesMissingException, piecesMissing),
  answeredWith(RateNotValidException, () => rateNotValid),
]);
