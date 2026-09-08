import { useState, useEffect } from "react";
import { satpamService } from "../services/satpamService";

export const useMitraOptions = () => {
  const [mitraOptions, setMitraOptions] = useState<any[]>([]);
  const [hasMoreMitra, setHasMoreMitra] = useState(false);
  const [nextCursorMitra, setNextCursorMitra] = useState<string | null>(null);
  const [loadingMoreMitra, setLoadingMoreMitra] = useState(false);

  useEffect(() => {
    const fetchInitialMitra = async () => {
      try {
        const res = await satpamService.getMitraOptions();
        if (res && Array.isArray(res.data)) {
          setMitraOptions(res.data);
          if (res.meta) {
            setHasMoreMitra(res.meta.has_more);
            setNextCursorMitra(res.meta.next_cursor);
          }
        }
      } catch (e) {
        console.error("Gagal load mitra for filter", e);
      }
    };
    fetchInitialMitra();
  }, []);

  const loadMoreMitra = async () => {
    if (!hasMoreMitra || !nextCursorMitra || loadingMoreMitra) return;
    setLoadingMoreMitra(true);
    try {
      const res = await satpamService.getMitraOptions(nextCursorMitra);
      if (res && Array.isArray(res.data)) {
        setMitraOptions((prev) => [...prev, ...res.data]);
        if (res.meta) {
          setHasMoreMitra(res.meta.has_more);
          setNextCursorMitra(res.meta.next_cursor);
        }
      }
    } catch (e) {
      console.error("Gagal load more mitra", e);
    } finally {
      setLoadingMoreMitra(false);
    }
  };

  return {
    mitraOptions,
    hasMoreMitra,
    loadingMoreMitra,
    loadMoreMitra,
  };
};
