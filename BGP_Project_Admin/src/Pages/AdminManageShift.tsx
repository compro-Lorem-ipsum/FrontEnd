import { useState, useEffect, useCallback } from "react";
import {
  Button,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  DatePicker,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Select,
  SelectItem,
  Spinner,
  CheckboxGroup,
  Checkbox,
  addToast,
  Pagination,
} from "@heroui/react";
import { FaEdit, FaTrash, FaExclamationTriangle } from "react-icons/fa";
import { CalendarDate, parseDate } from "@internationalized/date";

interface SatpamOption {
  uuid: string;
  nama: string;
  nip: string;
}

interface ShiftOption {
  uuid: string;
  nama: string;
  mulai: string;
  selesai: string;
}

interface PosOption {
  uuid: string;
  nama: string;
}

interface Jadwal {
  uuid: string;
  tanggal: string;
  satpam_id: number;
  user_id: number;
  satpam_name: string;
  shift_nama: string;
  mulai: string;
  selesai: string;
  nama_pos: string;
}

interface FormData {
  satpam_uuid: string;
  pos_uuid: string;
  shift_uuid: string;
  tanggal: CalendarDate | null;
}

interface GenerateFormData {
  satpam_uuid: string;
  pos_uuid: string;
  shift_uuid: string;
  start_date: CalendarDate | null;
  end_date: CalendarDate | null;
  days_of_week: string[];
}

