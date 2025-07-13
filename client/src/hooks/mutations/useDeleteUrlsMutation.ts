import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "../../lib/api";
import { URLS_QUERY_KEY } from "../queries/useUrlsQuery";
import { URLS_ROUTE } from "../../lib/routes";

export const useDeleteUrlsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) =>
      request({
        method: "DELETE",
        url: URLS_ROUTE,
        payload: { ids },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [URLS_QUERY_KEY] });
    },
  });
};
