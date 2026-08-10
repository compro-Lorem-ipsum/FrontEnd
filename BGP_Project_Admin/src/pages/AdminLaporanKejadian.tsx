import { FiSearch, FiCamera } from "react-icons/fi";
import { useState } from "react";
import {
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
} from "@heroui/react";

const filters = [
  { key: "semua", label: "Semua" },
  { key: "masuk", label: "Masuk" },
  { key: "ditangani", label: "Ditangani" },
  { key: "selesai", label: "Selesai" },
];

interface LaporanItem {
  uuid: string;
  nama: string;
  nip: string;
  mitra: string;
  deskripsi: string;
  lokasi_url?: string;
  waktu: string;
  status: "masuk" | "ditangani" | "selesai";
}

const dummyData: LaporanItem[] = [
  {
    uuid: "1",
    nama: "Nama Satpam",
    nip: "0123456789",
    mitra: "Nama Client",
    deskripsi:
      "Lampu penerangan di koridor lantai 2 mati total. Perlu tindakan",
    waktu: "01 Jun 2026, 23:00",
    status: "masuk",
  },
  {
    uuid: "2",
    nama: "Nama Satpam",
    nip: "0123456789",
    mitra: "Nama Client 2",
    deskripsi: "Keran di toilet lantai 2 mati",
    waktu: "01 Jun 2026, 23:00",
    status: "ditangani",
  },
  {
    uuid: "3",
    nama: "Nama Satpam",
    nip: "0123456789",
    mitra: "Nama Client 3",
    deskripsi: "Genangan air di deket parkiran basement",
    waktu: "01 Jun 2026, 23:00",
    status: "selesai",
  },
];

const columns = [
  { name: "No", uid: "no" },
  { name: "Nama", uid: "nama" },
  { name: "NIP", uid: "nip" },
  { name: "Mitra", uid: "mitra" },
  { name: "Deskripsi", uid: "deskripsi" },
  { name: "Foto", uid: "foto" },
  { name: "Lokasi", uid: "lokasi" },
  { name: "Waktu", uid: "waktu" },
  { name: "Status", uid: "status" },
];

const statusStyles: Record<LaporanItem["status"], string> = {
  masuk: "bg-[#FCE7E9] text-[#E11D48]",
  ditangani: "bg-[#E8EEFF] text-[#122C93]",
  selesai: "bg-[#E4F9EE] text-[#02A758]",
};

const statusLabels: Record<LaporanItem["status"], string> = {
  masuk: "Masuk",
  ditangani: "Ditangani",
  selesai: "Selesai",
};

const AdminLaporanKejadian = () => {
  const [activeFilter, setActiveFilter] = useState("semua");
  const loading = false;
  const page = 1;
  const totalPages = 1;
  const rowsPerPage = 10;

  return (
    <div className="flex flex-col gap-2 p-2.5 overflow-hidden">
      {/* header here */}
      <div className="header-container flex flex-row items-center justify-between mt-2">
        <div className="flex flex-col items-start">
          <h2 className="font-semibold text-2xl text-[#122C93]">
            Laporan Kejadian
          </h2>
          <p className="text-md text-black text-sm w-200">
            Laporan insiden yang dikirim satpam dari lapangan.
          </p>
        </div>
      </div>
      {/* end of header here */}

      <div className="container-search rounded-2xl flex flex-row gap-3 items-center bg-[#FFFFFF] p-3 border border-[#E4E9F7]">
        <div className="flex flex-row items-center gap-2 bg-white border border-[#E4E9F7] rounded-xl px-4 h-11 flex-1">
          <FiSearch className="text-[#B0B0B0] text-base flex-shrink-0" />
          <input
            type="search"
            placeholder="Cari nama deskripsi atau status"
            className="bg-transparent text-sm text-gray-700 placeholder:text-[#B0B0B0] outline-none w-full h-full"
          />
        </div>
        <div className="container-selector-filter flex flex-row gap-2 items-center">
          {filters.map((f) => (
            <Button
              key={f.key}
              size="sm"
              onPress={() => setActiveFilter(f.key)}
              className={
                activeFilter === f.key
                  ? "bg-[#122C93] text-white font-semibold h-11"
                  : "bg-white text-[#122C93] border border-[#E4E9F7] h-11 font-medium"
              }
            >
              {f.label}
            </Button>
          ))}
        </div>
      </div>

      {/* table here */}
      <div className="main-content flex flex-col gap-2 rounded-2xl border border-[#E4E9F7] bg-white">
        <Table
          aria-label="Tabel Laporan Kejadian"
          shadow="none"
          isStriped
          className="rounded-xl"
          bottomContent={
            totalPages > 0 ? (
              <div className="flex w-full justify-center">
                <Pagination
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={totalPages}
                />
              </div>
            ) : null
          }
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={
                  column.uid === "foto" || column.uid === "status"
                    ? "center"
                    : "start"
                }
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={dummyData}
            emptyContent={loading ? <Spinner size="lg" /> : "Tidak ada data"}
          >
            {(item) => (
              <TableRow key={item.uuid}>
                {(columnKey) => {
                  switch (columnKey) {
                    case "no":
                      return (
                        <TableCell>
                          {(page - 1) * rowsPerPage +
                            dummyData.indexOf(item) +
                            1}
                        </TableCell>
                      );
                    case "nama":
                      return <TableCell>{item.nama}</TableCell>;
                    case "nip":
                      return <TableCell>{item.nip}</TableCell>;
                    case "mitra":
                      return <TableCell>{item.mitra}</TableCell>;
                    case "deskripsi":
                      return (
                        <TableCell>
                          <div className="w-[280px] text-sm text-black">
                            {item.deskripsi}
                          </div>
                        </TableCell>
                      );
                    case "foto":
                      return (
                        <TableCell>
                          <div className="flex justify-center">
                            <button className="flex items-center justify-center w-9 h-9 bg-[#E8EEFF] rounded-lg hover:bg-[#DCE4FF]">
                              <FiCamera className="text-[#122C93] text-base" />
                            </button>
                          </div>
                        </TableCell>
                      );
                    case "lokasi":
                      return (
                        <TableCell>
                          <a
                            href={item.lokasi_url || "#"}
                            className="text-[#122C93] font-medium text-sm hover:underline"
                          >
                            Lihat Peta
                          </a>
                        </TableCell>
                      );
                    case "waktu":
                      return <TableCell>{item.waktu}</TableCell>;
                    case "status":
                      return (
                        <TableCell>
                          <div className="flex justify-center">
                            <span
                              className={`text-xs font-medium px-3 py-1.5 rounded-full ${statusStyles[item.status]}`}
                            >
                              {statusLabels[item.status]}
                            </span>
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
      </div>
      {/* end of table */}
    </div>
  );
};

export default AdminLaporanKejadian;
