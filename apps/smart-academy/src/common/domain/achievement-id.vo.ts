import { BaseId } from './base-id.abstract';

export class AchievementId extends BaseId {
  equals(id: AchievementId): boolean {
    return this.value === id.value && id instanceof AchievementId;
  }
}
