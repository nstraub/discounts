import { BadRequestException, Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Patch, Post, Res } from '@nestjs/common';

import {
  changeRateRequest,
  type ChangeRateRequest,
  couponResponse,
  discountResponse,
  publishDiscountRequest,
  type PublishDiscountRequest,
  publishedDiscountsResponse,
} from '@app/types/discounts';
import type { RequestRejection } from '@app/types/request-rejection';

import { DiscountService } from '../application/discount-service.js';
import { DiscountDetails } from '../application/domain/discount-details.js';

import { ParsedBy } from './parsed-by.js';

type Located = { location(url: string): unknown };

const rateNotValid: RequestRejection = { statusCode: HttpStatus.BAD_REQUEST, message: 'The rate is not valid', fields: ['rate'] };

@Controller('discounts')
export class DiscountsController {
  constructor(@Inject(DiscountService) private readonly discounts: DiscountService) {}

  @Post()
  async publish(@Body(new ParsedBy(publishDiscountRequest)) request: PublishDiscountRequest, @Res({ passthrough: true }) response: Located) {
    const discount = await this.discounts.publish(new DiscountDetails(request)).catch(() => {
      throw new BadRequestException(rateNotValid);
    });
    const published = discountResponse.parse(discount.toJSON());
    response.location(`/discounts/${published.id}`);
    return published;
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async changeRate(@Param('id') id: string, @Body(new ParsedBy(changeRateRequest)) request: ChangeRateRequest): Promise<void> {
    await this.discounts.changeRate(id, request.rate);
  }

  @Post(':id/coupons')
  async issueCoupon(@Param('id') id: string) {
    const coupon = await this.discounts.issueCoupon(id);
    return couponResponse.parse(coupon.toJSON());
  }

  @Get()
  async published() {
    const discounts = await this.discounts.published();
    return publishedDiscountsResponse.parse(discounts.map((discount) => discount.toJSON()));
  }
}
