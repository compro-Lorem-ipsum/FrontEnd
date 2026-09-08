import { FaArrowLeftLong } from "react-icons/fa6";
import { FaUserAlt, FaPhoneAlt, FaRegTrashAlt } from "react-icons/fa";
import { Button, Input, Select, SelectItem, Spinner } from "@heroui/react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import {
  useAdminEditDetailSatpam,
  enumgender,
  jabatan,
  statuspegawai,
  hubunganOptions,
} from "../hooks/useAdminEditDetailSatpam";

const AdminEditDetailSatpam = () => {
  const {
    navigate,
    isLoading,
    isSaving,
    isUploadingAvatar,
    satpamData,
    kontakUtama,
    nrg,
    avatarFile,
    existingAvatarUrl,
    visibleContacts,
    isNipInvalid,
    isKontakUtamaInvalid,
    isSaveDisabled,
    handleInputChange,
    handleKontakUtamaChange,
    handleContactChange,
    handleAddContact,
    handleRemoveContact,
    handleAvatarUpload,
    handleSave,
  } = useAdminEditDetailSatpam();

  if (isLoading) {
    return (
      <div className="flex justify-center p-10">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-2.5 overflow-hidden h-full">
      {/* header bar */}
      <div className="flex flex-row justify-between items-center bg-white p-2.5 rounded-xl flex-shrink-0">
        <div className="flex flex-row gap-2.5 items-start">
          <div
            className="bg-[#DBEAFE] p-2 rounded-lg cursor-pointer"
            onClick={() => navigate(-1)}
          >
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
            onPress={() => navigate(-1)}
            isDisabled={isSaving || isUploadingAvatar}
          >
            Batal
          </Button>
          <Button
            className="bg-[#122C93] text-white font-semibold text-xs px-4"
            size="sm"
            onPress={handleSave}
            isLoading={isSaving}
            isDisabled={isSaveDisabled}
          >
            Simpan Data Satpam
          </Button>
        </div>
      </div>

      {/* main content */}
      <div className="container-main flex flex-row gap-4 items-stretch justify-between flex-1 min-h-0">
        <div className="container-left flex flex-col w-1/2 bg-white rounded-lg gap-3 p-4 overflow-y-auto">
          {/* header */}
          <div className="header-container flex flex-row items-center gap-2">
            <FaUserAlt className="text-lg text-[#122C93]" />
            <h2 className="text-xs font-semibold text-[#122C93]">
              DATA PRIBADI
            </h2>
          </div>

          <Input
            size="sm"
            label="Nama Lengkap"
            labelPlacement="outside-top"
            placeholder="mis. Nur Cahya"
            variant="bordered"
            isRequired
            maxLength={100}
            value={satpamData.nama}
            onChange={(e) => handleInputChange("nama", e.target.value)}
          />
          <Input
            size="sm"
            label="Asal Daerah"
            labelPlacement="outside-top"
            placeholder="mis. Ngawi, Jawa Timur"
            variant="bordered"
            isRequired
            maxLength={100}
            value={satpamData.asal_daerah}
            onChange={(e) => handleInputChange("asal_daerah", e.target.value)}
          />

          <Select
            size="sm"
            isRequired
            className="max-w-full"
            label="Jenis Kelamin"
            labelPlacement="outside-top"
            variant="bordered"
            placeholder="Masukan jenis kelamin"
            selectedKeys={
              satpamData.gender ? new Set([satpamData.gender]) : new Set()
            }
            onSelectionChange={(keys) =>
              handleInputChange("gender", Array.from(keys)[0] as string)
            }
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
            selectedKeys={
              satpamData.jabatan ? new Set([satpamData.jabatan]) : new Set()
            }
            onSelectionChange={(keys) =>
              handleInputChange("jabatan", Array.from(keys)[0] as string)
            }
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
              isRequired
              maxLength={18}
              isInvalid={isNipInvalid}
              errorMessage={isNipInvalid ? "NIP harus 1-18 digit angka" : ""}
              value={satpamData.nip}
              onChange={(e) => handleInputChange("nip", e.target.value)}
            />
            <Input
              size="sm"
              label="NRG"
              labelPlacement="outside-top"
              placeholder="Otomatis"
              variant="bordered"
              className="w-1/2"
              isDisabled
              value={nrg}
            />
          </div>

          <Input
            size="sm"
            label="Alamat Email"
            labelPlacement="outside-top"
            placeholder="contoh@gmail.com"
            variant="bordered"
            isRequired
            maxLength={100}
            type="email"
            value={satpamData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
          />

          <Select
            size="sm"
            isRequired
            className="max-w-full"
            label="Status Kepegawaian"
            labelPlacement="outside-top"
            variant="bordered"
            placeholder="Pilih Status"
            selectedKeys={
              satpamData.status ? new Set([satpamData.status]) : new Set()
            }
            onSelectionChange={(keys) =>
              handleInputChange("status", Array.from(keys)[0] as string)
            }
          >
            {statuspegawai.map((item) => (
              <SelectItem key={item.key}>{item.label}</SelectItem>
            ))}
          </Select>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium">Pas Foto</span>
            <label
              htmlFor="upload-dokumen"
              className="flex flex-col items-center justify-center w-full h-36 bg-[#F5F7FF] border-2 border-dashed border-[#8D8787] rounded-xl cursor-pointer hover:bg-[#e6ecff] transition-colors relative overflow-hidden"
            >
              {avatarFile || existingAvatarUrl ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  {avatarFile ? (
                    <img
                      src={URL.createObjectURL(avatarFile)}
                      className="h-full object-contain"
                      alt="New avatar"
                    />
                  ) : (
                    <img
                      src={existingAvatarUrl!}
                      className="h-full object-contain"
                      alt="Current avatar"
                    />
                  )}
                  {isUploadingAvatar && (
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                      <Spinner color="white" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-row items-center gap-2 text-[#9095A0]">
                  <AiOutlineCloudUpload className="text-lg" />
                  <span className="text-xs font-medium text-[#6B7280]">
                    Unggah Dokumen
                  </span>
                  <span className="text-xs text-[#9CA3AF]">PDF, PNG/JPG</span>
                </div>
              )}
              <input
                id="upload-dokumen"
                type="file"
                accept=".png,.jpg,.jpeg"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleAvatarUpload(e.target.files[0]);
                  }
                }}
              />
            </label>
            {(avatarFile || existingAvatarUrl) && (
              <span className="text-[10px] text-gray-500 text-center mt-1">
                Klik gambar untuk mengganti foto
              </span>
            )}
          </div>
        </div>

        <div className="container-right flex flex-col w-1/2 bg-white rounded-lg p-4 gap-3 overflow-y-auto">
          {/* header */}
          <div className="header-container flex flex-row items-center gap-2">
            <FaPhoneAlt className="text-lg text-[#122C93]" />
            <h2 className="text-xs font-semibold text-[#122C93]">KONTAK</h2>
          </div>

          <Input
            size="sm"
            label="No. Telp"
            labelPlacement="outside-top"
            placeholder="08xx - xxxx - xxxx"
            variant="bordered"
            isRequired
            maxLength={15}
            isInvalid={isKontakUtamaInvalid}
            errorMessage={
              isKontakUtamaInvalid ? "Nomor HP harus 8-15 digit angka" : ""
            }
            value={kontakUtama}
            onChange={(e) => handleKontakUtamaChange(e.target.value)}
          />

          <div className="border border-dashed border-[#8D8787] my-2" />

          {/* header */}
          <div className="header-container flex flex-row items-center gap-2">
            <FaPhoneAlt className="text-lg text-[#122C93]" />
            <h2 className="text-xs font-semibold text-[#122C93]">
              KONTAK DARURAT
            </h2>
          </div>

          {visibleContacts.map((contact, index) => (
            <div
              key={contact.id || index}
              className="flex flex-col gap-3 border p-3 rounded-lg border-gray-200"
            >
              <Input
                size="sm"
                label="Nama Kerabat / Wali"
                labelPlacement="outside-top"
                placeholder="Nama Lengkap"
                variant="bordered"
                isRequired
                maxLength={100}
                value={contact.nama}
                onChange={(e) =>
                  handleContactChange(index, "nama", e.target.value)
                }
              />

              <div className="container-input flex flex-row items-center gap-3">
                <Select
                  size="sm"
                  label="Hubungan"
                  labelPlacement="outside-top"
                  placeholder="Pilih Hubungan"
                  variant="bordered"
                  className="w-1/2"
                  isRequired
                  selectedKeys={
                    contact.hubungan ? new Set([contact.hubungan]) : new Set()
                  }
                  onSelectionChange={(keys) =>
                    handleContactChange(
                      index,
                      "hubungan",
                      Array.from(keys)[0] as string
                    )
                  }
                >
                  {hubunganOptions.map((item) => (
                    <SelectItem key={item.key}>{item.label}</SelectItem>
                  ))}
                </Select>
                <Input
                  size="sm"
                  label="No. Telp"
                  labelPlacement="outside-top"
                  placeholder="08xx - xxxx - xxxx"
                  variant="bordered"
                  className="w-1/2"
                  isRequired
                  maxLength={15}
                  isInvalid={
                    contact.kontak.length > 0 &&
                    !/^\d{8,15}$/.test(contact.kontak)
                  }
                  errorMessage={
                    contact.kontak.length > 0 &&
                    !/^\d{8,15}$/.test(contact.kontak)
                      ? "8-15 digit angka"
                      : ""
                  }
                  value={contact.kontak}
                  onChange={(e) =>
                    handleContactChange(index, "kontak", e.target.value)
                  }
                />
              </div>

              <Button
                size="sm"
                className="w-full bg-[#A70202] text-white mt-1"
                onPress={() => handleRemoveContact(index)}
                startContent={<FaRegTrashAlt size={14} />}
              >
                Hapus Kontak
              </Button>
            </div>
          ))}

          {visibleContacts.length < 2 && (
            <Button
              size="sm"
              className="border-[#122C93] text-[#122C93] font-semibold text-sm mt-2 hover:bg-[#122C93] hover:text-white"
              variant="bordered"
              onPress={handleAddContact}
            >
              + Tambahkan Nomor Kedua
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminEditDetailSatpam;

