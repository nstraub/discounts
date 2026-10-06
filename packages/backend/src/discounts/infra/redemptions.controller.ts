import { Body, Controller, Inject, Post } from '@nestjs/common';

import { redemptionResponse } from '@app/types/discounts';

import { DiscountService } from '../application/discount-service.js';

@Controller('redemptions')
export class RedemptionsController {
  constructor(@Inject(DiscountService) private readonly discounts: DiscountService) {}

  @Post()
  async redeem(@Body('code') code: string) {
    const redeemed = await this.discounts.redeemCoupon(code);
    return redemptionResponse.parse(redeemed.toJSON());
  }
}
