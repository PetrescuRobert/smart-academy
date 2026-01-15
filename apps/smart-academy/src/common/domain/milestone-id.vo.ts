import { BaseId } from './base-id.abstract';

export class MilestoneId extends BaseId {
  equals(id: MilestoneId): boolean {
    return id.value === this.value && id instanceof MilestoneId;
  }
}
