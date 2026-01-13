import { SortByDto } from '../../student/presenters/http/dtos/sort-by.dto';

// src/common/response.dto.ts
export class PaginatedResponse<T> {
  data: T[];
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
