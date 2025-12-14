// src/common/response.dto.ts
export class PaginatedResponse<T> {
  data: T[];
  meta?: {
    pagination?: {
      page: number;
      limit: number;
      totalItems: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
    filters?: Record<string, unknown>;
    sort?: { field: string; order: 'asc' | 'desc' };
  };
}

export class StandardResponse<T> {
  data: T;
}
