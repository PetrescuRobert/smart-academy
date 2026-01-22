import { Entity, Id } from '@smart-academy/ddd-shared-kernel';
import { MilestoneId } from '../../common/domain/milestone-id.vo';
import { DomainException } from '../../common/exceptions/domain.exception';
import { Grade } from './value-objects/grade.vo';

export type AchievementProps = {
  milestoneId: MilestoneId;
  grade: Grade;
  completed: boolean;
};

export type CreateAchivementProps = AchievementProps & {
  id: Id;
};

export class Achievement extends Entity<AchievementProps> {
  protected _id: Id;
  public validate(): void {
    throw new Error('Method not implemented.');
  }

  constructor(create: CreateAchivementProps) {
    super({
      id: create.id,
      props: {
        completed: false,
        milestoneId: create.milestoneId,
        grade: create.grade,
      },
    });
  }

  gradeMilestone(grade: number) {
    this.props.grade = new Grade(grade);
  }

  complete() {
    if (this.props.completed) {
      throw new DomainException(
        'Invalid Achievement state for complete operation!'
      );
    }

    this.props.completed = true;
  }
}
