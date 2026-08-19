import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Meetings from "./pages/Meetings";
import Scheduler from "./pages/Scheduler";
import Availability from "./pages/Availability";
import "./app.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/signup" replace />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/meetings" element={<Meetings />} />
        <Route path="/schedules" element={<Scheduler />} />
        <Route path="/availabilities" element={<Availability />} />
        <Route path="*" element={<Navigate to="/signup" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
