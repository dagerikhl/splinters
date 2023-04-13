import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";

// TODO As of now, both the server and client fetches this request, slowing down the rendering
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      suspense: true,
      queryFn: ({ queryKey }) =>
        fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/${queryKey}`).then(
          (response) => response.json()
        ),
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
