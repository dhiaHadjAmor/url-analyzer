import { useQuery } from "@tanstack/react-query";
import { request } from "../../lib/api";
import type { UrlDetailResponse } from "../../lib/types";
import { URLS_ROUTE } from "../../lib/routes";

const URL_DETAILS_QUERY_KEY = "urlDetails";

export const useUrlDetailsQuery = (id: number) =>
  useQuery({
    queryKey: [URL_DETAILS_QUERY_KEY, id],
    queryFn: () =>
      request<UrlDetailResponse>({
        method: "GET",
        url: `${URLS_ROUTE}/${id}`,
      }),
  });
