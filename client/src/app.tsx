// src/app.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/navBar";
import Dashboard from "./pages/dashboard";

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-[#2c2d31] text-white overflow-hidden">
        <NavBar />
        <div className="flex-grow bg-gray-100 flex-1 overflow-y-auto">
          <Routes>
            {/* Add your routes here */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;