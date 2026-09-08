import { useEffect, useMemo } from "react";
import { FaLocationDot, FaRegClock, FaUser } from "react-icons/fa6";
import { LuRoute } from "react-icons/lu";
import { Spinner } from "@heroui/react";
import { MapContainer, TileLayer, Polyline, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { decodePolyline } from "../../Utils/polylineDecoder";
import { formatDateTime, formatDistance, formatDuration, statusStyles, statusLabels } from "./TrackingHelpers";

// Fix standard marker icons for Leaflet in React
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

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

interface TrackingMapDetailProps {
  selectedSession: any;
  isDetailLoading: boolean;
}

export const TrackingMapDetail = ({ selectedSession, isDetailLoading }: TrackingMapDetailProps) => {
  const polylineCoords = useMemo(() => {
    if (selectedSession?.clean_polyline) {
      return decodePolyline(selectedSession.clean_polyline);
    }
    return [];
  }, [selectedSession?.clean_polyline]);

  if (!selectedSession) {
    return (
      <div className="container-right-side flex flex-col gap-4 w-3/4 h-full">
        <div className="w-full h-full flex flex-col items-center justify-center bg-white rounded-2xl border border-[#E4E9F7] text-gray-500">
          <LuRoute className="text-6xl text-gray-200 mb-4" />
          <p>Pilih histori track di sebelah kiri untuk melihat rute perjalanan</p>
        </div>
      </div>
    );
  }

  const attendanceStatus = selectedSession.attendance?.status || "present";
  const sStyle = statusStyles[attendanceStatus] || statusStyles.present;
  const sLabel = statusLabels[attendanceStatus] || attendanceStatus;

  return (
    <div className="container-right-side flex flex-col gap-4 w-3/4 h-full">
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
          <div className={`chip rounded-4xl px-4 py-1 ${sStyle}`}>
            <h2 className="text-xs">{sLabel}</h2>
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
    </div>
  );
};
