import { describe, it } from 'vitest';

describe('POST /redemptions', () => {
  describe('success', () => {
    it.todo('should answer 201 with the item of the discount the coupon is for');
    it.todo('should answer with a body matching the redemption response schema');
    it.todo('should publish CouponRedeemed on the application event emitter for the coupon redeemed');
    it.todo('should keep the coupon redeemed and its discount\'s other coupons unused');
    it.todo('should redeem a coupon whose code is sent in lower case, in two groups');
  });

  describe('strictness', () => {
    it.todo('should keep the redemption request schema no stricter than any text for a code and a store\'s name and address');
    it.todo('should keep the redemption response schema no stricter than the item a discount has');
  });

  describe('malformed request', () => {
    it.todo('should answer 400 naming the code when it is missing or not text, never a 500');
    it.todo('should answer 400 for a JSON body that is an array, a string, a number or null');
    it.todo('should answer 400 for a body that is not valid JSON');
    it.todo('should answer every error with a body matching the error schema');
  });

  describe('A1 input boundary', () => {
    it.todo('should answer as for a coupon nobody issued when the code is 10 000 characters long, never a 500');
  });

  describe('A3 handle guessing (no accounts)', () => {
    it.todo('should answer with no coupon token, neither the one redeemed nor another');
    it.todo('should give the same answer to a malformed code and to a well-formed one nobody issued');
    it.todo('should throttle codes tried from one source far faster than anyone takes coupons at a till');
  });

  describe('A4 concurrency', () => {
    it.todo('should redeem a coupon once when it is used twice at the same moment');
  });

  describe('A5 resource exhaustion', () => {
    it.todo('should answer 503 with a body matching the error schema when the coupon cannot be checked, the coupon staying unused');
  });

  describe('the rate at the till', () => {
    it.todo('should answer with the rate the coupon applies at');
  });
});
