import { Module } from '@nestjs/common';

import { DatabaseModule } from './database.module.js';
import { GreetingController } from './greeting.controller.js';

@Module({
  imports: [DatabaseModule],
  controllers: [GreetingController],
})
export class DiscountsModule {}
