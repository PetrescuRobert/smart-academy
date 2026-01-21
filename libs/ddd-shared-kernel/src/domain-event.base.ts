import { DomainException } from './domain-exception';
import { isEmpty } from './lib/util-functions';

type DomainEventMetadata = {
  readonly timestamp: number;
  readonly message: string;
};

export type DomainEventProps<T> = Omit<T, 'id' | 'metadata'> & {
  eventId: string;
  aggregateId: string;
  metadata?: DomainEventMetadata;
};

export abstract class DomainEvent {
  public readonly eventId: string;
  public readonly aggregateId: string;
  public readonly metadata: DomainEventMetadata;

  constructor(props: DomainEventProps<unknown>) {
    if (isEmpty(props)) {
      throw new DomainException('DomainEvent props should not be empty');
    }
    this.eventId = props.eventId;
    this.aggregateId = props.aggregateId;
    this.metadata = {
      timestamp: props.metadata?.timestamp ?? Date.now(),
      message: props.metadata?.message ?? '',
    };
  }
}
