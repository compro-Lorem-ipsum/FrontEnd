import { AiOutlineDelete, AiOutlineUpload } from "react-icons/ai";
import { FaUserTimes } from "react-icons/fa";
import { FaAddressCard, FaUserCheck, FaUserPlus } from "react-icons/fa6";
import { GoAlertFill } from "react-icons/go";
import { HiDocumentCheck } from "react-icons/hi2";
import { MdOutlineCalendarMonth, MdOutlineFileDownload } from "react-icons/md";
import { RiEditBoxFill } from "react-icons/ri";
import { FaUserAlt } from "react-icons/fa";
import type { ActivityLogItem } from "../../types/activityLog";
import { formatDateTimeZone } from "../../Utils/helpers";

const getIconForAction = (action: string) => {
  const a = action.toLowerCase();
  if (a.includes("delete") || a.includes("remove")) return AiOutlineDelete;
  if (a.includes("update") || a.includes("edit")) return RiEditBoxFill;
  if (a.includes("create") || a.includes("add")) return FaUserPlus;
  if (a.includes("upload")) return AiOutlineUpload;
  if (a.includes("download")) return MdOutlineFileDownload;
  if (a.includes("approve")) return FaUserCheck;
  if (a.includes("reject")) return FaUserTimes;
  if (a.includes("assign")) return FaAddressCard;
  if (a.includes("schedule")) return MdOutlineCalendarMonth;
  if (a.includes("alert")) return GoAlertFill;
  if (a.includes("verify") || a.includes("verified")) return HiDocumentCheck;
  return FaUserAlt; // default
};

const getMessage = (item: ActivityLogItem) => {
  // If backend provides a message in payload, use it, otherwise fallback
  if (item.payload && item.payload.message) {
    return item.payload.message;
  }
  
  const action = item.action.toUpperCase();
  const resource = item.resource.toUpperCase();
  return `${item.actor?.nama || 'System'} did ${action} on ${resource}`;
};

export const ActivityLogCard = ({ item }: { item: ActivityLogItem }) => {
  const Icon = getIconForAction(item.action);
  const formattedTime = formatDateTimeZone(item.created_at);
  const message = getMessage(item);

  return (
    <div className="card-1 flex flex-row items-center gap-5 p-5 rounded-lg bg-white border border-[#E4E9F7]">
      <Icon className="text-3xl text-[#8D8787] flex-shrink-0" />
      <div className="container-caption flex flex-col items-start">
        <h2 className="text-sm font-medium">{message}</h2>
        <h2 className="text-xs font-light">
          {item.actor?.role || "System"} · {formattedTime.replace(" pukul ", ", ").replace(".", ":")}
        </h2>
      </div>
    </div>
  );
};
