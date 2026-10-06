import { Body, Controller, Inject, Post } from '@nestjs/common';

import { redemptionRequest, redemptionResponse } from '@app/types/discounts';

import { DiscountService } from '../application/discount-service.js';

import { ParsedBy } from './parsed-by.js';

const theCodeOfARedemption = redemptionRequest.pick({ code: true });

@Controller('redemptions')
export class RedemptionsController {
  constructor(@Inject(DiscountService) private readonly discounts: DiscountService) {}

  @Post()
  async redeem(@Body(new ParsedBy(theCodeOfARedemption)) request: { code: string }) {
    const redeemed = await this.discounts.redeemCoupon(request.code);
    return redemptionResponse.parse(redeemed.toJSON());
  }
}
