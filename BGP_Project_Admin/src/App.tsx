import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Mainlayouts from "./Layout/Mainlayouts";

import PrivateRoute from "./Utils/PrivateRoute";
import LandingPage from "./pages/LandingPage";

// Semua halaman selain landing page (publik) di-lazy-load — halaman ini
// hanya diakses lewat login, jadi tidak perlu ikut ditarik saat visitor
// pertama kali buka "/" (dampak besar ke ukuran bundle awal & SEO speed).
const Login = lazy(() => import("./Auth/Login"));
const AdminManageUsers = lazy(() => import("./pages/AdminManageUsers"));
const AdminManageSatpam = lazy(() => import("./pages/AdminManageSatpam"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const AdminManageShift = lazy(() => import("./pages/AdminManageShift"));
const AdminManagePos = lazy(() => import("./pages/AdminManagePos"));
const AdminManagePosUtama = lazy(() => import("./pages/AdminManagePosUtama"));
const AdminRekapAbsensi = lazy(() => import("./pages/AdminRekapAbsensi"));
const AdminRekapPatroli = lazy(() => import("./pages/AdminRekapPatroli"));
const AdminManageRadius = lazy(() => import("./pages/AdminManageRadius"));
const AdminManageWaktuJadwal = lazy(() => import("./pages/AdminManageWaktuJadwal"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const ClientDashboard = lazy(() => import("./pages/ClientDashboard"));
const ClientDetailsSatpam = lazy(() => import("./pages/ClientDetailsSatpam"));
const AdminDetailsSatpam = lazy(() => import("./pages/AdminDetailsSatpam"));
const AdminEditDetailSatpam = lazy(() => import("./pages/AdminEditDetailSatpam"));
const ClientActivityLog = lazy(() => import("./pages/ClientActivityLog"));
const AdminManagePengumuman = lazy(() => import("./pages/AdminManagePengumuman"));
const AdminRepositoriDokumen = lazy(() => import("./pages/AdminRepositoriDokumen"));
const AdminLaporanKejadian = lazy(() => import("./pages/AdminLaporanKejadian"));
const AdminManagePengajuan = lazy(() => import("./pages/AdminManagePengajuan"));
const AdminAprovalAkun = lazy(() => import("./pages/AdminAprovalAkun"));
const AdminActivityLog = lazy(() => import("./pages/AdminActivityLog"));
const AdminPanicAlert = lazy(() => import("./pages/AdminPanicAlert"));
const ClientRiwayatPesan = lazy(() => import("./pages/ClientRiwayatPesan"));
const ClientTrackingGps = lazy(() => import("./pages/ClientTrackingGps"));
const ClientPenjadwalanSatpam = lazy(() => import("./pages/ClientPenjadwalanSatpam"));

function App() {
  return (
    <Router>
      <Suspense fallback={null}>
        <Routes>
          {/* ga ada sidebar sama navbarnya */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />

          <Route element={<PrivateRoute />}>
            {/* ada side bar sama navbarnya */}
            <Route element={<Mainlayouts />}>
              <Route path="/AdminDashboard" element={<AdminDashboard />} />
              <Route path="/ClientDashboard" element={<ClientDashboard />} />
              <Route path="/AdminManageSatpam" element={<AdminManageSatpam />} />
              <Route
                path="/AdminEditDetailSatpam"
                element={<AdminEditDetailSatpam />}
              />
              <Route
                path="/ClientDetailSatpam"
                element={<ClientDetailsSatpam />}
              />
              <Route
                path="/ClientPenjadwalanSatpam"
                element={<ClientPenjadwalanSatpam />}
              />
              <Route path="/ClientActivityLog" element={<ClientActivityLog />} />
              <Route
                path="/ClientRiwayatPesan"
                element={<ClientRiwayatPesan />}
              />
              <Route path="/ClientGpsTracking" element={<ClientTrackingGps />} />
              <Route path="/AdminActivityLog" element={<AdminActivityLog />} />
              <Route path="/AdminPanicAlert" element={<AdminPanicAlert />} />

              <Route path="/AdminDetailSatpam" element={<AdminDetailsSatpam />} />
              <Route
                path="/AdminRepositoriDokumen"
                element={<AdminRepositoriDokumen />}
              />
              <Route
                path="/AdminLaporanKejadian"
                element={<AdminLaporanKejadian />}
              />
              <Route
                path="/AdminManagePengumuman"
                element={<AdminManagePengumuman />}
              />
              <Route
                path="/AdminManagePengajuan"
                element={<AdminManagePengajuan />}
              />
              <Route path="/AdminAprovalAkun" element={<AdminAprovalAkun />} />
              <Route path="/AdminManageUsers" element={<AdminManageUsers />} />
              <Route path="/AdminManageShift" element={<AdminManageShift />} />
              <Route path="/AdminManagePos" element={<AdminManagePos />} />
              <Route
                path="/AdminManagePosUtama"
                element={<AdminManagePosUtama />}
              />
              <Route path="/AdminRekapAbsensi" element={<AdminRekapAbsensi />} />
              <Route path="/AdminRekapPatroli" element={<AdminRekapPatroli />} />
              <Route path="/AdminManageRadius" element={<AdminManageRadius />} />
              <Route
                path="/AdminManageWaktu"
                element={<AdminManageWaktuJadwal />}
              />
              {/* Buat selanjutnya ya */}
            </Route>
            {/* Error Page Handler */}
            <Route path="*" element={<NotFoundPage />} />
            {/* ada side bar sama navbarnya */}
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
