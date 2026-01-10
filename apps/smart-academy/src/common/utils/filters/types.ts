export type Filter<T, K extends keyof T = keyof T> = {
  [P in K]:
    | { field: P; operator: 'eq'; value: T[P] } // eq accepts the exact field type
    | (T[P] extends string
        ? { field: P; operator: 'like'; value: string }
        : never) // like only for strings
    | {
        field: P;
        operator: 'in';
        value: (T[P] extends (infer E)[] ? E : T[P])[];
      } // in accepts an array of element type
    | (T[P] extends number | Date
        ? { field: P; operator: 'lt' | 'lte' | 'gt' | 'gte'; value: T[P] }
        : never); // lt|gt only for number|Date
}[K];
