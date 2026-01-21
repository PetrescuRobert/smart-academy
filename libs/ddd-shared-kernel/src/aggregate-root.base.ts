import { DomainEvent } from './domain-event.base';
import { Entity } from './entity.base';

export abstract class AggregateRoot<EntityProps> extends Entity<EntityProps> {
  private _domainEvents: DomainEvent[] = [];

  protected addEvent(domainEvent: DomainEvent): void {
    this._domainEvents.push(domainEvent);
  }

  /**
   * Retrieves all accumulated domain events and clears the internal event list.
   *
   * @returns An array of domain events that were accumulated since the last pull.
   */
  public pullEvents(): DomainEvent[] {
    const events = [...this._domainEvents];
    this.clearEvents();
    return events;
  }

  /**
   * Clears all accumulated domain events from the aggregate root.
   */
  public clearEvents(): void {
    this._domainEvents = [];
  }
}
