import { describe, it } from 'vitest';

describe('POST /stores/counts', () => {
  describe('success', () => {
    it.todo('should answer 201 with the discount\'s id, item and rate and the number of its coupons redeemed since the last count');
    it.todo('should answer with a body matching the count response schema');
    it.todo('should publish DiscountedSalesCounted on the application event emitter for the discount counted');
    it.todo('should answer a count made after another with only the coupons redeemed since that one');
  });

  describe('strictness', () => {
    it.todo('should keep the count request schema no stricter than any text for a store\'s name and address');
    it.todo('should keep the count response schema no stricter than a discount\'s id, item and rate and a number of sales');
  });

  describe('malformed request', () => {
    it.todo('should answer 400 naming the store\'s name and address when they are missing or not text, never a 500');
    it.todo('should answer 400 for a JSON body that is an array, a string, a number or null');
    it.todo('should answer 400 for a body that is not valid JSON');
    it.todo('should answer every error with a body matching the error schema');
  });

  describe('not found', () => {
    it.todo('should answer 404 for a store no published discount names, counting nothing');
  });

  describe('A1 input boundary', () => {
    it.todo('should answer as for a store nobody published at when its name is 10 000 characters long, never a 500');
  });

  describe('A3 handle guessing (no accounts)', () => {
    it.todo('should answer with no coupon token of the coupons counted');
  });

  describe('A4 concurrency', () => {
    it.todo('should count each redeemed coupon once between two counts of a store arriving at the same moment');
    it.todo('should count a coupon redeemed during a count once, in that count or the next');
  });

  describe('a coupon taken at another store\'s till', () => {
    it.todo('should count a coupon redeemed at another store\'s till with the store of its discount');
  });

  describe('A5 resource exhaustion', () => {
    it.todo('should answer 503 with a body matching the error schema when the store\'s discounts cannot be counted, restarting nothing');
  });
});
