import { Splinters } from "@/features/cms/types/Splinters";
import { useEffect, useState } from "react";

interface UseSplintersApiReturnType {
  data?: Splinters;
  error?: Error;
  isLoading: boolean;
}

export const useSplintersApi = (): UseSplintersApiReturnType => {
  const [data, setData] = useState<Splinters | undefined>(undefined);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    fetch("/api/splinters")
      .then((response) => response.json())
      .then((response) => {
        setData(response);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { data, error, isLoading };
};
