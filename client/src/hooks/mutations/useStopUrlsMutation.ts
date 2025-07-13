import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "../../lib/api";
import { URLS_QUERY_KEY } from "../queries/useUrlsQuery";
import { STOP_ANALYSIS_ROUTE } from "../../lib/routes";

export const useStopUrlsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) =>
      request({
        method: "POST",
        url: STOP_ANALYSIS_ROUTE,
        payload: { ids },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [URLS_QUERY_KEY] });
    },
  });
};
