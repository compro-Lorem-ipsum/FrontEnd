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
  Spinner,
  addToast,
  Pagination,
  Select,
  SelectItem,
} from "@heroui/react";
import { FaEdit, FaDownload } from "react-icons/fa";

interface Absensi {
  uuid: string;
  nama_satpam: string;
  nip: string;
  check_in: string | null;
  check_out: string | null;
  kategori: string;
  created_at: string;
}

const AdminRekapAbsensi = () => {
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

  const [dataAbsen, setDataAbsen] = useState<Absensi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const rowsPerPage = 12;

  const [formData, setFormData] = useState({
    check_in: "",
    check_out: "",
    kategori: "",
  });

  const fetchAbsensi = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${baseUrl}/v1/absensi/?pid=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (result.data && Array.isArray(result.data.data)) {
        setDataAbsen(result.data.data);
        if (result.data.pagination) {
          setTotalPages(result.data.pagination.total_pages);
        }
      } else {
        setDataAbsen([]);
      }
    } catch (error) {
      addToast({
        title: "Gagal",
        description: "Gagal memuat data absensi",
        color: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  }, [token, baseUrl, page]);

  useEffect(() => {
    fetchAbsensi();
  }, [fetchAbsensi]);

  const toDateTimeLocal = (isoString: string | null) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const offset = date.getTimezoneOffset() * 60000;
    const localISOTime = new Date(date.getTime() - offset)
      .toISOString()
      .slice(0, 16);
    return localISOTime;
  };

  const handleOpenEdit = async (uuid: string) => {
    setSelectedUuid(uuid);
    try {
      const response = await fetch(`${baseUrl}/v1/absensi/${uuid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      const item = result.data;

      if (item) {
        setFormData({
          check_in: toDateTimeLocal(item.check_in),
          check_out: toDateTimeLocal(item.check_out),
          kategori: item.kategori || "",
        });
        onOpen();
      }
    } catch (error) {
      addToast({
        title: "Error",
        description: "Gagal mengambil detail data",
        color: "danger",
      });
    }
  };

  const handleSubmit = async () => {
    if (!selectedUuid) return;

    const payload: any = {};

    if (formData.check_in) {
      try {
        payload.check_in = new Date(formData.check_in).toISOString();
      } catch (e) {
        addToast({
          title: "Error",
          description: "Format Check In Salah",
          color: "danger",
        });
        return;
      }
    }

    if (formData.check_out) {
      try {
        payload.check_out = new Date(formData.check_out).toISOString();
      } catch (e) {
        addToast({
          title: "Error",
          description: "Format Check Out Salah",
          color: "danger",
        });
        return;
      }
    }

    if (formData.kategori) {
      payload.kategori = formData.kategori;
    }

    if (Object.keys(payload).length === 0) {
      addToast({
        title: "Peringatan",
        description: "Tidak ada data yang diubah.",
        color: "warning",
      });
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/v1/absensi/${selectedUuid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        addToast({
          title: "Berhasil",
          description: "Data absensi diperbarui.",
          color: "success",
        });
        onClose();
        fetchAbsensi();
      } else {
        const errData = await response.json();
        throw new Error(errData.message || "Gagal update data");
      }
    } catch (error: any) {
      addToast({
        title: "Gagal",
        description: error.message || "Terjadi kesalahan saat menyimpan data.",
        color: "danger",
      });
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(`${baseUrl}/v1/absensi/export`, {
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
      a.download = `rekap_absensi_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      addToast({
        title: "Gagal",
        description: "Terjadi kesalahan saat mengunduh file.",
        color: "danger",
      });
    }
  };

  return (
    <div className="flex flex-col gap-10 p-5">
      <div className="container-content flex flex-col gap-4">
        <div className="header-container flex flex-row items-center justify-between mt-5">
          <h2 className="font-semibold text-[25px] text-[#122C93]">
            Rekap Absensi Satpam
          </h2>
          <Button
            onPress={handleDownload}
            className="bg-[#122C93] text-white font-semibold h-12 px-6"
            startContent={<FaDownload />}
          >
            Download
          </Button>
        </div>

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
            <TableColumn>Kategori</TableColumn>
            <TableColumn>Waktu Check In</TableColumn>
            <TableColumn>Waktu Check Out</TableColumn>
            <TableColumn className="text-center">Aksi</TableColumn>
          </TableHeader>
          <TableBody
            emptyContent="Data tidak ditemukan"
            isLoading={isLoading}
            loadingContent={<Spinner />}
          >
            {dataAbsen.map((item, index) => (
              <TableRow key={item.uuid}>
                <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                <TableCell>{item.nama_satpam}</TableCell>
                <TableCell>{item.nip}</TableCell>
                <TableCell>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      item.kategori === "Tepat Waktu"
                        ? "bg-green-100 text-green-700"
                        : item.kategori === "Terlambat"
                          ? "bg-yellow-100 text-yellow-700"
                          : item.kategori === "Alpha"
                            ? "bg-red-100 text-red-700"
                            : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {item.kategori}
                  </span>
                </TableCell>
                <TableCell>
                  {item.check_in
                    ? new Date(item.check_in).toLocaleString("id-ID")
                    : "-"}
                </TableCell>
                <TableCell>
                  {item.check_out
                    ? new Date(item.check_out).toLocaleString("id-ID")
                    : "-"}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    size="sm"
                    onPress={() => handleOpenEdit(item.uuid)}
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

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-[#122C93]">
                Edit Data Absensi
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-6 p-2">
                  <div className="flex flex-col gap-4">
                    <Input
                      label="Waktu Check In"
                      type="datetime-local"
                      variant="underlined"
                      labelPlacement="outside"
                      value={formData.check_in}
                      onChange={(e) =>
                        setFormData({ ...formData, check_in: e.target.value })
                      }
                    />

                    <Input
                      label="Waktu Check Out"
                      type="datetime-local"
                      variant="underlined"
                      labelPlacement="outside"
                      value={formData.check_out}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          check_out: e.target.value,
                        })
                      }
                    />

                    <Select
                      label="Kategori Kehadiran"
                      variant="underlined"
                      labelPlacement="outside"
                      placeholder="Pilih Kategori"
                      selectedKeys={
                        formData.kategori ? [formData.kategori] : []
                      }
                      onChange={(e) =>
                        setFormData({ ...formData, kategori: e.target.value })
                      }
                    >
                      <SelectItem key="Tepat Waktu">Tepat Waktu</SelectItem>
                      <SelectItem key="Terlambat">Terlambat</SelectItem>
                      <SelectItem key="Izin">Izin</SelectItem>
                      <SelectItem key="Alpha">Alpha</SelectItem>
                    </Select>
                  </div>
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
    </div>
  );
};

export default AdminRekapAbsensi;
