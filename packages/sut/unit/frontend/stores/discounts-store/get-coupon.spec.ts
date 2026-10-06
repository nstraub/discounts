import { describe, it } from 'vitest';

describe('Store discounts', () => {
  describe('getting a coupon for a discount', () => {
    it.todo('should hand the discount over to get a coupon for it');
    it.todo('should hold the coupon got once it is issued');
    it.todo('should keep the coupon got when the page is opened again');

    describe('dependency failure', () => {
      it.todo('should hold that a coupon could not be got when it cannot be issued');
    });
  });
});
