import { HttpException } from '@nestjs/common';

import type { RequestRejection } from '@app/types/request-rejection';

type RefusalClass<Refusal> = new (...args: never[]) => Refusal;

type RefusalAnswer = (refusal: unknown) => void;

export const answeredWith = <Refusal>(refused: RefusalClass<Refusal>, rejectionOf: (refusal: Refusal) => RequestRejection): RefusalAnswer => (refusal) => {
  if (refusal instanceof refused) {
    const rejection = rejectionOf(refusal);
    throw new HttpException(rejection, rejection.statusCode);
  }
};

export const answerFrom = (answers: readonly RefusalAnswer[]) => (refusal: unknown): never => {
  answers.forEach((answer) => answer(refusal));
  throw refusal;
};
