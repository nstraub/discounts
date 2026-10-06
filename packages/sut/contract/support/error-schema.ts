import { requestRejection } from '@app/types/request-rejection';

export const bodiesNotMatchingTheErrorSchema = (answers: ReadonlyArray<{ body: unknown }>) =>
  answers.map((answer) => answer.body).filter((body) => !requestRejection.safeParse(body).success);

export const theFieldsNamedBy = (...answers: ReadonlyArray<{ body: unknown }>) => answers.map((answer) => requestRejection.parse(answer.body).fields);
