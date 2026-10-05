import { Controller, Inject, Post, Res } from '@nestjs/common';

import { DiscountService } from '../application/discount-service.js';
import { DiscountDetails } from '../application/domain/discount-details.js';

type Located = { location(url: string): unknown };

@Controller('discounts')
export class DiscountsController {
  constructor(@Inject(DiscountService) private readonly discounts: DiscountService) {}

  @Post()
  async publish(@Res({ passthrough: true }) response: Located) {
    const discount = await this.discounts.publish(
      new DiscountDetails({ item: 'Peruvian spices', rate: 20, storeName: "Mike's Groceries", storeAddress: '12 Market Street' }),
    );
    const published = discount.toJSON();
    response.location(`/discounts/${published.id}`);
    return published;
  }
}
