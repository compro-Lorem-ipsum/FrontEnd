import { useState, useMemo } from "react";
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
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Textarea,
} from "@heroui/react";
import type { Selection } from "@heroui/react";
import { FiSearch } from "react-icons/fi";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { LuDownload } from "react-icons/lu";
import { FaFilePdf } from "react-icons/fa6";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { IoClose } from "react-icons/io5";

export const clients = [
  { key: "all", label: "Semua Client" },
  { key: "smb", label: "Sumarecon Bandung" },
  { key: "mitra1", label: "Mitra Sejahtera" },
  { key: "mitra2", label: "Graha Properti" },
];

export const jenisDokumen = [
  { key: "peraturan", label: "Peraturan" },
  { key: "atribut", label: "Atribut" },
  { key: "sop", label: "SOP" },
  { key: "lainnya", label: "Lainnya" },
];

export const satpamTargets = [
  { key: "semua", label: "Semua Satpam" },
  { key: "smb", label: "Sumarecon Bandung" },
  { key: "mitra1", label: "Mitra Sejahtera" },
  { key: "mitra2", label: "Graha Properti" },
];

const labelClass = "text-xs font-semibold text-[#122C93]";

interface DokumenItem {
  uuid: string;
  judul: string;
  deskripsi: string;
  file_name: string;
  tujuan: "semua" | "client";
  nama_client?: string;
  diunggah: string;
}

const dummyData: DokumenItem[] = [
  {
    uuid: "1",
    judul: "Panduan Penggunaan APAR",
    deskripsi:
      "Tata cara penggunaan alat pemadam api ringan saat keadaan darurat.",
    file_name: "Nama File",
    tujuan: "semua",
    diunggah: "05 Jun 2026, 16:00",
  },
  {
    uuid: "2",
    judul: "Judul Dokumen",
    deskripsi: "Deskripsi",
    file_name: "Nama File",
    tujuan: "client",
    nama_client: "Nama client",
    diunggah: "dd/mm/yyyy, --:--",
  },
  {
    uuid: "3",
    judul: "Judul Dokumen",
    deskripsi: "Deskripsi",
    file_name: "Nama File",
    tujuan: "semua",
    diunggah: "dd/mm/yyyy, --:--",
  },
];

const columns = [
  { name: "No", uid: "no" },
  { name: "Nama Dokumen", uid: "nama_dokumen" },
  { name: "File", uid: "file" },
  { name: "Tujuan", uid: "tujuan" },
  { name: "Diunggah", uid: "diunggah" },
  { name: "Aksi", uid: "aksi" },
];

const ALL_KEY = "semua";

