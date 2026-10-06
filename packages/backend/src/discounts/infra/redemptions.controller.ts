import { Body, Controller, Inject, Post } from '@nestjs/common';

import { redemptionRequest, redemptionResponse, type RedemptionRequest } from '@app/types/discounts';

import { DiscountService } from '../application/discount-service.js';
import { Store } from '../application/domain/store.js';

import { ParsedBy } from './parsed-by.js';
import { answerARefusedRedemption } from './refused-redemption.js';

@Controller('redemptions')
export class RedemptionsController {
  constructor(@Inject(DiscountService) private readonly discounts: DiscountService) {}

  @Post()
  async redeem(@Body(new ParsedBy(redemptionRequest)) { code, ...store }: RedemptionRequest) {
    const redeemed = await this.discounts.redeemCoupon(code, new Store(store)).catch(answerARefusedRedemption);
    return redemptionResponse.parse(redeemed.toJSON());
  }
}
