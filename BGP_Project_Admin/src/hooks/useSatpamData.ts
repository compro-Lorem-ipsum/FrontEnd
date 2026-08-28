import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { satpamService } from "../services/satpamService";
import type { Satpam } from "../types/satpam";
import { getRole } from "../Utils/helpers";
import { addToast } from "@heroui/react";

export const useSatpamData = () => {
  const navigate = useNavigate();
  const [dataSatpam, setDataSatpam] = useState<Satpam[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [limit, setLimit] = useState(7);

  // Pagination State (Cursor Based)
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([null]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const [userRole, setUserRole] = useState<string>("");
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  useEffect(() => {
    const role = getRole();
    if (role) setUserRole(role);
  }, []);

  const fetchSatpam = useCallback(async () => {
    setLoading(true);
    try {
      const currentCursor = cursorHistory[currentIndex];
      const response = await satpamService.getAll(limit, currentCursor);
      if (response && Array.isArray(response.data)) {
        setDataSatpam(response.data);
        if (response.meta) {
          setHasMore(response.meta.has_more);
          setNextCursor(response.meta.next_cursor);
        }
      } else {
        setDataSatpam([]);
        setHasMore(false);
        setNextCursor(null);
      }
    } catch (error: any) {
      console.error("Fetch satpam error:", error);
      setDataSatpam([]);
      setHasMore(false);
      setNextCursor(null);
    } finally {
      setLoading(false);
    }
  }, [limit, currentIndex, cursorHistory, navigate]);

  useEffect(() => {
    fetchSatpam();
  }, [fetchSatpam]);

  const confirmDelete = (uuid: string) => {
    setDeleteTargetId(uuid);
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!deleteTargetId) return;
    setDeleteModalOpen(false);
    try {
      await satpamService.delete(deleteTargetId);
      addToast({
        title: "Berhasil",
        description: "Data satpam berhasil dihapus.",
        variant: "flat",
        timeout: 3000,
        color: "danger",
      });
      fetchSatpam();
    } catch (error) {
      const err = error as Error;
      addToast({
        title: "Gagal",
        description: err.message || "Gagal menghapus satpam.",
        variant: "flat",
        color: "danger",
      });
    } finally {
      setDeleteTargetId(null);
    }
  };

  const handleNextPage = () => {
    if (hasMore && nextCursor) {
      if (currentIndex === cursorHistory.length - 1) {
        setCursorHistory((prev) => [...prev, nextCursor]);
      }
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const resetPagination = () => {
    setCursorHistory([null]);
    setCurrentIndex(0);
  };

  return {
    dataSatpam,
    loading,
    limit,
    setLimit,
    hasMore,
    currentPage: currentIndex + 1,
    handleNextPage,
    handlePrevPage,
    resetPagination,
    userRole,
    refreshData: fetchSatpam,
    deleteState: {
      isOpen: isDeleteModalOpen,
      setIsOpen: setDeleteModalOpen,
      confirm: confirmDelete,
      execute: executeDelete,
    },
  };
};
