import { Body, ConflictException, Controller, HttpStatus, Inject, Post, UnprocessableEntityException } from '@nestjs/common';

import { redemptionRequest, redemptionResponse, type RedemptionRequest, type RequestRejection } from '@app/types/discounts';

import { DiscountService } from '../application/discount-service.js';
import { CouponNotForThisStoreException } from '../application/domain/coupon-not-for-this-store-exception.js';
import { Store } from '../application/domain/store.js';

import { ParsedBy } from './parsed-by.js';

const alreadyUsed: RequestRejection = { statusCode: HttpStatus.CONFLICT, message: 'This coupon has already been used' };

const notForThisStore: RequestRejection = { statusCode: HttpStatus.UNPROCESSABLE_ENTITY, message: 'This coupon is not for this store' };

@Controller('redemptions')
export class RedemptionsController {
  constructor(@Inject(DiscountService) private readonly discounts: DiscountService) {}

  @Post()
  async redeem(@Body(new ParsedBy(redemptionRequest)) { code, ...store }: RedemptionRequest) {
    try {
      const redeemed = await this.discounts.redeemCoupon(code, new Store(store));
      return redemptionResponse.parse(redeemed.toJSON());
    } catch (refusal) {
      if (refusal instanceof CouponNotForThisStoreException) {
        throw new UnprocessableEntityException(notForThisStore);
      }
      throw new ConflictException(alreadyUsed);
    }
  }
}
