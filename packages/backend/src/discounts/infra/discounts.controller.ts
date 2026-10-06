import { Body, Controller, Get, HttpCode, HttpStatus, Inject, Param, Patch, Post, Res } from '@nestjs/common';

import { publishDiscountRequest, type PublishDiscountRequest } from '@app/types/discounts';

import { DiscountService } from '../application/discount-service.js';
import { DiscountDetails } from '../application/domain/discount-details.js';

import { ParsedBy } from './parsed-by.js';

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

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async changeRate(@Param('id') id: string, @Body('rate') rate: string): Promise<void> {
    await this.discounts.changeRate(id, rate);
  }

  @Get()
  async published() {
    const discounts = await this.discounts.published();
    return discounts.map((discount) => discount.toJSON());
  }
}
