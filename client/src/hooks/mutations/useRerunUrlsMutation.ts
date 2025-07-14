import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "../../lib/api";
import { URLS_QUERY_KEY } from "../queries/useUrlsQuery";
import { RERUN_URLS_ROUTE } from "../../lib/routes";
import toast from "react-hot-toast";

export const useRerunUrlsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ids: number[]) =>
      request({
        method: "POST",
        url: RERUN_URLS_ROUTE,
        payload: { ids },
      }),
    onSuccess: () => {
      toast.success("URL analysis re-run started.");
      queryClient.invalidateQueries({ queryKey: [URLS_QUERY_KEY] });
    },
  });
};
