import { useEffect, useState } from "react";

const Navbar = () => {
  const [time, setTime] = useState(
    new Date().toLocaleTimeString("id-ID", { hour12: false })
  );
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    // Update waktu setiap detik
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString("id-ID", { hour12: false }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Ambil token dari cookie
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (token) {
      try {
        // Ambil payload dari token (bagian tengah setelah titik pertama)
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserRole(payload.role || "User");
      } catch (error) {
        console.error("Gagal decode token:", error);
      }
    }
  }, []);

  return (
    <div className="navbar-container flex flex-row items-center justify-between px-10 py-6 bg-[#ffffff] text-[#122C93] shadow-sm">
      <h2 className="font-semibold">{time}</h2>
      <div className="user-container flex flex-row items-center gap-3">
        <span className="text-[14px] bg-[#122C93] text-white px-3 py-1 rounded-full">
          {userRole}
        </span>
      </div>
    </div>
  );
};

export default Navbar;
