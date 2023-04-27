"use client";

import { SHARDS_QK } from "@/features/cms/shards/constants/query-keys";
import { IShards } from "@/features/cms/shards/types/IShards";
import { useQuery } from "@tanstack/react-query";

// TODO Impl. some way to get and alter CMS content, consider state vs. (initial) data (Sanity? Hygraph?)
export const useShardsApi = () =>
  useQuery<IShards, unknown, IShards>({ queryKey: SHARDS_QK });
