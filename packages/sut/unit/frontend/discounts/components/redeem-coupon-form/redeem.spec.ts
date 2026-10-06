import { describe, it } from 'vitest';

describe('Component RedeemCouponForm', () => {
  describe('redeeming the coupon Sue shows', () => {
    it.todo('should redeem the code as typed at the store picked');
    it.todo('should say the discount applies once the coupon is redeemed');
    it.todo('should name the item the discount is for once the coupon is redeemed');

    describe('state', () => {
      it.todo('should say nothing applies before a coupon is redeemed');
      it.todo('should tell Stephanie to say which store she is at when none is picked, redeeming nothing');
    });

    describe('dependency failure', () => {
      it.todo('should tell Stephanie the coupon could not be checked and to try again');
    });

    describe('the rate at the till', () => {
      it.todo('should show the rate the coupon applies at');
    });
  });
});
