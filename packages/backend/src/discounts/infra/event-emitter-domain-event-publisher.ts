import type { EventEmitter2 } from '@nestjs/event-emitter';

import type { DomainEventPublisher } from '../application/domain/domain-event-publisher.js';

export class EventEmitterDomainEventPublisher implements DomainEventPublisher {
  constructor(private readonly emitter: EventEmitter2) {}

  publish(event: Parameters<DomainEventPublisher['publish']>[0]): void {
    this.emitter.emit(event.name, event);
  }
}
