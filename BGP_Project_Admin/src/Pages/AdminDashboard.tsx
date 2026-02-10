import { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter, Button } from "@heroui/react";
import {
  FaUsers,
  FaUserShield,
  FaMapMarkedAlt,
  FaCalendarAlt,
  FaCogs,
  FaRegClock,
} from "react-icons/fa";

import { LuScanFace } from "react-icons/lu";
import { IoMdPhotos } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");

  const getToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];
  };

  useEffect(() => {
    const initDashboard = () => {
      const token = getToken();
      if (!token) return;

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
        setUserRole(payload.role);
        setUserName(payload.nama);
      } catch (error) {
        console.error("Gagal decode token:", error);
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
      allowedRoles: ["Client", "Admin"],
    },
    {
      title: "Manajemen Shift",
      desc: "Atur jadwal jaga, generate shift otomatis.",
      icon: <FaCalendarAlt size={24} className="text-white" />,
      color: "bg-green-600",
      path: "/AdminManageShift",
      allowedRoles: ["Client"],
    },
    {
      title: "Data Pos Patroli",
      desc: "Kelola titik koordinat Pos Patroli.",
      icon: <FaMapMarkedAlt size={24} className="text-white" />,
      color: "bg-orange-600",
      path: "/AdminManagePos",
      allowedRoles: ["Client"],
    },
    {
      title: "Data Pos Utama",
      desc: "Kelola titik koordinat Pos Utama.",
      icon: <FaMapMarkedAlt size={24} className="text-white" />,
      color: "bg-orange-600",
      path: "/AdminManagePosUtama",
      allowedRoles: ["Client"],
    },
    {
      title: "Rekap Absensi",
      desc: "Download rekap absensi",
      icon: <LuScanFace size={24} className="text-white" />,
      color: "bg-teal-600",
      path: "/AdminRekapAbsensi",
      allowedRoles: ["Admin", "Client"],
    },
    {
      title: "Rekap Patroli",
      desc: "Download rekap patroli",
      icon: <IoMdPhotos size={24} className="text-white" />,
      color: "bg-teal-600",
      path: "/AdminRekapPatroli",
      allowedRoles: ["Admin", "Client"],
    },
    {
      title: "Konfigurasi Radius",
      desc: "Setting batas jarak toleransi GPS (geofencing).",
      icon: <FaCogs size={24} className="text-white" />,
      color: "bg-gray-600",
      path: "/AdminManageRadius",
      allowedRoles: ["Client"],
    },
    {
      title: "Konfigurasi Waktu",
      desc: "Setting waktu untuk shift kerja.",
      icon: <FaRegClock size={24} className="text-white" />,
      color: "bg-red-600",
      path: "/AdminManageWaktu",
      allowedRoles: ["Client"],
    },
    {
      title: "Manajemen Admin",
      desc: "Tambah atau hapus akses administrator sistem.",
      icon: <FaUserShield size={24} className="text-white" />,
      color: "bg-red-600",
      path: "/AdminManageAdmin",
      allowedRoles: ["Admin"],
    },
  ];

  const filteredMenuItems = allMenuItems.filter((item) => {
    if (!userRole) return false;
    return item.allowedRoles.includes(userRole);
  });

  return (
    <div className="flex flex-col p-6 min-h-[87vh] bg-gray-50/50">
      <div className="flex flex-col gap-8">
        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-bold text-[#122C93]">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            {greeting}, {userName}. Silakan pilih menu di bawah ini.
          </p>
        </div>

        {/* MENU UTAMA GRID */}
        <div>
          <h3 className="text-xl font-semibold text-[#122C93] mb-6">
            Menu Utama
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMenuItems.map((item, index) => (
              <Card
                key={index}
                isPressable
                onPress={() => navigate(item.path)}
                className="border border-gray-200 hover:scale-[1.02] transition-transform duration-200 h-full"
                shadow="sm"
              >
                <CardHeader className="flex gap-4 px-6 pt-6 items-start">
                  <div
                    className={`p-3 rounded-lg ${item.color} shadow-md flex items-center justify-center min-w-[48px] min-h-[48px]`}
                  >
                    {item.icon}
                  </div>
                  <div className="flex flex-col">
                    <p className="text-lg font-bold text-gray-800 leading-tight">
                      {item.title}
                    </p>
                  </div>
                </CardHeader>
                <CardBody className="px-6 py-2">
                  <p className="text-small text-gray-500 line-clamp-2">
                    {item.desc}
                  </p>
                </CardBody>
                <CardFooter className="px-6 pb-6 pt-2 mt-auto">
                  <Button
                    size="sm"
                    variant="flat"
                    color="primary"
                    className="w-full font-semibold bg-[#122C93]/10 text-[#122C93]"
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
    </div>
  );
};

export default AdminDashboard;
