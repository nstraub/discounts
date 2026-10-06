import { requestRejection } from '@app/types/discounts';

export const bodiesNotMatchingTheErrorSchema = (answers: ReadonlyArray<{ body: unknown }>) =>
  answers.map((answer) => answer.body).filter((body) => !requestRejection.safeParse(body).success);
