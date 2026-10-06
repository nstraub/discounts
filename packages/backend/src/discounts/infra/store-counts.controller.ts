import { Body, Controller, Inject, Post } from '@nestjs/common';

import { countRequest, type CountRequest } from '@app/types/discounts';

import { DiscountService } from '../application/discount-service.js';

import { ParsedBy } from './parsed-by.js';

@Controller('stores/counts')
export class StoreCountsController {
  constructor(@Inject(DiscountService) private readonly discounts: DiscountService) {}

  @Post()
  async count(@Body(new ParsedBy(countRequest)) request: CountRequest) {
    const counted = await this.discounts.count(request);
    return counted.map((sales) => sales.toJSON());
  }
}
