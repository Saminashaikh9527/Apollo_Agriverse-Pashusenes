import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  InputAdornment,
  IconButton,
  MenuItem,
  Divider,
} from "@mui/material";

import {
  Visibility,
  VisibilityOff,
  Agriculture,
  PersonAdd,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    farmName: "",
    location: "",
    farmType: "Mixed Livestock",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  const handleRegister = () => {
    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.password ||
      !form.confirmPassword ||
      !form.farmName ||
      !form.location
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    if (form.password.length < 6) {
      setError(
        "Password must contain at least 6 characters."
      );
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Demo registration
    setSuccess(
      "Registration successful! Redirecting to login..."
    );

    setTimeout(() => {
      navigate("/");
    }, 1500);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
          "linear-gradient(135deg, #ecfdf5 0%, #eff6ff 50%, #f0fdf4 100%)",
        p: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: "100%",
          maxWidth: 540,
          p: {
            xs: 3,
            sm: 4,
          },
          borderRadius: 4,
        }}
      >
        {/* LOGO / HEADER */}

        <Box
          sx={{
            textAlign: "center",
            mb: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 1.5,
            }}
          >
            <Box
              sx={{
                width: 70,
                height: 70,
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background:
                  "linear-gradient(135deg, #16a34a, #22c55e)",
                color: "white",
                boxShadow:
                  "0 8px 20px rgba(22,163,74,0.25)",
              }}
            >
              <Agriculture
                sx={{
                  fontSize: 40,
                }}
              />
            </Box>
          </Box>

          <Typography
            variant="h4"
            fontWeight={900}
            color="#166534"
          >
            AgroLens PLF
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.5,
            }}
          >
            Create your Precision Livestock
            Farming account
          </Typography>
        </Box>

        {/* ALERTS */}

        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              borderRadius: 2,
            }}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert
            severity="success"
            sx={{
              mb: 2,
              borderRadius: 2,
            }}
          >
            {success}
          </Alert>
        )}

        {/* PERSONAL INFORMATION */}

        <Typography
          variant="h6"
          fontWeight={900}
          sx={{
            mb: 1.5,
            color: "#172554",
          }}
        >
          Personal Information
        </Typography>

        <TextField
          fullWidth
          label="Full Name *"
          name="name"
          value={form.name}
          onChange={handleChange}
          margin="dense"
          placeholder="Enter your full name"
        />

        <TextField
          fullWidth
          label="Email Address *"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          margin="dense"
          placeholder="example@gmail.com"
        />

        <TextField
          fullWidth
          label="Mobile Number *"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          margin="dense"
          placeholder="+91 XXXXX XXXXX"
        />

        <Divider
          sx={{
            my: 3,
          }}
        />

        {/* FARM INFORMATION */}

        <Typography
          variant="h6"
          fontWeight={900}
          sx={{
            mb: 1.5,
            color: "#172554",
          }}
        >
          Farm Information 🌾
        </Typography>

        <TextField
          fullWidth
          label="Farm Name *"
          name="farmName"
          value={form.farmName}
          onChange={handleChange}
          margin="dense"
          placeholder="Enter your farm name"
        />

        <TextField
          fullWidth
          label="Farm Location *"
          name="location"
          value={form.location}
          onChange={handleChange}
          margin="dense"
          placeholder="City, State"
        />

        <TextField
          select
          fullWidth
          label="Farm Type"
          name="farmType"
          value={form.farmType}
          onChange={handleChange}
          margin="dense"
        >
          <MenuItem value="Mixed Livestock">
            🐄 Mixed Livestock
          </MenuItem>

          <MenuItem value="Dairy Farm">
            🥛 Dairy Farm
          </MenuItem>

          <MenuItem value="Goat Farm">
            🐐 Goat Farm
          </MenuItem>

          <MenuItem value="Sheep Farm">
            🐑 Sheep Farm
          </MenuItem>

          <MenuItem value="Poultry Farm">
            🐔 Poultry Farm
          </MenuItem>
        </TextField>

        <Divider
          sx={{
            my: 3,
          }}
        />

        {/* SECURITY */}

        <Typography
          variant="h6"
          fontWeight={900}
          sx={{
            mb: 1.5,
            color: "#172554",
          }}
        >
          Security 🔐
        </Typography>

        <TextField
          fullWidth
          label="Password *"
          name="password"
          type={
            showPassword
              ? "text"
              : "password"
          }
          value={form.password}
          onChange={handleChange}
          margin="dense"
          placeholder="Minimum 6 characters"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  edge="end"
                >
                  {showPassword ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          fullWidth
          label="Confirm Password *"
          name="confirmPassword"
          type={
            showConfirmPassword
              ? "text"
              : "password"
          }
          value={form.confirmPassword}
          onChange={handleChange}
          margin="dense"
          placeholder="Re-enter your password"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  edge="end"
                >
                  {showConfirmPassword ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        {/* REGISTER BUTTON */}

        <Button
          fullWidth
          variant="contained"
          size="large"
          startIcon={<PersonAdd />}
          onClick={handleRegister}
          sx={{
            mt: 3,
            py: 1.5,
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 900,
            fontSize: 16,
            background:
              "linear-gradient(135deg, #16a34a, #22c55e)",
            boxShadow:
              "0 8px 20px rgba(22,163,74,0.25)",
            "&:hover": {
              background:
                "linear-gradient(135deg, #15803d, #16a34a)",
            },
          }}
        >
          Create Account
        </Button>

        {/* LOGIN */}

        <Typography
          textAlign="center"
          sx={{
            mt: 3,
          }}
          color="text.secondary"
        >
          Already have an account?
        </Typography>

        <Button
          fullWidth
          variant="text"
          onClick={() =>
            navigate("/")
          }
          sx={{
            mt: 0.5,
            fontWeight: 800,
            textTransform: "none",
          }}
        >
          Login
        </Button>

      </Paper>
    </Box>
  );
}