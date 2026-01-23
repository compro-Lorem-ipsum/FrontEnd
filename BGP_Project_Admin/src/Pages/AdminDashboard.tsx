import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Button,
  Spinner,
} from "@heroui/react";
import {
  FaUsers,
  FaUserShield,
  FaMapMarkedAlt,
  FaCalendarAlt,
  FaFileInvoice,
  FaCogs,
  FaRoute,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalSatpam: 0,
    totalAdmin: 0,
    totalPos: 0,
    totalJadwal: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [greeting, setGreeting] = useState("");
  const [userRole, setUserRole] = useState(""); 

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const getToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
  };

  useEffect(() => {
    const initDashboard = async () => {
      const token = getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      let currentRole = "";
      try {
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          window
            .atob(base64)
            .split("")
            .map(function (c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join(""),
        );

        const payload = JSON.parse(jsonPayload);
        currentRole = payload.role;
        setUserRole(currentRole);
      } catch (error) {
        console.error("Gagal decode token:", error);
      }

      try {
        const headers = { Authorization: `Bearer ${token}` };

        const promises: Promise<Response>[] = [
          fetch(`${API_BASE_URL}/v1/satpams`, { headers }), 
          fetch(`${API_BASE_URL}/v1/poss`, { headers }), 
          fetch(`${API_BASE_URL}/v1/jadwals`, { headers }), 
        ];

        if (currentRole !== "Admin") {
          promises.push(fetch(`${API_BASE_URL}/v1/admins`, { headers }));
        }

        const responses = await Promise.all(promises);

        const dataSatpam = await responses[0].json();
        const dataPos = await responses[1].json();
        const dataJadwal = await responses[2].json();

        let totalAdminCount = 0;
        if (currentRole !== "Admin" && responses[3]) {
          const dataAdmin = await responses[3].json();
          totalAdminCount = dataAdmin.admins?.length || 0;
        }

        setStats({
          totalSatpam: dataSatpam.satpams?.length || 0,
          totalPos: dataPos.results?.length || 0,
          totalJadwal: dataJadwal.data?.length || 0,
          totalAdmin: totalAdminCount,
        });
      } catch (error) {
        console.error("Gagal memuat statistik dashboard", error);
      } finally {
        setIsLoading(false);
      }
    };

    initDashboard();

    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Selamat Pagi");
    else if (hour < 15) setGreeting("Selamat Siang");
    else if (hour < 18) setGreeting("Selamat Sore");
    else setGreeting("Selamat Malam");
  }, []);

  const allMenuItems = [
    {
      title: "Manajemen Satpam",
      desc: "Kelola data personel, NIP, dan foto anggota.",
      icon: <FaUsers size={24} className="text-white" />,
      color: "bg-blue-600",
      path: "/AdminManageSatpam",
    },
    {
      title: "Manajemen Shift",
      desc: "Atur jadwal jaga, generate shift otomatis.",
      icon: <FaCalendarAlt size={24} className="text-white" />,
      color: "bg-green-600",
      path: "/AdminManageShift",
    },
    {
      title: "Data Pos Patroli",
      desc: "Kelola titik koordinat Pos Patroli.",
      icon: <FaMapMarkedAlt size={24} className="text-white" />,
      color: "bg-orange-600",
      path: "/AdminManagePos",
    },
    {
      title: "Data Pos Utama",
      desc: "Kelola titik koordinat Pos Utama.",
      icon: <FaMapMarkedAlt size={24} className="text-white" />,
      color: "bg-orange-600",
      path: "/AdminManagePosUtama",
    },
    {
      title: "Plotting Patroli",
      desc: "Assign personel ke titik pos tertentu.",
      icon: <FaRoute size={24} className="text-white" />,
      color: "bg-purple-600",
      path: "/AdminManagePosPatroli",
    },
    {
      title: "Rekap & Laporan",
      desc: "Download rekap absensi dan log patroli.",
      icon: <FaFileInvoice size={24} className="text-white" />,
      color: "bg-teal-600",
      path: "/AdminDownloadRekap",
    },
    {
      title: "Konfigurasi Radius",
      desc: "Setting batas jarak toleransi GPS (geofencing).",
      icon: <FaCogs size={24} className="text-white" />,
      color: "bg-gray-600",
      path: "/AdminManageRadius",
    },
    {
      title: "Manajemen Admin",
      desc: "Tambah atau hapus akses administrator sistem.",
      icon: <FaUserShield size={24} className="text-white" />,
      color: "bg-red-600",
      path: "/AdminManageAdmin",
      requiredRole: "SuperAdmin",
    },
  ];

  const filteredMenuItems = allMenuItems.filter((item) => {
    if (item.path === "/AdminManageAdmin" && userRole === "Admin") {
      return false;
    }
    return true;
  });

  const statsCards = [
    {
      label: "Total Satpam",
      val: stats.totalSatpam,
      icon: <FaUsers />,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      label: "Total Pos",
      val: stats.totalPos,
      icon: <FaMapMarkedAlt />,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      label: "Jadwal Aktif",
      val: stats.totalJadwal,
      icon: <FaCalendarAlt />,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    ...(userRole !== "Admin"
      ? [
          {
            label: "Total Admin",
            val: stats.totalAdmin,
            icon: <FaUserShield />,
            color: "text-red-600",
            bg: "bg-red-100",
          },
        ]
      : []),
  ];

  return (
    <div className="flex flex-col p-6 justify-between min-h-[87vh] bg-gray-50/50">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#122C93]">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            {greeting}, {userRole === "Admin" ? "Admin" : "Super Admin"}.
            Berikut ringkasan sistem hari ini.
          </p>
        </div>
      </div>

      {/* STATS CARDS SECTION */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 ${userRole === "Admin" ? "lg:grid-cols-3" : "lg:grid-cols-4"} gap-5`}
      >
        {statsCards.map((item, idx) => (
          <Card key={idx} shadow="sm" className="border border-gray-100">
            <CardBody className="flex flex-row items-center gap-4 p-4">
              <div
                className={`p-3 rounded-xl ${item.bg} ${item.color} text-2xl`}
              >
                {item.icon}
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium">
                  {item.label}
                </p>
                {isLoading ? (
                  <Spinner size="sm" color="current" />
                ) : (
                  <h4 className="text-2xl font-bold text-gray-800">
                    {item.val}
                  </h4>
                )}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Divider className="my-2" />

      {/* MENU NAVIGATION GRID */}
      <div>
        <h3 className="text-xl font-semibold text-[#122C93] mb-8">
          Menu Utama
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredMenuItems.map((item, index) => (
            <Card
              key={index}
              isPressable
              onPress={() => navigate(item.path)}
              className="border border-gray-200 hover:scale-[1.02] transition-transform duration-200"
              shadow="sm"
            >
              <CardHeader className="flex gap-3 px-6 pt-6">
                <div
                  className={`p-3 rounded-lg ${item.color} shadow-md flex items-center justify-center`}
                >
                  {item.icon}
                </div>
                <div className="flex flex-col items-start">
                  <p className="text-md font-bold text-gray-800">
                    {item.title}
                  </p>
                </div>
              </CardHeader>
              <CardBody className="px-6 pb-6 pt-2">
                <p className="text-small text-gray-500">{item.desc}</p>
              </CardBody>
              <CardFooter className="px-6 pb-6 pt-0">
                <Button
                  size="sm"
                  variant="flat"
                  color="primary"
                  className="w-full font-semibold"
                  onPress={() => navigate(item.path)}
                >
                  Buka Menu
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
