import Navbar from "../Components/Navbar";
import Sidebar from "../Components/Sidebar";
import { Outlet } from "react-router-dom";
import { useActivePanicAlerts } from "../hooks/useActivePanicAlerts";
import ActivePanicAlertModal from "../Components/panicAlert/ActivePanicAlertModal";

const Mainlayouts = () => {
  const { activeAlert, dismissAlert } = useActivePanicAlerts(10000); // 10 seconds polling

  return (
    <div className="page-container flex flex-row min-h-screen bg-[#F5F7FF] gap-2">
      <Sidebar />
      <div className="sidebar-container flex flex-col w-full relative">
        <Navbar />

        <Outlet />
      </div>

      <ActivePanicAlertModal
        alert={activeAlert}
        onClose={() => activeAlert && dismissAlert(activeAlert.uuid)}
      />
    </div>
  );
};

export default Mainlayouts;
