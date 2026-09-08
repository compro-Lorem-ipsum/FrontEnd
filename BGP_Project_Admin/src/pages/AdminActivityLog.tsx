import { Select, SelectItem, Spinner } from "@heroui/react";
import { FiSearch } from "react-icons/fi";
import { useActivityLogData } from "../hooks/useActivityLogData";
import { ActivityLogCard } from "../Components/activityLog/ActivityLogCard";

const AdminActivityLog = () => {
  const {
    data,
    actionsList,
    isLoading,
    actionFilter,
    setActionFilter,
    hasMore,
    handleNextPage,
  } = useActivityLogData();

  return (
    <div className="container-main flex flex-col items-start gap-3 p-2.5">
      {/* header title */}
      <h2 className="font-semibold text-xl text-[#122C93]">Activity Log</h2>

      {/* search engine */}
      <div className="container-search rounded-2xl w-full flex flex-row gap-3 items-center bg-[#FFFFFF] p-3 border border-[#E4E9F7]">
        <div className="flex flex-row items-center gap-2 bg-white border border-[#E4E9F7] rounded-xl px-4 h-11 flex-1">
          <FiSearch className="text-[#B0B0B0] text-base flex-shrink-0" />
          <input
            type="search"
            placeholder="Cari aktivitas..."
            className="bg-transparent text-sm text-gray-700 placeholder:text-[#B0B0B0] outline-none w-full h-full"
            disabled // Search by keyword not implemented in API hook yet
          />
        </div>
        <Select
          className="w-48"
          placeholder="Semua Aksi"
          selectedKeys={[actionFilter]}
          onChange={(e) => setActionFilter(e.target.value || "all")}
          classNames={{
            trigger:
              "bg-white border border-[#E4E9F7] rounded-xl shadow-none h-11 min-h-11 data-[hover=true]:bg-white",
            value: "text-[#8D8787] text-sm",
          }}
        >
          {[{ action: "all", resource: "Semua Aksi" }, ...actionsList].map((c) => (
            <SelectItem key={c.action} textValue={c.action}>{c.action}</SelectItem>
          ))}
        </Select>
      </div>
      {/* end of search engine */}

      {/* main content here */}
      <div className="main-content-container flex flex-col gap-2 w-full max-h-[680px] flex-1 overflow-y-auto pr-1">
        {data.length === 0 && !isLoading && (
          <div className="flex justify-center p-10 text-gray-500">
            Tidak ada aktivitas.
          </div>
        )}
        
        {data.map((log) => (
          <ActivityLogCard key={log.uuid} item={log} />
        ))}
        
        {isLoading && (
          <div className="flex justify-center p-4">
            <Spinner />
          </div>
        )}

        {hasMore && !isLoading && (
          <div className="flex justify-center p-4">
            <button
              onClick={handleNextPage}
              className="text-sm text-[#122C93] font-medium hover:underline"
            >
              Muat lebih banyak
            </button>
          </div>
        )}
      </div>
      {/* end of main content */}
    </div>
  );
};

export default AdminActivityLog;

