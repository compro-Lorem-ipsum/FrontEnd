import { FiSearch } from "react-icons/fi";
import { Select, SelectItem, Pagination, Spinner } from "@heroui/react";
import { formatDateTime, statusStyles, statusLabels } from "./TrackingHelpers";

interface TrackingHistoryListProps {
  data: any[];
  selectedSession: any;
  isLoading: boolean;
  search: string;
  setSearch: (val: string) => void;
  limit: number;
  setLimit: (val: number) => void;
  hasMore: boolean;
  currentPageIndex: number;
  handleNextPage: () => void;
  handlePrevPage: () => void;
  loadSessionDetail: (uuid: string) => void;
}

export const TrackingHistoryList = ({
  data,
  selectedSession,
  isLoading,
  search,
  setSearch,
  limit,
  setLimit,
  hasMore,
  currentPageIndex,
  handleNextPage,
  handlePrevPage,
  loadSessionDetail,
}: TrackingHistoryListProps) => {
  return (
    <div className="container-left-side w-1/4 h-full flex flex-col bg-white gap-4 rounded-2xl border border-[#E8EEFF] p-3 overflow-hidden">
      <div className="search-bar flex flex-row gap-2 w-full">
        <div className="flex flex-row items-center flex-1 gap-2 bg-white border border-[#E4E9F7] rounded-xl px-4 h-11 min-w-0">
          <FiSearch className="text-[#B0B0B0] text-base flex-shrink-0" />
          <input
            type="search"
            placeholder="Cari histori track"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent text-sm text-gray-700 placeholder:text-[#B0B0B0] outline-none w-full h-full min-w-0"
          />
        </div>
        <Select
          className="w-28 flex-shrink-0"
          placeholder="Data"
          selectedKeys={[limit.toString()]}
          onSelectionChange={(keys) => {
            const val = Array.from(keys)[0];
            if (val) setLimit(Number(val));
          }}
          classNames={{
            trigger: "bg-white border border-[#E4E9F7] rounded-xl shadow-none h-11 min-h-11",
            value: "text-[#8D8787] text-sm",
          }}
        >
          {[5, 10, 15, 20].map((pageSize) => (
            <SelectItem key={pageSize.toString()} textValue={`${pageSize} Data`}>
              {pageSize} Data
            </SelectItem>
          ))}
        </Select>
      </div>
      <hr className="w-full border-[#E4E9F7] flex-shrink-0" />
      <div className="container-list flex flex-col gap-3 flex-1 min-h-0 overflow-y-auto scrollbar-hide pr-1">
        {data.map((item) => {
          const isSelected = selectedSession?.uuid === item.uuid;
          const { tanggal } = formatDateTime(item.work_date);
          const statusKey = item.attendance?.status || "present";
          const sStyle = statusStyles[statusKey] || statusStyles.present;
          const sLabel = statusLabels[statusKey] || statusKey;

          return (
            <div
              key={item.uuid}
              onClick={() => loadSessionDetail(item.uuid)}
              className={`card-1 border rounded-2xl flex flex-col gap-2 p-3 flex-shrink-0 cursor-pointer transition-colors ${
                isSelected ? "border-[#122C93] bg-[#F5F7FF]" : "border-[#E4E9F7] hover:bg-gray-50"
              }`}
            >
              <h2 className="font-medium text-sm">{item.satpam?.nama}</h2>
              <div className="desc-details flex flex-col items-start">
                <h2 className="text-xs font-light text-[#8D8787]">
                  NIP {item.satpam?.nip}
                </h2>
                <h2 className="text-xs font-light text-[#8D8787]">
                  {tanggal}
                </h2>
              </div>
              <div
                className={`chip -mt-4 self-end rounded-4xl px-4 py-1 ${sStyle}`}
              >
                <h2 className="text-xs">{sLabel}</h2>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex justify-center p-4">
            <Spinner size="sm" />
          </div>
        )}
        {!isLoading && data.length === 0 && (
          <div className="flex justify-center p-8 text-gray-500 text-sm">
            Tidak ada data
          </div>
        )}
      </div>
      <div className="flex w-full justify-center items-center py-2 border-t border-[#E4E9F7] mt-auto">
        <Pagination
          showControls
          page={currentPageIndex + 1}
          total={Math.max(currentPageIndex + 1 + (hasMore ? 1 : 0), 1)}
          onChange={(page) => {
            if (page > currentPageIndex + 1) handleNextPage();
            else if (page < currentPageIndex + 1) handlePrevPage();
          }}
          classNames={{
            item: "[&:not([data-active=true])]:hidden",
          }}
        />
      </div>
    </div>
  );
};
