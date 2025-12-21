import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./Pages/Face_Recognition/Landing";
import TakePhoto from "./Pages/Face_Recognition/TakePhoto";
import Verification from "./Pages/Face_Recognition/Verification";
import Landing_Patroli from "./Pages/Patroli_Check_Point/Landing_Patroli";
import TakePhoto_Patroli from "./Pages/Patroli_Check_Point/TakePhoto_Patroli";
import Report_Patroli from "./Pages/Patroli_Check_Point/Report_Patroli";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/TakePhoto" element={<TakePhoto />} />
        <Route path="/Verification" element={<Verification />} />
        <Route path="/Patroli" element={<Landing_Patroli />} />
        <Route path="/TakePhotoPatroli" element={<TakePhoto_Patroli />} />
        <Route path="/ReportPatroli" element={<Report_Patroli />} />
      </Routes>
    </Router>
  );
}

export default App;
