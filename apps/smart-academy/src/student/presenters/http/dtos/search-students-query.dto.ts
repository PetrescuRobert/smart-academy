import { Type } from 'class-transformer';
import {
  IsArray,
  ValidateNested,
  IsIn,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';
import { StudentFilterDto } from './student-filter.dto';
import type { FindStudentsQuery } from '../../../application/commands/find-students.query';
import type { Filter } from '../../../../common/utils/filters/types';

type StudentFields = {
  firstName: string;
  lastName: string;
  email: string;
};

export class SearchStudentsQuery {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudentFilterDto)
  filters: StudentFilterDto[] = [];

  @IsIn(['asc', 'desc'])
  @IsOptional()
  sort: 'asc' | 'desc' = 'asc';

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  pageIndex = 0;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  pageSize = 10;

  toDomain(): FindStudentsQuery {
    return {
      filters: this.filters as unknown as Filter<StudentFields>[],
      sort: this.sort,
      pageIndex: Number(this.pageIndex),
      pageSize: Number(this.pageSize),
    };
  }
}
