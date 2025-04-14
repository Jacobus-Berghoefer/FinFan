// src/app.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/navBar";
import Dashboard from "./pages/dashboard";
import SignupPage from "./pages/signupPage";
import LoginPage from "./pages/loginPage";
//import Matchups from "./pages/matchupBet";
import PrivateRoute from "./components/privateRoute";

function App() {
  return (
    <Router>
      <div className="flex h-screen bg-[#2c2d31] text-white overflow-hidden">
        <NavBar />
        <div className="flex-grow bg-gray-100 flex-1 overflow-y-auto">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Private routes */}
            <Route element={<PrivateRoute />}>
              {/* <Route path="/matchups" element={<Matchups />} /> */}
            </Route>

          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;