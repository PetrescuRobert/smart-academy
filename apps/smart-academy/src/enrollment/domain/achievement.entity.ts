import { AchievementId } from '../../common/domain/achievement-id.vo';
import { MilestoneId } from '../../common/domain/milestone-id.vo';
import { DomainException } from '../../common/exceptions/domain.exception';
import { Grade } from './value-objects/grade.vo';

export class Achievement {
  public readonly id: AchievementId;
  public readonly milestoneId: MilestoneId;
  private _grade: Grade;
  private _completed = false;

  constructor(id: AchievementId, milestone: MilestoneId) {
    this.id = id;
    this.milestoneId = milestone;
  }

  gradeMilestone(grade: number) {
    this._grade = new Grade(grade);
  }

  complete() {
    if (this._completed) {
      throw new DomainException(
        'Invalid Achievement state for complete operation!'
      );
    }

    this._completed = true;
  }

  get grade() {
    return this._grade;
  }

  get completed() {
    return this._completed;
  }
}
