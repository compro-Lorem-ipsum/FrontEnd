import {
  Button,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  DatePicker,
  CheckboxGroup,
  Checkbox,
  useDisclosure,
} from "@heroui/react";
import { useState } from "react";
import { CalendarDate } from "@internationalized/date";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { MdDelete, MdEditCalendar } from "react-icons/md";
import ShiftTableNew, {
  type ShiftData,
} from "../Components/shifts/ShiftTableNew";

interface SatpamShift {
  id: number;
  nama: string;
  jabatan: string;
  pos: string;
  foto: string;
}

interface ShiftGroup {
  id: number;
  nama: string;
  jamMulai: string;
  jamSelesai: string;
  satpam: SatpamShift[];
}

type ShiftHarian = "Pagi" | "Siang" | "Malam" | null;

interface SatpamMingguan {
  id: number;
  nama: string;
  jabatan: string;
  pos: string;
  foto: string;
  jadwal: Record<string, ShiftHarian>;
}

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

const getDeviceTimezone = () => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "Asia/Jakarta";
  }
};

const shiftOptions = [
  { key: "Pagi", label: "Pagi" },
  { key: "Siang", label: "Siang" },
  { key: "Malam", label: "Malam" },
];

const shiftTableDataInitial: ShiftData[] = [
  { uuid: "1", nama_shift: "Pagi", jam_mulai: "06:00", jam_selesai: "15:00" },
  { uuid: "2", nama_shift: "Siang", jam_mulai: "15:00", jam_selesai: "21:00" },
  { uuid: "3", nama_shift: "Malam", jam_mulai: "21:00", jam_selesai: "06:00" },
];

const listSatpamDummy: SatpamOption[] = [
  { uuid: "1", nama: "Prasetyo Teguh", nip: "13012200" },
  { uuid: "2", nama: "Ahmad Fauzi", nip: "13012201" },
  { uuid: "3", nama: "Budi Santoso", nip: "13012202" },
];

const listShiftDummy: ShiftOption[] = [
  { uuid: "1", nama: "Pagi", mulai: "06:00:00", selesai: "15:00:00" },
  { uuid: "2", nama: "Siang", mulai: "15:00:00", selesai: "21:00:00" },
  { uuid: "3", nama: "Malam", mulai: "21:00:00", selesai: "06:00:00" },
];

const listPosDummy: PosOption[] = [
  { uuid: "1", nama: "Pos Utara" },
  { uuid: "2", nama: "Pos Selatan" },
  { uuid: "3", nama: "Pos Timur" },
  { uuid: "4", nama: "Pos Barat" },
];

const shiftDataHarian: ShiftGroup[] = [
  {
    id: 1,
    nama: "Pagi",
    jamMulai: "06:00",
    jamSelesai: "15:00",
    satpam: [
      {
        id: 1,
        nama: "Prasetyo Teguh",
        jabatan: "Satpam Utama",
        pos: "Pos Utara",
        foto: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop&crop=faces",
      },
      {
        id: 2,
        nama: "Ahmad Fauzi",
        jabatan: "Satpam",
        pos: "Pos Utara",
        foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
      },
      {
        id: 3,
        nama: "Budi Santoso",
        jabatan: "Satpam",
        pos: "Pos Selatan",
        foto: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces",
      },
    ],
  },
  {
    id: 2,
    nama: "Siang",
    jamMulai: "15:00",
    jamSelesai: "22:00",
    satpam: [
      {
        id: 1,
        nama: "Candra Wijaya",
        jabatan: "Satpam",
        pos: "Pos Utama",
        foto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=faces",
      },
      {
        id: 2,
        nama: "Dedi Kurniawan",
        jabatan: "Satpam",
        pos: "Pos Selatan",
        foto: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop&crop=faces",
      },
    ],
  },
  {
    id: 3,
    nama: "Malam",
    jamMulai: "22:00",
    jamSelesai: "06:00",
    satpam: [
      {
        id: 1,
        nama: "Eko Prasetyo",
        jabatan: "Satpam Utama",
        pos: "Pos Utara",
        foto: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=100&h=100&fit=crop&crop=faces",
      },
      {
        id: 2,
        nama: "Fajar Nugroho",
        jabatan: "Satpam",
        pos: "Pos Belakang",
        foto: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&crop=faces",
      },
      {
        id: 3,
        nama: "Gunawan Saputra",
        jabatan: "Satpam",
        pos: "Pos Selatan",
        foto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces",
      },
      {
        id: 4,
        nama: "Hendra Kusuma",
        jabatan: "Satpam",
        pos: "Pos Utama",
        foto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=faces",
      },
      {
        id: 5,
        nama: "Hendra Kusuma",
        jabatan: "Satpam",
        pos: "Pos Utama",
        foto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=faces",
      },
      {
        id: 6,
        nama: "Hendra Kusuma",
        jabatan: "Satpam",
        pos: "Pos Utama",
        foto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=faces",
      },
    ],
  },
  {
    id: 4,
    nama: "Malam",
    jamMulai: "22:00",
    jamSelesai: "06:00",
    satpam: [
      {
        id: 1,
        nama: "Eko Prasetyo",
        jabatan: "Satpam Utama",
        pos: "Pos Utara",
        foto: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=100&h=100&fit=crop&crop=faces",
      },
      {
        id: 2,
        nama: "Fajar Nugroho",
        jabatan: "Satpam",
        pos: "Pos Belakang",
        foto: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&crop=faces",
      },
      {
        id: 3,
        nama: "Gunawan Saputra",
        jabatan: "Satpam",
        pos: "Pos Selatan",
        foto: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=faces",
      },
      {
        id: 4,
        nama: "Hendra Kusuma",
        jabatan: "Satpam",
        pos: "Pos Utama",
        foto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=faces",
      },
    ],
  },
];

