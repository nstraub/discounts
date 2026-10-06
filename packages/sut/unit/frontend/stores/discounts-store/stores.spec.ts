import { describe, it } from 'vitest';

describe('Store discounts', () => {
  describe('the stores that publish discounts', () => {
    describe('combination', () => {
      it.todo('should list a store once when it has published more than one discount');
      it.todo('should list a store with the same name at another address as another store');
    });

    describe('empty', () => {
      it.todo('should list no store when no discount is published');
    });
  });
});
