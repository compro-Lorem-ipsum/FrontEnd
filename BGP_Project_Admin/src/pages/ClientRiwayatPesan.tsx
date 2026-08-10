import { useState } from "react";
import { DateRangePicker } from "@heroui/react";
import { FiSearch } from "react-icons/fi";
import { parseDate } from "@internationalized/date";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
} from "@heroui/react";

interface PesanItem {
  uuid: string;
  nama: string;
  nip: string;
  isi_pesan: string;
  tanggal_dikirim: string;
}

const dummyData: PesanItem[] = [
  {
    uuid: "1",
    nama: "Prasetyo Teguh",
    nip: "1234",
    isi_pesan: "Lampu di Lokasi A mati, tolong di ganti yang baru",
    tanggal_dikirim: "07 JUNI 2026 14:45 PM",
  },
  {
    uuid: "2",
    nama: "Prasetyo Teguh",
    nip: "1234",
    isi_pesan: "Lampu di Lokasi A mati, tolong di ganti yang baru",
    tanggal_dikirim: "13 JUNI 2026 23:45 PM",
  },
  {
    uuid: "3",
    nama: "Prasetyo Teguh",
    nip: "1234",
    isi_pesan: "Lampu di Lokasi A mati, tolong di ganti yang baru",
    tanggal_dikirim: "30 JUNI 2026 05:45 AM",
  },
  {
    uuid: "4",
    nama: "Prasetyo Teguh",
    nip: "1234",
    isi_pesan: "Lampu di Lokasi A mati, tolong di ganti yang baru",
    tanggal_dikirim: "01 JULI 2026 08:45 AM",
  },
];

const ROWS_PER_PAGE = 10;

const COLUMNS = [
  { name: "No", uid: "no" },
  { name: "Nama", uid: "nama" },
  { name: "NIP", uid: "nip" },
  { name: "Isi Pesan", uid: "isi_pesan" },
  { name: "Tanggal dikirim", uid: "tanggal_dikirim" },
];

const ClientRiwayatPesan = () => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(dummyData.length / ROWS_PER_PAGE);
  const paginatedData = dummyData.slice(
    (page - 1) * ROWS_PER_PAGE,
    page * ROWS_PER_PAGE,
  );

  return (
    <div className="flex flex-col gap-2 p-2.5 overflow-hidden">
      {/* Header here */}
      <div className="header-container flex flex-row items-center justify-between mt-2">
        <div className="flex flex-col items-start">
          <h2 className="font-semibold text-2xl text-[#122C93]">
            Riwayat Pesan
          </h2>
          <p className="text-md text-black text-sm w-230">
            Semua pesan yang pernah dikirim ke satpam. Untuk kirim pesan baru,
            buka Download Absensi → klik ikon chat pada satpam yang sedang
            shift.
          </p>
        </div>
      </div>
      {/* end of header */}

      {/* search engine */}
      <div className="container-search rounded-2xl flex flex-row gap-3 items-center bg-[#FFFFFF] p-3 border border-[#E4E9F7]">
        <div className="flex flex-row items-center gap-2 bg-white border border-[#E4E9F7] rounded-xl px-4 h-11 flex-1">
          <FiSearch className="text-[#B0B0B0] text-base flex-shrink-0" />
          <input
            type="search"
            placeholder="Cari histori pesan"
            className="bg-transparent text-sm text-gray-700 placeholder:text-[#B0B0B0] outline-none w-full h-full"
          />
        </div>
        <DateRangePicker
          size="sm"
          className="w-72"
          defaultValue={{
            start: parseDate("2024-04-01"),
            end: parseDate("2024-04-08"),
          }}
          label="Filter Tanggal"
          variant="bordered"
          classNames={{
            label: "!text-xs !font-light !text-[#122C93]",
          }}
        />
      </div>
      {/* end of search engine */}

      {/* Table section */}
      <div className="table-container">
        <Table
          aria-label="Tabel Riwayat Pesan"
          shadow="none"
          isStriped
          className="rounded-xl border border-[#E8EEFF]"
          bottomContent={
            totalPages > 0 ? (
              <div className="flex w-full justify-center pb-1">
                <Pagination
                  size="sm"
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={totalPages}
                  onChange={setPage}
                />
              </div>
            ) : null
          }
        >
          <TableHeader columns={COLUMNS}>
            {(column) => (
              <TableColumn
                key={column.uid}
                className="text-sm font-medium bg-[#E8E8E8] text-black"
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>

          <TableBody items={paginatedData} emptyContent="Tidak ada data">
            {(item) => (
              <TableRow key={item.uuid}>
                {(columnKey) => {
                  switch (columnKey) {
                    case "no":
                      return (
                        <TableCell className="text-sm text-black">
                          {(page - 1) * ROWS_PER_PAGE +
                            paginatedData.indexOf(item) +
                            1}
                        </TableCell>
                      );
                    case "nama":
                      return (
                        <TableCell className="text-sm text-black">
                          {item.nama}
                        </TableCell>
                      );
                    case "nip":
                      return (
                        <TableCell className="text-sm text-black">
                          {item.nip}
                        </TableCell>
                      );
                    case "isi_pesan":
                      return (
                        <TableCell className="text-sm text-black">
                          {item.isi_pesan}
                        </TableCell>
                      );
                    case "tanggal_dikirim":
                      return (
                        <TableCell>
                          <span className="bg-[#E8EEFF] text-[#122C93] text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap">
                            {item.tanggal_dikirim}
                          </span>
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
      {/* end of table section */}
    </div>
  );
};

export default ClientRiwayatPesan;
