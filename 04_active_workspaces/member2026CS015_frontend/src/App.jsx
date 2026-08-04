import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Farms from "./pages/Farms";
import Animals from "./pages/Animals";
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
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />

        <Route
          path="/farms"
          element={
            <MainLayout>
              <Farms />
            </MainLayout>
          }
        />

        <Route
          path="/animals"
          element={
            <MainLayout>
              <Animals />
            </MainLayout>
          }
        />

        <Route
          path="/feed"
          element={
            <MainLayout>
              <Feed />
            </MainLayout>
          }
        />

        <Route
          path="/milk"
          element={
            <MainLayout>
              <Milk />
            </MainLayout>
          }
        />

        <Route
          path="/eggs"
          element={
            <MainLayout>
              <Eggs />
            </MainLayout>
          }
        />

        <Route
          path="/wool"
          element={
            <MainLayout>
              <Wool />
            </MainLayout>
          }
        />

        <Route
          path="/reports"
          element={
            <MainLayout>
              <Reports />
            </MainLayout>
          }
        />

        <Route
          path="/ai-monitoring"
          element={
            <MainLayout>
              <AIMonitoring />
            </MainLayout>
          }
        />

        <Route
          path="/predictions"
          element={
            <MainLayout>
              <Predictions />
            </MainLayout>
          }
        />

        <Route
          path="/settings"
          element={
            <MainLayout>
              <Settings />
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;