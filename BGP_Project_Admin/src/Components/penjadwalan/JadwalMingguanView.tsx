import type { Jadwal } from "../../types/schedule";

const hariSingkatanMingguTable = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

// Source chip colors (consistent with other views)
const SOURCE_CHIP: Record<string, string> = {
  pattern: "!bg-blue-50 !text-blue-700 border-blue-200",
  override: "!bg-amber-50 !text-amber-700 border-amber-200",
  manual: "!bg-indigo-50 !text-indigo-700 border-indigo-200",
};

export const getTanggalTableMingguan = (date: Date) => {
  const dayOfWeek = date.getDay();
  const minggu = new Date(date);
  minggu.setDate(date.getDate() - dayOfWeek);

  return hariSingkatanMingguTable.map((hari, i) => {
    const tanggal = new Date(minggu);
    tanggal.setDate(minggu.getDate() + i);

    const year = tanggal.getFullYear();
    const month = String(tanggal.getMonth() + 1).padStart(2, "0");
    const day = String(tanggal.getDate()).padStart(2, "0");

    return {
      hari,
      tanggal: tanggal.getDate(),
      iso: `${year}-${month}-${day}`,
    };
  });
};

interface JadwalMingguanViewProps {
  currentDate: Date;
  allJadwal: Jadwal[];
  listSatpam: any[];
  handleEditJadwalInstance: (item: Jadwal) => void;
  handleOpenAssignForDate: (satpamUuid: string, dateIso: string) => void;
}

const JadwalMingguanView = ({
  currentDate,
  allJadwal,
  listSatpam,
  handleEditJadwalInstance,
  handleOpenAssignForDate,
}: JadwalMingguanViewProps) => {
  const tanggalTable = getTanggalTableMingguan(currentDate);
  const todayIso = (() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  })();

  return (
    <div
      className="table-container mt-2 rounded-2xl border border-[#E4E9F7] overflow-hidden"
      style={{ maxHeight: "calc(100vh - 280px)", overflowY: "auto", overflowX: "auto" }}
    >
      <table className="w-full border-collapse">
        <thead className="sticky top-0 z-10">
          <tr className="bg-[#F1F1F1]">
            <th className="text-left py-4 px-5 font-bold text-base text-black min-w-[220px]">
              Nama
            </th>
            {tanggalTable.map(({ hari, tanggal, iso }) => (
              <th
                key={hari}
                className={`py-4 px-3 text-center min-w-[130px] ${iso === todayIso ? "bg-blue-50" : ""}`}
              >
                <div className="flex flex-col items-center">
                  <span className="text-sm font-normal text-[#8D8787]">{hari}</span>
                  <span
                    className={`text-base font-bold ${iso === todayIso ? "text-[#122C93]" : "text-black"}`}
                  >
                    {tanggal}
                  </span>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {listSatpam.length === 0 ? (
            <tr>
              <td
                colSpan={hariSingkatanMingguTable.length + 1}
                className="py-6 text-center text-sm text-[#6B6B6B]"
              >
                Belum ada data satpam
              </td>
            </tr>
          ) : (
            listSatpam.map((satpam) => (
              <tr key={satpam.uuid} className="border-t border-[#E4E9F7]">
                <td className="py-3 px-5">
                  <div className="flex flex-row items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#122C93] text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                      {satpam.nama.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-black">{satpam.nama}</span>
                      <span className="text-xs text-[#8D8787]">NIP · {satpam.nip}</span>
                    </div>
                  </div>
                </td>

                {tanggalTable.map(({ hari, iso }) => {
                  // Show ALL instances including cancelled
                  const matches = allJadwal.filter(
                    (j) => j.satpam.uuid === satpam.uuid && j.work_date.split("T")[0] === iso
                  );
                  const activeMatches = matches.filter((j) => j.status !== "cancelled");

                  return (
                    <td key={hari} className={`py-3 px-3 text-center ${iso === todayIso ? "bg-blue-50/30" : ""}`}>
                      <div className="flex flex-col items-center gap-1">
                        {matches.length > 0 ? (
                          <>
                            {matches.map((match) => {
                              const isCancelled = match.status === "cancelled";
                              const chipClass = isCancelled
                                ? "!bg-slate-100 !text-slate-400 border-slate-200 line-through"
                                : SOURCE_CHIP[match.source] ?? SOURCE_CHIP.pattern;

                              return (
                                <button
                                  key={match.uuid}
                                  type="button"
                                  onClick={() => !isCancelled && handleEditJadwalInstance(match)}
                                  disabled={isCancelled}
                                  className={`w-full min-h-8 h-8 px-2 rounded-full text-xs font-medium border truncate transition-colors ${chipClass} ${
                                    isCancelled
                                      ? "cursor-default"
                                      : "hover:brightness-95 cursor-pointer"
                                  }`}
                                  title={`${match.pattern.nama}${isCancelled ? " (dibatalkan)" : ""}`}
                                >
                                  {match.pattern.nama}
                                </button>
                              );
                            })}

                            {/* Tombol tambah jadwal lain di hari yang sama */}
                            {activeMatches.length > 0 && (
                              <button
                                type="button"
                                onClick={() => handleOpenAssignForDate(satpam.uuid, iso)}
                                className="w-6 h-6 rounded-full border border-dashed border-[#C4C4C4] text-[#9CA3AF] text-xs hover:bg-[#F5F7FF] transition-colors"
                                title="Tambah jadwal lain"
                              >
                                +
                              </button>
                            )}
                          </>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleOpenAssignForDate(satpam.uuid, iso)}
                            className="w-8 h-8 rounded-full border border-dashed border-[#C4C4C4] text-[#9CA3AF] text-xs hover:bg-[#F5F7FF] transition-colors"
                          >
                            +
                          </button>
                        )}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default JadwalMingguanView;