const shiftBadgeColor: Record<Exclude<ShiftHarian, null>, string> = {
  Pagi: "!bg-[#EFF6FF] !text-[#2563EB] border border-[#BFDBFE]",
  Siang: "!bg-[#FEFCE8] !text-[#A16207] border border-[#FEF08A]",
  Malam: "!bg-[#F5F3FF] !text-[#7C3AED] border border-[#DDD6FE]",
};

const satpamMingguanDataInitial: SatpamMingguan[] = [
  {
    id: 1,
    nama: "Prasetyo Teguh",
    jabatan: "Jabatan",
    pos: "Pos Utara",
    foto: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=100&h=100&fit=crop&crop=faces",
    jadwal: {
      Min: "Pagi",
      Sen: "Malam",
      Sel: null,
      Rab: "Pagi",
      Kam: "Siang",
      Jum: "Pagi",
      Sab: "Pagi",
    },
  },
  {
    id: 2,
    nama: "Satrio",
    jabatan: "Satpam",
    pos: "Pos Timur",
    foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces",
    jadwal: {
      Min: "Pagi",
      Sen: null,
      Sel: null,
      Rab: "Pagi",
      Kam: "Siang",
      Jum: "Pagi",
      Sab: "Pagi",
    },
  },
  {
    id: 3,
    nama: "Yuli",
    jabatan: "Satpam",
    pos: "Pos Barat",
    foto: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&h=100&fit=crop&crop=faces",
    jadwal: {
      Min: "Pagi",
      Sen: null,
      Sel: null,
      Rab: null,
      Kam: null,
      Jum: null,
      Sab: null,
    },
  },
  {
    id: 4,
    nama: "Nama Satpam",
    jabatan: "Jabatan",
    pos: "Nama Pos Utama",
    foto: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=faces",
    jadwal: {
      Min: null,
      Sen: null,
      Sel: null,
      Rab: null,
      Kam: null,
      Jum: null,
      Sab: null,
    },
  },
  {
    id: 5,
    nama: "Nama Satpam",
    jabatan: "Jabatan",
    pos: "Nama Pos Utama",
    foto: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=100&h=100&fit=crop&crop=faces",
    jadwal: {
      Min: null,
      Sen: null,
      Sel: null,
      Rab: null,
      Kam: null,
      Jum: null,
      Sab: null,
    },
  },
];

const hariSingkatanMingguTable = [
  "Min",
  "Sen",
  "Sel",
  "Rab",
  "Kam",
  "Jum",
  "Sab",
];

