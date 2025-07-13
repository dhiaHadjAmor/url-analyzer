import { useQuery } from "@tanstack/react-query";
import { request } from "../../lib/api";
import { URLS_ROUTE } from "../../lib/routes";
import type { UrlsResponse } from "../../lib/types";

export const URLS_QUERY_KEY = "urls";

type UseUrlsQueryParams = {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  search?: string;
};

/**
 * Custom hook to fetch URLs from the API.
 * Uses React Query for data fetching and caching.
 *
 * @returns {Object} The query result containing URLs data.
 */

export const useUrlsQuery = (params: UseUrlsQueryParams) => {
  return useQuery({
    queryKey: [URLS_QUERY_KEY, params],
    queryFn: () =>
      request<UrlsResponse>({ method: "GET", url: URLS_ROUTE, params }),
    placeholderData: (keepPreviousData) => keepPreviousData,
  });
};
