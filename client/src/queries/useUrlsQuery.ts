import { useQuery } from "@tanstack/react-query";
import { request } from "../lib/api";
import { URLS_ROUTE } from "../lib/routes";

export const URLS_QUERY_KEY = "urls";
/**
 * Custom hook to fetch URLs from the API.
 * Uses React Query for data fetching and caching.
 *
 * @returns {Object} The query result containing URLs data.
 */

export const useUrlsQuery = () => {
  return useQuery({
    queryKey: [URLS_QUERY_KEY],
    queryFn: () => request({ method: "GET", url: URLS_ROUTE }),
  });
};
