import { useState } from "react";
import { createPortal } from "react-dom";
import logo from "../assets/images/logo.webp";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaIdCardAlt, FaIdCard } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { LuOctagonAlert } from "react-icons/lu";
import { GoTrophy } from "react-icons/go";
import { GiGraduateCap } from "react-icons/gi";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { RiEditBoxFill } from "react-icons/ri";
import { IoIosAlert } from "react-icons/io";
import {
  DatePicker,
  Pagination,
  Tab,
  Tabs,
  Textarea,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Select,
  SelectItem,
  Input,
} from "@heroui/react";

interface KartuAnggotaProps {
  nama?: string;
  jabatan?: string;
  nip?: string;
  nrg?: string;
  mitra?: string;
  disahkanOleh?: string;
}

const Barcode = ({ value }: { value: string }) => {
  const bars = value.split("").map((char, i) => {
    const width = (char.charCodeAt(0) % 3) + 1;
    return (
      <div
        key={i}
        className="bg-black"
        style={{ width: `${width}px`, height: "44px", marginRight: "1.5px" }}
      />
    );
  });

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex flex-row items-end">{bars}</div>
      <span className="text-[10px] font-mono tracking-widest text-black">
        {value}
      </span>
    </div>
  );
};

export const KartuAnggotaDepan = ({
  nama = "Nama Anggota",
  jabatan = "Jabatan",
  nip = "123xxx",
  nrg = "00103062026000007",
  mitra = "Nama Mitra",
  disahkanOleh = "Direktur Utama",
}: KartuAnggotaProps) => {
  return (
    <div className="w-[420px] h-[264px] rounded-2xl overflow-hidden flex flex-row bg-[#F5F3EE] shadow-md">
      <div className="w-[150px] bg-gradient-to-b from-[#122C93] to-[#0C1F6B] relative flex flex-col items-center pt-4 pb-3 gap-2">
        <div className="absolute right-0 top-0 h-full w-1 bg-[#C9A227]" />
        <img src={logo} className="w-12" alt="" />
        <div className="flex flex-col items-center text-center px-2 mt-1">
          <span className="text-white font-bold text-[11px] leading-tight">
            PT BIMA GLOBAL
          </span>
          <span className="text-[#C9A227] text-[7px] tracking-widest font-semibold">
            SECURITY SERVICES
          </span>
        </div>
        <div className="w-24 h-28 bg-[#E7E9F5] rounded-md flex items-center justify-center mt-2">
          <span className="text-[#9096B8] text-[9px]">PAS FOTO</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between p-5">
        <div>
          <div className="flex flex-row items-center gap-2 mb-1">
            <div className="w-5 h-[3px] bg-[#C9A227] rounded-full" />
            <span className="text-xs font-semibold text-[#3B3B3B]">
              Kartu Tanda Anggota
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-[#12237A] leading-tight">
            {nama}
          </h2>
          <h3 className="text-sm font-semibold text-[#C9A227]">{jabatan}</h3>
        </div>

        <div className="border-t border-[#DDD8CC] pt-2 flex flex-row gap-10">
          <div>
            <span className="text-[9px] font-semibold text-[#8D8787] tracking-widest">
              NIP
            </span>
            <h4 className="text-sm font-bold text-[#1E1E1E]">{nip}</h4>
          </div>
          <div>
            <span className="text-[9px] font-semibold text-[#8D8787] tracking-widest">
              NRG
            </span>
            <h4 className="text-sm font-bold text-[#1E1E1E] font-mono">
              {nrg}
            </h4>
          </div>
        </div>

        <div>
          <span className="text-[9px] font-semibold text-[#8D8787] tracking-widest">
            MITRA
          </span>
          <h4 className="text-sm font-bold text-[#1E1E1E]">{mitra}</h4>
        </div>

        <div className="border-t border-[#DDD8CC] pt-1 flex flex-col items-end">
          <span className="text-[9px] italic text-[#8D8787]">
            Disahkan Oleh
          </span>
          <span className="text-xs font-bold text-[#1E1E1E]">
            {disahkanOleh}
          </span>
        </div>
      </div>
    </div>
  );
};

export const KartuAnggotaBelakang = ({
  nrg = "00103062026000007",
}: KartuAnggotaProps) => {
  return (
    <div className="w-[420px] h-[264px] rounded-2xl overflow-hidden bg-[#F5F3EE] shadow-md flex flex-col">
      <div className="bg-gradient-to-r from-[#0F1E5C] to-[#12237A] px-4 py-2 flex flex-row items-center gap-2 border-b-2 border-[#C9A227]">
        <img src={logo} className="w-10" alt="" />
        <span className="text-white font-bold text-xs tracking-wide">
          KARTU TANDA ANGGOTA (KTA)
        </span>
      </div>

      <div className="flex flex-row items-start p-4 gap-4">
        <div className="flex-1">
          <h4 className="font-bold text-xs text-[#1E1E1E] mb-1">
            KETENTUAN PENGGUNAAN
          </h4>
          <ol className="list-decimal list-inside text-[8px] text-[#3B3B3B] flex flex-col gap-1.5">
            <li>
              Kartu ini adalah milik PT Bima Global Security Services dan wajib
              dikembalikan saat masa kerja berakhir.
            </li>
            <li>
              Kartu ini hanya berlaku untuk pemegang yang tertera dan tidak
              dapat dipindahtangankan.
            </li>
            <li>
              Kehilangan kartu wajib segera dilaporkan ke pihak manajemen.
            </li>
          </ol>
        </div>

        <div className="flex flex-col">
          <span className="text-[9px] font-semibold text-[#8D8787] tracking-widest">
            NOMOR INDUK PEGAWAI (NIP)
          </span>
          <div className="mt-2">
            <Barcode value={nrg} />
          </div>
        </div>
      </div>

      <div className="px-4 pb-3">
        <h4 className="font-bold text-[10px] text-[#1E1E1E]">
          PT BIMA GLOBAL SECURITY SERVICES
        </h4>
        <span className="font-bold text-[9px] text-[#1E1E1E]">
          Never stop to protect
        </span>
      </div>
    </div>
  );
};

export const KartuAnggotaPreview = (props: KartuAnggotaProps) => {
  return (
    <div className="flex flex-col gap-4 items-center">
      <KartuAnggotaDepan {...props} />
      <KartuAnggotaBelakang {...props} />
    </div>
  );
};

export const KartuAnggotaPrintPortal = (props: KartuAnggotaProps) => {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="print-portal-container hidden print:flex print:flex-col print:items-center print:pt-10 print:w-full print:absolute print:top-0 print:left-0 print:z-[99999] print:bg-white">
      <style>
        {`
          @media print {
            /* 1. Mencegah root app dan elemen body lain menimpa portal */
            body > *:not(.print-portal-container) {
              display: none !important;
            }
            
            /* 2. Menetralkan CSS Modal yang mengunci scroll body (overflow: hidden) */
            html, body {
              height: auto !important;
              min-height: 100% !important;
              overflow: visible !important;
              position: static !important;
              margin: 0;
              padding: 0;
              background-color: white !important;
            }
            
            /* 3. Menampilkan wrapper print */
            .print-portal-container {
              display: flex !important;
              visibility: visible !important;
            }
            
            /* 4. Memaksa browser mencetak seluruh warna dan background gradient */
            * {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            
            /* Aturan area kertas (opsional, disesuaikan) */
            @page {
              size: A4 portrait;
              margin: 15mm;
            }
          }
        `}
      </style>
      <div className="flex flex-col gap-8 items-center justify-center w-full">
        <KartuAnggotaDepan {...props} />
        <KartuAnggotaBelakang {...props} />
      </div>
    </div>,
    document.body,
  );
};

