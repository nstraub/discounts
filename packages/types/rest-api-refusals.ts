import { requestRejection } from '@app/types/request-rejection';

const badRequest = 400;

const notFound = 404;

const unprocessableContent = 422;

class RestApiException extends Error {}

export class UnprocessableContentException extends RestApiException {}

export class NotFoundException extends RestApiException {}

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
  if (response.status === unprocessableContent) {
    throw new UnprocessableContentException(answered);
  }
  if (response.status === notFound) {
    throw new NotFoundException(answered);
  }
  if (!response.ok) {
    throw new RestApiException(answered);
  }
};
