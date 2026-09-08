import { Button, Spinner, Pagination } from "@heroui/react";
import { LuOctagonAlert } from "react-icons/lu";
import { IoIosAlert } from "react-icons/io";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { kategoriPelanggaran } from "./constants";

interface SatpamRiwayatPelanggaranProps {
  state: any;
  handlers: any;
  currentPelanggaran: any;
}

export const SatpamRiwayatPelanggaran = ({
  state,
  handlers,
  currentPelanggaran,
}: SatpamRiwayatPelanggaranProps) => {
  return (
    <div className="flex flex-col gap-2 bg-white p-3 rounded-xl border border-[#E8EEFF]">
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-row gap-2 items-center">
          <LuOctagonAlert className="text-danger text-xl" />
          <h2 className="font-semibold text-[#122C93] text-sm">
            Riwayat Pelanggaran
          </h2>
        </div>

        <Button
          className="font-semibold text-white text-xs bg-[#122C93] px-3 py-1.5 rounded-lg"
          onPress={handlers.handleTambahPelanggaran}
        >
          + Tambah Pelanggaran
        </Button>
      </div>

      {state.isLoadingViolations ? (
        <div className="flex justify-center py-4"><Spinner size="sm" /></div>
      ) : currentPelanggaran ? (
        <div className="flex flex-row items-center justify-between bg-[#F5F7FF] px-4 py-3 rounded-xl border border-danger">
          <div className="flex flex-row items-center gap-3">
            <div className="bg-[#FFE2E2] p-2.5 rounded-xl">
              <IoIosAlert className="text-[#C10007] text-2xl" />
            </div>
            <div className="flex flex-col items-start">
              <h2 className="text-sm font-semibold">
                {kategoriPelanggaran.find((k) => k.key === currentPelanggaran.type)?.label || currentPelanggaran.type}
              </h2>
              <h2 className="text-xs font-semibold text-[#F31260]">
                {currentPelanggaran.created_at ? new Date(currentPelanggaran.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : "-"}
              </h2>
              <h2 className="text-xs text-[#8D8787] font-light">
                {currentPelanggaran.description}
              </h2>
            </div>
          </div>
          <div className="flex flex-row gap-2.5 items-center">
            <button onClick={(e) => handlers.handleEditViolation(currentPelanggaran, e)} className="p-2 border border-[#C7D2FE] rounded-lg text-[#122C93] hover:bg-white transition-colors">
              <FaRegEdit className="text-base cursor-pointer" />
            </button>
            <button onClick={(e) => handlers.handleDeleteViolation(currentPelanggaran.uuid, e)} className="p-2 border border-[#C7D2FE] rounded-lg text-[#A70202] hover:bg-[#FDEDED] transition-colors">
              <FaRegTrashAlt className="text-base" />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center text-sm text-gray-500 py-4">Belum ada pelanggaran</div>
      )}

      {(state.violations.length > 0 || state.violCurrentIndex > 0) && (
        <div className="flex w-full justify-center">
          <Pagination
            size="sm"
            showControls
            showShadow
            color="primary"
            page={state.violCurrentIndex + 1}
            total={Math.max(state.violCurrentIndex + 1 + (state.violHasMore ? 1 : 0), 1)}
            onChange={(page) => {
              if (page > state.violCurrentIndex + 1) handlers.handleNextViolation();
              else if (page < state.violCurrentIndex + 1) handlers.handlePrevViolation();
            }}
            classNames={{
              item: "[&:not([data-active=true])]:hidden",
            }}
          />
        </div>
      )}
    </div>
  );
};
