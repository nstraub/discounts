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
  if (response.status === badRequest) {
    throw new BadRequestException(`${request} answered ${response.status}`, ['item']);
  }
  if (response.status === unprocessableContent) {
    throw new UnprocessableContentException(`${request} answered ${response.status}`);
  }
  if (!response.ok) {
    throw new RestApiException(`${request} answered ${response.status}`);
  }
};
