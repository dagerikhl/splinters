import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
      // TODO Fix TypeError: Failed to parse URL from /api/splinters (how to call internal APIs?)
      queryFn: ({ queryKey }) =>
        fetch(`/api/${queryKey}`).then((response) => response.json()),
      staleTime: Infinity,
    },
  },
});

export interface QueryProviderProps {
  children?: ReactNode;
}

export const QueryProvider = ({ children }: QueryProviderProps) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);
