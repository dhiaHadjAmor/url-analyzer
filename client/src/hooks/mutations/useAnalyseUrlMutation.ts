import { useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "../../lib/api";
import { URLS_QUERY_KEY } from "../queries/useUrlsQuery";
import { ANALYSE_URL_ROUTE } from "../../lib/routes";
import toast from "react-hot-toast";

/**
 * Custom hook to analyse a URL.
 * Uses React Query for mutation and cache invalidation.
 *
 * @returns {Object} The mutation object containing the mutate function and status.
 */
export const useAnalyseUrlMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (address: string) =>
      request({
        method: "POST",
        url: ANALYSE_URL_ROUTE,
        payload: { address },
      }),
    onSuccess: () => {
      toast.success("URL analysis started.");
      queryClient.invalidateQueries({ queryKey: [URLS_QUERY_KEY] });
    },
  });
};
