import { FaArrowLeftLong } from "react-icons/fa6";
import { FaUserAlt, FaPhoneAlt } from "react-icons/fa";
import { Button, Input } from "@heroui/react";
import { Select, SelectItem } from "@heroui/react";
import { AiOutlineCloudUpload } from "react-icons/ai";

export const enumgender = [
  { key: "laki", label: "Laki-Laki" },
  { key: "pr", label: "Perempuan" },
];

export const jabatan = [
  { key: "chief", label: "Chief" },
  { key: "danru", label: "Danru" },
  { key: "anggota", label: "Anggota" },
];

export const statuspegawai = [
  { key: "aktif", label: "Aktif" },
  { key: "nonaktif", label: "Non Aktif" },
  { key: "resign", label: "Resign" },
];

const AdminEditDetailSatpam = () => {
  return (
    <div className="flex flex-col gap-2 p-2.5 overflow-hidden">
      {/* header bar */}
      <div className="flex flex-row justify-between items-center bg-white p-2.5 rounded-xl">
        <div className="flex flex-row gap-2.5 items-start">
          <div className="bg-[#DBEAFE] p-2 rounded-lg">
            <FaArrowLeftLong className="text-base" />
          </div>
          <div className="flex flex-col items-start">
            <h2 className="font-semibold text-sm text-[#122C93]">
              Edit Satpam
            </h2>
            <h2 className="text-xs font-light text-[#8D8787]">
              Pastikan data personel sudah sesuai sebelum menyimpan perubahan.
            </h2>
          </div>
        </div>
        <div className="flex flex-row items-center gap-2">
          <Button
            variant="bordered"
            className="border-[#122C93] text-[#122C93] font-semibold text-xs px-4"
            size="sm"
          >
            Batal
          </Button>
          <Button
            className="bg-[#122C93] text-white font-semibold text-xs px-4"
            size="sm"
          >
            Simpan Data Satpam
          </Button>
        </div>
      </div>
      {/* end of header bar */}

      {/* main content */}
      <div className="container-main flex flex-row gap-4 items-stretch justify-between flex-1 min-h-0">
        <div className="container-left flex flex-col w-1/2 bg-white rounded-lg gap-1.5 p-2.5 overflow-y-auto">
          {/* header */}
          <div className="header-container flex flex-row items-center gap-2 mb-1">
            <FaUserAlt className="text-lg text-[#122C93]" />
            <h2 className="text-xs font-semibold text-[#122C93]">
              DATA PRIBADI
            </h2>
          </div>
          {/* end of header */}
          <Input
            size="sm"
            label="Nama Lengkap"
            labelPlacement="outside-top"
            placeholder="mis. Nur Cahya"
            variant="bordered"
            isRequired
          />
          <Input
            size="sm"
            label="Alamat"
            labelPlacement="outside-top"
            placeholder="mis. Ngawi, Jawa Timur"
            variant="bordered"
            isRequired
          />

          <Select
            size="sm"
            isRequired
            className="max-w-full"
            label="Jenis Kelamin"
            labelPlacement="outside-top"
            variant="bordered"
            placeholder="Masukan jenis kelamin"
          >
            {enumgender.map((item) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            ))}
          </Select>

          <Select
            size="sm"
            isRequired
            className="max-w-full"
            label="Jabatan"
            labelPlacement="outside-top"
            variant="bordered"
            placeholder="Pilih Jabatan"
          >
            {jabatan.map((item) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            ))}
          </Select>

          <div className="container-input flex flex-row items-center gap-3">
            <Input
              size="sm"
              label="NIP"
              labelPlacement="outside-top"
              placeholder="1301xxx"
              variant="bordered"
              className="w-1/2"
            />
            <Input
              size="sm"
              label="NRG"
              labelPlacement="outside-top"
              placeholder="Otomatis"
              variant="bordered"
              className="w-1/2"
            />
          </div>

          <Input
            size="sm"
            label="Alamat Email"
            labelPlacement="outside-top"
            placeholder="contoh@gmail.com"
            variant="bordered"
            isRequired
          />
          <Select
            size="sm"
            isRequired
            className="max-w-full"
            label="Status Kepegawaian"
            labelPlacement="outside-top"
            variant="bordered"
            placeholder="Pilih Jabatan"
          >
            {statuspegawai.map((item) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            ))}
          </Select>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium">
              Pas Foto
            </span>
            <label
              htmlFor="upload-dokumen"
              className="flex flex-col items-center justify-center w-full h-50 bg-[#F5F7FF] border-2 border-dashed border-[#8D8787] rounded-xl cursor-pointer hover:bg-[#e6ecff] transition-colors"
            >
              <div className="flex flex-row items-center gap-2 text-[#9095A0]">
                <AiOutlineCloudUpload className="text-lg" />
                <span className="text-xs font-medium text-[#6B7280]">
                  Unggah Dokumen
                </span>
                <span className="text-xs text-[#9CA3AF]">PDF, PNG/JPG</span>
              </div>
              <input
                id="upload-dokumen"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg"
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="container-right flex flex-col w-1/2 bg-white rounded-lg p-2.5 gap-1.5 overflow-y-auto">
          {/* header */}
          <div className="header-container flex flex-row items-center gap-2 mb-1">
            <FaPhoneAlt className="text-lg text-[#122C93]" />
            <h2 className="text-xs font-semibold text-[#122C93]">KONTAK</h2>
          </div>
          {/* end of header */}
          <Input
            size="sm"
            label="No. Telp"
            labelPlacement="outside-top"
            placeholder="08xx - xxxx - xxxx"
            variant="bordered"
            isRequired
          />

          <div className="border border-dashed border-[#8D8787] my-2" />

          {/* header */}
          <div className="header-container flex flex-row items-center gap-2 mb-1">
            <FaPhoneAlt className="text-lg text-[#122C93]" />
            <h2 className="text-xs font-semibold text-[#122C93]">
              KONTAK Darurat
            </h2>
          </div>
          {/* end of header */}

          <Input
            size="sm"
            label="Nama Kerabat / Wali"
            labelPlacement="outside-top"
            placeholder="Nama Lengkap"
            variant="bordered"
            isRequired
          />

          <div className="container-input flex flex-row items-center gap-3">
            <Input
              size="sm"
              label="Hubungan"
              labelPlacement="outside-top"
              placeholder="Pilih Hubungan"
              variant="bordered"
              className="w-1/2"
              isRequired
            />
            <Input
              size="sm"
              label="No. Telp"
              labelPlacement="outside-top"
              placeholder="08xx - xxxx - xxxx"
              variant="bordered"
              className="w-1/2"
              isRequired
            />
          </div>

          <Button
            size="sm"
            className="border-[#122C93] text-[#122C93] font-semibold text-xs mt-2 hover:bg-[#122C93] hover:text-white"
            variant="bordered"
          >
            + Tambahkan Nomor Kedua
          </Button>
        </div>
      </div>
      {/* end of main content */}
    </div>
  );
};

export default AdminEditDetailSatpam;
