import { useState } from "react";
import type { SortOrder, UrlSortField } from "../../../types/Url";

type TableQueryParams = {
  page: number;
  limit: number;
  sortBy: UrlSortField;
  sortOrder: SortOrder;
  search: string;
};

type UseTableQueryParamsReturn = {
  params: TableQueryParams;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSortBy: (field: UrlSortField) => void;
  setSortOrder: (order: SortOrder) => void;
  setSearch: (search: string) => void;
};

const defaultParams: TableQueryParams = {
  page: 1,
  limit: 10,
  sortBy: "created_at",
  sortOrder: "desc",
  search: "",
};

const useTableQueryParams = (): UseTableQueryParamsReturn => {
  const [params, setParams] = useState<TableQueryParams>(defaultParams);

  const setPage = (page: number) => setParams((p) => ({ ...p, page }));
  const setLimit = (limit: number) => setParams((p) => ({ ...p, limit }));
  const setSortBy = (sortBy: UrlSortField) =>
    setParams((p) => ({ ...p, sortBy }));
  const setSortOrder = (sortOrder: SortOrder) =>
    setParams((p) => ({ ...p, sortOrder }));
  const setSearch = (search: string) =>
    setParams((p) => ({ ...p, search, page: 1 }));

  return {
    params,
    setPage,
    setLimit,
    setSortBy,
    setSortOrder,
    setSearch,
  };
};

export default useTableQueryParams;
