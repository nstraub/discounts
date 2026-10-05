export interface RestApi {
  get<Response>(path: string): Promise<Response>;
  put(path: string, body: unknown): Promise<void>;
}

export class FetchRestApi implements RestApi {
  constructor(private readonly baseUrl: string) {}

  async get<Response>(path: string): Promise<Response> {
    const response = await fetch(`${this.baseUrl}${path}`);
    return (await response.json()) as Response;
  }

  async put(path: string, body: unknown): Promise<void> {
    await fetch(`${this.baseUrl}${path}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }
}
