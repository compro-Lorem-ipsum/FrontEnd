import { Spinner } from "@heroui/react";
import { MdEditCalendar } from "react-icons/md";
import type { Jadwal } from "../../types/schedule";

const SOURCE_BADGE: Record<string, string> = {
  pattern: "bg-blue-50 text-blue-600 border border-blue-200",
  override: "bg-amber-50 text-amber-600 border border-amber-200",
  manual: "bg-indigo-50 text-indigo-600 border border-indigo-200",
};
const SOURCE_LABEL: Record<string, string> = {
  pattern: "rutin",
  override: "dipindah",
  manual: "sekali pakai",
};

interface JadwalHarianViewProps {
  currentDateIso: string;
  isJadwalLoading: boolean;
  shiftData: any[];
  allJadwal: Jadwal[];
  handleOpenAssign: (shiftUuid: string) => void;
  handleEditJadwalInstance: (item: Jadwal) => void;
}

const JadwalHarianView = ({
  currentDateIso,
  isJadwalLoading,
  shiftData,
  allJadwal,
  handleOpenAssign,
  handleEditJadwalInstance,
}: JadwalHarianViewProps) => {
  // Collect all patterns that appear in today's instances (including manual/orphan)
  const shiftDataUuidSet = new Set((shiftData || []).map((s) => s.uuid));

  const extraPatterns: { uuid: string; nama: string; start_local: string | null; end_local: string | null }[] = [];
  const seenExtraUuids = new Set<string>();

  for (const j of allJadwal) {
    if (
      j.work_date.split("T")[0] === currentDateIso &&
      !shiftDataUuidSet.has(j.pattern.uuid) &&
      !seenExtraUuids.has(j.pattern.uuid)
    ) {
      seenExtraUuids.add(j.pattern.uuid);
      extraPatterns.push({
        uuid: j.pattern.uuid,
        nama: j.pattern.nama,
        start_local: null,
        end_local: null,
      });
    }
  }

  const allPatterns = [...(shiftData || []), ...extraPatterns];

  return (
    <div className="card-jadwal-container-wrapper w-full" style={{ maxHeight: "calc(100vh - 280px)", overflowY: "auto", paddingRight: "4px" }}>
      <div className="card-jadwal-container grid grid-cols-3 content-start gap-3 w-full min-h-[300px]">
      {isJadwalLoading ? (
        <div className="col-span-3 flex justify-center py-10">
          <Spinner />
        </div>
      ) : allPatterns.length === 0 ? (
        <div className="col-span-3 text-center text-sm text-[#6B6B6B] py-10">
          Belum ada konfigurasi shift. Tambahkan di tab &quot;Atur Shift&quot;.
        </div>
      ) : (
        allPatterns.map((shift) => {
          const isExtraPattern = !shiftDataUuidSet.has(shift.uuid);

          // Include ALL instances for this pattern today, including cancelled (show strikethrough)
          const satpamForShift = allJadwal.filter(
            (j) =>
              j.pattern.uuid === shift.uuid &&
              j.work_date.split("T")[0] === currentDateIso
          );

          const activeCount = satpamForShift.filter((j) => j.status !== "cancelled").length;

          return (
            <div
              key={shift.uuid}
              className="card-shift flex flex-col bg-white border border-[#E4E9F7] p-4 rounded-2xl h-[320px]"
            >
              {/* Card Header */}
              <div className="card-header flex flex-row items-start justify-between flex-shrink-0 gap-2">
                <div className="jadwal flex flex-col items-start">
                  <h2 className="font-semibold text-sm">{shift.nama}</h2>
                  <h2 className="text-light text-xs text-[#6B6B6B]">
                    {shift.start_local
                      ? `${shift.start_local.slice(0, 5)} – ${shift.end_local?.slice(0, 5)}`
                      : isExtraPattern
                      ? "Manual / Pattern dihapus"
                      : ""}
                  </h2>
                  <span className="mt-1 text-xs text-[#9CA3AF]">{activeCount} satpam bertugas</span>
                </div>
                {!isExtraPattern && (
                  <button
                    type="button"
                    onClick={() => handleOpenAssign(shift.uuid)}
                    className="text-xs px-3 py-1.5 rounded-xl border border-[#C7D2FE] text-[#122C93] hover:bg-[#F0F4FF] transition-colors flex-shrink-0"
                  >
                    Assign +
                  </button>
                )}
              </div>

              <hr className="w-full mt-3 border-[#E4E9F7] flex-shrink-0" />

              {/* Satpam list */}
              <div className="flex flex-col gap-2 mt-3 flex-1 min-h-0 overflow-y-auto pr-1">
                {satpamForShift.length === 0 ? (
                  <p className="text-xs text-[#9CA3AF] text-center mt-4">
                    Belum ada satpam yang ditugaskan
                  </p>
                ) : (
                  satpamForShift.map((item) => {
                    const isCancelled = item.status === "cancelled";
                    return (
                      <div
                        key={item.uuid}
                        className={`list-satpam flex flex-row justify-between items-center flex-shrink-0 p-2 rounded-xl transition-colors ${
                          isCancelled ? "opacity-50 bg-slate-50" : "hover:bg-[#F8FAFF]"
                        }`}
                      >
                        <div className="left-side flex flex-row items-center gap-2">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 ${
                              isCancelled
                                ? "bg-slate-200 text-slate-400"
                                : "bg-[#122C93] text-white"
                            }`}
                          >
                            {item.satpam.nama.charAt(0).toUpperCase()}
                          </div>
                          <div className="container-details-satpam flex flex-col gap-0.5 items-start">
                            <h2
                              className={`text-sm ${isCancelled ? "line-through text-slate-400" : ""}`}
                            >
                              {item.satpam.nama}
                            </h2>
                            <div className="flex items-center gap-1 flex-wrap">
                              <h2 className="text-xs text-[#6B6B6B]">
                                {item.pos.nama}
                              </h2>
                              {/* Source badge */}
                              {isCancelled ? (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-400 border border-slate-200">
                                  dibatalkan
                                </span>
                              ) : (
                                <span
                                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${SOURCE_BADGE[item.source] ?? SOURCE_BADGE.pattern}`}
                                >
                                  {SOURCE_LABEL[item.source] ?? item.source}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Edit button — always show unless completed (already checked in) */}
                        {!isCancelled && item.status !== "completed" && (
                          <button
                            type="button"
                            className="border border-[#C7D2FE] text-[#122C93] rounded-lg p-2 hover:bg-[#F5F7FF] cursor-pointer transition-colors flex-shrink-0"
                            onClick={() => handleEditJadwalInstance(item)}
                            title="Kelola jadwal ini"
                          >
                            <MdEditCalendar className="text-base" />
                          </button>
                        )}
                        {item.status === "completed" && (
                          <span className="text-[10px] px-2 py-1 rounded-full bg-green-50 text-green-600 border border-green-200 flex-shrink-0">
                            Sudah hadir
                          </span>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
    </div>
  );
};

export default JadwalHarianView;
