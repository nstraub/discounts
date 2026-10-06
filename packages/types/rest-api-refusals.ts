import { requestRejection } from '@app/types/request-rejection';

const badRequest = 400;

const unprocessableContent = 422;

class RestApiException extends Error {}

export class UnprocessableContentException extends RestApiException {}

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
    throw new BadRequestException(answered, requestRejection.parse(await response.json()).missing ?? [], ['rate']);
  }
  if (response.status === unprocessableContent) {
    throw new UnprocessableContentException(answered);
  }
  if (!response.ok) {
    throw new RestApiException(answered);
  }
};
