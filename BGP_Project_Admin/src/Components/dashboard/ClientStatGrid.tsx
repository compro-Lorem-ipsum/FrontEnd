import { IoLocationOutline, IoPersonOutline } from "react-icons/io5";
import { GiPoliceOfficerHead } from "react-icons/gi";

interface ClientStatGridProps {
  loading: boolean;
  dashboardData: any;
}

export const ClientStatGrid = ({ loading, dashboardData }: ClientStatGridProps) => {
  return (
    <div className="grid grid-cols-3 gap-2 flex-shrink-0">
      <div className="flex flex-col bg-white p-3 rounded-xl border border-[#E8EEFF] justify-between">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-[12px] font-semibold">Jumlah Satpam</h2>
          <div className="bg-[#DBEAFE] p-1.5 rounded-xl">
            <GiPoliceOfficerHead className="text-xl text-[#122C93]" />
          </div>
        </div>
        <div className="flex flex-row items-end gap-1 mt-1">
          <h2 className="font-extrabold text-[26px] leading-none text-[#122C93]">
            {loading ? "-" : dashboardData?.satpam_assigned || 0}
          </h2>
          <h2 className="font-light text-[11px] text-black mb-0.5">
            Personel ditugaskan
          </h2>
        </div>
      </div>

      <div className="flex flex-col bg-white p-3 rounded-xl border border-[#E8EEFF] justify-between">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-[12px] font-semibold">Jumlah Pos</h2>
          <div className="bg-[#DBEAFE] p-1.5 rounded-xl">
            <IoLocationOutline className="text-xl text-[#122C93]" />
          </div>
        </div>
        <div className="flex flex-row items-center gap-2 mt-1">
          <h2 className="font-extrabold text-[26px] leading-none text-[#122C93]">
            {loading ? "-" : dashboardData?.posts || 0}
          </h2>
          <div className="flex flex-col">
            <h2 className="font-light text-[11px] text-black">
              titik penjagaan
            </h2>
          </div>
        </div>
      </div>

      <div className="flex flex-col bg-white p-3 rounded-xl border border-[#E8EEFF] justify-between">
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-[12px] font-semibold">Jadwal Hari ini</h2>
          <div className="bg-[#DBEAFE] p-1.5 rounded-xl">
            <IoPersonOutline className="text-xl text-[#122C93]" />
          </div>
        </div>
        <div className="flex flex-row items-end gap-1 mt-1">
          <h2 className="font-extrabold text-[26px] leading-none text-[#122C93]">
            {loading ? "-" : dashboardData?.scheduled_today || 0}
          </h2>
          <h2 className="font-light text-[11px] text-black mb-0.5">
            Dari {loading ? "-" : dashboardData?.satpam_assigned || 0} Personel
          </h2>
        </div>
      </div>
    </div>
  );
};
