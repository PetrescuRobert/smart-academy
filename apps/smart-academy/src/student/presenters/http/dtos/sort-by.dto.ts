import { IsIn, IsOptional } from 'class-validator';

export class SortByDto {
  @IsIn(['id', 'firstName', 'lastName', 'email'])
  @IsOptional()
  by: 'id' | 'firstName' | 'lastName' | 'email' = 'email';
  @IsIn(['asc', 'desc'])
  @IsOptional()
  direction: 'asc' | 'desc' = 'asc';
}
