import { useState } from "react";
import {
  Button,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Spinner,
} from "@heroui/react";
import { FiSearch } from "react-icons/fi";

export const clients = [
  { key: "all", label: "Semua Client" },
  { key: "smb", label: "Sumarecon Bandung" },
  { key: "mitra1", label: "Mitra Sejahtera" },
  { key: "mitra2", label: "Graha Properti" },
];

const filters = [
  { key: "semua", label: "Semua" },
  { key: "menunggu", label: "Menunggu" },
  { key: "disetujui", label: "Disetujui" },
  { key: "ditolak", label: "Ditolak" },
];

interface PengajuanItem {
  uuid: string;
  nama: string;
  nip: string;
  mitra: string;
  tipe: "cuti" | "lembur";
  tanggal_izin: string;
  alasan: string;
  tanggal_pengajuan: string;
  status: "menunggu" | "disetujui" | "ditolak";
}

const dummyData: PengajuanItem[] = [
  {
    uuid: "1",
    nama: "Nama Satpam",
    nip: "0123xx",
    mitra: "Nama Client",
    tipe: "cuti",
    tanggal_izin: "31 Des 2026 - 2 Jan 2027",
    alasan: "Mau liburan sama keluarga, tolong di izinkan",
    tanggal_pengajuan: "24 Des 2026",
    status: "disetujui",
  },
  {
    uuid: "2",
    nama: "Nama Satpam",
    nip: "0123xx",
    mitra: "Nama Client",
    tipe: "lembur",
    tanggal_izin: "31 Des 2026",
    alasan:
      "Mengganti satpam shift malam yang berhalangan hadir karena liburan.",
    tanggal_pengajuan: "24 Des 2026",
    status: "menunggu",
  },
  {
    uuid: "3",
    nama: "Nama Satpam",
    nip: "0123xx",
    mitra: "Nama Client",
    tipe: "cuti",
    tanggal_izin: "27 Des 2026 - 31 Des 2026",
    alasan: "pengen istirahat aja",
    tanggal_pengajuan: "26 Des 2026",
    status: "ditolak",
  },
];

const INITIAL_COLUMNS = [
  { name: "No", uid: "no" },
  { name: "Nama", uid: "nama" },
  { name: "NIP", uid: "nip" },
  { name: "Mitra", uid: "mitra" },
  { name: "Tipe", uid: "tipe" },
  { name: "Tanggal Izin", uid: "tanggal_izin" },
  { name: "Alasan", uid: "alasan" },
  { name: "Tanggal Pengajuan", uid: "tanggal_pengajuan" },
  { name: "Status", uid: "status" },
  { name: "Aksi", uid: "aksi" },
];

const tipeStyles: Record<PengajuanItem["tipe"], string> = {
  cuti: "bg-[#E8EEFF] text-[#122C93]",
  lembur: "bg-[#F1E8FF] text-[#7C3AED]",
};

const tipeLabels: Record<PengajuanItem["tipe"], string> = {
  cuti: "Cuti",
  lembur: "Lembur",
};

const statusStyles: Record<PengajuanItem["status"], string> = {
  menunggu: "bg-[#FEF6E0] text-[#B45309]",
  disetujui: "bg-[#E4F9EE] text-[#02A758]",
  ditolak: "bg-[#FCE7E9] text-[#E11D48]",
};

const statusLabels: Record<PengajuanItem["status"], string> = {
  menunggu: "Menunggu",
  disetujui: "Disetujui",
  ditolak: "Ditolak",
};

interface PengajuanTableProps {
  data: PengajuanItem[];
  loading: boolean;
  page: number;
  totalPages: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onSetujui: (item: PengajuanItem) => void;
  onTolak: (item: PengajuanItem) => void;
}

