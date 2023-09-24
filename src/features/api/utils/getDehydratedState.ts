import { getQueryClient } from "@/features/api/utils/getQueryClient.server";
import { dehydrate, DehydratedState } from "@tanstack/query-core";
import { QueryKey } from "@tanstack/query-core/src/types";

export const getDehydratedState = async <TQueryKey extends QueryKey = QueryKey>(
  queryKey: TQueryKey,
): Promise<DehydratedState> => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(queryKey);

  return dehydrate(queryClient);
};