const AdminManageShift = () => {
  const BASE_URL_API = import.meta.env.VITE_API_BASE_URL;

  const getToken = (): string | undefined => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
    return token;
  };

  const token = getToken();

  const {
    isOpen: isOpenGenerate,
    onOpen: onOpenGenerate,
    onClose: onCloseGenerate,
  } = useDisclosure();

  const {
    isOpen: isOpenForm,
    onOpen: onOpenForm,
    onClose: onCloseForm,
  } = useDisclosure();

  const [listSatpam, setListSatpam] = useState<SatpamOption[]>([]);
  const [listPos, setListPos] = useState<PosOption[]>([]);
  const [listShift, setListShift] = useState<ShiftOption[]>([]);
  const [dataJadwal, setDataJadwal] = useState<Jadwal[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedUuid, setSelectedUuid] = useState<string | null>(null);

  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTargetUuid, setDeleteTargetUuid] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(12);

  const [formData, setFormData] = useState<FormData>({
    satpam_uuid: "",
    pos_uuid: "",
    shift_uuid: "",
    tanggal: null,
  });

  const [generateData, setGenerateData] = useState<GenerateFormData>({
    satpam_uuid: "",
    pos_uuid: "",
    shift_uuid: "",
    start_date: null,
    end_date: null,
    days_of_week: [],
  });

  const [errors, setErrors] = useState<any>({});

  const getHari = (dateString: string) => {
    const days = [
      "Minggu",
      "Senin",
      "Selasa",
      "Rabu",
      "Kamis",
      "Jumat",
      "Sabtu",
    ];
    return days[new Date(dateString).getDay()];
  };

  const fetchJadwal = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${BASE_URL_API}/v1/jadwal/?pid=${page}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();

      if (result.data && Array.isArray(result.data.data)) {
        setDataJadwal(result.data.data);
        if (result.data.pagination) {
          setTotalPages(result.data.pagination.total_pages);
          setRowsPerPage(result.data.pagination.items_per_page);
        }
      } else {
        setDataJadwal([]);
      }
    } catch (error) {
      console.error(error);
      addToast({ title: "Gagal memuat jadwal", color: "danger" });
    } finally {
      setIsLoading(false);
    }
  }, [token, BASE_URL_API, page]);

  useEffect(() => {
    const fetchDropdowns = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [resSatpam, resShift, resPos] = await Promise.all([
          fetch(`${BASE_URL_API}/v1/satpam/options`, { headers }),
          fetch(`${BASE_URL_API}/v1/shifts/options`, { headers }),
          fetch(`${BASE_URL_API}/v1/pos/options/utama`, { headers }),
        ]);

        const dSatpam = await resSatpam.json();
        const dShift = await resShift.json();
        const dPos = await resPos.json();

        setListSatpam(dSatpam.data || []);
        setListShift(dShift.data || []);
        setListPos(dPos.data || []);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    };

    if (isOpenForm || isOpenGenerate) fetchDropdowns();
  }, [isOpenForm, isOpenGenerate, token, BASE_URL_API]);

  useEffect(() => {
    fetchJadwal();
  }, [fetchJadwal]);

  const handleOpenAdd = () => {
    setSelectedUuid(null);
    setFormData({
      satpam_uuid: "",
      pos_uuid: "",
      shift_uuid: "",
      tanggal: null,
    });
    setErrors({});
    onOpenForm();
  };

  const handleOpenEdit = async (uuid: string) => {
    setSelectedUuid(uuid);
    setErrors({});

    const existingItem = dataJadwal.find((item) => item.uuid === uuid);
    let initialData = {
      satpam_uuid: "",
      pos_uuid: "",
      shift_uuid: "",
      tanggal: null as CalendarDate | null,
    };

    if (existingItem) {
      const foundSatpam = listSatpam.find(
        (s) => s.nama === existingItem.satpam_name,
      );
      const foundPos = listPos.find((p) => p.nama === existingItem.nama_pos);
      const foundShift = listShift.find(
        (s) =>
          s.nama === existingItem.shift_nama && s.mulai === existingItem.mulai,
      );

      initialData = {
        satpam_uuid: foundSatpam ? foundSatpam.uuid : "",
        pos_uuid: foundPos ? foundPos.uuid : "",
        shift_uuid: foundShift ? foundShift.uuid : "",
        tanggal: existingItem.tanggal ? parseDate(existingItem.tanggal) : null,
      };
    }

    setFormData(initialData);
    onOpenForm();

    try {
      const res = await fetch(`${BASE_URL_API}/v1/jadwal/${uuid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      const item = result.data || result;

      if (item && item.satpam_uuid && item.pos_uuid && item.shift_uuid) {
        setFormData({
          satpam_uuid: item.satpam_uuid,
          pos_uuid: item.pos_uuid,
          shift_uuid: item.shift_uuid,
          tanggal: item.tanggal ? parseDate(item.tanggal.split("T")[0]) : null,
        });
      }
    } catch (error) {
      console.error("Error fetching detail, using fallback data:", error);
    }
  };

  const validateForm = () => {
    const newErrors: any = {};
    if (!formData.satpam_uuid) newErrors.satpam_uuid = "Satpam wajib dipilih";
    if (!formData.pos_uuid) newErrors.pos_uuid = "Pos wajib dipilih";
    if (!formData.shift_uuid) newErrors.shift_uuid = "Shift wajib dipilih";
    if (!formData.tanggal) newErrors.tanggal = "Tanggal wajib diisi";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitShift = async () => {
    if (!validateForm()) {
      addToast({
        title: "Validasi Gagal",
        description: "Periksa kembali inputan anda",
        color: "warning",
      });
      return;
    }

    const body = {
      satpam_uuid: formData.satpam_uuid,
      pos_uuid: formData.pos_uuid,
      shift_uuid: formData.shift_uuid,
      tanggal: formData.tanggal!.toString(),
    };

    const url = selectedUuid
      ? `${BASE_URL_API}/v1/jadwal/${selectedUuid}`
      : `${BASE_URL_API}/v1/jadwal/`;

    try {
      const res = await fetch(url, {
        method: selectedUuid ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        addToast({
          title: "Berhasil",
          description: `Data berhasil ${selectedUuid ? "diubah" : "ditambahkan"}`,
          color: "success",
        });
        onCloseForm();
        if (!selectedUuid) setPage(1);
        fetchJadwal();
      } else {
        const err = await res.json();
        throw new Error(err.message || "Gagal menyimpan");
      }
    } catch (error: any) {
      addToast({ title: "Gagal", description: error.message, color: "danger" });
    }
  };

  const validateGenerate = () => {
    const newErrors: any = {};
    if (!generateData.start_date)
      newErrors.start_date = "Tanggal Mulai wajib diisi";
    if (!generateData.end_date)
      newErrors.end_date = "Tanggal Berakhir wajib diisi";
    if (!generateData.satpam_uuid)
      newErrors.satpam_uuid = "Satpam wajib dipilih";
    if (!generateData.pos_uuid) newErrors.pos_uuid = "Pos wajib dipilih";
    if (!generateData.shift_uuid) newErrors.shift_uuid = "Shift wajib dipilih";
    if (generateData.days_of_week.length === 0)
      newErrors.days_of_week = "Pilih minimal satu hari kerja";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGenerateSubmit = async () => {
    if (!validateGenerate()) {
      addToast({
        title: "Validasi Gagal",
        description: "Lengkapi form generate",
        color: "warning",
      });
      return;
    }

    const body = {
      satpam_uuid: generateData.satpam_uuid,
      pos_uuid: generateData.pos_uuid,
      shift_uuid: generateData.shift_uuid,
      start_date: generateData.start_date!.toString(),
      end_date: generateData.end_date!.toString(),
      days_of_week: generateData.days_of_week.map(Number),
    };

    try {
      const res = await fetch(`${BASE_URL_API}/v1/jadwal/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        addToast({
          title: "Berhasil",
          description: "Jadwal rutin berhasil dibuat",
          color: "success",
        });
        onCloseGenerate();
        setPage(1);
        fetchJadwal();
      } else {
        const err = await res.json();
        throw new Error(err.message || "Gagal generate jadwal");
      }
    } catch (error: any) {
      addToast({
        title: "Gagal generate",
        description: error.message,
        color: "danger",
      });
    }
  };

  const openDeleteModal = (uuid: string) => {
    setDeleteTargetUuid(uuid);
    setDeleteModalOpen(true);
  };

  const executeDelete = async () => {
    if (!deleteTargetUuid) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`${BASE_URL_API}/v1/jadwal/${deleteTargetUuid}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        addToast({
          title: "Berhasil",
          description: "Data shift berhasil dihapus",
          color: "danger",
        });
        fetchJadwal();
        setDeleteModalOpen(false);
      } else {
        throw new Error("Gagal menghapus");
      }
    } catch (error) {
      addToast({
        title: "Gagal",
        description: "Gagal menghapus data shift",
        color: "danger",
      });
    } finally {
      setIsDeleting(false);
      setDeleteTargetUuid(null);
    }
  };

  return (
    <div className="flex flex-col p-5">
      <div className="container-content flex flex-col gap-4">
        <div className="header-container flex flex-row items-center justify-between mt-5">
          <h2 className="font-semibold text-[25px] text-[#122C93]">
            Manage Shift
          </h2>
          <div className="container-generate flex flex-row gap-5">
            <Button
              onPress={onOpenGenerate}
              className="bg-[#122C93] text-white font-semibold h-10"
            >
              Generate Jadwal +
            </Button>
            <Button
              onPress={handleOpenAdd}
              className="bg-[#122C93] text-white font-semibold h-10"
            >
              Tambah +
            </Button>
          </div>
        </div>

        <Modal
          backdrop="opaque"
          isOpen={isOpenGenerate}
          onClose={onCloseGenerate}
          size="4xl"
          scrollBehavior="inside"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="text-[#122C93]">
                  Auto-Generate Jadwal Rutin
                </ModalHeader>
                <ModalBody>
                  <div className="grid grid-cols-2 gap-10 p-3">
                    <div className="flex flex-col gap-6">
                      <DatePicker
                        label="Tanggal Mulai"
                        variant="underlined"
                        labelPlacement="outside"
                        isInvalid={!!errors.start_date}
                        errorMessage={errors.start_date}
                        onChange={(d) => {
                          setGenerateData({
                            ...generateData,
                            start_date: d as CalendarDate,
                          });
                          if (errors.start_date)
                            setErrors({ ...errors, start_date: undefined });
                        }}
                      />
                      <DatePicker
                        label="Tanggal Berakhir"
                        variant="underlined"
                        labelPlacement="outside"
                        isInvalid={!!errors.end_date}
                        errorMessage={errors.end_date}
                        onChange={(d) => {
                          setGenerateData({
                            ...generateData,
                            end_date: d as CalendarDate,
                          });
                          if (errors.end_date)
                            setErrors({ ...errors, end_date: undefined });
                        }}
                      />
                      <Select
                        label="Pos"
                        variant="underlined"
                        labelPlacement="outside"
                        placeholder="Pilih Pos"
                        isInvalid={!!errors.pos_uuid}
                        errorMessage={errors.pos_uuid}
                        selectedKeys={
                          generateData.pos_uuid ? [generateData.pos_uuid] : []
                        }
                        onSelectionChange={(k) => {
                          setGenerateData({
                            ...generateData,
                            pos_uuid: String(Array.from(k)[0]),
                          });
                          if (errors.pos_uuid)
                            setErrors({ ...errors, pos_uuid: undefined });
                        }}
                      >
                        {listPos.map((p) => (
                          <SelectItem key={p.uuid} textValue={p.nama}>
                            {p.nama}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                    <div className="flex flex-col gap-6">
                      <Select
                        label="Satpam"
                        variant="underlined"
                        labelPlacement="outside"
                        placeholder="Pilih Personel"
                        isInvalid={!!errors.satpam_uuid}
                        errorMessage={errors.satpam_uuid}
                        selectedKeys={
                          generateData.satpam_uuid
                            ? [generateData.satpam_uuid]
                            : []
                        }
                        onSelectionChange={(k) => {
                          setGenerateData({
                            ...generateData,
                            satpam_uuid: String(Array.from(k)[0]),
                          });
                          if (errors.satpam_uuid)
                            setErrors({ ...errors, satpam_uuid: undefined });
                        }}
                      >
                        {listSatpam.map((s) => (
                          <SelectItem
                            key={s.uuid}
                            textValue={`${s.nama} - ${s.nip}`}
                          >
                            {s.nama} - {s.nip}
                          </SelectItem>
                        ))}
                      </Select>

                      <Select
                        label="Shift"
                        variant="underlined"
                        labelPlacement="outside"
                        placeholder="Pilih Shift Kerja"
                        isInvalid={!!errors.shift_uuid}
                        errorMessage={errors.shift_uuid}
                        selectedKeys={
                          generateData.shift_uuid
                            ? [generateData.shift_uuid]
                            : []
                        }
                        onSelectionChange={(k) => {
                          setGenerateData({
                            ...generateData,
                            shift_uuid: String(Array.from(k)[0]),
                          });
                          if (errors.shift_uuid)
                            setErrors({ ...errors, shift_uuid: undefined });
                        }}
                      >
                        {listShift.map((s) => (
                          <SelectItem
                            key={s.uuid}
                            textValue={`${s.nama} (${s.mulai.slice(0, 5)} - ${s.selesai.slice(0, 5)})`}
                          >
                            {s.nama} ({s.mulai.slice(0, 5)} -{" "}
                            {s.selesai.slice(0, 5)})
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                    <div className="col-span-2">
                      <CheckboxGroup
                        label="Pilih Hari Kerja"
                        orientation="horizontal"
                        isInvalid={!!errors.days_of_week}
                        errorMessage={errors.days_of_week}
                        value={generateData.days_of_week}
                        onValueChange={(v) => {
                          setGenerateData({ ...generateData, days_of_week: v });
                          if (errors.days_of_week)
                            setErrors({ ...errors, days_of_week: undefined });
                        }}
                      >
                        <Checkbox value="1">Senin</Checkbox>
                        <Checkbox value="2">Selasa</Checkbox>
                        <Checkbox value="3">Rabu</Checkbox>
                        <Checkbox value="4">Kamis</Checkbox>
                        <Checkbox value="5">Jumat</Checkbox>
                        <Checkbox value="6">Sabtu</Checkbox>
                        <Checkbox value="0">Minggu</Checkbox>
                      </CheckboxGroup>
                    </div>
                  </div>
                </ModalBody>
                <ModalFooter className="flex justify-center pb-8">
                  <Button variant="light" color="danger" onPress={onClose}>
                    Batal
                  </Button>
                  <Button
                    className="bg-[#122C93] text-white px-10"
                    onPress={handleGenerateSubmit}
                  >
                    Generate Sekarang
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        <Modal
          backdrop="opaque"
          isOpen={isOpenForm}
          onClose={onCloseForm}
          size="4xl"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="text-[#122C93]">
                  {selectedUuid ? "Edit Shift" : "Tambah Shift Manual"}
                </ModalHeader>
                <ModalBody>
                  <div className="container-form flex flex-row justify-between gap-10 p-3">
                    <div className="flex flex-col gap-8 w-1/2">
                      <DatePicker
                        className="w-full"
                        label="Tanggal"
                        variant="underlined"
                        labelPlacement="outside"
                        isInvalid={!!errors.tanggal}
                        errorMessage={errors.tanggal}
                        value={formData.tanggal}
                        onChange={(d) => {
                          setFormData({
                            ...formData,
                            tanggal: d as CalendarDate,
                          });
                          if (errors.tanggal)
                            setErrors({ ...errors, tanggal: undefined });
                        }}
                      />
                      <Select
                        className="w-full"
                        label="Pos"
                        variant="underlined"
                        labelPlacement="outside"
                        placeholder="Pilih Pos"
                        isInvalid={!!errors.pos_uuid}
                        errorMessage={errors.pos_uuid}
                        selectedKeys={
                          formData.pos_uuid ? [formData.pos_uuid] : []
                        }
                        onSelectionChange={(k) => {
                          setFormData({
                            ...formData,
                            pos_uuid: String(Array.from(k)[0]),
                          });
                          if (errors.pos_uuid)
                            setErrors({ ...errors, pos_uuid: undefined });
                        }}
                      >
                        {listPos.map((p) => (
                          <SelectItem key={p.uuid} textValue={p.nama}>
                            {p.nama}
                          </SelectItem>
                        ))}
                      </Select>
                    </div>
                    <div className="flex flex-col gap-8 w-1/2">
                      <Select
                        className="w-full"
                        label="Nama & NIP"
                        variant="underlined"
                        labelPlacement="outside"
                        placeholder="Pilih Personel"
                        isInvalid={!!errors.satpam_uuid}
                        errorMessage={errors.satpam_uuid}
                        selectedKeys={
                          formData.satpam_uuid ? [formData.satpam_uuid] : []
                        }
                        onSelectionChange={(k) => {
                          setFormData({
                            ...formData,
                            satpam_uuid: String(Array.from(k)[0]),
                          });
                          if (errors.satpam_uuid)
                            setErrors({ ...errors, satpam_uuid: undefined });
                        }}
                      >
                        {listSatpam.map((s) => (
                          <SelectItem
                            key={s.uuid}
                            textValue={`${s.nama} - ${s.nip}`}
                          >
                            {s.nama} - {s.nip}
                          </SelectItem>
                        ))}
                      </Select>

                      <Select
                        label="Shift"
                        variant="underlined"
                        labelPlacement="outside"
                        placeholder="Pilih Shift Kerja"
                        isInvalid={!!errors.shift_uuid}
                        errorMessage={errors.shift_uuid}
                        selectedKeys={
                          formData.shift_uuid ? [formData.shift_uuid] : []
                        }
                        onSelectionChange={(k) => {
                          setFormData({
                            ...formData,
                            shift_uuid: String(Array.from(k)[0]),
                          });
                          if (errors.shift_uuid)
                            setErrors({ ...errors, shift_uuid: undefined });
                        }}
                      >
                        {listShift.map((s) => (
                          <SelectItem
                            key={s.uuid}
                            textValue={`${s.nama} (${s.mulai.slice(0, 5)} - ${s.selesai.slice(0, 5)})`}
                          >
                            {s.nama} ({s.mulai.slice(0, 5)} -{" "}
                            {s.selesai.slice(0, 5)})
                          </SelectItem>
                        ))}
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
                    onPress={handleSubmitShift}
                  >
                    {selectedUuid ? "Update" : "Simpan"}
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        <Modal
          isOpen={isDeleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          size="sm"
          backdrop="opaque"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="flex flex-col gap-1 items-center text-danger">
                  <FaExclamationTriangle size={40} className="text-[#A70202]" />
                  <span className="mt-2 text-lg text-[#A70202]">
                    Konfirmasi Hapus
                  </span>
                </ModalHeader>
                <ModalBody className="text-center font-medium">
                  <p>Apakah Anda yakin ingin menghapus data shift ini?</p>
                </ModalBody>
                <ModalFooter className="justify-center">
                  <Button
                    variant="light"
                    onPress={onClose}
                    isDisabled={isDeleting}
                  >
                    Batal
                  </Button>
                  <Button
                    color="danger"
                    className="bg-[#A70202]"
                    onPress={executeDelete}
                    isLoading={isDeleting}
                  >
                    Ya, Hapus
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>

        <div className="table-section-container mt-6">
          <Table
            isStriped
            shadow="none"
            className="rounded-xl border border-gray-200"
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
              <TableColumn>Hari</TableColumn>
              <TableColumn>Tanggal</TableColumn>
              <TableColumn>Sesi Shift</TableColumn>
              <TableColumn>Nama Satpam</TableColumn>
              <TableColumn>Shift</TableColumn>
              <TableColumn>Pos</TableColumn>
              <TableColumn className="text-center">Aksi</TableColumn>
            </TableHeader>
            <TableBody
              emptyContent="Tidak ada data."
              isLoading={isLoading}
              loadingContent={<Spinner />}
            >
              {dataJadwal.map((item, index) => (
                <TableRow key={item.uuid}>
                  <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{getHari(item.tanggal)}</TableCell>
                  <TableCell>{item.tanggal}</TableCell>
                  <TableCell>{`${item.mulai.slice(0, 5)} - ${item.selesai.slice(0, 5)}`}</TableCell>
                  <TableCell>{item.satpam_name}</TableCell>
                  <TableCell>{item.shift_nama}</TableCell>
                  <TableCell>{item.nama_pos}</TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-3">
                      <Button
                        size="sm"
                        className="bg-[#02A758] text-white font-semibold"
                        startContent={<FaEdit />}
                        onPress={() => handleOpenEdit(item.uuid)}
                      >
                        Ubah
                      </Button>
                      <Button
                        size="sm"
                        className="bg-[#A70202] text-white font-semibold"
                        startContent={<FaTrash />}
                        onPress={() => openDeleteModal(item.uuid)}
                      >
                        Hapus
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default AdminManageShift;
