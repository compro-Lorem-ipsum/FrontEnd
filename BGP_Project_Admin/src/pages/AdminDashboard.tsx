import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDashboard } from "../hooks/useDashboard";
import { FaBuilding, FaTransgender, FaUsers, FaEye } from "react-icons/fa";
import { IoStatsChart } from "react-icons/io5";
import { PiWarningCircleFill } from "react-icons/pi";
import { BsPersonFillCheck } from "react-icons/bs";
import { GiPoliceOfficerHead } from "react-icons/gi";
import { LegendItem } from "../Components/dashboard/LegendItem";
import { DonutChart } from "../Components/dashboard/DonutChart";
import {
  Progress,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
} from "@heroui/react";

const columnsPerhatian = [
  { name: "No", uid: "no" },
  { name: "Nama", uid: "nama" },
  { name: "Mitra", uid: "client" },
  { name: "Telat", uid: "telat" },
  { name: "Tidak Hadir", uid: "tidak_hadir" },
  { name: "Teguran", uid: "teguran" },
  { name: "SP", uid: "sp" },
  { name: "Aksi", uid: "aksi" },
];

const AdminDashboard = () => {
  const { user, greeting, loading, stats, offendersData } = useDashboard();
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const ROWS_PER_PAGE = 5;

  // pagination
  const totalPages = Math.ceil(offendersData.length / ROWS_PER_PAGE) || 1;
  const pagedData = offendersData.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE,
  );

  return (
    <div className="flex flex-col p-5 bg-gray-50/50 gap-4 flex-1 h-0 overflow-hidden">
      {/* HEADER */}
      <div className="flex-shrink-0">
        <h1 className="text-2xl font-bold text-[#122C93]">Dashboard</h1>
        <p className="text-gray-500 text-sm">
          {greeting}, {user?.nama || "User"}. Silakan pilih menu di bawah ini.
        </p>
      </div>

      {/* STAT GRID 3×2 */}
      <div className="grid grid-cols-3 gap-4 flex-shrink-0 overflow-y-auto custom-scrollbar">
        {/* Jumlah Satpam */}
        <div className="flex flex-col bg-white p-5 rounded-xl border border-[#E8EEFF] justify-between gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Jumlah Satpam</h2>
            <div className="bg-[#DBEAFE] p-2 rounded-xl">
              <GiPoliceOfficerHead className="text-2xl text-[#122C93]" />
            </div>
          </div>
          <div className="flex items-end gap-2 mt-1">
            <h2 className="font-extrabold text-4xl leading-none text-[#122C93]">{loading ? "-" : stats.totalPersonel}</h2>
            <h2 className="font-light text-sm text-black mb-0.5">Personel</h2>
          </div>
        </div>

        {/* Satpam Aktif */}
        <div className="flex flex-col bg-white p-5 rounded-xl border border-[#E8EEFF] justify-between gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Satpam Aktif</h2>
            <div className="bg-[#DCFCE7] p-2 rounded-xl">
              <BsPersonFillCheck className="text-2xl text-[#008236]" />
            </div>
          </div>
          <div className="flex items-end gap-2 mt-1">
            <h2 className="font-extrabold text-4xl leading-none text-[#008236]">{loading ? "-" : stats.aktifCount}</h2>
            <h2 className="font-light text-sm text-black mb-0.5">dari {stats.totalPersonel}</h2>
          </div>
          <Progress
            aria-label="Satpam aktif"
            className="h-2 mt-1"
            value={stats.totalPersonel > 0 ? (stats.aktifCount / stats.totalPersonel) * 100 : 0}
            classNames={{ track: "bg-[#D9D9D9]", indicator: "bg-[#008236]" }}
          />
        </div>

        {/* Total Client */}
        <div className="flex flex-col bg-white p-5 rounded-xl border border-[#E8EEFF] justify-between gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Total Mitra</h2>
            <div className="bg-[#DBEAFE] p-2 rounded-xl">
              <FaBuilding className="text-2xl text-[#122C93]" />
            </div>
          </div>
          <div className="flex items-end gap-2 mt-1">
            <h2 className="font-extrabold text-4xl leading-none text-[#122C93]">{loading ? "-" : stats.totalClient}</h2>
            <h2 className="font-light text-sm text-black mb-0.5">Lokasi Aktif</h2>
          </div>
        </div>

        {/* Gender */}
        <div className="flex flex-col bg-white p-5 rounded-xl border border-[#E8EEFF] justify-between gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Gender</h2>
            <div className="bg-[#DBEAFE] p-2 rounded-xl">
              <FaTransgender className="text-2xl text-[#122C93]" />
            </div>
          </div>
          <div className="flex items-center gap-4 mt-1">
            <DonutChart
              data={stats.genderData}
              size={110}
              label={{ value: stats.totalPersonel, sub: "Total" }}
            />
            <div className="flex flex-col gap-3 w-full">
              <LegendItem color="#122C93" label="Laki-laki" value={stats.maleCount} />
              <LegendItem color="#93c5fd" label="Perempuan" value={stats.femaleCount} />
            </div>
          </div>
        </div>

        {/* Status Personel */}
        <div className="flex flex-col bg-white p-5 rounded-xl border border-[#E8EEFF] justify-between gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Status Personel</h2>
            <div className="bg-[#DBEAFE] p-2 rounded-xl">
              <FaUsers className="text-2xl text-[#122C93]" />
            </div>
          </div>
          <div className="flex items-center gap-4 mt-1">
            <DonutChart
              data={stats.statusData}
              size={110}
              label={{ value: stats.totalPersonel, sub: "Total" }}
            />
            <div className="flex flex-col gap-3 w-full">
              <LegendItem color="#122C93" label="Aktif" value={stats.aktifCount} />
              <LegendItem color="#93c5fd" label="Cuti / Izin" value={stats.cutiCount} />
              <LegendItem color="#dbeafe" label="Tidak Aktif" value={stats.tidakAktifCount} />
            </div>
          </div>
        </div>

        {/* Distribusi per Client */}
        <div className="flex flex-col bg-white p-5 rounded-xl border border-[#E8EEFF] justify-between gap-2">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Distribusi Satpam per Mitra</h2>
            <div className="bg-[#DBEAFE] p-2 rounded-xl">
              <IoStatsChart className="text-2xl text-[#122C93]" />
            </div>
          </div>
          <div className="flex flex-col gap-3 mt-1">
            {stats.clientsDistribution
              .sort((a: any, b: any) => b.satpam - a.satpam)
              .slice(0, 3)
              .map((item: any) => (
              <div key={item.uuid} className="flex flex-col">
                <div className="flex justify-between items-center">
                  <h2 className="font-medium text-xs truncate">{item.nama}</h2>
                  <h2 className="text-[#8D8787] text-xs ml-1">{item.satpam}</h2>
                </div>
                <Progress
                  aria-label={item.nama}
                  className="h-2 mt-1"
                  value={stats.totalPersonel > 0 ? (item.satpam / stats.totalPersonel) * 100 : 0}
                  classNames={{
                    track: "bg-[#D9D9D9]",
                    indicator: "bg-[#122C93]",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* END STAT GRID */}

      {/* TABLE */}
      <div className="flex flex-col bg-white border border-[#E8EEFF] rounded-2xl w-full p-4 gap-3 flex-1 min-h-0 overflow-y-auto custom-scrollbar">
        <div className="flex items-center gap-4">
          <div className="bg-[#FFE2E2] p-2 rounded-xl flex items-center">
            <PiWarningCircleFill className="text-2xl text-[#C10007]" />
          </div>
          <div className="flex flex-col gap-0.5">
            <h2 className="font-semibold text-[#122C93] text-base">Satpam Perlu Diperhatikan</h2>
            <h2 className="font-light text-xs text-gray-500">Personel dengan catatan kedisiplinan tertinggi 30 hari terakhir</h2>
          </div>
        </div>

        <Table
          aria-label="Tabel Satpam Perlu Diperhatikan"
          shadow="none"
          isStriped
          classNames={{ th: "text-xs py-2.5 px-3", td: "text-sm py-2.5 px-3" }}
        >
          <TableHeader columns={columnsPerhatian}>
            {(column) => (
              <TableColumn key={column.uid} align="center">
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={pagedData}>
            {(item: any) => (
              <TableRow key={item.uuid}>
                {(columnKey) => {
                  switch (columnKey) {
                    case "no":
                      return <TableCell>{offendersData.indexOf(item) + 1}</TableCell>;
                    case "nama":
                      return (
                        <TableCell>
                          <div className="font-medium">{item.nama}</div>
                        </TableCell>
                      );
                    case "client":
                      return (
                        <TableCell>
                          <div className="text-sm text-gray-500">{item.client}</div>
                        </TableCell>
                      );
                    case "telat":
                      return <TableCell>{item.late}</TableCell>;
                    case "tidak_hadir":
                      return <TableCell>{item.absent}</TableCell>;
                    case "teguran":
                      return <TableCell>{item.teguran}</TableCell>;
                    case "sp":
                      return (
                        <TableCell>
                          <span
                            className={
                              item.sp && item.sp !== "0" && item.sp !== 0
                                ? "text-[#C10007] font-semibold"
                                : ""
                            }
                          >
                            {item.sp || "-"}
                          </span>
                        </TableCell>
                      );
                    case "aksi":
                      return (
                        <TableCell>
                          <div className="flex justify-center">
                            <FaEye 
                              className="text-[#122C93] text-base cursor-pointer" 
                              onClick={() => navigate("/AdminDetailSatpam", { state: { uuid: item.uuid } })} 
                            />
                          </div>
                        </TableCell>
                      );
                    default:
                      return <TableCell>-</TableCell>;
                  }
                }}
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        <div className="flex justify-center pt-1">
          <Pagination
            total={totalPages}
            page={page}
            onChange={setPage}
            size="sm"
            showControls
            classNames={{
              cursor: "bg-[#122C93] text-white",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
