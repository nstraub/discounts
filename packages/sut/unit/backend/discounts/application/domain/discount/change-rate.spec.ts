import { describe, it } from 'vitest';

describe('class Discount', () => {
  describe('changing its rate', () => {
    describe('the discount changed', () => {
      it.todo('should hold the new rate once its rate is changed');
      it.todo('should raise DiscountRateChanged carrying its id and its new rate');
      it.todo('should keep its item, store name and store address when its rate changes');
    });

    describe('state', () => {
      it.todo('should hold the later rate when its rate is changed twice');
      it.todo('should accept a change to the rate it already has, staying as it is');
    });

    describe('empty', () => {
      it.todo('should refuse a new rate made only of blank space, its rejection naming the rate as missing, keeping its rate');
    });

    describe('type', () => {
      it.todo('should refuse a new rate that is not a number, its rejection naming the rate as not valid, keeping its rate');
    });
  });
});
