"use client";

import { SPLINTERS_QK } from "@/features/cms/constants/query-keys";
import { Splinters } from "@/features/cms/types/Splinters";
import { useQuery } from "@tanstack/react-query";

// TODO Impl. some way to get and alter CMS content, consider state vs. (initial) data (Sanity? Hygraph?)
export const useSplintersApi = () =>
  useQuery<Splinters, unknown, Splinters>({ queryKey: SPLINTERS_QK });
