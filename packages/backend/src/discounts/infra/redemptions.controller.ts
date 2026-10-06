import { Body, Controller, Inject, Post } from '@nestjs/common';

import { DiscountService } from '../application/discount-service.js';

@Controller('redemptions')
export class RedemptionsController {
  constructor(@Inject(DiscountService) private readonly discounts: DiscountService) {}

  @Post()
  async redeem(@Body('code') code: string) {
    await this.discounts.redeemCoupon(code);
    return { item: 'Peruvian spices' };
  }
}
