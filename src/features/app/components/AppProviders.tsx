import { QueryProvider } from "@/features/api/providers/QueryProvider/QueryProvider";
import { ReactNode } from "react";

export interface AppProvidersProps {
  children?: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => (
  <QueryProvider>{children}</QueryProvider>
);
