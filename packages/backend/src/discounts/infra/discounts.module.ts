import { Module } from '@nestjs/common';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';

import { DiscountService } from '../application/discount-service.js';
import { DiscountFactory } from '../application/domain/discount-factory.js';

import { database, DatabaseModule, type Database } from './database.module.js';
import { DiscountDrizzleRepository } from './discount-drizzle-repository.js';
import { DiscountsController } from './discounts.controller.js';
import { EventEmitterDomainEventPublisher } from './event-emitter-domain-event-publisher.js';
import { GreetingController } from './greeting.controller.js';
import { RedemptionsController } from './redemptions.controller.js';
import { StoreCountsController } from './store-counts.controller.js';

@Module({
  imports: [DatabaseModule, EventEmitterModule.forRoot()],
  controllers: [GreetingController, DiscountsController, RedemptionsController, StoreCountsController],
  providers: [
    {
      provide: DiscountFactory,
      useFactory: (emitter: EventEmitter2) => new DiscountFactory(new EventEmitterDomainEventPublisher(emitter)),
      inject: [EventEmitter2],
    },
    {
      provide: DiscountService,
      useFactory: (factory: DiscountFactory, db: Database) =>
        new DiscountService(factory, new DiscountDrizzleRepository(db, factory), (values) => crypto.getRandomValues(values)),
      inject: [DiscountFactory, database],
    },
  ],
})
export class DiscountsModule {}
