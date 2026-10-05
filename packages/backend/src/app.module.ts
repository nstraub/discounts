import { Module } from '@nestjs/common';

import { DiscountsModule } from './discounts/infra/discounts.module.js';

@Module({
  imports: [DiscountsModule],
})
export class AppModule {}
