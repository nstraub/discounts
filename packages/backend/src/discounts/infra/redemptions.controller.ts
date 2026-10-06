import { Body, ConflictException, Controller, HttpStatus, Inject, Post } from '@nestjs/common';

import { redemptionRequest, redemptionResponse, type RequestRejection } from '@app/types/discounts';

import { DiscountService } from '../application/discount-service.js';

import { ParsedBy } from './parsed-by.js';

const theCodeOfARedemption = redemptionRequest.pick({ code: true });

const alreadyUsed: RequestRejection = { statusCode: HttpStatus.CONFLICT, message: 'This coupon has already been used' };

@Controller('redemptions')
export class RedemptionsController {
  constructor(@Inject(DiscountService) private readonly discounts: DiscountService) {}

  @Post()
  async redeem(@Body(new ParsedBy(theCodeOfARedemption)) request: { code: string }) {
    try {
      const redeemed = await this.discounts.redeemCoupon(request.code);
      return redemptionResponse.parse(redeemed.toJSON());
    } catch {
      throw new ConflictException(alreadyUsed);
    }
  }
}
