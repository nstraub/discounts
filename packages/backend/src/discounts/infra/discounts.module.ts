import { Module } from '@nestjs/common';

import { DatabaseModule } from './database.module.js';
import { DiscountsController } from './discounts.controller.js';
import { GreetingController } from './greeting.controller.js';

@Module({
  imports: [DatabaseModule],
  controllers: [GreetingController, DiscountsController],
})
export class DiscountsModule {}
