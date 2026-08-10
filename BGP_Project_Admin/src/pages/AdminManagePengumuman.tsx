import { DatePicker, Input, Select, SelectItem, Textarea } from "@heroui/react";
import { now, getLocalTimeZone } from "@internationalized/date";
import { Button } from "@heroui/react";
import { RiEditFill } from "react-icons/ri";
import { MdDelete } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";
import { GoClock } from "react-icons/go";
import { IoIosCalendar } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import React from "react";

export const clients = [
  { key: "all", label: "Semua Client" },
  { key: "smb", label: "Sumarecon Bandung" },
  { key: "mitra1", label: "Mitra Sejahtera" },
  { key: "mitra2", label: "Graha Properti" },
];

export const satpamTargets = [
  { key: "all", label: "Seluruh Satpam" },
  { key: "smb", label: "Sumarecon Bandung" },
  { key: "mitra1", label: "Mitra Sejahtera" },
  { key: "mitra2", label: "Graha Properti" },
  { key: "chief", label: "Chief" },
  { key: "danru", label: "Danru" },
  { key: "anggota", label: "Anggota" },
];

const ALL_KEY = "all";

const CardItem = ({ onPressEdit }: { onPressEdit?: () => void }) => (
  <div className="card-container flex flex-row items-start justify-between p-5 rounded-2xl border border-[#E4E9F7]">
    <div className="left-side flex flex-row items-start gap-4">
      <div className="bg-[#DBEAFE] p-2.5 rounded-lg">
        <IoIosCalendar className="w-6 h-6 text-[#122C93]" />
      </div>
      <div className="flex flex-col gap-2 items-start">
        <h2 className="font-semibold">Upacara HUT Perusahaan</h2>
        <div className="flex flex-row items-center gap-3">
          <div className="flex flex-row items-center gap-2">
            <IoLocationOutline className="text-md text-[#122C93]" />
            <h2 className="text-xs text-[#122C93]">Lapangan Kantor</h2>
          </div>
          <div className="flex flex-row items-center gap-2">
            <GoClock className="text-md text-[#6B6B6B]" />
            <h2 className="text-xs text-[#6B6B6B]">
              Sen, 15 Juni 2026, 08.00 WIB
            </h2>
          </div>
        </div>
        <h2 className="text-xs">
          Peringatan hari jadi Perusahaan. Seluruh personel mengenakan Seragam
          beratribut lengkap. Acara dilanjutkan potong tumpeng.
        </h2>
        <div className="assign-to">
          <h2 className="text-xs bg-[#DBEAFE] px-3 py-1 border border-[#122C93] font-light rounded-full">
            Seluruh Satpam
          </h2>
        </div>
      </div>
    </div>
    <div className="flex flex-row items-center">
      <Button
        size="sm"
        variant="bordered"
        className="bg-[#F5F7FF] border w-4 rounded-r-none"
        onPress={onPressEdit}
      >
        <RiEditFill className="text-[#122C93] text-lg" />
      </Button>
      <Button
        size="sm"
        variant="bordered"
        className="bg-[#F5F7FF] border w-4 rounded-l-none"
      >
        <MdDelete className="text-[#A70202] text-lg" />
      </Button>
    </div>
  </div>
);

