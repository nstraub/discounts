import { describe, it } from 'vitest';

describe('POST /discounts with a piece left out', () => {
  describe('the pieces missing', () => {
    it.todo('should answer 400 listing as missing each of the item, the rate, the store name and the store address left out');
    it.todo('should list a rate left out as missing and not list a rate of 150 as missing, fields naming the rate in both');
    it.todo('should answer 400 listing the item, the store name and the store address as missing when each is empty text');
    it.todo('should answer with a body matching the error schema when pieces are missing');
    it.todo('should publish nothing when a piece is missing, listing no discount afterwards');
    it.todo('should publish DiscountPublicationRejected on the application event emitter for a piece made only of blank space');
  });
});