const AdminRepositoriDokumen = () => {
  const loading = false;
  const page = 1;
  const totalPages = 1;
  const rowsPerPage = 10;

  const modalDokumen = useDisclosure();
  const [selectedItem, setSelectedItem] = useState<DokumenItem | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]));

  const handleSelectionChange = (keys: Selection) => {
    setSelectedKeys(keys);
  };
  const clearAll = () => setSelectedKeys(new Set([]));

  const selectedCount = useMemo(() => {
    if (selectedKeys === "all") return satpamTargets.length;
    const keySet = selectedKeys as Set<string>;
    return keySet.has(ALL_KEY) ? satpamTargets.length - 1 : keySet.size;
  }, [selectedKeys]);

  const selectedLabels = useMemo(() => {
    if (selectedKeys === "all") {
      return satpamTargets.map((t) => t.label);
    }
    return satpamTargets
      .filter((t) => (selectedKeys as Set<string>).has(t.key))
      .map((t) => t.label);
  }, [selectedKeys]);

  const handleTambah = () => {
    setSelectedItem(null);
    setSelectedKeys(new Set([]));
    modalDokumen.onOpen();
  };

  const handleEdit = (item: DokumenItem) => {
    setSelectedItem(item);
    setSelectedKeys(new Set([]));
    modalDokumen.onOpen();
  };

  return (
    <div className="flex flex-col gap-2 p-2.5 overflow-hidden">
      <div className="header-container flex flex-row items-center justify-between mt-2">
        <div className="flex flex-col items-start">
          <h2 className="font-semibold text-2xl text-[#122C93]">
            Repositori Dokumen
          </h2>
          <p className="text-md text-black text-sm w-200">
            Upload dokumen (peraturan, atribut, dll) yang bisa dilihat & diunduh
            satpam via aplikasi. Bisa untuk semua satpam atau client tertentu.
          </p>
        </div>
        <Button
          className="text-white font-semibold bg-[#122C93]"
          size="md"
          onPress={handleTambah}
        >
          + Upload Dokumen
        </Button>
      </div>

      <div className="container-search rounded-2xl flex flex-row gap-3 items-center bg-[#FFFFFF] p-3 border border-[#E4E9F7]">
        <div className="flex flex-row items-center gap-2 bg-white border border-[#E4E9F7] rounded-xl px-4 h-11 flex-1">
          <FiSearch className="text-[#B0B0B0] text-base flex-shrink-0" />
          <input
            type="search"
            placeholder="Cari nama dokumen, atau nama mitra"
            className="bg-transparent text-sm text-gray-700 placeholder:text-[#B0B0B0] outline-none w-full h-full"
          />
        </div>
        <Select
          className="w-48"
          placeholder="Semua Client"
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
      </div>

      <div className="main-content flex flex-col gap-2 rounded-2xl border border-[#E4E9F7] bg-white">
        <Table
          aria-label="Tabel Repositori Dokumen"
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
                align={column.uid === "aksi" ? "center" : "start"}
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
                    case "nama_dokumen":
                      return (
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-black">
                              {item.judul}
                            </span>
                            <span className="text-sm font-light text-[#8D8787] w-[280px] truncate">
                              {item.deskripsi}
                            </span>
                          </div>
                        </TableCell>
                      );
                    case "file":
                      return (
                        <TableCell>
                          <div className="flex flex-row items-center gap-2">
                            <FaFilePdf className="text-[#E5493A] text-2xl" />
                            <span className="text-sm text-black">
                              {item.file_name}
                            </span>
                          </div>
                        </TableCell>
                      );
                    case "tujuan":
                      return (
                        <TableCell>
                          {item.tujuan === "semua" ? (
                            <span className="bg-[#E8EEFF] text-[#122C93] text-xs font-medium px-3 py-1.5 rounded-full">
                              Semua satpam
                            </span>
                          ) : (
                            <span className="bg-[#E4F9EE] text-[#02A758] text-xs font-medium px-3 py-1.5 rounded-full">
                              {item.nama_client}
                            </span>
                          )}
                        </TableCell>
                      );
                    case "diunggah":
                      return <TableCell>{item.diunggah}</TableCell>;
                    case "aksi":
                      return (
                        <TableCell>
                          <div className="flex justify-center gap-2">
                            <button
                              className="border border-[#C7D2FE] text-[#122C93] rounded-lg p-2 hover:bg-[#F5F7FF]"
                              onClick={() => handleEdit(item)}
                            >
                              <FaRegEdit className="text-base" />
                            </button>
                            <button className="border border-[#C7D2FE] text-[#122C93] rounded-lg p-2 hover:bg-[#F5F7FF]">
                              <LuDownload className="text-base" />
                            </button>
                            <button className="border border-[#C7D2FE] text-[#A70202] rounded-lg p-2 hover:bg-[#FDEDED]">
                              <FaRegTrashAlt className="text-base" />
                            </button>
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

      {/* Modal here */}
      <Modal
        isOpen={modalDokumen.isOpen}
        onOpenChange={modalDokumen.onOpenChange}
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-[#122C93] font-semibold">
                {selectedItem ? "Edit Dokumen" : "Tambah Dokumen"}
              </ModalHeader>
              <ModalBody className="gap-3">
                <Input
                  label="Judul / Nama"
                  labelPlacement="outside-top"
                  placeholder="mis. SOP Kebakaran"
                  isRequired
                  variant="bordered"
                  classNames={{ label: labelClass }}
                />
                <Textarea
                  label="Deskripsi (Opsional)"
                  labelPlacement="outside-top"
                  placeholder="Ringkasan isi dokumen"
                  variant="bordered"
                  classNames={{ label: labelClass }}
                />

                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#122C93]">
                    Upload Dokumen <span className="text-danger">*</span>
                  </span>
                  <label
                    htmlFor="upload-dokumen"
                    className="flex flex-col items-center justify-center w-full h-36 bg-[#F5F7FF] border-2 border-dashed border-[#8D8787] rounded-xl cursor-pointer hover:bg-[#e6ecff] transition-colors"
                  >
                    <div className="flex flex-col items-center gap-1 text-[#9095A0]">
                      <AiOutlineCloudUpload className="text-2xl" />
                      <span className="text-xs font-medium text-[#6B7280]">
                        {selectedItem
                          ? selectedItem.file_name
                          : "Unggah Dokumen"}
                      </span>
                      <span className="text-xs text-[#9CA3AF]">
                        PDF, PNG/JPG
                      </span>
                    </div>
                    <input
                      id="upload-dokumen"
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg"
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex flex-col gap-1.5">
                  {/* Label row dengan counter + clear */}
                  <div className="flex flex-row items-center justify-between">
                    <span className="text-sm font-semibold text-[#122C93]">
                      Target Penerima <span className="text-danger">*</span>
                    </span>
                    {selectedCount > 0 && (
                      <div className="flex flex-row items-center gap-1.5">
                        <span className="inline-flex items-center justify-center bg-[#122C93] text-white text-[10px] font-semibold rounded-full w-5 h-5">
                          {selectedCount}
                        </span>
                        <span className="text-[11px] text-[#8D8787]">
                          terpilih
                        </span>
                        <button
                          onClick={clearAll}
                          className="flex items-center justify-center w-4 h-4 rounded-full bg-[#E4E9F7] hover:bg-[#DBEAFE] transition-colors"
                        >
                          <IoClose className="text-[#122C93] text-[10px]" />
                        </button>
                      </div>
                    )}
                  </div>
                  {/* Select */}
                  <div className="flex flex-col border border-[#E4E9F7] rounded-xl overflow-hidden">
                    <Select
                      className="max-w-full"
                      labelPlacement="outside-top"
                      variant="bordered"
                      placeholder="Pilih target penerima"
                      selectedKeys={selectedKeys}
                      selectionMode="multiple"
                      onSelectionChange={handleSelectionChange}
                      renderValue={() => (
                        <span className="text-sm text-gray-700">
                          Pilih target penerima
                        </span>
                      )}
                      classNames={{
                        trigger:
                          "border-none shadow-none rounded-none rounded-t-xl data-[hover=true]:bg-white",
                        label: "text-sm font-semibold text-[#122C93]",
                      }}
                    >
                      {satpamTargets.map((t) => (
                        <SelectItem key={t.key}>{t.label}</SelectItem>
                      ))}
                    </Select>

                    {selectedLabels.length > 0 && (
                      <div className="flex flex-row flex-wrap gap-x-1 gap-y-0.5 px-3 py-2 border-t border-[#E4E9F7] bg-[#F5F7FF]">
                        {selectedLabels.map((label, i) => (
                          <span
                            key={label}
                            className="text-xs text-[#122C93] font-medium"
                          >
                            {label}
                            {i < selectedLabels.length - 1 ? "," : ""}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
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
      {/* end of modal */}
    </div>
  );
};

export default AdminRepositoriDokumen;
