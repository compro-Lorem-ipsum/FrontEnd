import { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Button,
  Select,
  SelectItem,
} from "@heroui/react";
import { FaUser } from "react-icons/fa6";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";

interface AkunSatpam {
  uuid: string;
  nama: string;
  email: string;
  nip: string;
  jabatan: string;
  no_telp: string;
  status: "menunggu" | "disetujui" | "ditolak";
  created_at: string;
}

export const clients = [
  { key: "all", label: "Semua Client" },
  { key: "smb", label: "Sumarecon Bandung" },
  { key: "mitra1", label: "Mitra Sejahtera" },
  { key: "mitra2", label: "Graha Properti" },
];

const dummyData: AkunSatpam[] = [
  {
    uuid: "1",
    nama: "Nama Satpam",
    email: "namasatpam@gmail.com",
    nip: "1234556",
    jabatan: "Anggota",
    no_telp: "081111111111",
    status: "menunggu",
    created_at: "20 Juni 2026",
  },
  {
    uuid: "2",
    nama: "Nama Satpam",
    email: "namasatpam@gmail.com",
    nip: "1234556",
    jabatan: "Anggota",
    no_telp: "081111111111",
    status: "menunggu",
    created_at: "20 Juni 2026",
  },
  {
    uuid: "3",
    nama: "Nama Satpam",
    email: "namasatpam@gmail.com",
    nip: "1234556",
    jabatan: "Anggota",
    no_telp: "081111111111",
    status: "menunggu",
    created_at: "20 Juni 2026",
  },
];

const statusStyles: Record<AkunSatpam["status"], string> = {
  menunggu: "bg-[#FEF6E0] text-[#B45309]",
  disetujui: "bg-[#E4F9EE] text-[#02A758]",
  ditolak: "bg-[#FCE7E9] text-[#E11D48]",
};

const statusLabels: Record<AkunSatpam["status"], string> = {
  menunggu: "Menunggu",
  disetujui: "Disetujui",
  ditolak: "Ditolak",
};

const AdminAprovalAkun = () => {
  const [page, setPage] = useState(1);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleOpen = () => {
    onOpen();
  };
  const rowsPerPage = 10;

  return (
    <div className="flex flex-col p-5">
      <div className="container-content flex flex-col gap-4">
        <div className="header-container flex flex-row items-center justify-between mt-5">
          <h2 className="font-semibold text-[25px] text-[#122C93]">
            Approval Akun Satpam
          </h2>
        </div>

        {/* Table section */}
        <div className="table-section-container mt-6">
          <Table
            aria-label="Tabel Approval Akun Satpam"
            shadow="none"
            isStriped
            className="rounded-xl border border-gray-200"
            bottomContent={
              <div className="flex w-full justify-center">
                <Pagination
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={1}
                  onChange={setPage}
                />
              </div>
            }
          >
            <TableHeader>
              <TableColumn>No</TableColumn>
              <TableColumn>Nama</TableColumn>
              <TableColumn>Email</TableColumn>
              <TableColumn>NIP</TableColumn>
              <TableColumn>Jabatan</TableColumn>
              <TableColumn>No Telp</TableColumn>
              <TableColumn align="center">Status</TableColumn>
              <TableColumn>Pembuatan</TableColumn>
              <TableColumn align="center">Aksi</TableColumn>
            </TableHeader>

            <TableBody items={dummyData} emptyContent="Tidak ada data">
              {(item) => (
                <TableRow key={item.uuid}>
                  <TableCell>
                    {(page - 1) * rowsPerPage + dummyData.indexOf(item) + 1}
                  </TableCell>
                  <TableCell>{item.nama}</TableCell>
                  <TableCell>{item.email}</TableCell>
                  <TableCell>{item.nip}</TableCell>
                  <TableCell>{item.jabatan}</TableCell>
                  <TableCell>{item.no_telp}</TableCell>
                  <TableCell>
                    <div className="flex justify-center">
                      <span
                        className={`text-xs font-medium px-3 py-1.5 rounded-full ${statusStyles[item.status]}`}
                      >
                        {statusLabels[item.status]}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{item.created_at}</TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        size="sm"
                        className="bg-[#E4F9EE] text-[#02A758] font-medium"
                        onPress={() => handleOpen()}
                      >
                        Setuju
                      </Button>
                      <Button
                        size="sm"
                        className="bg-[#FCE7E9] text-[#E11D48] font-medium"
                        onPress={() => console.log("Tolak:", item.uuid)}
                      >
                        Tolak
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {/* end of table section */}

        {/* Modal Section */}
        <Modal size="lg" isOpen={isOpen} backdrop="blur" onClose={onClose}>
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <h2 className="text-[#122C93] font-semibold">
                    Konfirmasi Persetujuan Akun
                  </h2>
                </ModalHeader>
                <ModalBody className="flex flex-col items-start gap-4">
                  <div className="container-user flex flex-row gap-3 items-center">
                    <div className="profile-content bg-[#D9D9D9] rounded-xl p-4">
                      <FaUser className="text-2xl" />
                    </div>
                    <h2 className="font-semibold text-black">Nama Satpam</h2>
                  </div>

                  <div className="container-details-user flex bg-[#F5F7FF] border border-gray-200 rounded-2xl p-6 flex-wrap flex-col h-[180px] w-full gap-x-4 gap-y-5">
                    <div className="card-1 flex flex-col items-start">
                      <h2 className="text-xs">Email</h2>
                      <h2 className="text-xs text-[#8D8787]">
                        namasatpam@gmail.com
                      </h2>
                    </div>
                    <div className="card-1 flex flex-col items-start">
                      <h2 className="text-xs">Jabatan</h2>
                      <h2 className="text-xs text-[#8D8787]">Anggota</h2>
                    </div>
                    <div className="card-1 flex flex-col items-start">
                      <h2 className="text-xs">NIP</h2>
                      <h2 className="text-xs text-[#8D8787]">123xxxx</h2>
                    </div>
                    <div className="card-1 flex flex-col items-start">
                      <h2 className="text-xs">No HP</h2>
                      <h2 className="text-xs text-[#8D8787]">
                        081xx - xxxx - xxxx
                      </h2>
                    </div>
                    <div className="card-1 flex flex-col items-start">
                      <h2 className="text-xs">Asal Daerah</h2>
                      <h2 className="text-xs text-[#8D8787]">Ngawi</h2>
                    </div>
                    <div className="card-1 flex flex-col items-start">
                      <h2 className="text-xs">Jenis Kelamin</h2>
                      <h2 className="text-xs text-[#8D8787]">Laki - laki</h2>
                    </div>
                  </div>

                  <Select
                    className="w-full"
                    label="Assign Mitra (Opsional)"
                    labelPlacement="outside-top"
                    placeholder="Pilih Mitra"
                    classNames={{
                      trigger:
                        "bg-white border border-[#E4E9F7] rounded-xl shadow-none h-11 min-h-11 data-[hover=true]:bg-white",
                      value: "text-[#8D8787] text-sm",
                      label: "font-semibold text-[#122C93]",
                    }}
                  >
                    {clients.map((c) => (
                      <SelectItem key={c.key}>{c.label}</SelectItem>
                    ))}
                  </Select>
                </ModalBody>
                <ModalFooter>
                  <Button variant="bordered" onPress={onClose}>
                    Batal
                  </Button>
                  <Button
                    className="bg-[#122C93] text-white font-medium"
                    onPress={onClose}
                  >
                    Simpan
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
        {/* end of modal section */}
      </div>
    </div>
  );
};

export default AdminAprovalAkun;
