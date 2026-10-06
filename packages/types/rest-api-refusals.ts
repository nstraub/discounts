import { requestRejection } from '@app/types/request-rejection';

const badRequest = 400;

class RestApiException extends Error {}

export class UnprocessableContentException extends RestApiException {
  static readonly status = 422;
}

export class NotFoundException extends RestApiException {
  static readonly status = 404;
}

const refusalsOfTheirOwn = [UnprocessableContentException, NotFoundException];

const theRefusalFor = (status: number) => refusalsOfTheirOwn.find((refusal) => refusal.status === status) ?? RestApiException;

export class BadRequestException extends RestApiException {
  constructor(
    message: string,
    readonly missing: readonly string[],
    readonly fields: readonly string[],
  ) {
    super(message);
  }
}

export const refuseANotOkAnswer = async (request: string, response: Response): Promise<void> => {
  const answered = `${request} answered ${response.status}`;
  if (response.status === badRequest) {
    const { missing, fields } = requestRejection.parse(await response.json());
    throw new BadRequestException(answered, missing ?? [], fields ?? []);
  }
  if (!response.ok) {
    const Refusal = theRefusalFor(response.status);
    throw new Refusal(answered);
  }
};
