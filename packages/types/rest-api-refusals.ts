const unprocessableContent = 422;

class RestApiException extends Error {}

export class UnprocessableContentException extends RestApiException {}

export const refuseANotOkAnswer = (request: string, response: Response): void => {
  if (response.status === unprocessableContent) {
    throw new UnprocessableContentException(`${request} answered ${response.status}`);
  }
  if (!response.ok) {
    throw new RestApiException(`${request} answered ${response.status}`);
  }
};
