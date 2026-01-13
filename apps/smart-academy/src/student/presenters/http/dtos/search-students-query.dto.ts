import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import type { Filter } from '../../../../common/utils/filters/types';
import type { FindStudentsQuery } from '../../../application/commands/find-students.query';
import { SortByDto } from './sort-by.dto';
import { StudentFilterDto } from './student-filter.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

type StudentFields = {
  firstName: string;
  lastName: string;
  email: string;
};

export class SearchStudentsQuery {
  @ApiPropertyOptional({ isArray: true })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => StudentFilterDto)
  @IsOptional()
  filters: StudentFilterDto[] = [];

  @ApiPropertyOptional()
  @ValidateNested()
  @Type(() => SortByDto)
  @IsOptional()
  sort: SortByDto;

  @ApiPropertyOptional({ default: 10, type: 'integer' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit = 10;

  @ApiPropertyOptional({ default: 0, type: 'integer' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  offset = 0;

  toDomain(): FindStudentsQuery {
    return {
      filters: this.filters as Filter<StudentFields>[],
      sort: this.sort ?? { by: 'email', direction: 'asc' },
      limit: this.limit,
      offset: this.offset,
    };
  }
}