const AdminManagePengumuman = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedKeys, setSelectedKeys] = React.useState<Set<string>>(
    new Set(),
  );

  const handleSelectionChange = (keys: any) => {
    const keysArray = Array.from(keys as Set<string>);

    if (keysArray.includes(ALL_KEY) && !selectedKeys.has(ALL_KEY)) {
      setSelectedKeys(new Set(satpamTargets.map((t) => t.key)));
      return;
    }

    if (!keysArray.includes(ALL_KEY) && selectedKeys.has(ALL_KEY)) {
      setSelectedKeys(new Set());
      return;
    }

    const withoutAll = keysArray.filter((k) => k !== ALL_KEY);
    const allNonAllKeys = satpamTargets
      .filter((t) => t.key !== ALL_KEY)
      .map((t) => t.key);
    const allSelected = allNonAllKeys.every((k) => withoutAll.includes(k));

    if (allSelected) {
      setSelectedKeys(new Set(satpamTargets.map((t) => t.key)));
    } else {
      setSelectedKeys(new Set(withoutAll));
    }
  };

  const clearAll = () => setSelectedKeys(new Set());

  const selectedCount = selectedKeys.has(ALL_KEY)
    ? satpamTargets.length - 1
    : selectedKeys.size;

  const selectedLabels = satpamTargets
    .filter((t) => t.key !== ALL_KEY && selectedKeys.has(t.key))
    .map((t) => t.label);

  return (
    <div className="flex flex-col gap-2 p-2.5 overflow-hidden">
      <div className="flex flex-row items-center justify-between mt-2">
        <div className="flex flex-col items-start">
          <h2 className="font-semibold text-2xl text-[#122C93]">Pengumuman</h2>
          <p className="text-md text-black text-sm">
            Broadcast informasi ke semua satpam atau hanya satpam di client
            tertentu.
          </p>
        </div>
        <Button
          className="text-white font-semibold bg-[#122C93]"
          size="md"
          onPress={onOpen}
        >
          + Buat Pengumuman
        </Button>
      </div>

      <div className="container-search rounded-2xl flex flex-row gap-3 items-center bg-[#FFFFFF] p-3 border border-[#E4E9F7]">
        <div className="flex flex-row items-center gap-2 bg-white border border-[#E4E9F7] rounded-xl px-4 h-11 flex-1">
          <FiSearch className="text-[#B0B0B0] text-base flex-shrink-0" />
          <input
            type="search"
            placeholder="Cari nama pengumuman, atau nama mitra"
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

      <div className="main-content flex flex-col p-2.5 gap-2 rounded-2xl border border-[#E4E9F7] bg-white">
        <CardItem onPressEdit={onOpen} />
        <CardItem />
        <CardItem />
      </div>

      {/* Modal */}
      <Modal size="lg" backdrop="blur" isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-row items-center gap-2">
                <IoIosCalendar className="text-2xl text-[#122C93]" />
                <h2 className="text-[#122C93]">Buat / Edit Pengumuman</h2>
              </ModalHeader>
              <ModalBody className="flex flex-col w-full gap-3">
                <Input
                  className="max-w-full"
                  label="Nama Pengumuman / Agenda"
                  isRequired
                  labelPlacement="outside-top"
                  placeholder="mis. Apel Pagi"
                  variant="bordered"
                  classNames={{ label: "text-sm font-semibold text-[#122C93]" }}
                />
                <div className="flex flex-row gap-2">
                  <Input
                    className="w-1/2"
                    label="Tempat"
                    isRequired
                    labelPlacement="outside-top"
                    placeholder="mis. Lapangan"
                    variant="bordered"
                    classNames={{
                      label: "text-sm font-semibold text-[#122C93]",
                    }}
                  />

                  <DatePicker
                    hideTimeZone
                    showMonthAndYearPickers
                    defaultValue={now(getLocalTimeZone())}
                    label="Waktu"
                    className="w-1/2"
                    labelPlacement="outside-top"
                    variant="bordered"
                    classNames={{
                      label: "text-sm font-semibold text-[#122C93]",
                    }}
                  />
                </div>
                <Textarea
                  className="max-w-full"
                  label="Isi / Deskripsi"
                  isRequired
                  labelPlacement="outside-top"
                  placeholder="Jelaskan isi pengumuman, agenda kegiatan atau hal yang perlu disiapkan"
                  variant="bordered"
                  classNames={{ label: "text-sm font-semibold text-[#122C93]" }}
                />
                <hr className="w-full border-[#E4E9F7]" />

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
                <Button className="bg-[#122C93] text-white font-medium">
                  Buat Pengumuman
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AdminManagePengumuman;
