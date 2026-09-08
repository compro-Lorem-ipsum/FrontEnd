import { Button } from "@heroui/react";
import { GoAlertFill } from "react-icons/go";
import { formatDateTimeZone } from "../../Utils/helpers";
import type { PanicAlertData } from "../../types/panicAlert";

interface ActivePanicAlertCardProps {
  item: PanicAlertData;
  role: string;
  onHandleAlert: (uuid: string) => void;
}

export const ActivePanicAlertCard = ({
  item,
  role,
  onHandleAlert,
}: ActivePanicAlertCardProps) => {
  return (
    <div className="card-1 flex flex-col gap-3 items-start p-5 bg-white border border-[#A70202] rounded-xl w-full">
      <div className="header-card flex flex-row items-center w-full justify-between">
        <div className="left-side flex flex-row items-center gap-3">
          <div className="logo-container bg-[#FFE2E2] rounded-2xl p-5 flex-shrink-0">
            <GoAlertFill className="text-3xl text-[#A70202]" />
          </div>
          <div className="desc-container gap-1.5 flex flex-col items-start overflow-hidden">
            <h2 className="text-sm font-semibold truncate w-full">
              {item.satpam.nama}
            </h2>
            <h2 className="text-[#6B6B6B] text-xs font-medium truncate w-full">
              NIP {item.satpam.nip} · {formatDateTimeZone(item.created_at)}
            </h2>
            <h2 className="font-semibold text-xs text-[#122C93] truncate w-full">
              {item.client}
            </h2>
          </div>
        </div>
        <div className="indicator-active bg-[#FFE2E2] -mt-15 rounded-2xl px-4 py-1 flex-shrink-0">
          <h2 className="text-[#F31260] font-medium text-xs">Aktif</h2>
        </div>
      </div>

      <div className="bottom-side flex flex-row items-center justify-between w-full mt-2">
        <a
          href={`https://www.google.com/maps?q=${item.lat},${item.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#122C93] font-medium text-sm hover:underline"
        >
          Lihat Lokasi
        </a>

        <div className="flex flex-row gap-2 flex-shrink-0">
          {role === "admin" ? (
            <span className="text-sm font-semibold text-[#F31260]">
              Menunggu Ditangani
            </span>
          ) : (
            <Button
              size="sm"
              className="bg-[#E8EEFF] text-[#122C93] font-semibold"
              onPress={() => onHandleAlert(item.uuid)}
            >
              Tandai Ditangani
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
