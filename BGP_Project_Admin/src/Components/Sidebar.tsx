import { useLocation, useNavigate } from "react-router-dom";
import { Listbox, ListboxItem, Button, Divider } from "@heroui/react";
import { IoPersonAdd } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { AiFillHome } from "react-icons/ai";
import { GoClockFill } from "react-icons/go";
import { LuRadius } from "react-icons/lu";
import {
  MdFileDownload,
  MdCoPresent,
  MdOutlineManageHistory,
} from "react-icons/md";
import logo from "../assets/images/logo.png";
import { TbLogout } from "react-icons/tb";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const role = document.cookie
    .split("; ")
    .find((row) => row.startsWith("role="))
    ?.split("=")[1];

  const menu = [
    {
      key: "manage-satpam",
      name: "Manage Satpam",
      icon: <IoPersonAdd className="text-xl" />,
      path: "/AdminManageSatpam",
    },
    {
      key: "manage-admin",
      name: "Manage Admin",
      icon: <IoMdSettings className="text-xl" />,
      path: "/AdminManageAdmin",
      disabled: role !== "SuperAdmin",
    },
    {
      key: "manage-pos",
      name: "Manage Pos Patroli",
      icon: <AiFillHome className="text-xl" />,
      path: "/AdminManagePos",
    },
    {
      key: "manage-pos-utama",
      name: "Manage Pos Utama",
      icon: <MdCoPresent className="text-xl" />,
      path: "/AdminManagePosUtama",
    },
    {
      key: "manage-shift",
      name: "Manage Shift",
      icon: <GoClockFill className="text-xl" />,
      path: "/AdminManageShift",
    },
    {
      key: "manage-patroli",
      name: "Manage Patroli",
      icon: <MdOutlineManageHistory className="text-xl" />,
      path: "/AdminManagePosPatroli",
    },
    {
      key: "manage-radius",
      name: "Manage Radius",
      icon: <LuRadius className="text-xl" />,
      path: "/AdminManageRadius",
    },
    {
      key: "download-rekap",
      name: "Download Rekap",
      icon: <MdFileDownload className="text-xl" />,
      path: "/AdminDownloadRekap",
    },
  ];

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "/";
  };

  return (
    <div className="h-screen w-[280px] bg-white border-r border-gray-100 flex flex-col shadow-xl shadow-blue-900/5 relative z-20">
      {/* --- Header Section --- */}
      <div className="px-6 pt-8 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center">
            <img src={logo} alt="" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-[#122C93] tracking-tight leading-none">
              PT. Bima Global
            </h1>
            <span className="text-[10px] text-gray-400 font-medium tracking-wider mt-1 uppercase">
              Dashboard Admin
            </span>
          </div>
        </div>
      </div>

      {/* --- Menu Section --- */}
      <div className="flex-1 overflow-y-auto px-4 py-2 scrollbar-hide">
        <div className="mb-2 px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Main Menu
        </div>

        <Listbox
          aria-label="Sidebar Menu"
          variant="light"
          className="p-0 gap-1"
        >
          {menu.map((item) => {
            const isActive = location.pathname === item.path;

            // --- Logic Render Item Disabled ---
            if (item.disabled) {
              return (
                <ListboxItem
                  key={item.key}
                  textValue={item.name}
                  startContent={item.icon}
                  className="opacity-40 grayscale my-1 py-3 cursor-not-allowed data-[hover=true]:bg-transparent"
                  isReadOnly
                >
                  <div className="flex justify-between items-center w-full text-gray-400">
                    <span>{item.name}</span>
                    <span className="text-[9px] border border-gray-300 px-1 rounded">
                      LOCK
                    </span>
                  </div>
                </ListboxItem>
              );
            }

            // --- Logic Render Item Normal/Active ---
            return (
              <ListboxItem
                key={item.key}
                textValue={item.name}
                // Menggunakan onPress bawaan HeroUI + useNavigate lebih stabil daripada <Link>
                onPress={() => navigate(item.path)}
                startContent={
                  // Ikon berubah putih jika active, abu-abu jika tidak (tapi jadi biru saat hover via CSS parent)
                  <span
                    className={`transition-colors duration-200 ${
                      isActive
                        ? "text-white"
                        : "text-gray-400 group-data-[hover=true]:text-[#122C93]"
                    }`}
                  >
                    {item.icon}
                  </span>
                }
                // Custom Class Names
                className={`
                  group my-1 py-3 px-3 rounded-xl transition-all duration-200
                  ${
                    isActive
                      ? "bg-[#122C93] text-white shadow-md shadow-blue-900/30 data-[hover=true]:bg-[#122C93] data-[hover=true]:text-white"
                      : "bg-transparent text-gray-500 data-[hover=true]:bg-blue-50 data-[hover=true]:text-[#122C93]"
                  }
                `}
              >
                <span className="font-medium text-sm">{item.name}</span>
              </ListboxItem>
            );
          })}
        </Listbox>
      </div>

      {/* --- Footer Logout Section --- */}
      <div className="p-4 mt-auto">
        <Divider className="mb-4" />
        <Button
          variant="light"
          color="danger"
          startContent={<TbLogout className="text-xl" />}
          onPress={handleLogout}
          className="w-full justify-start font-semibold h-12 hover:bg-red-50 data-[hover=true]:bg-red-50 transition-colors"
        >
          Keluar
        </Button>
        <div className="text-center mt-2 text-[10px] text-gray-300">
          v1.0.0 &copy; 2026 Bima Global
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
