import { describe, it } from 'vitest';

describe('Component PublishedDiscounts', () => {
  describe('showing a published discount', () => {
    it.todo('should show its item');
    it.todo('should show its rate as a percentage');
    it.todo('should show its store name');
    it.todo('should show its store address');
    it.todo('should show the item, store name and store address without their surrounding spaces');
  });

  describe('empty', () => {
    it.todo('should say in one short line that nothing is published when there is no discount');
    it.todo('should show one entry per discount when several are published, two identical discounts included');
  });

  describe('A2 injection', () => {
    it.todo('should show an item, store name and store address written as markup as plain text, never as markup');
  });
});
