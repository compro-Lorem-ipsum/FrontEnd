import { Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import folders from "../../assets/images/folders.png";
const Landing_Patroli = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center text-[#122C93] p-10 justify-between min-h-screen bg-[#F5F7FF]">
      {/* Head Section */}
      <div className="header-content flex flex-col gap-2 items-center">
        <h2 className="text-[20px] font-semibold">PT BIMA GLOBAL SECURITY</h2>
        <h2 className="text-[15px] font-medium">Sistem Laporan Patroli</h2>
      </div>
      {/* Logo Section */}
      <div className="logo-img flex flex-col items-center gap-20">
        <img src={folders} className="w-[180px]" alt="" />
      </div>
      {/* Button Section */}
      <div className="button-confirm">
        <Button
          variant="solid"
          className="bg-[#122C93] w-[350px] h-11 text-white font-semibold"
          onClick={() => navigate("/TakePhotoPatroli")}
        >
          Mulai Report
        </Button>
      </div>
    </div>
  );
};

export default Landing_Patroli;
