export interface RestApi {
  get<Response>(path: string): Promise<Response>;
  put(path: string, body: unknown): Promise<void>;
  post<Response>(path: string, body: unknown): Promise<Response>;
  patch(path: string, body: unknown): Promise<void>;
}

class RestApiException extends Error {}

export class UnprocessableContentException extends RestApiException {}

export class FetchRestApi implements RestApi {
  constructor(private readonly baseUrl: string) {}

  async get<Response>(path: string): Promise<Response> {
    const response = await fetch(`${this.baseUrl}${path}`);
    return this.bodyOfAnOkAnswer<Response>(`GET ${path}`, response);
  }

  async put(path: string, body: unknown): Promise<void> {
    await this.sendAsJson('PUT', path, body);
  }

  async post<Response>(path: string, body: unknown): Promise<Response> {
    const response = await this.sendAsJson('POST', path, body);
    return this.bodyOfAnOkAnswer<Response>(`POST ${path}`, response);
  }

  async patch(path: string, body: unknown): Promise<void> {
    const response = await this.sendAsJson('PATCH', path, body);
    this.refuseANotOkAnswer(`PATCH ${path}`, response);
  }

  private sendAsJson(method: string, path: string, body: unknown): Promise<Response> {
    return fetch(`${this.baseUrl}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  private async bodyOfAnOkAnswer<Body>(request: string, response: Response): Promise<Body> {
    this.refuseANotOkAnswer(request, response);
    return (await response.json()) as Body;
  }

  private refuseANotOkAnswer(request: string, response: Response): void {
    if (!response.ok) {
      throw new UnprocessableContentException(`${request} answered ${response.status}`);
    }
  }
}
