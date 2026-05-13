import type {
  DomainEvent,
  DomainEventPublisher,
} from "../../application/ports/domain-event-publisher.js";

export class InMemoryDomainEventPublisher implements DomainEventPublisher {
  private readonly publishedEvents: DomainEvent[] = [];

  public async publish(event: DomainEvent): Promise<void> {
    this.publishedEvents.push(event);
  }

  public all(): DomainEvent[] {
    return [...this.publishedEvents];
  }

  public clear(): void {
    this.publishedEvents.length = 0;
  }
}
