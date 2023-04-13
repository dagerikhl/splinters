import { Splinters } from "@/features/cms/types/Splinters";
import { useQuery } from "@tanstack/react-query";

export const useSplintersApi = () =>
  useQuery<Splinters, unknown, Splinters>({ queryKey: ["splinters"] });