const ClientPenjadwalanSatpam = () => {
  const [activeSwitch, setActiveSwitch] = useState<"jadwal" | "shift">(
    "jadwal",
  );
  const [rangeMode, setRangeMode] = useState<"harian" | "mingguan">("harian");
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 22));
  const [satpamMingguanData, setSatpamMingguanData] = useState<
    SatpamMingguan[]
  >(satpamMingguanDataInitial);

  const [shiftTableData] = useState<ShiftData[]>(shiftTableDataInitial);
  const [shiftPage, setShiftPage] = useState(1);
  const shiftRowsPerPage = 10;
  const shiftTotalPages = Math.ceil(shiftTableData.length / shiftRowsPerPage);

  const handleEditShift = (uuid: string) => {
    console.log("edit shift", uuid);
  };

  const handleDeleteShift = (uuid: string) => {
    console.log("hapus shift", uuid);
  };

  // === Modal: Auto Generate Jadwal ===
  const modalGenerate = useDisclosure();
  const [generateData, setGenerateData] = useState<{
    start_date?: CalendarDate;
    end_date?: CalendarDate;
    pos_uuid: string;
    satpam_uuid: string;
    shift_uuid: string;
    days_of_week: string[];
  }>({
    start_date: undefined,
    end_date: undefined,
    pos_uuid: "",
    satpam_uuid: "",
    shift_uuid: "",
    days_of_week: [],
  });
  const [generateErrors, setGenerateErrors] = useState<
    Record<string, string | undefined>
  >({});
  const [isGenerateSubmitting, setIsGenerateSubmitting] = useState(false);

  const handleGenerateSubmit = () => {
    setIsGenerateSubmitting(true);
    console.log("generate jadwal", generateData);
    setIsGenerateSubmitting(false);
    modalGenerate.onOpenChange();
  };

  // === Modal: Tambah/Edit Jadwal Manual ===
  const modalManual = useDisclosure();
  const [selectedJadwalUuid, setSelectedJadwalUuid] = useState<string | null>(
    null,
  );
  const [manualData, setManualData] = useState<{
    tanggal?: CalendarDate;
    pos_uuid: string;
    satpam_uuid: string;
    shift_uuid: string;
  }>({
    tanggal: undefined,
    pos_uuid: "",
    satpam_uuid: "",
    shift_uuid: "",
  });
  const [manualErrors, setManualErrors] = useState<
    Record<string, string | undefined>
  >({});
  const [isManualSubmitting, setIsManualSubmitting] = useState(false);

  const resetManualForm = () => {
    setManualData({
      tanggal: undefined,
      pos_uuid: "",
      satpam_uuid: "",
      shift_uuid: "",
    });
    setManualErrors({});
    setSelectedJadwalUuid(null);
  };

  const handleCloseManual = () => {
    resetManualForm();
    modalManual.onOpenChange();
  };

  const handleManualSubmit = () => {
    setIsManualSubmitting(true);
    console.log("submit jadwal manual", manualData, selectedJadwalUuid);
    setIsManualSubmitting(false);
    handleCloseManual();
  };

  // === Modal: Tambah/Edit Konfigurasi Shift ===
  const modalShiftForm = useDisclosure();
  const [selectedShiftId, setSelectedShiftId] = useState<string | null>(null);
  const [shiftFormData, setShiftFormData] = useState<{
    nama: string;
    mulai: string;
    selesai: string;
  }>({
    nama: "",
    mulai: "",
    selesai: "",
  });
  const [shiftFormErrors, setShiftFormErrors] = useState<
    Record<string, string | undefined>
  >({});
  const [isShiftFormSubmitting, setIsShiftFormSubmitting] = useState(false);

  const resetShiftForm = () => {
    setShiftFormData({ nama: "", mulai: "", selesai: "" });
    setShiftFormErrors({});
    setSelectedShiftId(null);
  };

  const handleCloseShiftForm = () => {
    resetShiftForm();
    modalShiftForm.onOpenChange();
  };

  const handleShiftFormSubmit = () => {
    setIsShiftFormSubmitting(true);
    console.log("submit konfigurasi shift", shiftFormData, selectedShiftId);
    setIsShiftFormSubmitting(false);
    handleCloseShiftForm();
  };

  const formatTanggal = (date: Date) => {
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatRentangMinggu = (date: Date) => {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(start.getDate() + 6);

    const startLabel = start.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
    });
    const endLabel = end.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    return `${startLabel} - ${endLabel}`;
  };

  const getTanggalTableMingguan = (date: Date) => {
    const dayOfWeek = date.getDay();
    const minggu = new Date(date);
    minggu.setDate(date.getDate() - dayOfWeek);

    return hariSingkatanMingguTable.map((hari, i) => {
      const tanggal = new Date(minggu);
      tanggal.setDate(minggu.getDate() + i);
      return {
        hari,
        tanggal: tanggal.getDate(),
      };
    });
  };

  const handlePrev = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() - (rangeMode === "harian" ? 1 : 7));
      return newDate;
    });
  };

  const handleNext = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + (rangeMode === "harian" ? 1 : 7));
      return newDate;
    });
  };

  const handleUpdateJadwal = (
    satpamId: number,
    hari: string,
    value: ShiftHarian,
  ) => {
    setSatpamMingguanData((prev: any) =>
      prev.map((satpam: any) =>
        satpam.id === satpamId
          ? {
              ...satpam,
              jadwal: {
                ...satpam.jadwal,
                [hari]: value,
              },
            }
          : satpam,
      ),
    );
  };

  const renderJadwalHarian = () => (
    <div className="card-jadwal-container grid grid-cols-3 content-start gap-1 w-full h-152 overflow-y-auto">
      {shiftDataHarian.map((shift) => (
        <div
          key={shift.id}
          className="card-shift flex flex-col bg-white border border-[#E4E9F7] p-3 rounded-2xl h-[300px]"
        >
          <div className="card-header flex flex-row items-center justify-between flex-shrink-0">
            <div className="jadwal flex flex-col items-start">
              <h2 className="font-semibold">{shift.nama}</h2>
              <h2 className="text-light text-sm text-[#6B6B6B]">
                {shift.jamMulai} - {shift.jamSelesai}
              </h2>
            </div>
            <Button variant="bordered" className="rounded-2xl">
              Assign +
            </Button>
          </div>
          <hr className="w-full mt-4 border-[#E4E9F7] flex-shrink-0" />

          <div className="flex flex-col gap-3 mt-4 flex-1 min-h-0 overflow-y-auto pr-1">
            {shift.satpam.map((item) => (
              <div
                key={item.id}
                className="list-satpam flex flex-row justify-between items-center flex-shrink-0"
              >
                <div className="left-side flex flex-row items-center gap-3">
                  <img
                    src={item.foto}
                    alt={item.nama}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="container-details-satpam flex flex-col gap-1 items-start">
                    <h2 className="text-sm">{item.nama}</h2>
                    <h2 className="text-xs text-[#6B6B6B]">
                      {item.jabatan} · {item.pos}
                    </h2>
                  </div>
                </div>
                <div className="right-side flex flex-row items-center gap-3">
                  <MdEditCalendar className="text-xl text-[#8D8787] cursor-pointer" />
                  <MdDelete className="text-xl text-[#A70202] cursor-pointer" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const renderJadwalMingguan = () => {
    const tanggalTable = getTanggalTableMingguan(currentDate);

    return (
      <div className="table-container mt-2 rounded-2xl border border-[#E4E9F7] overflow-hidden overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#F1F1F1]">
              <th className="text-left py-4 px-5 font-bold text-base text-black min-w-[220px]">
                Nama
              </th>
              {tanggalTable.map(({ hari, tanggal }) => (
                <th key={hari} className="py-4 px-3 text-center min-w-[110px]">
                  <div className="flex flex-col items-center">
                    <span className="text-sm font-normal text-[#8D8787]">
                      {hari}
                    </span>
                    <span className="text-base font-bold text-black">
                      {tanggal}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {satpamMingguanData.map((satpam) => (
              <tr key={satpam.id} className="border-t border-[#E4E9F7]">
                <td className="py-3 px-5">
                  <div className="flex flex-row items-center gap-3">
                    <img
                      src={satpam.foto}
                      alt={satpam.nama}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-black">
                        {satpam.nama}
                      </span>
                      <span className="text-xs text-[#8D8787]">
                        {satpam.jabatan} · {satpam.pos}
                      </span>
                    </div>
                  </div>
                </td>
                {hariSingkatanMingguTable.map((hari) => {
                  const shift = satpam.jadwal[hari];
                  const isFilled = !!shift;

                  return (
                    <td key={hari} className="py-3 px-3 text-center">
                      <Select
                        aria-label={`Pilih shift ${satpam.nama} - ${hari}`}
                        placeholder="Pilih"
                        selectedKeys={shift ? [shift] : []}
                        onSelectionChange={(keys) => {
                          const value = Array.from(keys)[0] as
                            | ShiftHarian
                            | undefined;
                          handleUpdateJadwal(satpam.id, hari, value ?? null);
                        }}
                        className="w-24 mx-auto"
                        size="sm"
                        radius="full"
                        variant="bordered"
                        classNames={{
                          trigger: `min-h-8 h-8 px-3 ${
                            isFilled
                              ? shiftBadgeColor[
                                  shift as Exclude<ShiftHarian, null>
                                ]
                              : "border-dashed border-[#C4C4C4] bg-transparent data-[hover=true]:bg-[#F5F7FF]"
                          }`,
                          value: `text-xs font-medium ${
                            isFilled ? "" : "text-[#9CA3AF] text-center"
                          }`,
                        }}
                      >
                        {shiftOptions.map((item) => (
                          <SelectItem key={item.key}>{item.label}</SelectItem>
                        ))}
                      </Select>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSwitch) {
      case "jadwal":
        return (
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center justify-between w-full">
              <div className="left-side flex flex-row items-center gap-4">
                <div className="container-switcher flex flex-row w-fit items-center gap-1 bg-[#F1F1F1] p-1 rounded-4xl">
                  <h2
                    onClick={() => setRangeMode("harian")}
                    className={`text-sm px-4 py-2 rounded-2xl cursor-pointer font-medium transition-colors ${
                      rangeMode === "harian"
                        ? "bg-white text-[#122C93]"
                        : "text-[#6B6B6B]"
                    }`}
                  >
                    Hari Ini
                  </h2>
                  <h2
                    onClick={() => setRangeMode("mingguan")}
                    className={`text-sm px-4 py-2 rounded-2xl cursor-pointer font-medium transition-colors ${
                      rangeMode === "mingguan"
                        ? "bg-white text-[#122C93]"
                        : "text-[#6B6B6B]"
                    }`}
                  >
                    7 Hari
                  </h2>
                </div>
                <div className="container-date-switch flex flex-row gap-3 items-center">
                  <button
                    onClick={handlePrev}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-[#E4E9F7] hover:bg-[#F5F7FF] transition-colors"
                  >
                    <IoChevronBack className="text-[#122C93] text-base" />
                  </button>

                  <div className="bg-[#F1F1F1] px-6 py-3 rounded-4xl">
                    <h2 className="text-sm font-medium text-black">
                      {rangeMode === "harian"
                        ? formatTanggal(currentDate)
                        : formatRentangMinggu(currentDate)}
                    </h2>
                  </div>

                  <button
                    onClick={handleNext}
                    className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-[#E4E9F7] hover:bg-[#F5F7FF] transition-colors"
                  >
                    <IoChevronForward className="text-[#122C93] text-base" />
                  </button>
                </div>
              </div>

              <div className="right-side flex flex-row items-center gap-3">
                <Button
                  className="bg-[#122C93] text-white font-semibold h-10"
                  onPress={modalGenerate.onOpen}
                >
                  Generate Jadwal +
                </Button>
                <Button
                  className="bg-[#122C93] text-white font-semibold h-10"
                  onPress={modalManual.onOpen}
                >
                  Tambah Manual +
                </Button>
              </div>
            </div>

            {rangeMode === "harian"
              ? renderJadwalHarian()
              : renderJadwalMingguan()}
          </div>
        );
      case "shift":
        return (
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center justify-between">
              <h2 className="font-semibold text-md text-[#122C93]">
                Konfigurasi Shift
              </h2>

              <Button
                className="bg-[#122C93] text-white font-semibold h-10"
                onPress={modalShiftForm.onOpen}
              >
                Tambah +
              </Button>
            </div>

            {/* table shift here */}
            <div className="shift-table">
              <ShiftTableNew
                data={shiftTableData}
                page={shiftPage}
                rowsPerPage={shiftRowsPerPage}
                totalPages={shiftTotalPages}
                onPageChange={setShiftPage}
                onEdit={handleEditShift}
                onDelete={handleDeleteShift}
              />
            </div>
            {/* end of table shift */}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-4 p-2.5 overflow-hidden">
      <div className="flex flex-row items-center justify-between mt-2">
        <div className="flex flex-col items-start">
          <h2 className="font-semibold text-2xl text-[#122C93]">
            Manage Penjadwalan Satpam
          </h2>
          <p className="text-sm text-black">
            Kelola jadwal tugas satpam dan pengaturan shift
          </p>
        </div>
      </div>

      <div className="container-switcher flex flex-row w-fit items-center gap-1 bg-[#F1F1F1] p-1 rounded-4xl">
        <h2
          onClick={() => setActiveSwitch("jadwal")}
          className={`text-sm px-4 py-2 rounded-2xl cursor-pointer font-medium transition-colors ${
            activeSwitch === "jadwal"
              ? "bg-white text-[#122C93]"
              : "text-[#6B6B6B]"
          }`}
        >
          Jadwal Jaga
        </h2>
        <h2
          onClick={() => setActiveSwitch("shift")}
          className={`text-sm px-4 py-2 rounded-2xl cursor-pointer font-medium transition-colors ${
            activeSwitch === "shift"
              ? "bg-white text-[#122C93]"
              : "text-[#6B6B6B]"
          }`}
        >
          Atur Shift
        </h2>
      </div>

      {renderContent()}

      {/* Modal Auto-Generate Jadwal Rutin */}
      <Modal
        backdrop="opaque"
        isOpen={modalGenerate.isOpen}
        onClose={modalGenerate.onOpenChange}
        size="4xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader className="text-[#122C93]">
            Auto-Generate Jadwal Rutin
          </ModalHeader>
          <ModalBody>
            <div className="grid grid-cols-2 gap-10 p-3">
              <div className="flex flex-col gap-6">
                <DatePicker
                  label="Tanggal Mulai"
                  variant="underlined"
                  labelPlacement="inside"
                  isInvalid={!!generateErrors.start_date}
                  errorMessage={generateErrors.start_date}
                  onChange={(d) => {
                    setGenerateData({
                      ...generateData,
                      start_date: d as CalendarDate,
                    });
                    if (generateErrors.start_date)
                      setGenerateErrors({
                        ...generateErrors,
                        start_date: undefined,
                      });
                  }}
                />
                <DatePicker
                  label="Tanggal Berakhir"
                  variant="underlined"
                  labelPlacement="inside"
                  isInvalid={!!generateErrors.end_date}
                  errorMessage={generateErrors.end_date}
                  onChange={(d) => {
                    setGenerateData({
                      ...generateData,
                      end_date: d as CalendarDate,
                    });
                    if (generateErrors.end_date)
                      setGenerateErrors({
                        ...generateErrors,
                        end_date: undefined,
                      });
                  }}
                />
                <Select
                  label="Pos"
                  variant="underlined"
                  labelPlacement="inside"
                  placeholder="Pilih Pos"
                  isInvalid={!!generateErrors.pos_uuid}
                  errorMessage={generateErrors.pos_uuid}
                  selectedKeys={
                    generateData.pos_uuid ? [generateData.pos_uuid] : []
                  }
                  onSelectionChange={(k) => {
                    setGenerateData({
                      ...generateData,
                      pos_uuid: String(Array.from(k)[0]),
                    });
                    if (generateErrors.pos_uuid)
                      setGenerateErrors({
                        ...generateErrors,
                        pos_uuid: undefined,
                      });
                  }}
                >
                  {listPosDummy.map((p) => (
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
                  labelPlacement="inside"
                  placeholder="Pilih Personel"
                  isInvalid={!!generateErrors.satpam_uuid}
                  errorMessage={generateErrors.satpam_uuid}
                  selectedKeys={
                    generateData.satpam_uuid ? [generateData.satpam_uuid] : []
                  }
                  onSelectionChange={(k) => {
                    setGenerateData({
                      ...generateData,
                      satpam_uuid: String(Array.from(k)[0]),
                    });
                    if (generateErrors.satpam_uuid)
                      setGenerateErrors({
                        ...generateErrors,
                        satpam_uuid: undefined,
                      });
                  }}
                >
                  {listSatpamDummy.map((s) => (
                    <SelectItem key={s.uuid} textValue={`${s.nama} - ${s.nip}`}>
                      {s.nama} - {s.nip}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  label="Shift"
                  variant="underlined"
                  labelPlacement="inside"
                  placeholder="Pilih Shift Kerja"
                  isInvalid={!!generateErrors.shift_uuid}
                  errorMessage={generateErrors.shift_uuid}
                  selectedKeys={
                    generateData.shift_uuid ? [generateData.shift_uuid] : []
                  }
                  onSelectionChange={(k) => {
                    setGenerateData({
                      ...generateData,
                      shift_uuid: String(Array.from(k)[0]),
                    });
                    if (generateErrors.shift_uuid)
                      setGenerateErrors({
                        ...generateErrors,
                        shift_uuid: undefined,
                      });
                  }}
                >
                  {listShiftDummy.map((s) => (
                    <SelectItem
                      key={s.uuid}
                      textValue={`${s.nama} (${s.mulai.slice(0, 5)} - ${s.selesai.slice(0, 5)})`}
                    >
                      {s.nama} ({s.mulai.slice(0, 5)} - {s.selesai.slice(0, 5)})
                    </SelectItem>
                  ))}
                </Select>
              </div>
              <div className="col-span-2">
                <CheckboxGroup
                  label="Pilih Hari Kerja"
                  orientation="horizontal"
                  isInvalid={!!generateErrors.days_of_week}
                  errorMessage={generateErrors.days_of_week}
                  value={generateData.days_of_week}
                  onValueChange={(v) => {
                    setGenerateData({ ...generateData, days_of_week: v });
                    if (generateErrors.days_of_week)
                      setGenerateErrors({
                        ...generateErrors,
                        days_of_week: undefined,
                      });
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
            <Button
              variant="light"
              color="danger"
              onPress={modalGenerate.onOpenChange}
            >
              Batal
            </Button>
            <Button
              className="bg-[#122C93] text-white px-10"
              onPress={handleGenerateSubmit}
              isLoading={isGenerateSubmitting}
            >
              Generate Sekarang
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal Tambah/Edit Jadwal Manual */}
      <Modal
        backdrop="opaque"
        isOpen={modalManual.isOpen}
        onClose={handleCloseManual}
        size="4xl"
      >
        <ModalContent>
          <ModalHeader className="text-[#122C93]">
            {selectedJadwalUuid ? "Edit Shift" : "Tambah Shift Manual"}
          </ModalHeader>
          <ModalBody>
            <div className="container-form flex flex-row justify-between gap-10 p-3">
              <div className="flex flex-col gap-8 w-1/2">
                <DatePicker
                  className="w-full"
                  label="Tanggal"
                  variant="underlined"
                  labelPlacement="inside"
                  isInvalid={!!manualErrors.tanggal}
                  errorMessage={manualErrors.tanggal}
                  value={manualData.tanggal}
                  onChange={(d) =>
                    setManualData({
                      ...manualData,
                      tanggal: d as CalendarDate,
                    })
                  }
                />
                <Select
                  className="w-full"
                  label="Pos"
                  variant="underlined"
                  labelPlacement="inside"
                  placeholder="Pilih Pos"
                  isInvalid={!!manualErrors.pos_uuid}
                  errorMessage={manualErrors.pos_uuid}
                  selectedKeys={
                    manualData.pos_uuid ? [manualData.pos_uuid] : []
                  }
                  onSelectionChange={(k) =>
                    setManualData({
                      ...manualData,
                      pos_uuid: String(Array.from(k)[0]),
                    })
                  }
                >
                  {listPosDummy.map((p) => (
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
                  labelPlacement="inside"
                  placeholder="Pilih Personel"
                  isInvalid={!!manualErrors.satpam_uuid}
                  errorMessage={manualErrors.satpam_uuid}
                  selectedKeys={
                    manualData.satpam_uuid ? [manualData.satpam_uuid] : []
                  }
                  onSelectionChange={(k) =>
                    setManualData({
                      ...manualData,
                      satpam_uuid: String(Array.from(k)[0]),
                    })
                  }
                >
                  {listSatpamDummy.map((s) => (
                    <SelectItem key={s.uuid} textValue={`${s.nama} - ${s.nip}`}>
                      {s.nama} - {s.nip}
                    </SelectItem>
                  ))}
                </Select>

                <Select
                  label="Shift"
                  variant="underlined"
                  labelPlacement="inside"
                  placeholder="Pilih Shift Kerja"
                  isInvalid={!!manualErrors.shift_uuid}
                  errorMessage={manualErrors.shift_uuid}
                  selectedKeys={
                    manualData.shift_uuid ? [manualData.shift_uuid] : []
                  }
                  onSelectionChange={(k) =>
                    setManualData({
                      ...manualData,
                      shift_uuid: String(Array.from(k)[0]),
                    })
                  }
                >
                  {listShiftDummy.map((s) => (
                    <SelectItem
                      key={s.uuid}
                      textValue={`${s.nama} (${s.mulai.slice(0, 5)} - ${s.selesai.slice(0, 5)})`}
                    >
                      {s.nama} ({s.mulai.slice(0, 5)} - {s.selesai.slice(0, 5)})
                    </SelectItem>
                  ))}
                </Select>
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="flex justify-center pb-8">
            <Button variant="light" color="danger" onPress={handleCloseManual}>
              Batal
            </Button>
            <Button
              className="bg-[#122C93] text-white px-10"
              onPress={handleManualSubmit}
              isLoading={isManualSubmitting}
            >
              {selectedJadwalUuid ? "Update" : "Simpan"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal Tambah/Edit Konfigurasi Shift */}
      <Modal
        backdrop="opaque"
        isOpen={modalShiftForm.isOpen}
        onClose={handleCloseShiftForm}
        size="2xl"
      >
        <ModalContent>
          <ModalHeader className="text-[#122C93]">
            {selectedShiftId ? "Edit Waktu Jadwal" : "Tambah Waktu Jadwal"}
          </ModalHeader>
          <ModalBody>
            <div className="container-form flex flex-col gap-6 p-3">
              <Input
                label="Nama Waktu"
                placeholder="Contoh: Shift Pagi"
                variant="underlined"
                labelPlacement="inside"
                value={shiftFormData.nama}
                maxLength={21}
                minLength={1}
                isInvalid={!!shiftFormErrors.nama}
                errorMessage={shiftFormErrors.nama}
                onChange={(e) =>
                  setShiftFormData({ ...shiftFormData, nama: e.target.value })
                }
              />
              <div className="flex gap-4 w-full">
                <Input
                  className="w-full"
                  label="Jam Mulai"
                  type="time"
                  variant="underlined"
                  labelPlacement="inside"
                  step="1"
                  value={shiftFormData.mulai}
                  isInvalid={!!shiftFormErrors.mulai}
                  errorMessage={shiftFormErrors.mulai}
                  onChange={(e) =>
                    setShiftFormData({
                      ...shiftFormData,
                      mulai: e.target.value,
                    })
                  }
                />
                <Input
                  className="w-full"
                  label="Jam Selesai"
                  type="time"
                  variant="underlined"
                  labelPlacement="inside"
                  step="1"
                  value={shiftFormData.selesai}
                  isInvalid={!!shiftFormErrors.selesai}
                  errorMessage={shiftFormErrors.selesai}
                  onChange={(e) =>
                    setShiftFormData({
                      ...shiftFormData,
                      selesai: e.target.value,
                    })
                  }
                />
              </div>
              {!selectedShiftId && (
                <p className="text-xs text-gray-400 italic mt-[-10px]">
                  * Timezone akan otomatis terdeteksi: {getDeviceTimezone()}
                </p>
              )}
            </div>
          </ModalBody>
          <ModalFooter className="flex justify-center pb-8">
            <Button
              variant="light"
              color="danger"
              onPress={handleCloseShiftForm}
            >
              Batal
            </Button>
            <Button
              className="bg-[#122C93] text-white px-10"
              onPress={handleShiftFormSubmit}
              isLoading={isShiftFormSubmitting}
            >
              {selectedShiftId ? "Update" : "Simpan"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ClientPenjadwalanSatpam;
