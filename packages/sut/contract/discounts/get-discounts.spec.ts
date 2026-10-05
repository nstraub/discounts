// Schema: the published-discounts response schema in @app/types, imported by the route too.
import { describe, it } from 'vitest';

describe('GET /discounts', () => {
  describe('success', () => {
    it.todo('should answer 200 with every published discount as JSON');
    it.todo('should answer 200 with an empty list when nothing is published');
    it.todo('should answer with a body matching the published-discounts response schema');
    it.todo('should list both of two identical discounts, each with its own id');
  });

  describe('strictness', () => {
    it.todo('should keep the published-discounts response schema no stricter than Discount');
  });
});
