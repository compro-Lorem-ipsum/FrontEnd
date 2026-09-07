// src/hooks/useScheduleData.ts
// NOTE: /shift-instances is keyset-paginated (cursor + has_more, no page/total),
// so `page`/`totalPages` never matched the real API shape. Rewritten around
// cursor + hasMore; a visited-cursor stack lets "previous page" still work.
import { useState, useEffect, useCallback } from "react";
import { scheduleService } from "../services/scheduleService";
import type { Jadwal } from "../types/schedule";
import { addToast } from "@heroui/react";

const ROWS_PER_PAGE = 12;

export const useScheduleData = () => {
  const [dataJadwal, setDataJadwal] = useState<Jadwal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [cursorStack, setCursorStack] = useState<(string | null)[]>([null]);
  const [pageIndex, setPageIndex] = useState(0);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetUuid, setDeleteTargetUuid] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchJadwal = useCallback(async (cursor: string | null) => {
    setIsLoading(true);
    try {
      const result = await scheduleService.getAll(ROWS_PER_PAGE, cursor);
      setDataJadwal(Array.isArray(result.data) ? result.data : []);
      setHasMore(Boolean((result as any).meta?.has_more));
      setNextCursor((result as any).meta?.next_cursor ?? null);
    } catch (error: any) {
      console.error(error);
      setDataJadwal([]);
      addToast({
        title: "Gagal memuat jadwal",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJadwal(cursorStack[pageIndex]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageIndex, cursorStack]);

  const refreshData = useCallback(() => {
    setCursorStack([null]);
    setPageIndex(0);
    fetchJadwal(null);
  }, [fetchJadwal]);

  const goToNextPage = useCallback(() => {
    if (!hasMore || !nextCursor) return;
    setCursorStack((prev) =>
      pageIndex + 1 < prev.length ? prev : [...prev.slice(0, pageIndex + 1), nextCursor]
    );
    setPageIndex((prev) => prev + 1);
  }, [hasMore, nextCursor, pageIndex]);

  const goToPreviousPage = useCallback(() => {
    setPageIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const confirmDelete = (uuid: string) => {
    setDeleteTargetUuid(uuid);
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!deleteTargetUuid) return;
    setIsDeleting(true);
    try {
      await scheduleService.delete(deleteTargetUuid);
      addToast({
        title: "Berhasil",
        description: "Data shift berhasil dihapus",
        color: "success",
      });
      refreshData();
      setDeleteModalOpen(false);
    } catch (error: any) {
      addToast({
        title: "Gagal",
        description: error?.message || "Gagal menghapus data shift",
        color: "danger",
      });
    } finally {
      setIsDeleting(false);
      setDeleteTargetUuid(null);
    }
  };

  return {
    data: {
      dataJadwal,
      isLoading,
      page: pageIndex + 1,
      hasNextPage: hasMore,
      hasPreviousPage: pageIndex > 0,
      rowsPerPage: ROWS_PER_PAGE,
    },
    goToNextPage,
    goToPreviousPage,
    refreshData,
    deleteState: {
      isOpen: isDeleteModalOpen,
      setIsOpen: setDeleteModalOpen,
      isDeleting,
      confirm: confirmDelete,
      execute: executeDelete,
    },
  };
};