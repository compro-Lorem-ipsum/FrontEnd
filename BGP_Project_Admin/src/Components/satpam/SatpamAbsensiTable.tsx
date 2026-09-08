import { Spinner, Pagination } from "@heroui/react";
import { formatTanggal } from "../../Utils/helpers";

interface SatpamAbsensiTableProps {
  absensiLoading: boolean;
  absensiItems: any[];
  absensiCurrentIndex: number;
  absensiHasMore: boolean;
  handleNextAbsensi: () => void;
  handlePrevAbsensi: () => void;
}

export const SatpamAbsensiTable = ({
  absensiLoading,
  absensiItems,
  absensiCurrentIndex,
  absensiHasMore,
  handleNextAbsensi,
  handlePrevAbsensi,
}: SatpamAbsensiTableProps) => {

  const parseDuration = (checkIn: string | null, checkOut: string | null) => {
    if (!checkIn || !checkOut) return "-";
    const diffMs = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    if (diffMs <= 0) return "-";
    const h = Math.floor(diffMs / 3600000);
    const m = Math.floor((diffMs % 3600000) / 60000);
    const s = Math.floor((diffMs % 60000) / 1000);
    const res = [];
    if (h > 0) res.push(`${h} jam`);
    if (m > 0) res.push(`${m} menit`);
    if (s > 0) res.push(`${s} detik`);
    return res.length > 0 ? res.join(" ") : "0 detik";
  };

  return (
    <>
      <table className="w-full text-center border-separate border-spacing-y-0.5">
        <thead>
          <tr className="bg-[#F1F1F1] text-black">
            <th className="py-2 px-3 font-normal text-xs rounded-l-lg">
              Tanggal
            </th>
            <th className="py-2 px-3 font-normal text-xs">NIP</th>
            <th className="py-2 px-3 font-normal text-xs">Kategori</th>
            <th className="py-2 px-3 font-normal text-xs">Check In</th>
            <th className="py-2 px-3 font-normal text-xs">Check Out</th>
            <th className="py-2 px-3 font-normal text-xs rounded-r-lg">
              Durasi
            </th>
          </tr>
        </thead>
        <tbody>
          {absensiLoading ? (
            <tr>
              <td colSpan={6} className="py-4">
                <Spinner size="sm" />
              </td>
            </tr>
          ) : absensiItems.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-4 text-sm text-gray-500">
                Belum ada data absensi
              </td>
            </tr>
          ) : (
            absensiItems.map((row, index) => {
              const checkIn = row.checked_in_at ? new Date(row.checked_in_at).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' }) : "-";
              const checkOut = row.checked_out_at ? new Date(row.checked_out_at).toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' }) : "-";
              const tanggal = formatTanggal(row.work_date);
              
              let kategoriText = "Hadir";
              let kategoriColor = "bg-[#DCFCE7] text-[#16A34A]";
              if (row.status === "absent") {
                kategoriText = "Tidak Hadir";
                kategoriColor = "bg-[#FFE2E2] text-[#F31260]";
              } else if (row.status === "late") {
                kategoriText = "Terlambat";
                kategoriColor = "bg-[#FEF9C3] text-[#A16207]";
              }

              return (
                <tr
                  key={row.uuid}
                  className={index % 2 !== 0 ? "bg-[#F1F1F1]" : "bg-white"}
                >
                  <td
                    className={`py-2 px-3 text-xs ${index % 2 !== 0 ? "rounded-l-lg" : ""}`}
                  >
                    {tanggal}
                  </td>
                  <td className="py-2 px-3 text-xs">{row.satpam?.nip || "-"}</td>
                  <td className="py-2 px-3">
                    <div
                      className={`mx-auto px-2 py-0.5 rounded-full text-[10px] font-medium w-fit ${kategoriColor}`}
                    >
                      {kategoriText}
                    </div>
                  </td>
                  <td className="py-2 px-3 text-xs">{checkIn}</td>
                  <td className="py-2 px-3 text-xs">{checkOut}</td>
                  <td
                    className={`py-2 px-3 text-xs ${index % 2 !== 0 ? "rounded-r-lg" : ""}`}
                  >
                    {parseDuration(row.checked_in_at, row.checked_out_at)}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
      {(absensiItems.length > 0 || absensiCurrentIndex > 0) && (
        <div className="flex w-full justify-center mt-1.5">
          <Pagination
            size="sm"
            showControls
            showShadow
            color="primary"
            page={absensiCurrentIndex + 1}
            total={Math.max(absensiCurrentIndex + 1 + (absensiHasMore ? 1 : 0), 1)}
            onChange={(page) => {
              if (page > absensiCurrentIndex + 1) handleNextAbsensi();
              else if (page < absensiCurrentIndex + 1) handlePrevAbsensi();
            }}
            classNames={{
              item: "[&:not([data-active=true])]:hidden",
            }}
          />
        </div>
      )}
    </>
  );
};
