/**
 * EditShiftModal — source-aware shift editing.
 *
 * The actions available depend on where the shift came from (source field):
 *
 * source: "manual"
 *   – Only option: Cancel this instance directly (no assignment/recurrence to point at)
 *
 * source: "pattern" | "override"
 *   – Edit (this day only): POST /shift-exceptions type=override + regenerate
 *   – Cancel from Rule: POST /shift-exceptions type=cancel + regenerate
 *   – Cancel this row: POST /shift-instances/:uuid/cancel (immediate)
 */
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Select,
  SelectItem,
  Input,
  addToast,
} from "@heroui/react";
import { useState, useEffect } from "react";
import { scheduleService } from "../../services/scheduleService";
import { InfiniteScrollTrigger } from "../common/InfiniteScrollTrigger";
import type { Jadwal } from "../../types/schedule";
import { MdInfo, MdWarning } from "react-icons/md";
import { FiClock } from "react-icons/fi";

interface EditShiftModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduleOptions: any;
  item: Jadwal | null;
  onSuccess: () => void;
}

function hhmm(utcInstant: string, timezone: string) {
  return new Date(utcInstant).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: timezone,
  });
}

const SOURCE_LABEL: Record<string, { label: string; color: string }> = {
  pattern: { label: "Dari Aturan Rutin", color: "text-blue-600 bg-blue-50 border-blue-200" },
  override: { label: "Sudah Diubah", color: "text-amber-600 bg-amber-50 border-amber-200" },
  manual: { label: "Jadwal Sekali Pakai", color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
};

const EditShiftModal = ({
  isOpen,
  onClose,
  scheduleOptions,
  item,
  onSuccess,
}: EditShiftModalProps) => {
  const [shiftUuid, setShiftUuid] = useState("");
  const [posUuid, setPosUuid] = useState("");
  const [startLocal, setStartLocal] = useState("");
  const [endLocal, setEndLocal] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen && item) {
      setShiftUuid(item.pattern.uuid);
      setPosUuid(item.pos.uuid);
      setStartLocal("");
      setEndLocal("");
    }
  }, [isOpen, item]);

  if (!item) return null;

  const isManual = item.source === "manual";
  const hasRule = Boolean(item.assignment_uuid || item.assignment?.uuid) && Boolean(item.recurrence_id);
  const sourceInfo = SOURCE_LABEL[item.source] ?? SOURCE_LABEL.pattern;
  const timezone = item.pattern.timezone;

  const handleEditSingleDay = async () => {
    if (!shiftUuid || !posUuid) {
      addToast({ title: "Validasi", description: "Shift dan Pos wajib dipilih", color: "warning" });
      return;
    }
    if ((startLocal && !endLocal) || (!startLocal && endLocal)) {
      addToast({ title: "Validasi", description: "Jam Mulai dan Jam Selesai harus diisi keduanya jika ingin menggunakan jam custom", color: "warning" });
      return;
    }
    setIsSubmitting(true);
    try {
      await scheduleService.update(
        item,
        {
          satpam_uuid: item.satpam.uuid,
          pos_uuid: posUuid,
          shift_uuid: shiftUuid,
          tanggal: item.work_date.split("T")[0],
          ...(startLocal && endLocal ? { start_local: startLocal, end_local: endLocal } : {}),
        },
        "single",
      );
      addToast({ title: "Berhasil", description: "Jadwal hari ini berhasil diubah", color: "success" });
      onSuccess();
      onClose();
    } catch (err: any) {
      addToast({ title: "Gagal", description: err.message || "Gagal mengubah jadwal", color: "danger" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelViaRule = async () => {
    const assignmentUuid = item.assignment_uuid || item.assignment?.uuid;
    if (!assignmentUuid || !item.recurrence_id) {
      addToast({ title: "Error", description: "Shift ini tidak punya aturan untuk dibatalkan.", color: "danger" });
      return;
    }
    setIsSubmitting(true);
    try {
      await scheduleService.createCancelException(assignmentUuid, item.recurrence_id.split("T")[0]);
      // Regenerate the whole month to apply exception
      const d = new Date(item.work_date.split("T")[0] + "T00:00:00");
      const first = new Date(d.getFullYear(), d.getMonth(), 1);
      const last = new Date(d.getFullYear(), d.getMonth() + 1, 0);
      const toIso = (dt: Date) => {
        const y = dt.getFullYear(), m = String(dt.getMonth() + 1).padStart(2, "0"), dd = String(dt.getDate()).padStart(2, "0");
        return `${y}-${m}-${dd}`;
      };
      await scheduleService.regenerateFrom(toIso(first), toIso(last));
      addToast({ title: "Berhasil", description: "Jadwal hari ini dibatalkan dari aturan. Jadwal hari lain tetap ada.", color: "success" });
      onSuccess();
      onClose();
    } catch (err: any) {
      addToast({ title: "Gagal", description: err.message || "Gagal membatalkan via aturan", color: "danger" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelInstance = async () => {
    setIsSubmitting(true);
    try {
      await scheduleService.cancelInstance(item.uuid);
      addToast({ title: "Berhasil", description: "Jadwal ini berhasil dibatalkan langsung.", color: "success" });
      onSuccess();
      onClose();
    } catch (err: any) {
      addToast({ title: "Gagal", description: err.message || "Gagal membatalkan jadwal", color: "danger" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal backdrop="opaque" isOpen={isOpen} onClose={onClose} size="lg">
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <span className="text-[#122C93]">Detail Jadwal Shift</span>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full border w-fit ${sourceInfo.color}`}>
            {sourceInfo.label}
          </span>
        </ModalHeader>

        <ModalBody>
          {/* Shift Info Summary */}
          <div className="bg-[#F8FAFC] rounded-xl p-4 flex flex-col gap-2 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-[#122C93] text-white flex items-center justify-center font-bold flex-shrink-0">
                {item.satpam.nama.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-sm">{item.satpam.nama}</p>
                <p className="text-xs text-[#6B6B6B]">NIP {item.satpam.nip} · {item.satpam.jabatan || "Anggota"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#6B6B6B] mt-1">
              <FiClock className="text-[#122C93] flex-shrink-0" />
              <span>
                {hhmm(item.starts_at, timezone)} – {hhmm(item.ends_at, timezone)}
                <span className="text-xs ml-1 text-[#9CA3AF]">({timezone})</span>
              </span>
            </div>
            <p className="text-xs text-[#6B6B6B]">
              <span className="font-medium">Pos:</span> {item.pos.nama} &nbsp;·&nbsp;
              <span className="font-medium">Shift:</span> {item.pattern.nama}
            </p>
          </div>

          {/* Manual shift: no rule actions */}
          {isManual && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs">
              <MdInfo className="flex-shrink-0 mt-0.5 text-base" />
              <span>
                Jadwal ini adalah <strong>sekali pakai</strong> (tidak ada aturan di baliknya).
                Anda bisa mengubahnya di sini, tapi perubahan jadwal ini tidak memengaruhi pola rutin apa pun.
              </span>
            </div>
          )}

          {/* Edit form: available for rule-based and manual (fallback handles recreate) */}
          {(hasRule || isManual) && item.status !== "completed" && (
            <div className="flex flex-col gap-4">
              <p className="text-xs text-[#6B6B6B] font-medium uppercase tracking-wide">
                Ubah Jadwal Hari Ini Saja
              </p>
              <Select
                label="Shift"
                variant="underlined"
                labelPlacement="inside"
                selectedKeys={shiftUuid ? [shiftUuid] : []}
                onSelectionChange={(k) => setShiftUuid(String(Array.from(k)[0]))}
                listboxProps={{
                  bottomContent: (
                    <InfiniteScrollTrigger
                      hasMore={scheduleOptions.hasMoreShift}
                      isLoading={scheduleOptions.isLoadingShift}
                      onLoadMore={scheduleOptions.loadMoreShift}
                    />
                  ),
                }}
              >
                {scheduleOptions.listShift.map((s: any) => (
                  <SelectItem
                    key={s.uuid}
                    textValue={`${s.nama} (${s.mulai?.slice(0, 5)} - ${s.selesai?.slice(0, 5)})`}
                  >
                    {s.nama} ({s.mulai?.slice(0, 5)} – {s.selesai?.slice(0, 5)})
                  </SelectItem>
                ))}
              </Select>

              <Select
                label="Pos"
                variant="underlined"
                labelPlacement="inside"
                selectedKeys={posUuid ? [posUuid] : []}
                onSelectionChange={(k) => setPosUuid(String(Array.from(k)[0]))}
                isDisabled={!isManual && hasRule}
                description={!isManual && hasRule ? "Pos tidak bisa diubah untuk jadwal dari aturan rutin (hanya Shift/Jam). Batalkan jadwal ini dan buat jadwal baru jika ingin pindah Pos." : ""}
                listboxProps={{
                  bottomContent: (
                    <InfiniteScrollTrigger
                      hasMore={scheduleOptions.hasMorePos}
                      isLoading={scheduleOptions.isLoadingPos}
                      onLoadMore={scheduleOptions.loadMorePos}
                    />
                  ),
                }}
              >
                {scheduleOptions.listPos.map((p: any) => (
                  <SelectItem key={p.uuid} textValue={p.nama}>
                    {p.nama}
                  </SelectItem>
                ))}
              </Select>

              <div className="flex gap-4">
                <Input
                  label="Jam Mulai (Opsional)"
                  type="time"
                  variant="underlined"
                  value={startLocal}
                  onChange={(e) => setStartLocal(e.target.value)}
                  placeholder="Ikuti shift"
                />
                <Input
                  label="Jam Selesai (Opsional)"
                  type="time"
                  variant="underlined"
                  value={endLocal}
                  onChange={(e) => setEndLocal(e.target.value)}
                  placeholder="Ikuti shift"
                />
              </div>
              <p className="text-[11px] text-gray-500 mt-[-8px]">
                Biarkan kosong untuk mengikuti waktu default dari Shift yang dipilih.
              </p>
            </div>
          )}

          {/* Warning about completed status */}
          {item.status === "completed" && (
            <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs mt-2">
              <MdWarning className="flex-shrink-0 mt-0.5 text-base" />
              <span>Satpam sudah check-in. Jadwal ini tidak bisa dibatalkan.</span>
            </div>
          )}
        </ModalBody>

        <ModalFooter className="flex-col gap-2 pb-6">
          {/* Edit action — available for both if not completed */}
          {(hasRule || isManual) && item.status !== "completed" && (
            <Button
              className="w-full bg-[#122C93] text-white"
              onPress={handleEditSingleDay}
              isLoading={isSubmitting}
            >
              Simpan Perubahan
            </Button>
          )}

          {/* Cancel via rule — only for rule-based shifts */}
          {!isManual && hasRule && item.status !== "completed" && (
            <Button
              variant="bordered"
              className="w-full text-amber-700 border-amber-300 hover:bg-amber-50"
              onPress={handleCancelViaRule}
              isLoading={isSubmitting}
            >
              Batalkan dari Aturan (Hari Ini)
            </Button>
          )}

          {/* Direct cancel — always available (except completed) */}
          {item.status !== "completed" && (
            <Button
              variant="bordered"
              className="w-full text-red-600 border-red-200 hover:bg-red-50"
              onPress={handleCancelInstance}
              isLoading={isSubmitting}
            >
              {isManual ? "Batalkan Jadwal Ini" : "Batalkan Langsung (Hanya Baris Ini)"}
            </Button>
          )}

          <Button variant="light" className="w-full" onPress={onClose}>
            Tutup
          </Button>

          {/* Explanation */}
          {item.status !== "completed" && (
            <div className="w-full text-[11px] text-[#9CA3AF] space-y-1 border-t border-[#E4E9F7] pt-2 mt-1">
              {!isManual && <p><strong className="text-amber-600">Batalkan dari Aturan:</strong> Hapus jadwal ini dari pola berulang. Jadwal hari lainnya tetap ada. Cocok untuk cuti/izin.</p>}
              <p><strong className="text-red-600">Batalkan Langsung:</strong> Hapus baris ini saja, tanpa mengubah aturan. Cocok untuk tukar jadwal sehari. Efek langsung tanpa perlu re-generate.</p>
            </div>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditShiftModal;
