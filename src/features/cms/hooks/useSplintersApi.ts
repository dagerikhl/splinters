import { Splinters } from "@/features/cms/types/Splinters";
import { useQuery } from "@tanstack/react-query";

export const useSplintersApi = () => {
  return useQuery<Splinters>({ queryKey: ["splinters"] });
};
