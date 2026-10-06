import { describe, it } from 'vitest';

describe('POST /discounts with a rate that is not valid', () => {
  describe('the rate refused', () => {
    it.todo('should answer 400 naming the rate as not valid for 150, 100.5, 12.25, 0 and -10');
    it.todo('should answer with a body matching the error schema when the rate is not valid');
    it.todo('should publish nothing when the rate is not valid, listing no discount afterwards');
    it.todo('should publish DiscountPublicationRejected on the application event emitter for the rate refused');
    it.todo('should publish no DiscountPublicationRejected when the request schema refuses the body before any rule decides');
  });

  describe('combination', () => {
    it.todo('should name at once the rate as not valid and the item as missing when both are wrong');
  });
});
