import { useEffect } from "react";
import { useTrackingSessions } from "../hooks/useTrackingSessions";
import { TrackingHistoryList } from "../Components/tracking/TrackingHistoryList";
import { TrackingMapDetail } from "../Components/tracking/TrackingMapDetail";

const ClientTrackingGps = () => {
  const {
    data,
    selectedSession,
    isLoading,
    isDetailLoading,
    search,
    setSearch,
    hasMore,
    handleNextPage,
    handlePrevPage,
    loadSessionDetail,
    limit,
    setLimit,
    currentPageIndex,
  } = useTrackingSessions();

  // Load first item automatically if none selected
  useEffect(() => {
    if (data.length > 0 && !selectedSession && !isLoading && !isDetailLoading) {
      loadSessionDetail(data[0].uuid);
    }
  }, [data, selectedSession, isLoading, isDetailLoading, loadSessionDetail]);

  return (
    <div className="flex flex-col gap-2 p-2.5 overflow-hidden h-[calc(100vh-90px)]">
      {/* Header here */}
      <div className="header-container flex flex-row items-center justify-between mt-2 flex-shrink-0">
        <div className="flex flex-col items-start">
          <h2 className="font-semibold text-2xl text-[#122C93]">
            Tracking GPS Satpam
          </h2>
          <p className="text-md text-black text-sm w-230">
            Lihat rute perjalanan satpam berdasarkan sesi absensi
          </p>
        </div>
      </div>
      {/* end of header */}
      
      {/* container main start here */}
      <div className="container-main-content flex-1 flex flex-row w-full gap-3 min-h-0">
        <TrackingHistoryList
          data={data}
          selectedSession={selectedSession}
          isLoading={isLoading}
          search={search}
          setSearch={setSearch}
          limit={limit}
          setLimit={setLimit}
          hasMore={hasMore}
          currentPageIndex={currentPageIndex}
          handleNextPage={handleNextPage}
          handlePrevPage={handlePrevPage}
          loadSessionDetail={loadSessionDetail}
        />
        <TrackingMapDetail
          selectedSession={selectedSession}
          isDetailLoading={isDetailLoading}
        />
      </div>
      {/* end of container main */}
    </div>
  );
};

export default ClientTrackingGps;
