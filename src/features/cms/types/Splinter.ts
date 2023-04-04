import { SplinterState } from "@/features/cms/enums/SplinterState";
import { SplinterType } from "@/features/cms/enums/SplinterType";

export interface Splinter {
  id: string;
  name: string;
  type: SplinterType;
  state?: SplinterState;
  vessel?: string;
  splinters?: Splinter[];
  combinations?: Record<string, string[]>;
  slivers?: string[];
}
