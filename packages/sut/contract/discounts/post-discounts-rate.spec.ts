import { describe, it } from 'vitest';

describe('POST /discounts with a rate written another way', () => {
  describe('type', () => {
    it.todo('should answer 400 naming the rate, or publish it, when the rate is sent as a JSON number, never a 500');
  });

  describe('A1 input boundary', () => {
    it.todo('should answer 400 naming the rate when it is 10 000 characters long');
  });
});
