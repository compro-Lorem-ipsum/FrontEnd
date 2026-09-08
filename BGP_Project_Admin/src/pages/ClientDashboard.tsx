import { useState, useEffect } from "react";
import { useDashboard } from "../hooks/useDashboard";
import { dashboardService } from "../services/dashboardService";
import { ClientStatGrid } from "../Components/dashboard/ClientStatGrid";
import { ClientKehadiranHariIni } from "../Components/dashboard/ClientKehadiranHariIni";
import { ClientTrendChart } from "../Components/dashboard/ClientTrendChart";
import { ClientOffendersChart } from "../Components/dashboard/ClientOffendersChart";

const ClientDashboard = () => {
  const { user, greeting } = useDashboard();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [offendersData, setOffendersData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [dashRes, offendersRes] = await Promise.all([
          dashboardService.getDashboard(),
          dashboardService.getOffenders(4, 30) // Get top 4 offenders for last 30 days
        ]);
        if (dashRes.ok) {
          const dashJson = await dashRes.json();
          setDashboardData(dashJson.data || dashJson);
        }
        if (offendersRes.ok) {
          const offendersJson = await offendersRes.json();
          setOffendersData(offendersJson.data || offendersJson);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const trendData = (dashboardData?.all_time?.monthly || []).map((m: any) => {
    const date = new Date(m.month + "-01");
    const bulan = date.toLocaleDateString("id-ID", { month: "short" }).toLowerCase();
    return {
      bulan,
      hadir: m.ontime || 0,
      terlambat: m.late || 0,
      izin: (m.excused || 0) + (m.cuti || 0) + (m.cuti_lembur || 0),
      tidakHadir: m.absent || 0,
    };
  });

  return (
    <div className="flex flex-col p-3 bg-gray-50/50 gap-2 flex-1 h-0 overflow-hidden">
      {/* HEADER */}
      <div className="flex-shrink-0">
        <h1 className="text-lg font-bold text-[#122C93]">Dashboard</h1>
        <p className="text-gray-500 text-[11px]">
          {greeting}, {user?.nama || "User"}. Silakan pilih menu di bawah ini.
        </p>
      </div>

      <ClientStatGrid loading={loading} dashboardData={dashboardData} />
      
      <ClientKehadiranHariIni loading={loading} dashboardData={dashboardData} />

      <ClientTrendChart trendData={trendData} />

      <ClientOffendersChart offendersData={offendersData} />
    </div>
  );
};

export default ClientDashboard;
