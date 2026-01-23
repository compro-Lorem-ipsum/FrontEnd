import { Button, Input, Spinner } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import loginImg from "../../assets/images/cover.png";
import logo from "../../assets/images/logo.png";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Username dan Password tidak boleh kosong.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/v1/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login gagal, periksa kembali data Anda!");
        setLoading(false);
        return;
      }
      document.cookie = `token=${data.token}; path=/;`;

      try {
        const base64Url = data.token.split(".")[1];
        const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
        const jsonPayload = decodeURIComponent(
          window
            .atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join("")
        );

        const decoded = JSON.parse(jsonPayload);
        const userRole = decoded.role;

        document.cookie = `role=${userRole}; path=/;`;

        if (userRole === "SuperAdmin") {
          navigate("/AdminDashboard");
        } else {
          navigate("/AdminDashboard");
        }
      } catch (decodeErr) {
        console.error("Error decoding token:", decodeErr);
        setError("Format token tidak dikenali.");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setError("Terjadi kesalahan saat login.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="flex w-full h-screen overflow-hidden bg-white">
      {/* --- KIRI: Image Section (Branding) --- */}
      <div className="hidden lg:flex w-1/2 relative bg-[#122C93] items-center justify-center overflow-hidden">
        {/* Gambar Background dengan Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={loginImg}
            alt="Background"
            className="w-full h-full object-cover opacity-50 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-[#122C93] to-blue-900/90 mix-blend-multiply" />
        </div>

        {/* Text Overlay */}
        <div className="relative z-10 p-12 text-white max-w-lg">
          <div className="w-30 h-30 flex items-center justify-center mb-6">
            <img src={logo} alt="" />
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Sistem Keamanan Terpadu
          </h1>
          <p className="text-base text-blue-100 font-light leading-relaxed opacity-90">
            PT. Bima Global Security System.
            <br />
            Kelola operasional keamanan dengan efisien dan aman.
          </p>
        </div>
      </div>

      {/* --- KANAN: Form Section --- */}
      <div className="form-section w-1/2 flex flex-col items-start justify-center px-[200px]">
        <h2 className="font-bold text-[33px] text-[#122C93]">Login</h2>

        <h2 className="font-semibold text-[20px] mt-20 text-[#122C93]">
          Username
        </h2>
        <Input
          variant="bordered"
          type="text"
          label="Username"
          className="mt-5"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown} 
        />

        <h2 className="font-semibold text-[20px] mt-5 text-[#122C93]">
          Password
        </h2>
        <Input
          variant="bordered"
          type="password"
          label="Password"
          className="mt-5"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        {error && <p className="text-red-500 mt-3 font-medium">{error}</p>}

        <h2 className="text-[#122C93] text-[15px] font-light mt-5">
          Lupa Password ?{" "}
          <span className="font-semibold cursor-pointer hover:underline">
            Silahkan Konfirmasi Admin
          </span>
        </h2>

        <Button
          variant="solid"
          color="primary"
          size="lg"
          className="mt-10 w-full font-semibold bg-[#122C93] flex items-center justify-center"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <Spinner
              variant="default"
              classNames={{ label: "text-white mt-0 ml-2" }}
            />
          ) : (
            "Login"
          )}
        </Button>
      </div>
    </div>
  );
};

export default Login;
