import { useEffect, useMemo } from "react";
import { FaLocationDot, FaRegClock, FaUser } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { LuRoute } from "react-icons/lu";
import { MapContainer, TileLayer, Polyline, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTrackingSessions } from "../hooks/useTrackingSessions";
import { decodePolyline } from "../Utils/polylineDecoder";
import { Spinner, Select, SelectItem, Pagination } from "@heroui/react";

// Fix standard marker icons for Leaflet in React
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const statusStyles: Record<string, string> = {
  present: "bg-[#DCFCE7] text-[#008236]",
  late: "bg-[#FEF3C7] text-[#B45309]",
  absent: "bg-[#FEE2E2] text-[#B91C1C]",
  partial: "bg-[#F3E8FF] text-[#7E22CE]",
};

const statusLabels: Record<string, string> = {
  present: "Tepat Waktu",
  late: "Terlambat",
  absent: "Absen",
  partial: "Parsial",
};

const MapUpdater = ({ positions }: { positions: [number, number][] }) => {
  const map = useMap();
  useEffect(() => {
    if (positions.length > 0) {
      const bounds = L.latLngBounds(positions);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [positions, map]);
  return null;
};

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

  const polylineCoords = useMemo(() => {
    if (selectedSession?.clean_polyline) {
      return decodePolyline(selectedSession.clean_polyline);
    }
    return [];
  }, [selectedSession?.clean_polyline]);

  const formatDateTime = (isoString?: string) => {
    if (!isoString) return { tanggal: "-", jam: "-", full: "-" };
    const d = new Date(isoString);
    const tanggal = d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const jam = d.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
    return { tanggal, jam, full: `${tanggal}, ${jam}` };
  };

  const formatDistance = (meters?: number) => {
    if (meters === undefined || meters === null) return "-";
    if (meters < 1000) return `${meters} m`;
    return `${(meters / 1000).toFixed(2)} Km`;
  };

  const formatDuration = (minutes?: number) => {
    if (minutes === undefined || minutes === null) return "-";
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    if (h > 0) return `${h}j ${m}m`;
    return `${m}m`;
  };

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
        {/* conatiner for left side */}
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
                  className={`card-1 border rounded-2xl flex flex-col gap-2 p-3 flex-shrink-0 cursor-pointer transition-colors ${isSelected ? "border-[#122C93] bg-[#F5F7FF]" : "border-[#E4E9F7] hover:bg-gray-50"
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
        {/* end of container left side */}

        {/* container for right side */}
        <div className="container-right-side flex flex-col gap-4 w-3/4 h-full">
          {selectedSession ? (
            <>
              {/* top section */}
              <div className="header-name-user flex flex-row w-full items-center justify-between bg-white rounded-2xl border border-[#E4E9F7] p-4 flex-shrink-0">
                <div className="left-side flex flex-row items-center gap-3">
                  <div className="user-logo-container p-3 rounded-2xl bg-[#e0e0e0]">
                    <FaUser className="text-3xl" />
                  </div>
                  <div className="name-content flex flex-col items-start">
                    <h2 className="text-md font-semibold">{selectedSession.satpam?.nama}</h2>
                    <h2 className="text-xs text-[#8D8787]">
                      NIP {selectedSession.satpam?.nip}
                    </h2>
                    <h2 className="text-xs text-[#8D8787]">
                      Masuk: {formatDateTime(selectedSession.attendance?.checked_in_at).full} • Keluar: {formatDateTime(selectedSession.attendance?.checked_out_at).full}
                    </h2>
                  </div>
                </div>
                <div className="right-side">
                  <div className={`chip rounded-4xl px-4 py-1 ${statusStyles[selectedSession.attendance?.status] || statusStyles.present}`}>
                    <h2 className="text-xs">{statusLabels[selectedSession.attendance?.status] || selectedSession.attendance?.status}</h2>
                  </div>
                </div>
              </div>
              {/* end of top section */}

              {/* maps section */}
              <div className="maps-section flex-1 flex flex-col w-full gap-3 bg-white rounded-2xl border border-[#E4E9F7] p-4 min-h-0 relative">
                {isDetailLoading && (
                  <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50 rounded-2xl backdrop-blur-sm">
                    <Spinner />
                  </div>
                )}

                <div className="header-container-user flex flex-col flex-shrink-0">
                  <h2 className="text-md font-semibold text-[#122C93]">
                    Statistik Perjalanan
                  </h2>
                  <h2 className="text-xs text-[#8D8787]">Ringkasan Patroli</h2>
                </div>

                <div className="indicator-container flex flex-row w-full justify-between gap-2 flex-shrink-0">
                  <div className="card-1 flex flex-row w-full gap-2 items-center border border-[#E4E9F7] rounded-2xl p-3">
                    <div className="logo-content p-3 bg-[#DBEAFE] rounded-xl">
                      <LuRoute className="text-xl text-[#122C93]" />
                    </div>
                    <div className="desc flex flex-col items-start">
                      <h2 className="text-md font-semibold text-[#122C93]">
                        {formatDistance(selectedSession.distance_meters)}
                      </h2>
                      <h2 className="text-xs">Total Jarak Tempuh</h2>
                    </div>
                  </div>
                  <div className="card-1 flex flex-row w-full gap-2 items-center border border-[#E4E9F7] rounded-2xl p-3">
                    <div className="logo-content p-3 bg-[#DBEAFE] rounded-xl">
                      <FaRegClock className="text-xl text-[#122C93]" />
                    </div>
                    <div className="desc flex flex-col items-start">
                      <h2 className="text-md font-semibold text-[#122C93]">
                        {formatDuration(selectedSession.duration_minutes)}
                      </h2>
                      <h2 className="text-xs">Total Durasi</h2>
                    </div>
                  </div>
                  <div className="card-1 flex flex-row w-full gap-2 items-center border border-[#E4E9F7] rounded-2xl p-3">
                    <div className="logo-content p-3 bg-[#DBEAFE] rounded-xl">
                      <FaLocationDot className="text-xl text-[#122C93]" />
                    </div>
                    <div className="desc flex flex-col items-start">
                      <h2 className="text-md font-semibold text-[#122C93]">{polylineCoords.length}</h2>
                      <h2 className="text-xs">Titik GPS Terekam</h2>
                    </div>
                  </div>
                </div>

                <div className="flex-1 min-h-0 rounded-xl overflow-hidden bg-gray-100 relative">
                  {polylineCoords.length > 0 ? (
                    <MapContainer
                      center={polylineCoords[0]}
                      zoom={13}
                      scrollWheelZoom
                      style={{ height: "100%", width: "100%", zIndex: 1 }}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Polyline positions={polylineCoords} color="#122C93" weight={4} opacity={0.8} />

                      {/* Start and End Markers */}
                      <Marker position={polylineCoords[0]} />
                      {polylineCoords.length > 1 && (
                        <Marker position={polylineCoords[polylineCoords.length - 1]} />
                      )}

                      <MapUpdater positions={polylineCoords} />
                    </MapContainer>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500 gap-2">
                      <FaLocationDot className="text-3xl text-gray-300" />
                      <p>Tidak ada data rute / GPS untuk sesi ini</p>
                    </div>
                  )}
                </div>
              </div>
              {/* end of map section */}
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-2xl border border-[#E4E9F7] text-gray-500">
              <LuRoute className="text-6xl text-gray-200 mb-4" />
              <p>Pilih histori track di sebelah kiri untuk melihat rute perjalanan</p>
            </div>
          )}
        </div>
        {/* end of container right side */}
      </div>
      {/* end of container main */}
    </div>
  );
};

export default ClientTrackingGps;
