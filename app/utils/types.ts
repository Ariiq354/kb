export type ExtractFetchData<T>
  = T extends Ref<{ data: infer D } | undefined>
    ? D
    : never;

export interface PageSearch {
  page?: number;
  search?: string;
}
