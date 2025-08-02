import { Routes, Route } from "react-router-dom";
// import Dashboard from "./pages/Dashboard";
// import SetUsername from "./pages/SetUsername";
// import AuthPage from "./pages/AuthPage";
// import CameraPages from "./pages/Camera";
import CameraCapture from "./components/Fragments/CameraCapture";

export default function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<AuthPage />} /> */}
      {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      {/* <Route path="/set-username" element={<SetUsername />} /> */}
      {/* <Route path="/camera" element={<CameraPages />} /> */}
      <Route path="/" element={<CameraCapture />} />
    </Routes>      
  );
}
