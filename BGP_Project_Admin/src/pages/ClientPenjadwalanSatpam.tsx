import { useState } from "react";
import { Button, useDisclosure, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { useShiftPatternData } from "../hooks/useShiftPatternData";
import { useScheduleOptions } from "../hooks/useScheduleOptions";
import { useJadwalSatpam, toIsoDate } from "../hooks/useJadwalSatpam";
import { parseDate } from "@internationalized/date";
import type { Jadwal } from "../types/schedule";

// Components
import AssignJadwalModal from "../Components/penjadwalan/AssignJadwalModal";
import EditShiftModal from "../Components/penjadwalan/EditShiftModal";
import JadwalHarianView from "../Components/penjadwalan/JadwalHarianView";
import JadwalMingguanView from "../Components/penjadwalan/JadwalMingguanView";
import JadwalBulananView from "../Components/penjadwalan/JadwalBulananView";
import ShiftConfigSection from "../Components/penjadwalan/ShiftConfigSection";

const ClientPenjadwalanSatpam = () => {
  const {
    activeSwitch,
    setActiveSwitch,
    rangeMode,
    setRangeMode,
    currentDate,
    allJadwal,
    isJadwalLoading,
    handlePrev,
    handleNext,
    // Direct cancel
    jadwalCancelModal,
    executeCancelInstance,
    isCancelling,
    cancelTarget,
    // Cancel via rule
    jadwalRuleModal,
    executeCancelViaRule,
    isRuleCancelling,
    ruleTarget,
  } = useJadwalSatpam("jadwal");

  const scheduleOptions = useScheduleOptions(activeSwitch === "jadwal");
  const { data: shiftData } = useShiftPatternData();

  // === Assign Jadwal Modal (Tambah Baru) ===
  const [selectedJadwalUuid] = useState<string | null>(null);
  const {
    isOpen: isManualOpen,
    onOpen: onManualOpen,
    onClose: onManualClose,
  } = useDisclosure();
  const [manualInitialData, setManualInitialData] = useState<any>();

  // === Edit Shift Modal (source-aware) ===
  const [editTarget, setEditTarget] = useState<Jadwal | null>(null);
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  // === Monthly view: selected date for sidebar ===
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // === Handlers ===
  const handleOpenTambahJadwal = () => {
    setManualInitialData({
      tanggalMulai: undefined,
      tanggalAkhir: undefined,
      pos_uuid: "",
      satpam_uuid: "",
      shift_uuid: "",
      selectedDays: [1, 2, 3, 4, 5, 6, 0],
    });
    onManualOpen();
  };

  const handleOpenAssign = (shiftUuid: string) => {
    setManualInitialData({
      tanggalMulai: parseDate(toIsoDate(currentDate)),
      tanggalAkhir: undefined,
      pos_uuid: "",
      satpam_uuid: "",
      shift_uuid: shiftUuid,
      selectedDays: [1, 2, 3, 4, 5, 6, 0],
    });
    onManualOpen();
  };

  const handleOpenAssignForDate = (satpamUuid: string, dateIso: string) => {
    setEditTarget(null);
    setManualInitialData({
      satpam_uuid: satpamUuid,
      tanggalMulai: parseDate(dateIso),
      tanggalAkhir: undefined,
      pos_uuid: scheduleOptions.listPos.length > 0 ? scheduleOptions.listPos[0].uuid : "",
      shift_uuid: "",
      selectedDays: [1, 2, 3, 4, 5, 6, 0],
    });
    onManualOpen();
  };

  const handleEditJadwalInstance = (item: Jadwal) => {
    setEditTarget(item);
    onEditOpen();
  };

  const formatTanggal = (date: Date) =>
    date.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });

  const formatRentangMinggu = (date: Date) => {
    const dayOfWeek = date.getDay();
    const start = new Date(date);
    start.setDate(start.getDate() - dayOfWeek);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `${start.toLocaleDateString("id-ID", { day: "2-digit", month: "long" })} - ${end.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}`;
  };

  const formatBulan = (date: Date) =>
    date.toLocaleDateString("id-ID", { month: "long", year: "numeric" });

  const getDateLabel = () => {
    if (rangeMode === "harian") return formatTanggal(currentDate);
    if (rangeMode === "mingguan") return formatRentangMinggu(currentDate);
    return formatBulan(currentDate);
  };

  // Shifts on selected date for monthly sidebar
  const shiftsOnSelectedDate = selectedDate
    ? allJadwal.filter((j) => j.work_date.split("T")[0] === selectedDate && j.status !== "cancelled")
    : [];

  return (
    <div className="manage-penjadwalan-satpam-container flex flex-col p-6 h-[calc(100vh-90px)] overflow-hidden">
      <div className="title flex flex-col gap-1 items-start">
        <h1 className="text-xl font-bold text-[#122C93]">Manajemen Shift &amp; Penjadwalan</h1>
        <p className="text-[#8D8787] text-sm">
          Kelola jam kerja, atur posisi satpam, dan atur jadwal tugas untuk memastikan operasional harian yang lancar dan terorganisir.
        </p>
      </div>

      {/* Tab Switcher */}
      <div className="header-actions flex flex-row items-center justify-between mb-5 w-full mt-6">
        <div className="left-side flex flex-row items-center gap-5 flex-1">
          <div className="container-switcher flex flex-row w-fit items-center gap-1 bg-[#F1F1F1] p-1 rounded-4xl">
            <h2
              onClick={() => setActiveSwitch("jadwal")}
              className={`text-sm px-4 py-2 rounded-2xl cursor-pointer font-medium transition-colors ${
                activeSwitch === "jadwal" ? "bg-white text-[#122C93]" : "text-[#6B6B6B]"
              }`}
            >
              Jadwal Jaga
            </h2>
            <h2
              onClick={() => setActiveSwitch("shift")}
              className={`text-sm px-4 py-2 rounded-2xl cursor-pointer font-medium transition-colors ${
                activeSwitch === "shift" ? "bg-white text-[#122C93]" : "text-[#6B6B6B]"
              }`}
            >
              Atur Shift
            </h2>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide pb-4">
        {activeSwitch === "jadwal" ? (
          <div className="flex flex-col gap-4 h-full">
          {/* View controls */}
          <div className="flex flex-row items-center justify-between w-full">
            <div className="left-side flex flex-row items-center gap-4 flex-wrap">
              {/* View mode switcher */}
              <div className="container-switcher flex flex-row w-fit items-center gap-1 bg-[#F1F1F1] p-1 rounded-4xl">
                {(["harian", "mingguan", "bulanan"] as const).map((mode) => {
                  const label = mode === "harian" ? "Harian" : mode === "mingguan" ? "7 Hari" : "Bulan";
                  return (
                    <h2
                      key={mode}
                      onClick={() => setRangeMode(mode)}
                      className={`text-sm px-4 py-2 rounded-2xl cursor-pointer font-medium transition-colors ${
                        rangeMode === mode ? "bg-white text-[#122C93]" : "text-[#6B6B6B]"
                      }`}
                    >
                      {label}
                    </h2>
                  );
                })}
              </div>

              {/* Date navigation */}
              <div className="container-date-switch flex flex-row gap-3 items-center">
                <button
                  onClick={handlePrev}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-[#E4E9F7] hover:bg-[#F5F7FF] transition-colors"
                >
                  <IoChevronBack className="text-[#122C93] text-base" />
                </button>
                <div className="bg-[#F1F1F1] px-6 py-3 rounded-4xl">
                  <h2 className="text-sm font-medium text-black">{getDateLabel()}</h2>
                </div>
                <button
                  onClick={handleNext}
                  className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-[#E4E9F7] hover:bg-[#F5F7FF] transition-colors"
                >
                  <IoChevronForward className="text-[#122C93] text-base" />
                </button>
              </div>
            </div>

            <Button
              className="bg-[#122C93] text-white font-semibold h-11 rounded-xl px-6"
              onPress={handleOpenTambahJadwal}
            >
              Tambah Jadwal +
            </Button>
          </div>

          {/* Views */}
          {rangeMode === "harian" ? (
            <JadwalHarianView
              currentDateIso={toIsoDate(currentDate)}
              isJadwalLoading={isJadwalLoading}
              shiftData={shiftData}
              allJadwal={allJadwal}
              handleOpenAssign={handleOpenAssign}
              handleEditJadwalInstance={handleEditJadwalInstance}
            />
          ) : rangeMode === "mingguan" ? (
            <JadwalMingguanView
              currentDate={currentDate}
              allJadwal={allJadwal}
              listSatpam={scheduleOptions.listSatpam}
              handleEditJadwalInstance={handleEditJadwalInstance}
              handleOpenAssignForDate={handleOpenAssignForDate}
            />
          ) : (
            <div className="flex gap-4">
              {/* Monthly calendar */}
              <div className="flex-1 min-w-0">
                <JadwalBulananView
                  currentDate={currentDate}
                  allJadwal={allJadwal}
                  isJadwalLoading={isJadwalLoading}
                  onSelectDate={setSelectedDate}
                  selectedDate={selectedDate}
                />
              </div>

              {/* Day detail sidebar */}
              {selectedDate && (
                <div className="w-72 flex-shrink-0 bg-white border border-[#E4E9F7] rounded-2xl p-4 flex flex-col gap-3 self-start">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm text-[#122C93]">
                      {new Date(selectedDate + "T00:00:00").toLocaleDateString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </h3>
                    <button
                      onClick={() => handleOpenAssignForDate("", selectedDate)}
                      className="text-xs px-2 py-1 rounded-lg bg-[#122C93] text-white hover:opacity-90 transition-opacity"
                    >
                      + Tambah
                    </button>
                  </div>

                  <hr className="border-[#E4E9F7]" />

                  {isJadwalLoading ? (
                    <p className="text-xs text-[#9CA3AF]">Memuat...</p>
                  ) : shiftsOnSelectedDate.length === 0 ? (
                    <p className="text-xs text-[#9CA3AF] text-center py-4">
                      Tidak ada jadwal pada hari ini.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {shiftsOnSelectedDate.map((s) => (
                        <div
                          key={s.uuid}
                          className="flex items-center justify-between p-2.5 rounded-xl border border-[#E4E9F7] hover:bg-[#F8FAFF] cursor-pointer transition-colors"
                          onClick={() => handleEditJadwalInstance(s)}
                        >
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-semibold">{s.satpam.nama}</span>
                            <span className="text-[11px] text-[#6B6B6B]">
                              {s.pattern.nama} · {s.pos.nama}
                            </span>
                          </div>
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
                              s.source === "manual"
                                ? "bg-indigo-50 text-indigo-600 border-indigo-200"
                                : s.source === "override"
                                ? "bg-amber-50 text-amber-600 border-amber-200"
                                : "bg-blue-50 text-blue-600 border-blue-200"
                            }`}
                          >
                            {s.source === "manual" ? "sekali" : s.source === "override" ? "ubah" : "rutin"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
          </div>
        ) : (
          <ShiftConfigSection />
        )}
      </div>

      {/* Modals */}
      <AssignJadwalModal
        isOpen={isManualOpen}
        onClose={onManualClose}
        scheduleOptions={scheduleOptions}
        onSuccess={() => setTimeout(() => window.location.reload(), 800)}
        selectedJadwalUuid={selectedJadwalUuid}
        initialData={manualInitialData}
      />

      {/* Edit / Kelola Jadwal (source-aware) */}
      <EditShiftModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        scheduleOptions={scheduleOptions}
        item={editTarget}
        onSuccess={() => setTimeout(() => window.location.reload(), 800)}
      />

      {/* Direct Cancel Confirmation */}
      <Modal isOpen={jadwalCancelModal.isOpen} onClose={jadwalCancelModal.onClose} size="sm" backdrop="opaque">
        <ModalContent>
          <ModalHeader className="text-red-600">Batalkan Jadwal Langsung</ModalHeader>
          <ModalBody>
            <p className="text-sm">
              Anda akan membatalkan jadwal <strong>{cancelTarget?.satpam.nama}</strong> pada{" "}
              <strong>{cancelTarget?.work_date.split("T")[0]}</strong> secara langsung.
            </p>
            <p className="text-xs text-[#9CA3AF] mt-2">
              ⚠️ Hanya baris ini yang dibatalkan. Jadwal di hari lain tetap tidak berubah. Cocok untuk tukar jadwal sehari.
            </p>
          </ModalBody>
          <ModalFooter className="gap-2">
            <Button variant="light" onPress={jadwalCancelModal.onClose}>Batal</Button>
            <Button color="danger" isLoading={isCancelling} onPress={executeCancelInstance}>
              Ya, Batalkan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Cancel Via Rule Confirmation */}
      <Modal isOpen={jadwalRuleModal.isOpen} onClose={jadwalRuleModal.onClose} size="sm" backdrop="opaque">
        <ModalContent>
          <ModalHeader className="text-amber-600">Batalkan dari Aturan</ModalHeader>
          <ModalBody>
            <p className="text-sm">
              Anda akan menghapus jadwal <strong>{ruleTarget?.satpam.nama}</strong> pada{" "}
              <strong>{ruleTarget?.work_date.split("T")[0]}</strong> dari aturan berulangnya.
            </p>
            <p className="text-xs text-[#9CA3AF] mt-2">
              ⚠️ Hanya hari ini yang dihapus dari aturan. Jadwal hari Senin/Selasa/Rabu lainnya dalam pola yang sama tetap ada. Cocok untuk cuti/izin.
            </p>
          </ModalBody>
          <ModalFooter className="gap-2">
            <Button variant="light" onPress={jadwalRuleModal.onClose}>Batal</Button>
            <Button
              className="bg-amber-500 text-white"
              isLoading={isRuleCancelling}
              onPress={executeCancelViaRule}
            >
              Ya, Batalkan dari Aturan
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default ClientPenjadwalanSatpam;
