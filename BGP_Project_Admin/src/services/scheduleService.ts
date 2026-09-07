// src/services/scheduleService.ts
import { fetchWithAuth } from "../Utils/fetchWithAuth";
import { getToken } from "../Utils/helpers";
import type {
  ScheduleResponse,
  ScheduleDetailResponse,
  SatpamOption,
  ShiftOption,
  PosOption,
  CreateJadwalBody,
  GenerateJadwalBody,
  Jadwal,
} from "../types/schedule";

const BASE_URL_API = import.meta.env.VITE_API_BASE_URL;

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

const DAY_CODE = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

// Exceptions created by leave-approval carry reason "cuti"/"lembur" or a request_uuid.
// Never silently overwrite these from a manual edit/delete.
const isProtectedException = (ex: any) =>
  ex?.reason === "cuti" || ex?.reason === "lembur" || Boolean(ex?.request_uuid);

const findExceptionForRecurrence = async (assignmentUuid: string, recurrenceId: string) => {
  const exQuery = new URLSearchParams({ assignment: assignmentUuid, limit: "50" });
  const exRes = await fetchWithAuth(`${BASE_URL_API}/shift-exceptions?${exQuery.toString()}`, {
    headers: getHeaders(),
  });
  const exData = await exRes.json().catch(() => ({ data: [] }));
  return (exData.data || []).find((e: any) => e.recurrence_id === recurrenceId);
};

const parseByDay = (rrule: string | undefined | null): string[] => {
  const match = /BYDAY=([^;]+)/.exec(rrule || "");
  return match ? match[1].split(",").filter(Boolean) : [];
};

const buildRruleFromDays = (days: string[]) => `FREQ=WEEKLY;BYDAY=${days.join(",")}`;

/**
 * Removes `targetDayCode` from an assignment's rrule going forward from
 * `targetDateStr`, WITHOUT touching the other weekdays that share the same
 * assignment (they cannot be split into separate assignments up front,
 * because a duplicate satpam+pattern+overlapping-daterange combo is
 * rejected by the backend's exclusion constraint — ASSIGNMENT_OVERLAP —
 * regardless of BYDAY content).
 *
 * Returns the { from, to } date range the target weekday now "owns" going
 * forward, so the caller can do whatever it needs with that slot (nothing,
 * for a delete; a brand-new assignment with different values, for an edit).
 */
