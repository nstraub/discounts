import { describe, it } from 'vitest';

describe('class Discount', () => {
  describe('publishing a discount with a piece left out', () => {
    describe('the rejection', () => {
      it.todo('should raise DiscountPublicationRejected naming each piece left out as missing');
      it.todo('should not raise DiscountPublished when a piece is left out');
    });

    describe('empty', () => {
      it.todo('should refuse an item that is empty text, its rejection naming the item as missing');
      it.todo('should refuse a store name that is empty text, its rejection naming the store name as missing');
      it.todo('should refuse a store address that is empty text, its rejection naming the store address as missing');
      it.todo('should refuse a rate that is empty text or only blank space, its rejection naming the rate as missing, not as not valid');
    });

    describe('combination', () => {
      it.todo('should name at once an item and a store address both made only of blank space as missing');
    });
  });
});
