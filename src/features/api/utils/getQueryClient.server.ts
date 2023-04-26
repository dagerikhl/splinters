import { QUERY_CLIENT_CONFIG } from "@/features/api/constants/QUERY_CLIENT_CONFIG";
import { QueryClient } from "@tanstack/query-core";
import { cache } from "react";

export const getQueryClient = cache(() => new QueryClient(QUERY_CLIENT_CONFIG));
