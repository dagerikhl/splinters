import { getQueryClient } from "@/features/api/utils/getQueryClient.server";
import { dehydrate, DehydratedState, QueryKey } from "@tanstack/react-query";

export const getDehydratedState = async <TQueryKey extends QueryKey = QueryKey>(
  queryKey: TQueryKey,
): Promise<DehydratedState> => {
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({ queryKey });

  return dehydrate(queryClient);
};
