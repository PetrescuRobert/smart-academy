import { ApiProperty } from '@nestjs/swagger';
import {
  IsIn,
  IsString,
  IsArray,
  ArrayNotEmpty,
  ValidateIf,
  IsNotEmpty,
} from 'class-validator';

export class StudentFilterDto {
  @ApiProperty()
  @IsIn(['firstName', 'lastName', 'email'])
  field: 'firstName' | 'lastName' | 'email';

  @ApiProperty()
  @IsIn(['eq', 'like', 'in'])
  operator: 'eq' | 'like' | 'in';

  @ApiProperty()
  @ValidateIf((o) => o.operator === 'in')
  @IsArray()
  @ValidateIf((o) => o.operator === 'in')
  @ArrayNotEmpty()
  @ValidateIf((o) => o.operator === 'in')
  @IsString({ each: true })
  @ValidateIf((o) => o.operator !== 'in')
  @IsString()
  @ValidateIf((o) => o.operator !== 'in')
  @IsNotEmpty()
  value: string[] | string;
}
