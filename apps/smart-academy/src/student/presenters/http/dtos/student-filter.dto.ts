import {
  IsIn,
  IsString,
  IsArray,
  ArrayNotEmpty,
  ValidateIf,
  IsNotEmpty,
} from 'class-validator';

export class StudentFilterDto {
  @IsIn(['firstName', 'lastName', 'email'])
  field: 'firstName' | 'lastName' | 'email';

  @IsIn(['eq', 'like', 'in'])
  operator: 'eq' | 'like' | 'in';

  @ValidateIf((o) => o.operator === 'in')
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  @ValidateIf((o) => o.operator !== 'in')
  @IsString()
  @IsNotEmpty()
  value: string[] | string;
}
