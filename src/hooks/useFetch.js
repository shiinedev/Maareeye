import { useEffect, useState, useCallback } from "react";

export function useFetch(fetchFunction, dependencies = []) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (typeof fetchFunction !== "function") return;
    setIsLoading(true);
    try {
      const result = await fetchFunction();
      setData(result);
    } catch (err) {
      console.error("Fetch error:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    if(typeof fetchFunction === "function") {
      fetchData();
    }
   
  }, [fetchData]);

  return { data, isLoading, error,  fetchData };
}
