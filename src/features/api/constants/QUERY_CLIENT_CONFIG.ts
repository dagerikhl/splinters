import { QueryClientConfig } from "@tanstack/query-core";

export const QUERY_CLIENT_CONFIG: QueryClientConfig = {
  defaultOptions: {
    queries: {
      suspense: true,
      queryFn: ({ queryKey }) =>
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/${queryKey}`).then(
          (response) => response.json(),
        ),
      staleTime: Infinity,
    },
  },
};
