interface ClientKehadiranHariIniProps {
  loading: boolean;
  dashboardData: any;
}

export const ClientKehadiranHariIni = ({ loading, dashboardData }: ClientKehadiranHariIniProps) => {
  return (
    <div className="flex flex-col gap-1.5 flex-shrink-0">
      <div>
        <h2 className="font-semibold text-base text-[#122C93]">
          Kehadiran Hari Ini
        </h2>
        <h2 className="text-[11px] text-gray-500">
          Status absensi personel yang bertugas
        </h2>
      </div>
      <div className="flex flex-row justify-between bg-white rounded-2xl p-2.5 border border-[#E8EEFF]">
        {[
          {
            label: "Tepat Waktu",
            count: dashboardData?.today?.ontime || 0,
            color: "#122C93",
            sub: "Check in sesuai jadwal",
          },
          {
            label: "Terlambat",
            count: dashboardData?.today?.late || 0,
            color: "#CB9235",
            sub: "Melewati jam masuk shift",
          },
          {
            label: "Izin/Sakit",
            count: (dashboardData?.today?.excused || 0) + (dashboardData?.today?.cuti || 0) + (dashboardData?.today?.cuti_lembur || 0),
            color: "#2F58FB",
            sub: "Dengan keterangan resmi",
          },
          {
            label: "Tidak Hadir",
            count: dashboardData?.today?.absent || 0,
            color: "#A70202",
            sub: "Tanpa kabar",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="flex flex-row items-center gap-2 mr-40"
          >
            <div
              className="rounded-2xl w-1.5 h-14"
              style={{ background: item.color }}
            />
            <div className="flex flex-col">
              <h2 className="font-semibold text-[11px]">{item.label}</h2>
              <h2 className="font-semibold text-[24px] leading-tight">
                {loading ? "-" : item.count}
              </h2>
              <h2 className="text-[11px] text-gray-500">{item.sub}</h2>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
