import { Box, Button } from "@mui/material";
import { Home } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function MainLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleHome = () => {
    navigate("/");
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f7f9fc",
      }}
    >
      {/* =====================================================
          SIDEBAR
      ===================================================== */}
      <Sidebar />

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: {
            xs: 2,
            sm: 3,
            md: 3,
          },
          position: "relative",
          minWidth: 0,
        }}
      >
        {/* ===================================================
            BACK TO HOME BUTTON

            Hidden when already on Home/Dashboard
        =================================================== */}
        {location.pathname !== "/" && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              mb: 2,
            }}
          >
            <Button
              variant="outlined"
              startIcon={<Home />}
              onClick={handleHome}
              sx={{
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 800,
                px: 2.5,
                py: 1,

                borderColor: "#2563eb",
                color: "#2563eb",

                "&:hover": {
                  borderColor: "#1d4ed8",
                  backgroundColor: "#eff6ff",
                },
              }}
            >
              Back to Home
            </Button>
          </Box>
        )}

        {/* ===================================================
            CURRENT PAGE
        =================================================== */}
        {children}
      </Box>
    </Box>
  );
}