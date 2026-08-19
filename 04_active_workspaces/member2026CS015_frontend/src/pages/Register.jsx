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
  CircularProgress,
} from "@mui/material";

import {
  Visibility,
  VisibilityOff,
  Agriculture,
  PersonAdd,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/backend";

export default function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
    setSuccess("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !form.full_name ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please fill in all required fields (Full Name, Email, and Password).");
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

    setLoading(true);

    try {
      // Prepare registration data matching UserCreate schema
      const registrationData = {
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        password: form.password,
        ...(form.phone && { phone: form.phone.trim() }),
      };

      const response = await registerUser(registrationData);

      console.log("Registration successful:", response);

      setSuccess(
        "Registration successful! Redirecting to login..."
      );

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err) {
      console.error("Registration failed:", err);

      setError(
        err.message ||
          "Registration failed. Please try again."
      );

    } finally {
      setLoading(false);
    }
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
            Apollo AgriVerse
          </Typography>

          <Typography
            color="text.secondary"
            sx={{
              mt: 0.5,
            }}
          >
            Create your Precision Livestock Farming account
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

        <form onSubmit={handleRegister}>

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
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            margin="dense"
            placeholder="Enter your full name"
            disabled={loading}
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
            disabled={loading}
          />

          <TextField
            fullWidth
            label="Mobile Number (Optional)"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            margin="dense"
            placeholder="+91 XXXXX XXXXX"
            disabled={loading}
          />

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
            disabled={loading}
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
                    disabled={loading}
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
            disabled={loading}
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
                    disabled={loading}
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
            type="submit"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <PersonAdd />}
            disabled={loading}
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
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>

        </form>

        {/* LOGIN LINK */}

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
          disabled={loading}
          sx={{
            mt: 0.5,
            fontWeight: 800,
            textTransform: "none",
          }}
        >
          Sign In
        </Button>

      </Paper>
    </Box>
  );
}