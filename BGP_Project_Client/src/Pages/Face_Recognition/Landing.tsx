import { Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/images/immigration.png";
const Landing = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center text-[#122C93] p-10 justify-between min-h-screen bg-[#F5F7FF]">
      {/* Head Section */}
      <div className="header-content flex flex-col gap-2 items-center">
        <h2 className="text-[20px] font-semibold">PT BIMA GLOBAL SECURITY</h2>
        <h2 className="text-[15px] font-medium">Sistem Absensi & Patroli</h2>
      </div>
      {/* Logo Section */}
      <div className="logo-img">
        <img src={Logo} className="w-[180px]" alt="" />
      </div>
      {/* Button Section */}
      <div className="container-button flex flex-col gap-4">
        <div className="button-confirm">
          <Button
            variant="solid"
            className="bg-[#122C93] w-[350px] h-11 text-white font-semibold"
            onClick={() => navigate("/TakePhoto")}
          >
            Lakukan Absensi
          </Button>
        </div>
        <div className="button-confirm">
          <Button
            variant="solid"
            className="bg-[#122C93] w-[350px] h-11 text-white font-semibold"
            onClick={() => navigate("/ReportPatroli")}
          >
            Lakukan Patroli
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
