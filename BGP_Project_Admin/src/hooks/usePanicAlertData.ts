import { useState, useEffect, useCallback } from "react";
import { panicAlertService } from "../services/panicAlertService";
import type { PanicAlertData } from "../types/panicAlert";
import { addToast } from "@heroui/react";

export const usePanicAlertData = () => {
  const [data, setData] = useState<PanicAlertData[]>([]);
  const [activeData, setActiveData] = useState<PanicAlertData[]>([]);
  const [loading, setLoading] = useState(false);
  const [satpamId, setSatpamId] = useState("");
  const [statusFilter, setStatusFilter] = useState("semua"); // 'semua', 'active', 'handled', 'resolved'

  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([null]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const [limit, setLimit] = useState(10);


  // Reset pagination on filter change
  useEffect(() => {
    setCursorHistory([null]);
    setCurrentIndex(0);
  }, [limit, satpamId, statusFilter]);

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const currentCursor = cursorHistory[currentIndex];
      const queryStatus = statusFilter === "semua" ? undefined : statusFilter;
      const querySatpam = satpamId || undefined;

      const [response, activeResponse] = await Promise.all([
        panicAlertService.getAll(limit, currentCursor, querySatpam, queryStatus),
        panicAlertService.getActive()
      ]);

      setData(response.data || []);
      setActiveData(activeResponse.data || []);
      setHasMore(response.meta.has_more);
      setNextCursor(response.meta.next_cursor);
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Gagal mengambil data panic alert",
        color: "danger",
        variant: "flat",
      });
      console.error("Error fetching panic alerts:", error);
    } finally {
      setLoading(false);
    }
  }, [limit, satpamId, statusFilter, currentIndex, cursorHistory]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const handleNextPage = () => {
    if (hasMore && nextCursor) {
      setCursorHistory((prev) => {
        const newHistory = [...prev];
        newHistory[currentIndex + 1] = nextCursor;
        return newHistory;
      });
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const resolveAlert = async (uuid: string) => {
    try {
      await panicAlertService.resolve(uuid);
      addToast({
        title: "Berhasil",
        description: "Panic alert berhasil diselesaikan",
        color: "success",
        variant: "flat",
      });
      fetchAlerts();
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Gagal menyelesaikan panic alert",
        color: "danger",
        variant: "flat",
      });
    }
  };

  const handleAlert = async (uuid: string) => {
    try {
      await panicAlertService.handle(uuid);
      addToast({
        title: "Berhasil",
        description: "Panic alert ditangani",
        color: "success",
        variant: "flat",
      });
      fetchAlerts();
    } catch (error: any) {
      addToast({
        title: "Error",
        description: error.message || "Gagal menangani panic alert",
        color: "danger",
        variant: "flat",
      });
    }
  };

  return {
    data,
    activeData,
    loading,
    satpamId,
    setSatpamId,
    statusFilter,
    setStatusFilter,
    limit,
    setLimit,
    currentIndex,
    hasMore,
    handleNextPage,
    handlePrevPage,
    resolveAlert,
    handleAlert,
    refetch: fetchAlerts,
  };
};
