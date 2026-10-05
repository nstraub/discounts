import { Body, Controller, Get, Inject, Post, Res } from '@nestjs/common';

import { publishDiscountRequest, type PublishDiscountRequest } from '@app/types/discounts';

import { DiscountService } from '../application/discount-service.js';
import { DiscountDetails } from '../application/domain/discount-details.js';

import { ParsedBy } from './request-rejection.js';

type Located = { location(url: string): unknown };

@Controller('discounts')
export class DiscountsController {
  constructor(@Inject(DiscountService) private readonly discounts: DiscountService) {}

  @Post()
  async publish(@Body(new ParsedBy(publishDiscountRequest)) request: PublishDiscountRequest, @Res({ passthrough: true }) response: Located) {
    const discount = await this.discounts.publish(new DiscountDetails(request));
    const published = discount.toJSON();
    response.location(`/discounts/${published.id}`);
    return published;
  }

  @Get()
  async published() {
    const discounts = await this.discounts.published();
    return discounts.map((discount) => discount.toJSON());
  }
}
