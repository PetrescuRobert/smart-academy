import { Filter } from '../../../common/utils/filters/types';

type _student_fielter_fields = {
  firstName: string;
  lastName: string;
  email: string;
};

export type FindStudentsQuery = {
  filters: Filter<_student_fielter_fields>[];
  sort: 'asc' | 'desc';
  pageIndex: number;
  pageSize: number;
};
