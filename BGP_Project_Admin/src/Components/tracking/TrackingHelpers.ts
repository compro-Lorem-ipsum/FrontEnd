export const statusStyles: Record<string, string> = {
  present: "bg-[#DCFCE7] text-[#008236]",
  late: "bg-[#FEF3C7] text-[#B45309]",
  absent: "bg-[#FEE2E2] text-[#B91C1C]",
  partial: "bg-[#F3E8FF] text-[#7E22CE]",
};

export const statusLabels: Record<string, string> = {
  present: "Tepat Waktu",
  late: "Terlambat",
  absent: "Absen",
  partial: "Parsial",
};

export const formatDateTime = (isoString?: string) => {
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

export const formatDistance = (meters?: number) => {
  if (meters === undefined || meters === null) return "-";
  if (meters < 1000) return `${meters} m`;
  return `${(meters / 1000).toFixed(2)} Km`;
};

export const formatDuration = (minutes?: number) => {
  if (minutes === undefined || minutes === null) return "-";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h > 0) return `${h}j ${m}m`;
  return `${m}m`;
};
