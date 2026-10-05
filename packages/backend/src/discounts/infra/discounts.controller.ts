import { Controller, Post, Res } from '@nestjs/common';

type Located = { location(url: string): unknown };

@Controller('discounts')
export class DiscountsController {
  @Post()
  publish(@Res({ passthrough: true }) response: Located) {
    response.location('/discounts/a-discount');
    return { id: 'a-discount', item: 'Peruvian spices', rate: 20, storeName: "Mike's Groceries", storeAddress: '12 Market Street' };
  }
}
