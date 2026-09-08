import { useState, useEffect, useMemo, useCallback } from "react";
import { decodeUserToken, getTimeBasedGreeting } from "../Utils/dashboardHelpers";
import { DASHBOARD_MENU_ITEMS } from "../constants/menuItems";
import { dashboardService } from "../services/dashboardService";
import type { UserPayload } from "../types/dashboard";

export const useDashboard = () => {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [greeting, setGreeting] = useState<string>("");
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [offendersData, setOffendersData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load User & Greeting
  useEffect(() => {
    const userData = decodeUserToken();
    if (userData) {
      setUser(userData);
    }
    setGreeting(getTimeBasedGreeting());
  }, []);

  // Fetch Dashboard Stats
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [dashRes, offendersRes] = await Promise.all([
        dashboardService.getDashboard(),
        dashboardService.getOffenders(30, 30)
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
      console.error("Failed to fetch admin dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const filteredMenuItems = useMemo(() => {
    if (!user) return [];
    return DASHBOARD_MENU_ITEMS.filter((item) =>
      item.allowedRoles.includes(user.role),
    );
  }, [user]);

  // Derived Stats
  const stats = useMemo(() => {
    const totalPersonel = dashboardData?.satpam?.total || 0;
    const maleCount = dashboardData?.gender?.["1"] || 0;
    const femaleCount = dashboardData?.gender?.["2"] || 0;
    const aktifCount = dashboardData?.satpam?.active || 0;
    const cutiCount = dashboardData?.satpam?.cuti || 0;
    const tidakAktifCount = 
      (dashboardData?.satpam?.inactive || 0) + 
      (dashboardData?.satpam?.pending || 0) + 
      (dashboardData?.satpam?.rejected || 0) + 
      (dashboardData?.satpam?.resign || 0) + 
      (dashboardData?.satpam?.unassigned || 0);

    const genderData = [
      { name: "Laki-laki", value: maleCount, color: "#122C93" },
      { name: "Perempuan", value: femaleCount, color: "#93c5fd" },
    ];
    
    const statusData = [
      { name: "Aktif", value: aktifCount, color: "#122C93" },
      { name: "Cuti / Izin", value: cutiCount, color: "#93c5fd" },
      { name: "Tidak Aktif", value: tidakAktifCount, color: "#dbeafe" },
    ];

    const totalClient = dashboardData?.clients?.total || 0;
    const clientsDistribution = dashboardData?.clients?.distribution || [];

    return {
      totalPersonel,
      maleCount,
      femaleCount,
      aktifCount,
      cutiCount,
      tidakAktifCount,
      genderData,
      statusData,
      totalClient,
      clientsDistribution
    };
  }, [dashboardData]);

  return {
    user,
    greeting,
    filteredMenuItems,
    dashboardData,
    offendersData,
    loading,
    stats,
    fetchDashboardData
  };
};
