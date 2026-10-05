interface DomainEvent {
  readonly name: string;
}

export interface DomainEventPublisher {
  publish(event: DomainEvent): void;
}
