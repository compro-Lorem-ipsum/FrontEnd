import { useState, useEffect, useCallback } from "react";
import { trackingSessionService } from "../services/trackingSessionService";
import type { TrackingSessionItem, TrackingSessionDetail } from "../types/trackingSession";
import { addToast } from "@heroui/react";

export const useTrackingSessions = () => {
  const [data, setData] = useState<TrackingSessionItem[]>([]);
  const [selectedSession, setSelectedSession] = useState<TrackingSessionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailLoading, setIsDetailLoading] = useState(false);
  
  // Search & Pagination
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [limit, setLimit] = useState(20);
  const [historyCursor, setHistoryCursor] = useState<(string | null)[]>([null]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(handler);
  }, [search]);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const currentCursor = historyCursor[currentPageIndex];
      const res = await trackingSessionService.getAll({
        limit,
        cursor: currentCursor,
        search: debouncedSearch,
      });

      setData(res.data || []);
      setHasMore(res.meta?.has_more || false);

      if (res.meta?.has_more && res.meta?.next_cursor) {
        setHistoryCursor((prev) => {
          const newHistory = [...prev];
          newHistory[currentPageIndex + 1] = res.meta.next_cursor;
          return newHistory;
        });
      }
    } catch (err: any) {
      addToast({
        title: "Gagal",
        description: err.message || "Gagal mengambil data tracking",
        variant: "flat",
        color: "danger",
        timeout: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  }, [limit, debouncedSearch, currentPageIndex, historyCursor]);

  // Handle Search changes (reset pagination)
  useEffect(() => {
    setHistoryCursor([null]);
    setCurrentPageIndex(0);
  }, [debouncedSearch, limit]);

  // Trigger fetch when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleNextPage = () => {
    if (hasMore) {
      setCurrentPageIndex((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex((prev) => prev - 1);
    }
  };

  const loadSessionDetail = async (uuid: string) => {
    try {
      setIsDetailLoading(true);
      const res = await trackingSessionService.getById(uuid);
      setSelectedSession(res.data);
    } catch (err: any) {
      addToast({
        title: "Gagal",
        description: err.message || "Gagal memuat detail tracking",
        variant: "flat",
        color: "danger",
        timeout: 3000,
      });
      setSelectedSession(null);
    } finally {
      setIsDetailLoading(false);
    }
  };

  return {
    data,
    selectedSession,
    isLoading,
    isDetailLoading,
    search,
    setSearch,
    hasMore,
    handleNextPage,
    handlePrevPage,
    loadSessionDetail,
    limit,
    setLimit,
    currentPageIndex,
  };
};
