import { Body, Controller, Inject, Post } from '@nestjs/common';

import { DiscountService } from '../application/discount-service.js';

@Controller('stores/counts')
export class StoreCountsController {
  constructor(@Inject(DiscountService) private readonly discounts: DiscountService) {}

  @Post()
  async count(@Body() request: { storeName: string; storeAddress: string }) {
    const counted = await this.discounts.count(request);
    return counted.map((sales) => sales.toJSON());
  }
}
