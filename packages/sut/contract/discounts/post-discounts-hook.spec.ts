import { describe, it } from 'vitest';

describe('POST /discounts with a hook', () => {
  describe('success', () => {
    it.todo('should publish the hook the request gives and answer with it');
    it.todo('should answer with no hook when the request gives none');
  });

  describe('empty', () => {
    it.todo('should publish no hook when the hook is null, empty or only blank space');
  });

  describe('type', () => {
    it.todo('should answer 400 naming the hook when it is a number, an array or an object, never a 500');
  });

  describe('A1 input boundary', () => {
    it.todo('should answer 400 naming the hook when it is longer than allowed');
  });
});
