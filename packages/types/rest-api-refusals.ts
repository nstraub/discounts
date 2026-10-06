const badRequest = 400;

const unprocessableContent = 422;

class RestApiException extends Error {}

export class UnprocessableContentException extends RestApiException {}

export class BadRequestException extends RestApiException {
  constructor(
    message: string,
    readonly missing: readonly string[],
  ) {
    super(message);
  }
}

export const refuseANotOkAnswer = (request: string, response: Response): void => {
  const answered = `${request} answered ${response.status}`;
  if (response.status === badRequest) {
    throw new BadRequestException(answered, ['item']);
  }
  if (response.status === unprocessableContent) {
    throw new UnprocessableContentException(answered);
  }
  if (!response.ok) {
    throw new RestApiException(answered);
  }
};
