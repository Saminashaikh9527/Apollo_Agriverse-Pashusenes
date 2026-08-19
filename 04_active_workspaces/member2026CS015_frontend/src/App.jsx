import { useState } from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Farms from "./pages/Farms";
import Animals from "./pages/Animals";
import DigitalTwin from "./pages/DigitalTwin";
import Feed from "./pages/Feed";
import Milk from "./pages/Milk";
import Eggs from "./pages/Eggs";
import Wool from "./pages/Wool";
import Reports from "./pages/Reports";
import AIMonitoring from "./pages/AIMonitoring";
import Predictions from "./pages/Predictions";
import Settings from "./pages/Settings";
import Vaccination from "./pages/Vaccination";
import Health from "./pages/Health";
import Growth from "./pages/Growth";

import MainLayout from "./layouts/MainLayout";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route
          path="/"
          element={<Login />}
        />

        {/* REGISTER */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* DASHBOARD */}
        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />

        {/* FARMS */}
        <Route
          path="/farms"
          element={
            <MainLayout>
              <Farms />
            </MainLayout>
          }
        />

        {/* ANIMALS */}
        <Route
          path="/animals"
          element={
            <MainLayout>
              <Animals />
            </MainLayout>
          }
        />

        {/* DIGITAL TWIN */}
        <Route
          path="/digital-twin"
          element={
            <MainLayout>
              <DigitalTwin />
            </MainLayout>
          }
        />

        {/* FEED */}
        <Route
          path="/feed"
          element={
            <MainLayout>
              <Feed />
            </MainLayout>
          }
        />

        {/* MILK */}
        <Route
          path="/milk"
          element={
            <MainLayout>
              <Milk />
            </MainLayout>
          }
        />

        {/* EGGS */}
        <Route
          path="/eggs"
          element={
            <MainLayout>
              <Eggs />
            </MainLayout>
          }
        />

        {/* WOOL */}
        <Route
          path="/wool"
          element={
            <MainLayout>
              <Wool />
            </MainLayout>
          }
        />

        <Route
          path="/vaccination"
          element={
            <MainLayout>
              <Vaccination />
            </MainLayout>
          }
        />

        <Route path="/health" element={<MainLayout><Health /></MainLayout>} />
        <Route path="/growth" element={<MainLayout><Growth /></MainLayout>} />

        {/* REPORTS */}
        <Route
          path="/reports"
          element={
            <MainLayout>
              <Reports />
            </MainLayout>
          }
        />

        {/* AI MONITORING */}
        <Route
          path="/ai-monitoring"
          element={
            <MainLayout>
              <AIMonitoring />
            </MainLayout>
          }
        />

        {/* PREDICTIONS */}
        <Route
          path="/predictions"
          element={
            <MainLayout>
              <Predictions />
            </MainLayout>
          }
        />

        {/* SETTINGS */}
        <Route
          path="/settings"
          element={
            <MainLayout>
              <Settings
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
            </MainLayout>
          }
        />

        {/* UNKNOWN PAGE */}
        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
