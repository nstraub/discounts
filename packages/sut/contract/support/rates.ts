import type { Http } from './app';

export const changeTheRateOf = (http: Http, published: { id: string }, rate: string) => http.patch(`/discounts/${published.id}`).send({ rate });
