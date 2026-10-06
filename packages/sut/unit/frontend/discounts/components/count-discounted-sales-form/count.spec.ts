import { describe, it } from 'vitest';

describe('Component CountDiscountedSalesForm', () => {
  describe('counting the sales of the store picked', () => {
    it.todo('should count the discounted sales of the store picked');
    it.todo('should name the item of each discount counted');
    it.todo('should show the rate of each discount counted');
    it.todo('should show the number of discounted sales counted for each discount under its caption');

    describe('state', () => {
      it.todo('should show no count before the sales are counted');
      it.todo('should count once when Rodrigo counts twice before the first count answers');
    });

    describe('empty', () => {
      it.todo('should show a discount with no sales since the last count with none counted');
    });

    describe('dependency failure', () => {
      it.todo('should tell Rodrigo the sales could not be counted and to try again');
    });
  });
});
