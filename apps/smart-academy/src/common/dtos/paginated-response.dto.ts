import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SortByDto } from '../../student/presenters/http/dtos/sort-by.dto';

// src/common/response.dto.ts

export class PaginatedResponse<T> {
  @ApiProperty({ isArray: true })
  data: T[];
  @ApiPropertyOptional({
    type: 'object',
    properties: {
      pagination: {
        type: 'object',
        properties: {
          limit: { type: 'integer' },
          offset: { type: 'integer' },
          totalItems: { type: 'integer' },
          hasNextPage: { type: 'boolean' },
          hasPrevPage: { type: 'boolean' },
        },
      },
      filters: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            field: { type: 'string' },
            operator: { type: 'string' },
            value: {
              oneOf: [
                { type: 'string' },
                { type: 'array', items: { type: 'string' } },
              ],
            },
          },
        },
      },
      sort: {
        type: 'object',
        properties: { by: { type: 'string' }, direction: { type: 'string' } },
      },
    },
  })
  meta?: {
    pagination?: {
      limit: number;
      offset: number;
      totalItems: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
    filters?: { field: string; operator: string; value: string | string[] }[];
    sort?: { by: string; direction: 'asc' | 'desc' };
  };

  private constructor(
    data: T[],
    limit: number,
    offset: number,
    totalItems: number,
    sort: SortByDto,
    filters: { field: string; operator: string; value: string | string[] }[]
  ) {
    this.data = data;
    this.meta = {
      pagination: {
        limit,
        offset,
        totalItems,
        hasNextPage: limit + offset <= totalItems,
        hasPrevPage: offset > 0,
      },
      filters,
      sort,
    };
  }

  public static of<T>(
    data: T[],
    limit: number,
    offset: number,
    totalItems: number,
    sort: SortByDto,
    filters: { field: string; operator: string; value: string | string[] }[]
  ) {
    return new PaginatedResponse<T>(
      data,
      limit,
      offset,
      totalItems,
      sort,
      filters
    );
  }
}
