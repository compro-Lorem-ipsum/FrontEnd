import { useState, useCallback, useEffect } from "react";
import { scheduleService } from "../services/scheduleService";
import type { Jadwal } from "../types/schedule";
import { addToast, useDisclosure } from "@heroui/react";

export const toIsoDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

type ViewMode = "harian" | "mingguan" | "bulanan";

export const useJadwalSatpam = (initialSwitch: "jadwal" | "shift" = "jadwal") => {
  const [activeSwitch, setActiveSwitch] = useState<"jadwal" | "shift">(initialSwitch);
  const [rangeMode, setRangeMode] = useState<ViewMode>("harian");
  const [currentDate, setCurrentDate] = useState(new Date());

  const [allJadwal, setAllJadwal] = useState<Jadwal[]>([]);
  const [isJadwalLoading, setIsJadwalLoading] = useState(false);

  /** Fetch all instances for the current view span, following next_cursor pages. */
  const fetchAllJadwal = useCallback(async () => {
    setIsJadwalLoading(true);
    try {
      let from: string;
      let to: string;

      if (rangeMode === "harian") {
        from = toIsoDate(currentDate);
        to = toIsoDate(currentDate);
      } else if (rangeMode === "mingguan") {
        const dayOfWeek = currentDate.getDay();
        const start = new Date(currentDate);
        start.setDate(currentDate.getDate() - dayOfWeek);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        from = toIsoDate(start);
        to = toIsoDate(end);
      } else {
        // bulanan — first to last of the month
        const first = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const last = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        from = toIsoDate(first);
        to = toIsoDate(last);
      }

      let allData: Jadwal[] = [];
      let cursor: string | null = null;
      let hasMore = true;

      while (hasMore) {
        const result = await scheduleService.getAll(50, cursor, from, to);
        const data = Array.isArray(result.data) ? result.data : [];
        allData = [...allData, ...data];
        hasMore = result.meta?.has_more ?? false;
        cursor = result.meta?.next_cursor || null;
      }

      setAllJadwal(allData);
    } catch (error: any) {
      addToast({
        title: "Gagal",
        description: error.message || "Gagal memuat jadwal jaga",
        color: "danger",
      });
    } finally {
      setIsJadwalLoading(false);
    }
  }, [currentDate, rangeMode]);

  useEffect(() => {
    if (activeSwitch === "jadwal") {
      fetchAllJadwal();
    }
  }, [fetchAllJadwal, activeSwitch]);

  const handlePrev = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (rangeMode === "harian") {
        newDate.setDate(prev.getDate() - 1);
      } else if (rangeMode === "mingguan") {
        newDate.setDate(prev.getDate() - 7);
      } else {
        // bulanan
        newDate.setMonth(prev.getMonth() - 1);
      }
      return newDate;
    });
  }, [rangeMode]);

  const handleNext = useCallback(() => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (rangeMode === "harian") {
        newDate.setDate(prev.getDate() + 1);
      } else if (rangeMode === "mingguan") {
        newDate.setDate(prev.getDate() + 7);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  }, [rangeMode]);

  // ── Direct cancel (source: any) ──────────────────────────────────────────
  // Strikes off the row immediately. No regenerate. Use for one-day swaps.
  const jadwalCancelModal = useDisclosure();
  const [cancelTarget, setCancelTarget] = useState<Jadwal | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const confirmCancelInstance = useCallback(
    (item: Jadwal) => {
      if (item.status === "completed") {
        addToast({
          title: "Tidak bisa dibatalkan",
          description:
            "Jadwal ini sudah memiliki data absensi (satpam sudah check-in). Tidak dapat dibatalkan untuk menjaga integritas data.",
          color: "warning",
        });
        return;
      }
      setCancelTarget(item);
      jadwalCancelModal.onOpen();
    },
    [jadwalCancelModal],
  );

  const executeCancelInstance = useCallback(async () => {
    if (!cancelTarget) return;
    setIsCancelling(true);
    try {
      await scheduleService.cancelInstance(cancelTarget.uuid);
      addToast({ title: "Berhasil", description: "Jadwal berhasil dibatalkan", color: "success" });
      setTimeout(() => window.location.reload(), 800);
      jadwalCancelModal.onClose();
    } catch (error: any) {
      addToast({
        title: "Gagal",
        description: error.message || "Gagal membatalkan jadwal",
        color: "danger",
      });
    } finally {
      setIsCancelling(false);
      setCancelTarget(null);
    }
  }, [cancelTarget, jadwalCancelModal]);

  // ── Cancel via rule (source: pattern | override only) ───────────────────
  // Writes a cancel exception then regenerates. Use for leave/permanent removal.
  const jadwalRuleModal = useDisclosure();
  const [ruleTarget, setRuleTarget] = useState<Jadwal | null>(null);
  const [isRuleCancelling, setIsRuleCancelling] = useState(false);

  const confirmCancelViaRule = useCallback(
    (item: Jadwal) => {
      if (item.status === "completed") {
        addToast({
          title: "Tidak bisa dibatalkan",
          description: "Jadwal ini sudah memiliki data absensi.",
          color: "warning",
        });
        return;
      }
      setRuleTarget(item);
      jadwalRuleModal.onOpen();
    },
    [jadwalRuleModal],
  );

  const executeCancelViaRule = useCallback(async () => {
    if (!ruleTarget) return;
    const assignmentUuid = ruleTarget.assignment_uuid || ruleTarget.assignment?.uuid;
    const rawRecurrenceId = ruleTarget.recurrence_id || ruleTarget.work_date;
    const recurrenceId = rawRecurrenceId.split("T")[0];
    if (!assignmentUuid || !recurrenceId) {
      addToast({ title: "Error", description: "Tidak dapat membatalkan via aturan — shift ini tidak punya aturan.", color: "danger" });
      return;
    }
    setIsRuleCancelling(true);
    try {
      await scheduleService.createCancelException(assignmentUuid, recurrenceId);
      // Regenerate the whole affected month so the change takes effect
      const workDate = ruleTarget.work_date.split("T")[0];
      const d = new Date(workDate + "T00:00:00");
      const first = new Date(d.getFullYear(), d.getMonth(), 1);
      const last = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      await scheduleService.regenerateFrom(toIsoDate(first), toIsoDate(last));
      addToast({ title: "Berhasil", description: "Jadwal berhasil dibatalkan dari aturan. Jadwal di hari lain tetap tidak berubah.", color: "success" });
      setTimeout(() => window.location.reload(), 800);
      jadwalRuleModal.onClose();
    } catch (error: any) {
      addToast({
        title: "Gagal",
        description: error.message || "Gagal membatalkan via aturan",
        color: "danger",
      });
    } finally {
      setIsRuleCancelling(false);
      setRuleTarget(null);
    }
  }, [ruleTarget, jadwalRuleModal]);

  return {
    activeSwitch,
    setActiveSwitch,
    rangeMode,
    setRangeMode,
    currentDate,
    setCurrentDate,
    allJadwal,
    isJadwalLoading,
    fetchAllJadwal,
    handlePrev,
    handleNext,

    // Direct cancel
    jadwalCancelModal,
    confirmCancelInstance,
    executeCancelInstance,
    isCancelling,
    cancelTarget,

    // Cancel via rule
    jadwalRuleModal,
    confirmCancelViaRule,
    executeCancelViaRule,
    isRuleCancelling,
    ruleTarget,
  };
};
