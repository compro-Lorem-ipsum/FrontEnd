import { useMemo } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Textarea,
  Select,
  SelectItem,
} from "@heroui/react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { IoClose } from "react-icons/io5";

interface DocumentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editUuid: string | null;
  judul: string;
  setJudul: (val: string) => void;
  deskripsi: string;
  setDeskripsi: (val: string) => void;
  file: File | null;
  setFile: (val: File | null) => void;
  selectedKeys: any;
  handleSelectionChange: (keys: any) => void;
  clearAll: () => void;
  targetOptions: any[];
  ALL_KEY: string;
  handleSubmit: () => void;
  submitting: boolean;
}

const labelClass = "text-xs font-semibold text-[#122C93]";

export const DocumentFormModal = ({
  isOpen,
  onClose,
  editUuid,
  judul,
  setJudul,
  deskripsi,
  setDeskripsi,
  file,
  setFile,
  selectedKeys,
  handleSelectionChange,
  clearAll,
  targetOptions,
  ALL_KEY,
  handleSubmit,
  submitting,
}: DocumentFormModalProps) => {
  const selectedCount = useMemo(() => {
    if (selectedKeys === "all") return targetOptions.length;
    const keySet = selectedKeys as Set<string>;
    return keySet.has(ALL_KEY) ? targetOptions.length - 1 : keySet.size;
  }, [selectedKeys, targetOptions, ALL_KEY]);

  const selectedLabels = useMemo(() => {
    if (selectedKeys === "all") {
      return targetOptions.map((t) => t.label);
    }
    return targetOptions
      .filter((t) => (selectedKeys as Set<string>).has(t.key))
      .map((t) => t.label);
  }, [selectedKeys, targetOptions]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => !open && onClose()}
      backdrop="blur"
    >
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="text-[#122C93] font-semibold">
              {editUuid ? "Update Dokumen" : "Tambah Dokumen"}
            </ModalHeader>
            <ModalBody className="gap-3">
              <Input
                label="Judul / Nama"
                value={judul}
                onValueChange={setJudul}
                labelPlacement="outside-top"
                placeholder="mis. SOP Kebakaran"
                isRequired
                variant="bordered"
                classNames={{ label: labelClass }}
              />
              <Textarea
                label="Deskripsi (Opsional)"
                value={deskripsi}
                onValueChange={setDeskripsi}
                labelPlacement="outside-top"
                placeholder="Ringkasan isi dokumen"
                variant="bordered"
                classNames={{ label: labelClass }}
              />

              <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold text-[#122C93]">
                  Upload Dokumen {!editUuid && <span className="text-danger">*</span>}
                  {editUuid && (
                    <span className="text-gray-500 font-normal">
                      {" "}
                      (Opsional - biarkan kosong jika tidak ingin mengubah file)
                    </span>
                  )}
                </span>
                <label
                  htmlFor="upload-dokumen"
                  className="flex flex-col items-center justify-center w-full h-36 bg-[#F5F7FF] border-2 border-dashed border-[#8D8787] rounded-xl cursor-pointer hover:bg-[#e6ecff] transition-colors"
                >
                  <div className="flex flex-col items-center gap-1 text-[#9095A0]">
                    <AiOutlineCloudUpload className="text-2xl" />
                    <span className="text-xs font-medium text-[#6B7280]">
                      {file
                        ? file.name
                        : editUuid
                        ? "Ganti Dokumen"
                        : "Unggah Dokumen"}
                    </span>
                    <span className="text-xs text-[#9CA3AF]">PDF, PNG/JPG</span>
                  </div>
                  <input
                    id="upload-dokumen"
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        setFile(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex flex-row items-center justify-between">
                  <span className="text-sm font-semibold text-[#122C93]">
                    Target Penerima <span className="text-danger">*</span>
                  </span>
                  {selectedCount > 0 && (
                    <div className="flex flex-row items-center gap-1.5">
                      <span className="inline-flex items-center justify-center bg-[#122C93] text-white text-[10px] font-semibold rounded-full w-5 h-5">
                        {selectedCount}
                      </span>
                      <span className="text-[11px] text-[#8D8787]">terpilih</span>
                      <button
                        onClick={clearAll}
                        className="flex items-center justify-center w-4 h-4 rounded-full bg-[#E4E9F7] hover:bg-[#DBEAFE] transition-colors"
                      >
                        <IoClose className="text-[#122C93] text-[10px]" />
                      </button>
                    </div>
                  )}
                </div>
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
                    {targetOptions.map((t) => (
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
                onPress={handleSubmit}
                isLoading={submitting}
              >
                Simpan
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
