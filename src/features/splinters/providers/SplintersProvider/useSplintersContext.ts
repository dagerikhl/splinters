import { SplintersContext } from "@/features/splinters/providers/SplintersProvider/SplintersContext";
import { useContext } from "react";

export const useSplintersContext = () => useContext(SplintersContext);