const excludeWeekdayFromAssignment = async (
  assignment: any,
  targetDateStr: string,
  targetDayCode: string,
): Promise<{ from: string; to: string | null }> => {
  const effectiveFrom: string = assignment.effective_from;
  const effectiveTo: string | null = assignment.effective_to ?? null;
  const currentDays = parseByDay(assignment.rrule);
  const remainingDays = currentDays.filter((d) => d !== targetDayCode);
  const hasHistoryBefore = Boolean(effectiveFrom) && effectiveFrom < targetDateStr;

  if (remainingDays.length === 0) {
    // targetDayCode was the only weekday on this assignment.
    if (!hasHistoryBefore) {
      await fetchWithAuth(`${BASE_URL_API}/shift-assignments/${assignment.uuid}`, {
        method: "DELETE",
        headers: getHeaders(),
      });
      return { from: effectiveFrom, to: effectiveTo };
    }
    const dayBefore = new Date(targetDateStr);
    dayBefore.setDate(dayBefore.getDate() - 1);
    const closeRes = await fetchWithAuth(`${BASE_URL_API}/shift-assignments/${assignment.uuid}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ effective_to: dayBefore.toISOString().split("T")[0] }),
    });
    const closeResult = await closeRes.json().catch(() => ({}));
    if (!closeRes.ok)
      throw new Error(closeResult.error?.message || closeResult.message || "Gagal menutup jadwal lama");
    return { from: targetDateStr, to: effectiveTo };
  }

  if (!hasHistoryBefore) {
    // No history to preserve — narrow the existing assignment's rrule in place.
    const patchRes = await fetchWithAuth(`${BASE_URL_API}/shift-assignments/${assignment.uuid}`, {
      method: "PATCH",
      headers: getHeaders(),
      body: JSON.stringify({ rrule: buildRruleFromDays(remainingDays) }),
    });
    const patchResult = await patchRes.json().catch(() => ({}));
    if (!patchRes.ok)
      throw new Error(patchResult.error?.message || patchResult.message || "Gagal mengubah pola jadwal");
    return { from: effectiveFrom, to: effectiveTo };
  }

  // History exists before this date — close old (full rrule preserved as history),
  // open a successor carrying the remaining weekdays. Ranges never overlap, so
  // this is safe against ASSIGNMENT_OVERLAP.
  const dayBefore = new Date(targetDateStr);
  dayBefore.setDate(dayBefore.getDate() - 1);
  const closeRes = await fetchWithAuth(`${BASE_URL_API}/shift-assignments/${assignment.uuid}`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({ effective_to: dayBefore.toISOString().split("T")[0] }),
  });
  const closeResult = await closeRes.json().catch(() => ({}));
  if (!closeRes.ok)
    throw new Error(closeResult.error?.message || closeResult.message || "Gagal menutup jadwal lama");

  const successorRes = await fetchWithAuth(`${BASE_URL_API}/shift-assignments`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({
      pattern_uuid: assignment.pattern_uuid || assignment.pattern?.uuid,
      pos_uuid: assignment.pos_uuid || assignment.pos?.uuid,
      satpam_uuid: assignment.satpam_uuid || assignment.satpam?.uuid,
      rrule: buildRruleFromDays(remainingDays),
      effective_from: targetDateStr,
      effective_to: effectiveTo,
    }),
  });
  const successorResult = await successorRes.json().catch(() => ({}));
  if (!successorRes.ok)
    throw new Error(successorResult.error?.message || successorResult.message || "Gagal membuat jadwal lanjutan");

  return { from: targetDateStr, to: effectiveTo };
};

const regenerateFrom = async (fromStr: string, toStrOverride?: string | null) => {
  const toDate = toStrOverride ? new Date(toStrOverride) : new Date(fromStr);
  if (!toStrOverride) toDate.setDate(toDate.getDate() + 32);
  await fetchWithAuth(`${BASE_URL_API}/shift-instances/generate`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ from: fromStr, to: toDate.toISOString().split("T")[0] }),
  }).catch(() => { });
};

export const scheduleService = {
  getAll: async (
    limit: number = 50,
    cursor: string | null = null,
    from?: string,
    to?: string,
  ): Promise<ScheduleResponse> => {
    const params = new URLSearchParams({ limit: limit.toString() });
    if (cursor) params.append("cursor", cursor);
    if (from) params.append("from", from);
    if (to) params.append("to", to);

    const res = await fetchWithAuth(`${BASE_URL_API}/shift-instances?${params.toString()}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Gagal memuat data jadwal");
    return res.json();
  },

  getById: async (uuid: string): Promise<ScheduleDetailResponse> => {
    const res = await fetchWithAuth(`${BASE_URL_API}/shift-instances/${uuid}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Gagal mengambil data jadwal");
    return res.json();
  },

  getOptions: async (): Promise<{
    satpam: SatpamOption[];
    shifts: ShiftOption[];
    pos: PosOption[];
  }> => {
    const headers = getHeaders();
    const [resSatpam, resShift, resPos] = await Promise.all([
      fetchWithAuth(`${BASE_URL_API}/satpam?limit=50`, { headers }),
      fetchWithAuth(`${BASE_URL_API}/shift-patterns?limit=50`, { headers }),
      fetchWithAuth(`${BASE_URL_API}/posts?type=utama&limit=50`, { headers }),
    ]);

    const dSatpam = await resSatpam.json();
    const dShift = await resShift.json();
    const dPos = await resPos.json();

    return {
      satpam: (dSatpam.data || []).map((s: any) => ({
        uuid: s.uuid,
        nama: s.nama,
        nip: s.nip,
      })),
      shifts: (dShift.data || []).map((s: any) => ({
        uuid: s.uuid,
        nama: s.nama,
        mulai: s.start_local,
        selesai: s.end_local,
      })),
      pos: (dPos.data || []).map((p: any) => ({ uuid: p.uuid, nama: p.nama })),
    };
  },

  getAssignmentById: async (uuid: string) => {
    const res = await fetchWithAuth(`${BASE_URL_API}/shift-assignments/${uuid}`, {
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Gagal mengambil data assignment");
    return res.json();
  },

  create: async (body: CreateJadwalBody) => {
    const payload = {
      pattern_uuid: body.shift_uuid,
      pos_uuid: body.pos_uuid,
      satpam_uuid: body.satpam_uuid,
      work_date: body.tanggal,
    };
    const res = await fetchWithAuth(`${BASE_URL_API}/shift-instances`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok)
      throw new Error(result.error?.message || result.message || "Gagal menyimpan");
    return result;
  },

  update: async (item: Jadwal | any, body: CreateJadwalBody, mode: "single" | "future" = "single") => {
    const assignmentUuid = item.assignment_uuid || item.assignment?.uuid;
    if (assignmentUuid) {
      if (mode === "single") {
        const recurrenceId = item.recurrence_id || item.work_date;
        const payload: Record<string, string> = {
          assignment_uuid: assignmentUuid,
          recurrence_id: recurrenceId,
          type: "override",
          work_date: body.tanggal,
          pattern_uuid: body.shift_uuid,
        };
        const res = await fetchWithAuth(`${BASE_URL_API}/shift-exceptions`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(payload),
        });
        const result = await res.json().catch(() => ({}));
        if (!res.ok) {
          if (res.status === 409 && result.error?.code === "EXCEPTION_EXISTS") {
            const existingEx = await findExceptionForRecurrence(assignmentUuid, recurrenceId);
            if (existingEx) {
              if (isProtectedException(existingEx)) {
                throw new Error(
                  "Tanggal ini sudah dibatalkan karena cuti/lembur yang disetujui — tidak bisa dijadwalkan ulang di sini."
                );
              }
              await fetchWithAuth(`${BASE_URL_API}/shift-exceptions/${existingEx.uuid}`, { method: "DELETE", headers: getHeaders() });
              const retryRes = await fetchWithAuth(`${BASE_URL_API}/shift-exceptions`, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(payload),
              });
              const retryResult = await retryRes.json().catch(() => ({}));
              if (!retryRes.ok) throw new Error(retryResult.error?.message || retryResult.message || "Gagal mengubah jadwal");
              await regenerateFrom(body.tanggal, body.tanggal);
              return retryResult;
            }
          }
          throw new Error(result.error?.message || result.message || "Gagal mengubah jadwal");
        }
        await regenerateFrom(body.tanggal, body.tanggal);
        return result;
      } else {
        // mode: "future" — change this weekday's pattern/pos/satpam going forward,
        // WITHOUT dragging the other weekday(s) on the same assignment along with it.
        const targetDateStr = item.recurrence_id || item.work_date;

        const oldAssignmentRes = await scheduleService.getAssignmentById(assignmentUuid);
        const oldAssignment = oldAssignmentRes.data || oldAssignmentRes;
        const targetDayCode = DAY_CODE[new Date(targetDateStr).getDay()];

        // 1) Take this weekday out of the old assignment; other weekdays keep
        //    their original pattern/pos/satpam untouched.
        const { from, to } = await excludeWeekdayFromAssignment(oldAssignment, targetDateStr, targetDayCode);

        // 2) Give the edited weekday its own assignment with the new values.
        const newAssignmentRes = await fetchWithAuth(`${BASE_URL_API}/shift-assignments`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            pattern_uuid: body.shift_uuid,
            pos_uuid: body.pos_uuid,
            satpam_uuid: body.satpam_uuid,
            rrule: buildRruleFromDays([targetDayCode]),
            effective_from: from,
            effective_to: to,
          }),
        });
        const result = await newAssignmentRes.json().catch(() => ({}));
        if (!newAssignmentRes.ok)
          throw new Error(result.error?.message || result.message || "Gagal membuat jadwal baru");

        await regenerateFrom(from, to);
        return result;
      }
    } else {
      await scheduleService.delete(item.uuid);
      return await scheduleService.create(body);
    }
  },

  delete: async (target: string | Jadwal | any, mode: "single" | "future" = "single") => {
    const assignmentUuid = typeof target === "object" ? (target.assignment_uuid || target.assignment?.uuid) : null;

    if (assignmentUuid) {
      if (mode === "single") {
        const recurrenceId = target.recurrence_id || target.work_date;
        const payload = {
          assignment_uuid: assignmentUuid,
          recurrence_id: recurrenceId,
          type: "cancel",
          reason: "admin",
        };
        const res = await fetchWithAuth(`${BASE_URL_API}/shift-exceptions`, {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify(payload),
        });
        const result = await res.json().catch(() => ({}));
        if (!res.ok) {
          if (res.status === 409 && result.error?.code === "EXCEPTION_EXISTS") {
            const existingEx = await findExceptionForRecurrence(assignmentUuid, recurrenceId);
            if (existingEx) {
              if (isProtectedException(existingEx)) {
                throw new Error("Tanggal ini sudah dibatalkan karena cuti/lembur yang disetujui.");
              }
              await fetchWithAuth(`${BASE_URL_API}/shift-exceptions/${existingEx.uuid}`, { method: "DELETE", headers: getHeaders() });
              const retryRes = await fetchWithAuth(`${BASE_URL_API}/shift-exceptions`, {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify(payload),
              });
              const retryResult = await retryRes.json().catch(() => ({}));
              if (!retryRes.ok) throw new Error(retryResult.error?.message || retryResult.message || "Gagal menghapus jadwal");
              await regenerateFrom(recurrenceId, recurrenceId);
              return retryResult;
            }
          }
          throw new Error(result.error?.message || result.message || "Gagal menghapus jadwal");
        }
        await regenerateFrom(recurrenceId, recurrenceId);
        return result;
      } else {
        const targetDateStr = target.recurrence_id || target.work_date;
        const assignmentRes = await scheduleService.getAssignmentById(assignmentUuid);
        const assignment = assignmentRes.data || assignmentRes;
        const targetDayCode = DAY_CODE[new Date(targetDateStr).getDay()];

        const { from, to } = await excludeWeekdayFromAssignment(assignment, targetDateStr, targetDayCode);
        await regenerateFrom(from, to);
        return { success: true };
      }
    }

    const uuid = typeof target === "string" ? target : target.uuid;
    const res = await fetchWithAuth(`${BASE_URL_API}/shift-instances/${uuid}/cancel`, {
      method: "POST",
      headers: getHeaders(),
    });
    const result = await res.json().catch(() => ({}));
    if (!res.ok)
      throw new Error(result.error?.message || result.message || "Gagal menghapus");
    return result;
  },

  generate: async (body: GenerateJadwalBody) => {
    const byday = body.days_of_week
      .map((d) => DAY_CODE[d])
      .filter(Boolean);
    const rrule = `FREQ=WEEKLY;BYDAY=${byday.join(",")}`;

    const assignmentRes = await fetchWithAuth(`${BASE_URL_API}/shift-assignments`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        pattern_uuid: body.shift_uuid,
        pos_uuid: body.pos_uuid,
        satpam_uuid: body.satpam_uuid,
        rrule,
        effective_from: body.start_date,
        effective_to: body.end_date,
      }),
    });
    const assignmentResult = await assignmentRes.json().catch(() => ({}));
    if (!assignmentRes.ok)
      throw new Error(
        assignmentResult.error?.message ||
        assignmentResult.message ||
        "Gagal membuat jadwal rutin",
      );

    const generateRes = await fetchWithAuth(`${BASE_URL_API}/shift-instances/generate`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ from: body.start_date, to: body.end_date }),
    });
    const generateResult = await generateRes.json().catch(() => ({}));
    if (!generateRes.ok)
      throw new Error(
        generateResult.error?.message ||
        generateResult.message ||
        "Gagal generate jadwal",
      );

    return generateResult;
  },
};