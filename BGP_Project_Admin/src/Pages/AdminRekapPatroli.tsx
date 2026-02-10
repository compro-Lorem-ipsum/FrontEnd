import { useState, useEffect, useCallback } from "react";
import {
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Input,
  Select,
  SelectItem,
  Spinner,
  addToast,
  Tooltip,
  Pagination,
} from "@heroui/react";
import { FaEdit, FaDownload, FaImage } from "react-icons/fa";

interface Patroli {
  uuid: string;
  nama_satpam: string;
  nip: string;
  nama_pos: string;
  status_lokasi: string;
  keterangan: string;
  created_at: string;
  images: string[];
}

const AdminRekapPatroli = () => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  const getToken = (): string | undefined => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    return token;
  };

  const token = getToken();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isOpenImage,
    onOpen: onOpenImage,
    onClose: onCloseImage,
  } = useDisclosure();

  const [dataPatroli, setDataPatroli] = useState<Patroli[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 12;

  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    status_lokasi: "",
    keterangan: "",
  });

  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const fetchPatroli = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/v1/patroli/?pid=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (result.data && Array.isArray(result.data.data)) {
        setDataPatroli(result.data.data);

        if (result.data.pagination) {
          setTotalPages(result.data.pagination.total_pages);
        }
      } else {
        setDataPatroli([]);
      }
    } catch (error) {
      console.error(error);
      addToast({
        title: "Gagal",
        description: "Gagal memuat data patroli",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  }, [token, baseUrl, page]);

  useEffect(() => {
    fetchPatroli();
  }, [fetchPatroli]);

  const handleOpenEdit = (item: Patroli) => {
    setSelectedUuid(item.uuid);
    setFormData({
      status_lokasi: item.status_lokasi,
      keterangan: item.keterangan,
    });
    onOpen();
  };

  const handleSubmit = async () => {
    if (!selectedUuid) return;

    try {
      const response = await fetch(`${baseUrl}/v1/patroli/${selectedUuid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        addToast({
          title: "Berhasil",
          description: "Laporan patroli diperbarui.",
          color: "success",
        });
        onClose();
        fetchPatroli();
      } else {
        throw new Error("Gagal update");
      }
    } catch (error) {
      console.error(error);
      addToast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menyimpan data.",
        color: "danger",
      });
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(`${baseUrl}/v1/patroli/export`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Gagal mengunduh file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "rekap_patroli.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      addToast({
        title: "Gagal",
        description: "Terjadi kesalahan saat mengunduh file.",
        color: "danger",
      });
    }
  };

  const handleViewImages = (images: string[]) => {
    setPreviewImages(images);
    onOpenImage();
  };

  return (
    <div className="flex flex-col gap-10 p-5">
      <div className="container-content flex flex-col gap-4">
        {/* HEADER */}
        <div className="header-container flex flex-row items-center justify-between mt-5">
          <h2 className="font-semibold text-[25px] text-[#122C93]">
            Rekap Patroli Satpam
          </h2>
          <Button
            onPress={handleDownload}
            className="bg-[#122C93] text-white font-semibold h-12 px-6"
            startContent={<FaDownload />}
          >
            Download
          </Button>
        </div>

        {/* TABLE */}
        <Table
          isStriped
          shadow="none"
          className="border border-gray-200 rounded-xl"
          bottomContent={
            totalPages > 0 ? (
              <div className="flex w-full justify-center">
                <Pagination
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={totalPages}
                  onChange={(p) => setPage(p)}
                />
              </div>
            ) : null
          }
        >
          <TableHeader>
            <TableColumn>No</TableColumn>
            <TableColumn>Nama</TableColumn>
            <TableColumn>NIP</TableColumn>
            <TableColumn>Waktu</TableColumn>
            <TableColumn>Pos</TableColumn>
            <TableColumn>Status</TableColumn>
            <TableColumn>Keterangan</TableColumn>
            <TableColumn className="text-center">Dokumentasi</TableColumn>
            <TableColumn className="text-center">Aksi</TableColumn>
          </TableHeader>
          <TableBody
            emptyContent="Data tidak ditemukan"
            isLoading={isLoading}
            loadingContent={<Spinner />}
          >
            {dataPatroli.map((item, index) => (
              <TableRow key={item.uuid}>
                <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                <TableCell>{item.nama_satpam}</TableCell>
                <TableCell>{item.nip}</TableCell>
                <TableCell>{item.created_at}</TableCell>
                <TableCell>{item.nama_pos}</TableCell>
                <TableCell>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.status_lokasi === "Aman"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.status_lokasi}
                  </span>
                </TableCell>
                <TableCell className="max-w-[200px] truncate">
                  {item.keterangan}
                </TableCell>
                <TableCell>
                  <div className="flex justify-center">
                    {item.images && item.images.length > 0 ? (
                      <Tooltip content="Lihat Foto">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="light"
                          className="text-[#122C93]"
                          onPress={() => handleViewImages(item.images)}
                        >
                          <FaImage size={18} />
                        </Button>
                      </Tooltip>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    size="sm"
                    onPress={() => handleOpenEdit(item)}
                    className="bg-[#02A758] text-white font-semibold"
                    startContent={<FaEdit />}
                  >
                    Ubah
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* MODAL EDIT */}
      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-[#122C93]">
                Edit Laporan Patroli
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-6 p-2">
                  <Select
                    label="Status Lokasi"
                    variant="underlined"
                    labelPlacement="outside"
                    placeholder="Pilih Status"
                    selectedKeys={
                      formData.status_lokasi ? [formData.status_lokasi] : []
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status_lokasi: e.target.value,
                      })
                    }
                  >
                    <SelectItem key="Aman">Aman</SelectItem>
                    <SelectItem key="Tidak Aman">Tidak Aman</SelectItem>
                  </Select>
                  <Input
                    label="Keterangan"
                    variant="underlined"
                    labelPlacement="outside"
                    placeholder="Keterangan situasi..."
                    value={formData.keterangan}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        keterangan: e.target.value,
                      })
                    }
                  />
                </div>
              </ModalBody>
              <ModalFooter className="flex justify-center pb-8">
                <Button variant="light" color="danger" onPress={onClose}>
                  Batal
                </Button>
                <Button
                  className="bg-[#122C93] text-white px-10"
                  onPress={handleSubmit}
                >
                  Simpan Perubahan
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* MODAL IMAGE PREVIEW */}
      <Modal
        isOpen={isOpenImage}
        onClose={onCloseImage}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-[#122C93]">
                Dokumentasi Patroli
              </ModalHeader>
              <ModalBody>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                  {previewImages.map((url, index) => (
                    <div key={index} className="flex flex-col gap-2">
                      <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm h-64">
                        <img
                          src={url}
                          alt={`Patroli-${index}`}
                          className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => window.open(url, "_blank")}
                        />
                      </div>
                      <span className="text-xs text-center text-gray-500">
                        Gambar {index + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </ModalBody>
              <ModalFooter>
                <Button className="bg-[#122C93] text-white" onPress={onClose}>
                  Tutup
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AdminRekapPatroli;
