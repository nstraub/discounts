import { describe, it } from 'vitest';

describe('POST /redemptions', () => {
  describe('a code nobody issued', () => {
    it.todo('should answer 404 with a body matching the error schema for a well-formed code nobody issued');
    it.todo('should keep every discount and coupon as it was when the code was never issued');
    it.todo('should publish nothing on the application event emitter for a code nobody issued');
  });

  describe('empty', () => {
    it.todo('should answer 400 naming the code when it is empty or only blank space');
  });

  describe('A2 injection', () => {
    it.todo('should answer a code written as SQL as for a code nobody issued, every discount and coupon left as it was');
  });

  describe('A3 handle guessing (no accounts)', () => {
    it.todo('should answer 404 for a code one character away from an issued coupon\'s, that coupon staying unused');
  });
});
