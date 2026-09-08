import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaIdCardAlt, FaUser, FaUserEdit, FaIdCard } from "react-icons/fa";
import { GoTrophy } from "react-icons/go";
import { GiGraduateCap } from "react-icons/gi";
import { Tab, Tabs, Spinner } from "@heroui/react";

import { useAdminSatpamDetails } from "../hooks/useAdminSatpamDetails";
import { SatpamDetailModals } from "../Components/satpam/Modals/SatpamDetailModals";
import { useSatpamAbsensi } from "../hooks/useSatpamAbsensi";
import { SatpamAbsensiTable } from "../Components/satpam/SatpamAbsensiTable";
import { SatpamRiwayatPelanggaran } from "../Components/satpam/SatpamRiwayatPelanggaran";

const ClientDetailsSatpam = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const uuid = location.state?.uuid;

  const { state, setters, handlers, modals } = useAdminSatpamDetails(uuid);
  const [activeTab, setActiveTab] = useState("absensi");

  const {
    absensiItems,
    absensiLoading,
    absensiCurrentIndex,
    absensiHasMore,
    handleNextAbsensi,
    handlePrevAbsensi,
  } = useSatpamAbsensi(state.satpam?.uuid, activeTab);

  const dataKartu = state.cardData ? {
    nama: state.cardData.nama,
    jabatan: state.cardData.jabatan,
    nip: state.cardData.nip,
    nrg: state.cardData.nrg,
    mitra: state.cardData.client,
    disahkanOleh: "Direktur Utama",
    avatar_url: state.cardData.avatar_url,
  } : {
    nama: "Nama Anggota",
    jabatan: "Jabatan",
    nip: "123xxx",
    nrg: "00103062026000007",
    mitra: "Nama Mitra",
    disahkanOleh: "Direktur Utama",
  };

  const kerabat1 = state.emergencyContacts && state.emergencyContacts.length > 0 ? state.emergencyContacts[0] : null;
  const kerabat2 = state.emergencyContacts && state.emergencyContacts.length > 1 ? state.emergencyContacts[1] : null;

  const currentPelanggaran = state.violations.length > 0 ? state.violations[0] : null;

  const renderTabContent = () => {
    switch (activeTab) {
      case "absensi":
        return (
          <SatpamAbsensiTable
            absensiLoading={absensiLoading}
            absensiItems={absensiItems}
            absensiCurrentIndex={absensiCurrentIndex}
            absensiHasMore={absensiHasMore}
            handleNextAbsensi={handleNextAbsensi}
            handlePrevAbsensi={handlePrevAbsensi}
          />
        );

      case "pendukung":
        return (
          <div className="flex flex-col gap-2 p-2">
            {state.documents.length === 0 && (
              <div className="text-center text-sm text-gray-500 py-4">Belum ada dokumen pendukung</div>
            )}
            {state.documents.map((doc: any) => (
              <div
                key={doc.uuid}
                className="border border-[#E8EEFF] flex flex-row items-center w-full bg-[#F5F7FF] py-2.5 px-4 gap-3 rounded-xl cursor-pointer"
                onClick={() => handlers.openPreviewModal(doc)}
              >
                <div className="border rounded-xl p-2.5 bg-white">
                  <FaIdCard className="text-xl text-[#122C93]" />
                </div>
                <div className="flex flex-col items-start flex-1">
                  <h2 className="font-semibold text-sm text-black">{doc.type ? doc.type.toUpperCase() : "Dokumen"}</h2>
                  <h2 className="font-light text-xs text-[#8D8787]">
                    {new Date(doc.created_at).toLocaleDateString("id-ID")}
                  </h2>
                </div>
              </div>
            ))}
          </div>
        );

      case "pendidikan":
        return (
          <div className="flex flex-col gap-2 p-2">
            {state.educations.length === 0 && (
              <div className="text-center text-sm text-gray-500 py-4">Belum ada riwayat pendidikan</div>
            )}
            {state.educations.map((edu: any) => (
              <div
                key={edu.uuid}
                className="border border-[#E8EEFF] flex flex-row items-center w-full bg-[#F5F7FF] py-2.5 px-4 gap-3 rounded-xl cursor-pointer"
                onClick={() => edu.file && handlers.openPreviewModal(edu)}
              >
                <div className="border rounded-xl p-2.5 bg-white">
                  <GiGraduateCap className="text-xl text-[#122C93]" />
                </div>
                <div className="flex flex-col items-start flex-1">
                  <h2 className="font-semibold text-sm text-black">{edu.title}</h2>
                  <h2 className="font-semibold text-xs text-[#122C93]">{edu.issued_year}</h2>
                  {edu.description && (
                    <h2 className="font-light text-xs text-[#8D8787]">
                      {edu.description}
                    </h2>
                  )}
                </div>
              </div>
            ))}
          </div>
        );

      case "penghargaan":
        return (
          <div className="flex flex-col gap-2 p-2">
            {state.recognitions.length === 0 && (
              <div className="text-center text-sm text-gray-500 py-4">Belum ada riwayat penghargaan</div>
            )}
            {state.recognitions.map((rec: any) => (
              <div
                key={rec.uuid}
                className="border border-[#E8EEFF] flex flex-row items-center w-full bg-[#F5F7FF] py-2.5 px-4 gap-3 rounded-xl cursor-pointer"
                onClick={() => rec.file && handlers.openPreviewModal(rec)}
              >
                <div className="border rounded-xl p-2.5 bg-white">
                  <GoTrophy className="text-xl text-[#122C93]" />
                </div>
                <div className="flex flex-col items-start flex-1">
                  <h2 className="font-semibold text-sm text-black">{rec.title}</h2>
                  <h2 className="font-semibold text-xs text-[#122C93]">{rec.issued_year}</h2>
                  {rec.description && (
                    <h2 className="font-light text-xs text-[#8D8787]">
                      {rec.description}
                    </h2>
                  )}
                </div>
              </div>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const renderJamMenit = (totalHours: number | undefined) => {
    if (!totalHours) {
      return (
        <>
          0 <span className="font-semibold text-[#8D8787] text-sm">Jam</span>
        </>
      );
    }
    const jam = Math.floor(totalHours);
    const menit = Math.round((totalHours - jam) * 60);

    return (
      <>
        {jam.toLocaleString("id-ID")} <span className="font-semibold text-[#8D8787] text-sm">Jam</span>
        {menit > 0 && (
          <>
            {" "}
            {menit} <span className="font-semibold text-[#8D8787] text-sm">Menit</span>
          </>
        )}
      </>
    );
  };

  return (
    <div className="flex flex-col gap-2 p-2.5 overflow-hidden">
      {/* Header */}
      <div className="flex flex-row justify-between items-center bg-white p-3 rounded-xl border border-[#E8EEFF]">
        <div className="flex flex-row gap-2.5 items-start">
          <div className="bg-[#DBEAFE] p-2 rounded-lg cursor-pointer" onClick={() => navigate(-1)}>
            <FaArrowLeftLong className="text-base" />
          </div>
          <div className="flex flex-col items-start">
            <h2 className="font-semibold text-sm text-[#122C93]">
              {state.satpam?.nama || "Prasetyo Teguh"}
            </h2>
            <h2 className="text-xs font-light text-[#8D8787]">
              NIP {state.satpam?.nip || "-"}
            </h2>
          </div>
          <div className="flex flex-row items-center gap-1.5">
            <h2 className={`text-xs px-3 py-0.5 rounded-2xl ${state.satpam?.status === 'active' ? 'bg-[#DCFCE7] text-[#008236]' : 'bg-red-100 text-red-700'}`}>
              {state.satpam?.status === 'active' ? 'Aktif' : state.satpam?.status || "Aktif"}
            </h2>
            <h2 className="bg-[#D9D9D9] text-xs px-3 py-0.5 rounded-2xl text-black">
              {state.satpam?.jabatan || "Anggota"}
            </h2>
          </div>
        </div>
        <div
          className="flex flex-row items-center gap-2 bg-[#122C93] px-3 py-2 rounded-xl cursor-pointer"
          onClick={modals.modalGenerateKartu.onOpen}
        >
          <FaIdCardAlt className="text-white text-base" />
          <h2 className="text-white font-medium text-xs">
            Generate Kartu Anggota
          </h2>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="flex flex-row items-center justify-between gap-2.5">
        <div className="bg-white w-full h-[120px] rounded-xl border border-[#E8EEFF] flex flex-row items-center gap-4 p-4">
          <div className="bg-[#D9D9D9] w-[70px] h-[70px] rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center">
            {state.satpam?.avatar?.view_url ? (
              <img src={state.satpam.avatar.view_url} className="w-full h-full object-cover" alt="Profile" />
            ) : (
              <FaUser className="text-xl" />
            )}
          </div>
          <div className="flex flex-col gap-1">
            <div>
              <h2 className="font-bold text-md">{state.satpam?.nama || "Prasetyo Teguh"}</h2>
              <h2 className="font-light text-xs">
                Bergabung sejak {state.satpam?.created_at ? new Date(state.satpam.created_at).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' }) : "-"}
              </h2>
            </div>
            <div>
              <h2 className="font-bold text-md">Tempat Tugas</h2>
              <h2 className="font-light text-xs">{state.satpam?.client || "-"}</h2>
            </div>
          </div>
        </div>
        <div className="bg-white w-full h-[120px] rounded-xl border border-[#E8EEFF] flex flex-col justify-center p-4">
          <h2 className="font-medium text-md text-black">
            Total Jam Kerja Bulan ini
          </h2>
          <h2 className="font-bold text-2xl text-[#122C93] leading-tight">
            {renderJamMenit(state.workingHours?.this_month?.hours)}
          </h2>
          <h2 className="font-light text-xs text-[#8D8787]">
            Periode {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })} · {state.workingHours?.this_month?.shifts || 0} hari kerja
          </h2>
          <h2 className="font-light text-xs text-[#8D8787]">
            {state.satpam?.client ? `di ${state.satpam.client}` : "-"}
          </h2>
        </div>
        <div className="bg-white w-full h-[120px] rounded-xl border border-[#E8EEFF] flex flex-col justify-center p-4">
          <h2 className="font-medium text-md text-black">
            Total Seluruh Jam Kerja
          </h2>
          <h2 className="font-bold text-2xl text-[#122C93] leading-tight">
            {renderJamMenit(state.workingHours?.all_time?.hours)}
          </h2>
          <h2 className="font-light text-xs text-[#8D8787]">
            Sejak Penempatan · {(state.satpam?.date_assigned || state.workingHours?.all_time?.since || state.workingHours?.since) ? new Date(state.satpam?.date_assigned || state.workingHours?.all_time?.since || state.workingHours?.since).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }) : "-"}
          </h2>
          <h2 className="font-light text-xs text-[#8D8787]">
            {state.satpam?.client ? `di ${state.satpam.client}` : "-"}
          </h2>
        </div>
      </div>

      {/* Informasi Personal */}
      {state.isLoading ? (
        <div className="flex justify-center p-10"><Spinner /></div>
      ) : state.satpam ? (
        <div className="flex flex-col bg-white p-3 gap-2 rounded-xl border border-[#E8EEFF]">
          <div className="flex flex-row items-center gap-2">
            <FaUserEdit className="text-[#122C93] text-2xl" />
            <h2 className="font-semibold text-[#122C93] text-md">
              Informasi Personal
            </h2>
          </div>
          <div className="flex flex-col flex-wrap gap-x-6 gap-y-4 w-full h-[180px]">
            {[
              ["ASAL DAERAH", state.satpam.asal_daerah || "-"],
              ["NO. HP UTAMA", state.satpam.nomor_hp || state.satpam.no_telp || "-"],
              ["NO. HP KERABAT 1", kerabat1 ? `${kerabat1.kontak} (${kerabat1.nama})` : "-"],
              ["STATUS HUBUNGAN 1", kerabat1 ? (kerabat1.hubungan?.toUpperCase() || "-") : "-"],
              ["NO. HP KERABAT 2", kerabat2 ? `${kerabat2.kontak} (${kerabat2.nama})` : "-"],
              ["STATUS HUBUNGAN 2", kerabat2 ? (kerabat2.hubungan?.toUpperCase() || "-") : "-"],
              ["JENIS KELAMIN", state.satpam.gender === "1" ? "Laki-Laki" : state.satpam.gender === "2" ? "Perempuan" : "-"],
              ["NIP", state.satpam.nip || "-"],
              ["EMAIL", state.satpam.email || "-"],
              ["NRG", state.satpam.nrg || "-"],
            ].map(([label, value], i) => (
              <div key={i} className="flex flex-col">
                <h2 className="font-light text-xs leading-tight">{label}</h2>
                <h2 className="font-light text-sm leading-tight text-[#8D8787] max-w-[200px] truncate" title={String(value)}>
                  {value}
                </h2>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-center p-10">Data tidak ditemukan</div>
      )}

      {/* Tab Section */}
      <div className="flex flex-col items-start bg-white p-3 gap-1 rounded-xl border border-[#E8EEFF]">
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
        <div className="w-full flex flex-col gap-1">{renderTabContent()}</div>
      </div>

      <SatpamRiwayatPelanggaran
        state={state}
        handlers={handlers}
        currentPelanggaran={currentPelanggaran}
      />

      <SatpamDetailModals
        state={state}
        setters={setters}
        handlers={handlers}
        modals={modals}
        dataKartu={dataKartu}
      />
    </div>
  );
};

export default ClientDetailsSatpam;
