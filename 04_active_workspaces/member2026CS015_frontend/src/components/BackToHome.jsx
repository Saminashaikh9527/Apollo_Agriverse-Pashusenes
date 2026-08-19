import React from "react";
import { Button } from "@mui/material";
import { Home } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

export default function BackToHome() {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/");
  };

  return (
    <Button
      variant="outlined"
      startIcon={<Home />}
      onClick={handleBackToHome}
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
  );
}