const PengajuanTable = ({
  data,
  loading,
  page,
  totalPages,
  rowsPerPage,
  onPageChange,
  onSetujui,
  onTolak,
}: PengajuanTableProps) => {
  return (
    <Table
      aria-label="Tabel Pengajuan Lembur & Cuti"
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
              onChange={onPageChange}
            />
          </div>
        ) : null
      }
    >
      <TableHeader columns={INITIAL_COLUMNS}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align={
              column.uid === "tipe" ||
              column.uid === "status" ||
              column.uid === "aksi"
                ? "center"
                : "start"
            }
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
        items={data}
        emptyContent={loading ? <Spinner size="lg" /> : "Tidak ada data"}
      >
        {(item) => (
          <TableRow key={item.uuid}>
            {(columnKey) => {
              switch (columnKey) {
                case "no":
                  return (
                    <TableCell>
                      {(page - 1) * rowsPerPage + data.indexOf(item) + 1}
                    </TableCell>
                  );
                case "nama":
                  return <TableCell>{item.nama}</TableCell>;
                case "nip":
                  return <TableCell>{item.nip}</TableCell>;
                case "mitra":
                  return <TableCell>{item.mitra}</TableCell>;
                case "tipe":
                  return (
                    <TableCell>
                      <div className="flex justify-center">
                        <span
                          className={`text-xs font-medium px-3 py-1.5 rounded-full ${tipeStyles[item.tipe]}`}
                        >
                          {tipeLabels[item.tipe]}
                        </span>
                      </div>
                    </TableCell>
                  );
                case "tanggal_izin":
                  return (
                    <TableCell>
                      <div className="w-[170px] text-sm text-black">
                        {item.tanggal_izin}
                      </div>
                    </TableCell>
                  );
                case "alasan":
                  return (
                    <TableCell>
                      <div className="w-[260px] text-sm text-black">
                        {item.alasan}
                      </div>
                    </TableCell>
                  );
                case "tanggal_pengajuan":
                  return <TableCell>{item.tanggal_pengajuan}</TableCell>;
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
                case "aksi":
                  return (
                    <TableCell>
                      <div className="flex justify-center gap-2">
                        {item.status === "menunggu" ? (
                          <>
                            <Button
                              size="sm"
                              className="bg-[#02A758] text-white font-semibold"
                              onPress={() => onSetujui(item)}
                            >
                              Setuju
                            </Button>
                            <Button
                              size="sm"
                              variant="bordered"
                              className="border-[#E11D48] text-[#E11D48] font-semibold"
                              onPress={() => onTolak(item)}
                            >
                              Tolak
                            </Button>
                          </>
                        ) : (
                          <span className="text-[#8D8787]">-</span>
                        )}
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
  );
};

const AdminManagePengajuan = () => {
  const [activeFilter, setActiveFilter] = useState("semua");
  const [page, setPage] = useState(1);

  const loading = false;
  const totalPages = 1;
  const rowsPerPage = 10;

  const handleSetujui = (item: PengajuanItem) => {
    console.log("setujui", item.uuid);
  };

  const handleTolak = (item: PengajuanItem) => {
    console.log("tolak", item.uuid);
  };

  return (
    <div className="flex flex-col gap-2 p-2.5 overflow-hidden">
      {/* Header here */}
      <div className="header-container flex flex-row items-center justify-between mt-2">
        <div className="flex flex-col items-start">
          <h2 className="font-semibold text-2xl text-[#122C93]">
            Pengajuan Lembur & Cuti
          </h2>
          <p className="text-md text-black text-sm w-200">
            Pengajuan dari satpam. Setujui atau tolak setelah review.
          </p>
        </div>
      </div>
      {/* end of header here */}

      {/* search engine */}
      <div className="container-search rounded-2xl flex flex-row gap-3 items-center bg-[#FFFFFF] p-3 border border-[#E4E9F7]">
        <div className="flex flex-row items-center gap-2 bg-white border border-[#E4E9F7] rounded-xl px-4 h-11 flex-1">
          <FiSearch className="text-[#B0B0B0] text-base flex-shrink-0" />
          <input
            type="search"
            placeholder="Cari nama deskripsi, atau status"
            className="bg-transparent text-sm text-gray-700 placeholder:text-[#B0B0B0] outline-none w-full h-full"
          />
        </div>
        <Select
          className="w-48"
          placeholder="Semua Type"
          classNames={{
            trigger:
              "bg-white border border-[#E4E9F7] rounded-xl shadow-none h-11 min-h-11 data-[hover=true]:bg-white",
            value: "text-[#8D8787] text-sm",
          }}
        >
          {clients.map((c) => (
            <SelectItem key={c.key}>{c.label}</SelectItem>
          ))}
        </Select>
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
      {/* end of search engine */}

      <div className="main-content flex flex-col gap-2 rounded-2xl border border-[#E4E9F7] bg-white">
        <PengajuanTable
          data={dummyData}
          loading={loading}
          page={page}
          totalPages={totalPages}
          rowsPerPage={rowsPerPage}
          onPageChange={setPage}
          onSetujui={handleSetujui}
          onTolak={handleTolak}
        />
      </div>
    </div>
  );
};

export default AdminManagePengajuan;