export const kategoriPelanggaran = [
  { key: "teguran", label: "Teguran" },
  { key: "sp1", label: "Surat Peringatan 1" },
  { key: "sp2", label: "Surat Peringatan 2" },
  { key: "sp3", label: "Surat Peringatan 3" },
];

export const jenisDokumen = [
  { key: "ktp", label: "KTP" },
  { key: "bpjs", label: "BPJS" },
  { key: "npwp", label: "NPWP" },
];

export const jenjangPendidikan = [
  { key: "sd", label: "SD" },
  { key: "smp", label: "SMP" },
  { key: "sma", label: "SMA/SMK" },
  { key: "d3", label: "D3" },
  { key: "s1", label: "S1" },
  { key: "diklat", label: "Pelatihan/Diklat" },
];

export const kategoriPenghargaan = [
  { key: "kinerja", label: "Kinerja" },
  { key: "keamanan", label: "Keamanan" },
  { key: "disiplin", label: "Kedisiplinan" },
  { key: "pelayanan", label: "Pelayanan" },
];

const AdminDetailsSatpam = () => {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState("absensi");
  const [pelanggaranPage, setPelanggaranPage] = useState(1);
  const totalPages = 10;

  const modalPelanggaran = useDisclosure();
  const modalDokumen = useDisclosure();
  const modalPendidikan = useDisclosure();
  const modalPenghargaan = useDisclosure();
  const modalTambahPelanggaran = useDisclosure();
  const modalGenerateKartu = useDisclosure();

  const dataKartu = {
    nama: "Nama Anggota",
    jabatan: "Jabatan",
    nip: "123xxx",
    nrg: "00103062026000007",
    mitra: "Nama Mitra",
    disahkanOleh: "Direktur Utama",
  };

  const absensiData = [
    {
      id: 1,
      tanggal: "dd/mm/yy",
      nip: "13012200",
      kategori: "Tepat Waktu",
      checkIn: "18:00",
      checkOut: "04:03",
      durasi: "10 jam 3 menit",
    },
    {
      id: 2,
      tanggal: "dd/mm/yy",
      nip: "13012200",
      kategori: "Terlambat",
      checkIn: "18:00",
      checkOut: "04:03",
      durasi: "10 jam 3 menit",
    },
    {
      id: 3,
      tanggal: "dd/mm/yy",
      nip: "13012200",
      kategori: "Tepat Waktu",
      checkIn: "18:00",
      checkOut: "04:03",
      durasi: "10 jam 3 menit",
    },
  ];

  const pelanggaranData = [
    {
      id: 1,
      judul: "Teguran 1",
      tanggal: "23 Juni 2026",
      keterangan: "Keterangan pelanggaran pertama",
    },
    {
      id: 2,
      judul: "Teguran 2",
      tanggal: "10 Juli 2026",
      keterangan: "Keterangan pelanggaran kedua",
    },
    {
      id: 3,
      judul: "SP 1",
      tanggal: "01 Agustus 2026",
      keterangan: "Keterangan pelanggaran ketiga",
    },
  ];

  const currentPelanggaran = pelanggaranData[pelanggaranPage - 1];

  const handleTambahTab = () => {
    if (activeTab === "pendukung") modalDokumen.onOpen();
    if (activeTab === "pendidikan") modalPendidikan.onOpen();
    if (activeTab === "penghargaan") modalPenghargaan.onOpen();
  };

  const labelClass = "!text-xs !font-semibold !text-[#122C93]";

  const renderTabContent = () => {
    switch (activeTab) {
      case "absensi":
        return (
          <>
            <table className="w-full text-center border-separate border-spacing-y-0.5">
              <thead>
                <tr className="bg-[#F1F1F1] text-black">
                  <th className="py-2 px-3 font-normal text-xs rounded-l-lg">
                    Tanggal
                  </th>
                  <th className="py-2 px-3 font-normal text-xs">NIP</th>
                  <th className="py-2 px-3 font-normal text-xs">Kategori</th>
                  <th className="py-2 px-3 font-normal text-xs">Check In</th>
                  <th className="py-2 px-3 font-normal text-xs">Check Out</th>
                  <th className="py-2 px-3 font-normal text-xs rounded-r-lg">
                    Durasi
                  </th>
                </tr>
              </thead>
              <tbody>
                {absensiData.map((row, index) => (
                  <tr
                    key={row.id}
                    className={index % 2 !== 0 ? "bg-[#F1F1F1]" : "bg-white"}
                  >
                    <td
                      className={`py-2 px-3 text-xs ${index % 2 !== 0 ? "rounded-l-lg" : ""}`}
                    >
                      {row.tanggal}
                    </td>
                    <td className="py-2 px-3 text-xs">{row.nip}</td>
                    <td className="py-2 px-3">
                      <div
                        className={`mx-auto px-2 py-0.5 rounded-full text-[10px] font-medium w-fit ${row.kategori === "Tepat Waktu" ? "bg-[#DCFCE7] text-[#16A34A]" : "bg-[#FEF9C3] text-[#A16207]"}`}
                      >
                        {row.kategori}
                      </div>
                    </td>
                    <td className="py-2 px-3 text-xs">{row.checkIn}</td>
                    <td className="py-2 px-3 text-xs">{row.checkOut}</td>
                    <td
                      className={`py-2 px-3 text-xs ${index % 2 !== 0 ? "rounded-r-lg" : ""}`}
                    >
                      {row.durasi}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex w-full justify-center mt-1.5">
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
          </>
        );
      case "pendukung":
        return (
          <div className="flex flex-col gap-2 p-2">
            {["KTP", "Kartu BPJS"].map((nama) => (
              <div
                key={nama}
                className="border border-[#E8EEFF] flex flex-row items-center w-full bg-[#F5F7FF] py-2.5 px-4 gap-3 rounded-xl"
              >
                <div className="border rounded-xl p-2.5">
                  <FaIdCard className="text-xl" />
                </div>
                <div className="flex flex-col items-start">
                  <h2 className="font-semibold text-sm">{nama}</h2>
                  <h2 className="font-light text-xs text-[#8D8787]">
                    dd/mm/yyyy
                  </h2>
                </div>
              </div>
            ))}
          </div>
        );
      case "pendidikan":
        return (
          <div className="flex flex-col gap-2 p-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="border border-[#E8EEFF] flex flex-row items-center w-full bg-[#F5F7FF] py-2.5 px-4 gap-3 rounded-xl"
              >
                <div className="border rounded-xl p-2.5">
                  <GiGraduateCap className="text-xl" />
                </div>
                <div className="flex flex-col items-start">
                  <h2 className="font-semibold text-sm">Judul/Nama Diklat</h2>
                  <h2 className="font-semibold text-xs">Tahun</h2>
                  <h2 className="font-light text-xs text-[#8D8787]">
                    Keterangan
                  </h2>
                </div>
              </div>
            ))}
          </div>
        );
      case "penghargaan":
        return (
          <div className="flex flex-col gap-2 p-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="border border-[#E8EEFF] flex flex-row items-center w-full bg-[#F5F7FF] py-2.5 px-4 gap-3 rounded-xl"
              >
                <div className="border rounded-xl p-2.5">
                  <GoTrophy className="text-xl" />
                </div>
                <div className="flex flex-col items-start">
                  <h2 className="font-semibold text-sm">
                    Judul/Nama Penghargaan
                  </h2>
                  <h2 className="font-semibold text-xs">Tahun</h2>
                  <h2 className="font-light text-xs text-[#8D8787]">
                    Keterangan
                  </h2>
                </div>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-2 p-2.5 overflow-hidden">
      {/* Header */}
      <div className="flex flex-row justify-between items-center bg-white p-3 rounded-xl border border-[#E8EEFF]">
        <div className="flex flex-row gap-2.5 items-start">
          <div className="bg-[#DBEAFE] p-2 rounded-lg">
            <FaArrowLeftLong className="text-base" />
          </div>
          <div className="flex flex-col items-start">
            <h2 className="font-semibold text-sm text-[#122C93]">
              Detail Satpam
            </h2>
            <h2 className="text-xs font-light text-[#8D8787]">
              Profil Personal
            </h2>
          </div>
        </div>
        <div
          className="flex flex-row items-center gap-2 bg-[#122C93] px-3 py-2 rounded-xl cursor-pointer"
          onClick={modalGenerateKartu.onOpen}
        >
          <FaIdCardAlt className="text-white text-base" />
          <h2 className="text-white font-medium text-xs">
            Generate Kartu Anggota
          </h2>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="flex flex-row items-center justify-between gap-2.5">
        <div className="bg-white w-full h-[88px] rounded-xl border border-[#E8EEFF] flex flex-col justify-center p-3">
          <h2 className="font-medium text-xs text-black">
            Total Jam Kerja Bulan ini
          </h2>
          <h2 className="font-bold text-2xl text-[#122C93] leading-tight">
            178{" "}
            <span className="font-semibold text-[#8D8787] text-sm">Jam</span>
          </h2>
          <h2 className="font-light text-xs text-[#8D8787]">
            Periode Juni 2026 · 24 hari kerja
          </h2>
          <h2 className="text-xs font-medium text-[#122C93]">di mitra x</h2>
        </div>
        <div className="bg-white w-full h-[88px] rounded-xl border border-[#E8EEFF] flex flex-col justify-center p-3">
          <h2 className="font-medium text-xs text-black">
            Total Jam Kerja Keseluruhan
          </h2>
          <h2 className="font-bold text-2xl text-[#122C93] leading-tight">
            2.080{" "}
            <span className="font-semibold text-[#8D8787] text-sm">Jam</span>
          </h2>
          <h2 className="font-light text-xs text-[#8D8787]">
            Sejak Penempatan · Januari 2025 - sekarang
          </h2>
          <h2 className="text-xs font-medium text-[#122C93]">di mitra x</h2>
        </div>
      </div>

      {/* Informasi Personal */}
      <div className="flex flex-row items-center gap-5 bg-white rounded-xl px-3 py-2 border border-[#E8EEFF]">
        <div className="w-40 h-40 bg-slate-200 rounded-2xl flex-shrink-0"></div>
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col items-start">
            <div className="flex flex-row items-center gap-2">
              <h2 className="font-semibold text-lg">Nama Satpam</h2>
              <h2 className="bg-[#DCFCE7] text-xs px-3 py-0.5 rounded-2xl text-[#008236]">
                Aktif
              </h2>
            </div>
            <h2 className="text-xs font-light text-[#8D8787]">
              Jabatan · Pos Utama
            </h2>
          </div>
          <div className="flex flex-col flex-wrap gap-x-4 gap-y-5 w-full h-[120px]">
            {[
              [
                "ASAL DAERAH",
                "Jalan Basuki Rahmad, Kelurahan Margomulyo, Kabupaten Ngawi, Jawa Timur",
              ],
              ["NO. HP UTAMA", "0812 - 3456 - 7890"],
              ["NO. HP ORTU/WALI", "0812 - 3456 - 7890"],
              ["JENIS KELAMIN", "Laki-Laki"],
              ["NIP", "123xx"],
              ["EMAIL", "Prasetyoteguh@gmail.com"],
              ["NRGG", "33xxx"],
            ].map(([label, value], i) => (
              <div key={i} className="flex flex-col">
                <h2 className="font-light text-[10px] leading-tight">
                  {label}
                </h2>
                <h2 className="font-light text-[10px] leading-tight text-[#8D8787]">
                  {value}
                </h2>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Section */}
      <div className="flex flex-col items-start bg-white p-3 gap-1 rounded-xl border border-[#E8EEFF]">
        <div className="flex flex-row justify-between items-center w-full">
          <Tabs
            aria-label="Tabs variants"
            variant="underlined"
            selectedKey={activeTab}
            onSelectionChange={(key) => setActiveTab(key as string)}
            size="sm"
          >
            <Tab key="absensi" title="Riwayat Absensi" />
            <Tab key="pendukung" title="Dokumen Pendukung" />
            <Tab key="pendidikan" title="Riwayat Pendidikan" />
            <Tab key="penghargaan" title="Riwayat Penghargaan" />
          </Tabs>
          {activeTab !== "absensi" && (
            <Button
              className="font-semibold text-white text-xs bg-[#122C93] px-3 py-2 rounded-lg"
              size="sm"
              onPress={handleTambahTab}
            >
              + Tambah
            </Button>
          )}
        </div>
        <div className="w-full flex flex-col gap-1">{renderTabContent()}</div>
      </div>

      {/* Modal Generate Kartu Anggota */}
      <Modal
        isOpen={modalGenerateKartu.isOpen}
        onOpenChange={modalGenerateKartu.onOpenChange}
        backdrop="blur"
        size="lg"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-[#122C93] font-semibold">
                Pratinjau KTA
              </ModalHeader>
              <ModalBody className="gap-3 flex items-center py-4">
                <KartuAnggotaPreview {...dataKartu} />
              </ModalBody>
              <ModalFooter>
                <Button variant="bordered" onPress={onClose}>
                  Batal
                </Button>
                <Button
                  className="bg-[#122C93] text-white font-medium"
                  onPress={() => window.print()}
                >
                  Unduh KTA
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Inject Portal secara paralel jika modal kartu terbuka */}
      {modalGenerateKartu.isOpen && <KartuAnggotaPrintPortal {...dataKartu} />}

      {/* Modal Dokumen Pendukung */}
      <Modal
        isOpen={modalDokumen.isOpen}
        onOpenChange={modalDokumen.onOpenChange}
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-[#122C93] font-semibold">
                Tambah Dokumen Pendukung
              </ModalHeader>
              <ModalBody className="gap-3">
                <Select
                  className="max-w-full"
                  label="Jenis Dokumen"
                  labelPlacement="outside-top"
                  placeholder="Pilih Jenis Dokumen"
                  variant="bordered"
                  classNames={{ label: labelClass }}
                >
                  {jenisDokumen.map((item) => (
                    <SelectItem key={item.key}>{item.label}</SelectItem>
                  ))}
                </Select>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#122C93]">
                    Upload Dokumen
                  </span>
                  <label
                    htmlFor="upload-dokumen"
                    className="flex flex-col items-center justify-center w-full h-36 bg-[#F5F7FF] border-2 border-dashed border-[#8D8787] rounded-xl cursor-pointer hover:bg-[#e6ecff] transition-colors"
                  >
                    <div className="flex flex-col items-center gap-1 text-[#9095A0]">
                      <AiOutlineCloudUpload className="text-2xl" />
                      <span className="text-xs font-medium text-[#6B7280]">
                        Unggah Dokumen
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

      {/* Modal Pendidikan */}
      <Modal
        isOpen={modalPendidikan.isOpen}
        onOpenChange={modalPendidikan.onOpenChange}
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-[#122C93] font-semibold">
                Tambah Riwayat Pendidikan
              </ModalHeader>
              <ModalBody className="gap-3">
                <Input
                  label="Judul / Nama"
                  labelPlacement="outside-top"
                  placeholder="mis. Gada Pratama"
                  variant="bordered"
                  classNames={{ label: labelClass }}
                />
                <Input
                  label="Tahun"
                  labelPlacement="outside-top"
                  placeholder="Masukkan Tahun Pendidikan"
                  type="number"
                  variant="bordered"
                  classNames={{ label: labelClass }}
                />
                <Textarea
                  label="Keterangan"
                  labelPlacement="outside"
                  placeholder="Detail atau institusi / penerbit"
                  variant="bordered"
                  classNames={{ label: labelClass }}
                />
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#122C93]">
                    Upload Dokumen
                  </span>
                  <label
                    htmlFor="upload-dokumen"
                    className="flex flex-col items-center justify-center w-full h-36 bg-[#F5F7FF] border-2 border-dashed border-[#8D8787] rounded-xl cursor-pointer hover:bg-[#e6ecff] transition-colors"
                  >
                    <div className="flex flex-col items-center gap-1 text-[#9095A0]">
                      <AiOutlineCloudUpload className="text-2xl" />
                      <span className="text-xs font-medium text-[#6B7280]">
                        Unggah Dokumen
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

      {/* Modal Penghargaan */}
      <Modal
        isOpen={modalPenghargaan.isOpen}
        onOpenChange={modalPenghargaan.onOpenChange}
        backdrop="blur"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-[#122C93] font-semibold">
                Tambah Riwayat Penghargaan
              </ModalHeader>
              <ModalBody className="gap-3">
                <Input
                  label="Judul / Nama"
                  labelPlacement="outside-top"
                  placeholder="mis. Satpam Teladan"
                  variant="bordered"
                  classNames={{ label: labelClass }}
                />
                <Input
                  label="Tahun"
                  labelPlacement="outside-top"
                  placeholder="Masukkan Tahun Penghargaan"
                  type="number"
                  variant="bordered"
                  classNames={{ label: labelClass }}
                />
                <Textarea
                  label="Keterangan"
                  labelPlacement="outside"
                  placeholder="Detail Prestasi"
                  variant="bordered"
                  classNames={{ label: labelClass }}
                />
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-[#122C93]">
                    Upload Sertifikat (opsional)
                  </span>
                  <label
                    htmlFor="upload-dokumen"
                    className="flex flex-col items-center justify-center w-full h-36 bg-[#F5F7FF] border-2 border-dashed border-[#8D8787] rounded-xl cursor-pointer hover:bg-[#e6ecff] transition-colors"
                  >
                    <div className="flex flex-col items-center gap-1 text-[#9095A0]">
                      <AiOutlineCloudUpload className="text-2xl" />
                      <span className="text-xs font-medium text-[#6B7280]">
                        Unggah Sertifikat
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

      {/* Riwayat Pelanggaran */}
      <div className="flex flex-col gap-2 bg-white p-2 rounded-xl border border-[#E8EEFF]">
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row gap-2 items-center">
            <LuOctagonAlert className="text-danger text-xl" />
            <h2 className="font-semibold text-[#122C93] text-sm">
              Riwayat Pelanggaran
            </h2>
          </div>
          <Button
            className="font-semibold text-white text-xs bg-[#122C93] px-3 py-1.5 rounded-lg"
            size="sm"
            onPress={modalTambahPelanggaran.onOpen}
          >
            + Tambah Pelanggaran
          </Button>
        </div>

        {/* Modal Tambah Pelanggaran */}
        <Modal
          isOpen={modalTambahPelanggaran.isOpen}
          onOpenChange={modalTambahPelanggaran.onOpenChange}
          backdrop="blur"
        >
          <ModalContent>
            {(onClose) => (
              <>
                <ModalHeader className="text-[#122C93] font-semibold">
                  Tambah Pelanggaran
                </ModalHeader>
                <ModalBody className="gap-3">
                  <Select
                    className="max-w-full"
                    label="Kategori Pelanggaran"
                    labelPlacement="outside-top"
                    placeholder="Pilih Kategori"
                    variant="bordered"
                    classNames={{ label: labelClass }}
                  >
                    {kategoriPelanggaran.map((item) => (
                      <SelectItem key={item.key}>{item.label}</SelectItem>
                    ))}
                  </Select>
                  <DatePicker
                    className="max-w-full"
                    variant="bordered"
                    label="Tanggal"
                    labelPlacement="outside-top"
                    classNames={{ label: labelClass }}
                  />
                  <Textarea
                    label="Keterangan"
                    labelPlacement="outside"
                    placeholder="Detail Pelanggaran"
                    variant="bordered"
                    classNames={{ label: labelClass }}
                  />
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

        <div className="flex flex-row items-center justify-between bg-[#F5F7FF] px-4 py-3 rounded-xl border border-danger">
          <div className="flex flex-row items-center gap-3">
            <div className="bg-[#FFE2E2] p-2.5 rounded-xl">
              <IoIosAlert className="text-[#C10007] text-2xl" />
            </div>
            <div className="flex flex-col items-start">
              <h2 className="text-sm font-semibold">
                {currentPelanggaran.judul}
              </h2>
              <h2 className="text-xs font-semibold text-[#F31260]">
                {currentPelanggaran.tanggal}
              </h2>
              <h2 className="text-xs text-[#8D8787] font-light">
                {currentPelanggaran.keterangan}
              </h2>
            </div>
          </div>
          <div className="flex flex-row gap-2.5 items-center">
            <RiEditBoxFill className="text-xl cursor-pointer" />
            <MdDelete className="text-red-900 text-xl cursor-pointer" />
          </div>
        </div>
        <div className="flex w-full justify-center">
          <Pagination
            size="sm"
            showControls
            showShadow
            color="primary"
            page={pelanggaranPage}
            total={pelanggaranData.length}
            onChange={setPelanggaranPage}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDetailsSatpam;
