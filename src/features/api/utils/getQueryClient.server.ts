import { QUERY_CLIENT_CONFIG } from "@/features/api/constants/QUERY_CLIENT_CONFIG";
import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

export const getQueryClient = cache(() => new QueryClient(QUERY_CLIENT_CONFIG));
