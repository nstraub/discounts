import { Module } from '@nestjs/common';
import { EventEmitter2, EventEmitterModule } from '@nestjs/event-emitter';

import { DiscountService } from '../application/discount-service.js';
import { DiscountFactory } from '../application/domain/discount-factory.js';

import { database, DatabaseModule, type Database } from './database.module.js';
import { DiscountDrizzleRepository } from './discount-drizzle-repository.js';
import { DiscountsController } from './discounts.controller.js';
import { EventEmitterDomainEventPublisher } from './event-emitter-domain-event-publisher.js';
import { GreetingController } from './greeting.controller.js';

@Module({
  imports: [DatabaseModule, EventEmitterModule.forRoot()],
  controllers: [GreetingController, DiscountsController],
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
