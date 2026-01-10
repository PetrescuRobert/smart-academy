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
import { SortByDto } from './sort-by.dto';

type StudentFields = {
  firstName: string;
  lastName: string;
  email: string;
};

export class SearchStudentsQuery {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudentFilterDto)
  @IsOptional()
  filters: StudentFilterDto[] = [];

  @ValidateNested()
  @Type(() => SortByDto)
  @IsOptional()
  sort: SortByDto;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit = 10;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  offset = 0;

  toDomain(): FindStudentsQuery {
    return {
      filters: this.filters as unknown as Filter<StudentFields>[],
      sort: this.sort ?? { by: 'email', direction: 'asc' },
      limit: this.limit,
      offset: this.offset,
    };
  }
}
