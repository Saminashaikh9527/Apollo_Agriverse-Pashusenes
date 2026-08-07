import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
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

import MainLayout from "./layouts/MainLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />

        {/* Farms */}
        <Route
          path="/farms"
          element={
            <MainLayout>
              <Farms />
            </MainLayout>
          }
        />

        {/* Animals */}
        <Route
          path="/animals"
          element={
            <MainLayout>
              <Animals />
            </MainLayout>
          }
        />

        {/* Digital Twin */}
        <Route
          path="/digital-twin"
          element={
            <MainLayout>
              <DigitalTwin />
            </MainLayout>
          }
        />

        {/* Feed */}
        <Route
          path="/feed"
          element={
            <MainLayout>
              <Feed />
            </MainLayout>
          }
        />

        {/* Milk */}
        <Route
          path="/milk"
          element={
            <MainLayout>
              <Milk />
            </MainLayout>
          }
        />

        {/* Eggs */}
        <Route
          path="/eggs"
          element={
            <MainLayout>
              <Eggs />
            </MainLayout>
          }
        />

        {/* Wool */}
        <Route
          path="/wool"
          element={
            <MainLayout>
              <Wool />
            </MainLayout>
          }
        />

        {/* Reports */}
        <Route
          path="/reports"
          element={
            <MainLayout>
              <Reports />
            </MainLayout>
          }
        />

        {/* AI Monitoring */}
        <Route
          path="/ai-monitoring"
          element={
            <MainLayout>
              <AIMonitoring />
            </MainLayout>
          }
        />

        {/* Predictions */}
        <Route
          path="/predictions"
          element={
            <MainLayout>
              <Predictions />
            </MainLayout>
          }
        />

        {/* Settings */}
        <Route
          path="/settings"
          element={
            <MainLayout>
              <Settings />
            </MainLayout>
          }
        />

        {/* Unknown URL */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;