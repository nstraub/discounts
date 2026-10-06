import { Controller, Post } from '@nestjs/common';

@Controller('redemptions')
export class RedemptionsController {
  @Post()
  redeem() {
    return { item: 'Peruvian spices' };
  }
}
