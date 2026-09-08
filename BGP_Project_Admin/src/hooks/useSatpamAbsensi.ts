import { useState, useEffect } from "react";
import { attendanceService } from "../services/attendanceService";

export const useSatpamAbsensi = (satpamUuid: string | undefined, activeTab: string) => {
  const [absensiItems, setAbsensiItems] = useState<any[]>([]);
  const [absensiLoading, setAbsensiLoading] = useState(false);
  const [absensiCursorHistory, setAbsensiCursorHistory] = useState<(string | null)[]>([null]);
  const [absensiCurrentIndex, setAbsensiCurrentIndex] = useState(0);
  const [absensiHasMore, setAbsensiHasMore] = useState(false);
  const [absensiNextCursor, setAbsensiNextCursor] = useState<string | null>(null);

  const fetchAbsensi = async () => {
    if (!satpamUuid) return;
    setAbsensiLoading(true);
    try {
      const currentCursor = absensiCursorHistory[absensiCurrentIndex];
      const res = await attendanceService.getAll(
        3,
        currentCursor,
        undefined,
        undefined,
        satpamUuid
      );
      setAbsensiItems(res.data || []);
      if (res.meta) {
        setAbsensiHasMore(res.meta.has_more);
        setAbsensiNextCursor(res.meta.next_cursor);
      } else {
        setAbsensiHasMore(false);
        setAbsensiNextCursor(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAbsensiLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "absensi") {
      fetchAbsensi();
    }
  }, [activeTab, satpamUuid, absensiCurrentIndex]);

  const handleNextAbsensi = () => {
    if (!absensiHasMore) return;
    setAbsensiCursorHistory((prev) => {
      const next = [...prev];
      next[absensiCurrentIndex + 1] = absensiNextCursor;
      return next;
    });
    setAbsensiCurrentIndex((prev) => prev + 1);
  };

  const handlePrevAbsensi = () => {
    if (absensiCurrentIndex > 0) {
      setAbsensiCurrentIndex((prev) => prev - 1);
    }
  };

  return {
    absensiItems,
    absensiLoading,
    absensiCurrentIndex,
    absensiHasMore,
    handleNextAbsensi,
    handlePrevAbsensi,
  };
};
