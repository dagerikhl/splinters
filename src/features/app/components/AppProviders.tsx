"use client";

import { QueryProvider } from "@/features/app/providers/QueryProvider/QueryProvider";
import { ReactNode } from "react";

export interface AppProvidersProps {
  children?: ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => (
  <QueryProvider>{children}</QueryProvider>
);
