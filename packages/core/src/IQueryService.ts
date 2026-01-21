import { Ok } from "@avuny/utils";
import { IBaseRepository } from "./IRepository.js";

export type FilteredPaginatedList<IFilters, TOrderBy> = {
  page?: number;
  pageSize?: number;
  orderBy?: TOrderBy;
  filters: IFilters;
  context: { userId: string; requestId: string; organizationId: string };
};

export interface IQueryService<R extends IBaseRepository> {
  filteredPaginatedList: <
    TFilter extends Parameters<R["findMany"]>[0]["where"],
    TOrderBy extends Parameters<R["findMany"]>[0]["orderBy"],
  >(
    params: FilteredPaginatedList<TFilter, TOrderBy>,
  ) => Promise<
    Ok<{
      list: Awaited<ReturnType<R["findMany"]>>;
      totalCount: number;
      totalPages: number;
    }>
  >;

  findById: (params: {
    id: string;
    context: {
      userId: string;
      requestId: string;
      organizationId: string;
    };
  }) => Promise<Ok<Awaited<ReturnType<R["findUnique"]>>>>;
}
