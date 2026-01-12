import { Filter } from '../../../common/utils/filters/types';

type _student_fielter_fields = {
  firstName: string;
  lastName: string;
  email: string;
};

type SortBy = {
  by: keyof _student_fielter_fields | 'id';
  direction: 'asc' | 'desc';
};

export type FindStudentsQuery = {
  filters: Filter<_student_fielter_fields>[];
  sort: SortBy;
  limit: number;
  offset: number;
};
