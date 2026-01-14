import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional } from 'class-validator';

export class SortByDto {
  @ApiPropertyOptional()
  @IsIn(['id', 'firstName', 'lastName', 'email'])
  @IsOptional()
  by: 'id' | 'firstName' | 'lastName' | 'email' = 'email';

  @ApiPropertyOptional()
  @IsIn(['asc', 'desc'])
  @IsOptional()
  direction: 'asc' | 'desc' = 'asc';
}
