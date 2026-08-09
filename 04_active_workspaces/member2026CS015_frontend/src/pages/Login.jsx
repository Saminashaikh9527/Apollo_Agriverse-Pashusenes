import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  Divider,
  Alert,
  Avatar,
} from "@mui/material";

import {
  Visibility,
  VisibilityOff,
  Agriculture,
  ArrowForward,
  Security,
  Pets,
  AutoGraph,
} from "@mui/icons-material";

import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [rememberMe, setRememberMe] =
    useState(false);

  const [error, setError] =
    useState("");


  const handleLogin = () => {

    setError("");

    if (!email || !password) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    // Demo login
    if (
      email === "admin@gmail.com" &&
      password === "123456"
    ) {

      if (rememberMe) {
        localStorage.setItem(
          "agrolens_remember",
          "true"
        );
      }

      navigate("/dashboard");

    } else {

      setError(
        "Invalid email or password."
      );

    }
  };


  return (

    <Box
      sx={{
        minHeight: "100vh",

        display: "flex",

        backgroundColor: "#f8fafc",

        fontFamily:
          "'Inter', 'Roboto', sans-serif",
      }}
    >

      {/* =================================================
          LEFT BRANDING PANEL
      ================================================= */}

      <Box
        sx={{
          display: {
            xs: "none",
            md: "flex",
          },

          width: "52%",

          minHeight: "100vh",

          position: "relative",

          overflow: "hidden",

          flexDirection: "column",

          justifyContent: "space-between",

          p: 6,

          color: "#ffffff",

          background:
            "linear-gradient(145deg, #064e3b 0%, #047857 45%, #16a34a 100%)",
        }}
      >

        {/* Decorative circles */}

        <Box
          sx={{
            position: "absolute",

            width: 450,
            height: 450,

            borderRadius: "50%",

            background:
              "rgba(255,255,255,0.05)",

            top: -180,
            right: -150,
          }}
        />

        <Box
          sx={{
            position: "absolute",

            width: 350,
            height: 350,

            borderRadius: "50%",

            background:
              "rgba(255,255,255,0.04)",

            bottom: -150,
            left: -100,
          }}
        />


        {/* LOGO */}

        <Box
          sx={{
            position: "relative",
            zIndex: 2,

            display: "flex",
            alignItems: "center",
            gap: 1.5,
          }}
        >

          <Avatar
            sx={{
              width: 54,
              height: 54,

              backgroundColor:
                "#ffffff",

              color: "#047857",

              boxShadow:
                "0 8px 25px rgba(0,0,0,0.15)",
            }}
          >
            <Agriculture
              sx={{
                fontSize: 32,
              }}
            />
          </Avatar>


          <Box>

            <Typography
              fontWeight={900}
              fontSize={22}
            >
              AgroLens PLF
            </Typography>

            <Typography
              fontSize={12}
              sx={{
                opacity: 0.8,
                letterSpacing: 1,
              }}
            >
              PRECISION LIVESTOCK FARMING
            </Typography>

          </Box>

        </Box>


        {/* MAIN CONTENT */}

        <Box
          sx={{
            position: "relative",
            zIndex: 2,

            maxWidth: 600,

            my: 6,
          }}
        >

          <Typography
            sx={{
              fontSize: {
                md: 42,
                lg: 52,
              },

              lineHeight: 1.1,

              fontWeight: 900,

              mb: 3,
            }}
          >
            Smarter farms.
            <br />

            Healthier livestock.
            <br />

            Better decisions.
          </Typography>


          <Typography
            sx={{
              fontSize: 17,

              lineHeight: 1.7,

              opacity: 0.88,

              maxWidth: 520,

              mb: 4,
            }}
          >
            Monitor your livestock, understand animal
            health, track production and make
            data-driven farming decisions with
            AgroLens PLF.
          </Typography>


          {/* FEATURES */}

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >

            <Feature
              icon={<Pets />}
              title="Complete Livestock Management"
              text="Track cows, buffaloes, goats, sheep and poultry."
            />

            <Feature
              icon={<AutoGraph />}
              title="AI-Powered Monitoring"
              text="Identify health risks and unusual animal behaviour."
            />

            <Feature
              icon={<Security />}
              title="Secure Farm Data"
              text="Your farm information stays protected."
            />

          </Box>

        </Box>


        {/* FOOTER */}

        <Typography
          sx={{
            position: "relative",
            zIndex: 2,

            fontSize: 12,

            opacity: 0.65,
          }}
        >
          © 2026 AgroLens PLF · Precision Livestock
          Farming
        </Typography>

      </Box>


      {/* =================================================
          RIGHT LOGIN PANEL
      ================================================= */}

      <Box
        sx={{
          flex: 1,

          minHeight: "100vh",

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          p: {
            xs: 2,
            sm: 4,
            md: 6,
          },

          backgroundColor: "#ffffff",
        }}
      >

        <Box
          sx={{
            width: "100%",

            maxWidth: 450,
          }}
        >

          {/* MOBILE LOGO */}

          <Box
            sx={{
              display: {
                xs: "flex",
                md: "none",
              },

              alignItems: "center",

              justifyContent: "center",

              gap: 1.5,

              mb: 5,
            }}
          >

            <Avatar
              sx={{
                backgroundColor: "#dcfce7",
                color: "#15803d",
              }}
            >
              <Agriculture />
            </Avatar>

            <Typography
              fontWeight={900}
              fontSize={22}
              color="#064e3b"
            >
              AgroLens PLF
            </Typography>

          </Box>


          {/* LOGIN CARD */}

          <Paper
            elevation={0}
            sx={{
              p: {
                xs: 1,
                sm: 2,
              },

              border: "none",

              boxShadow: "none",
            }}
          >

            <Typography
              variant="h4"
              fontWeight={900}
              color="#111827"
              sx={{
                mb: 1,
              }}
            >
              Welcome back
            </Typography>


            <Typography
              color="text.secondary"
              sx={{
                mb: 4,
                fontSize: 15,
              }}
            >
              Sign in to manage your farm and
              livestock.
            </Typography>


            {/* ERROR */}

            {error && (

              <Alert
                severity="error"
                sx={{
                  mb: 3,
                  borderRadius: 2,
                }}
              >
                {error}
              </Alert>

            )}


            {/* EMAIL */}

            <Typography
              variant="body2"
              fontWeight={700}
              sx={{
                mb: 1,
                color: "#374151",
              }}
            >
              Email address
            </Typography>


            <TextField
              fullWidth

              placeholder="you@example.com"

              type="email"

              value={email}

              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}

              sx={{
                mb: 2.5,

                "& .MuiOutlinedInput-root": {
                  borderRadius: 2.5,

                  backgroundColor: "#f9fafb",

                  "&:hover fieldset": {
                    borderColor: "#16a34a",
                  },

                  "&.Mui-focused fieldset": {
                    borderColor: "#16a34a",
                  },
                },
              }}
            />


            {/* PASSWORD */}

            <Box
              sx={{
                display: "flex",

                justifyContent:
                  "space-between",

                alignItems: "center",

                mb: 1,
              }}
            >

              <Typography
                variant="body2"
                fontWeight={700}
                color="#374151"
              >
                Password
              </Typography>


              <Button
                size="small"
                sx={{
                  textTransform: "none",

                  color: "#15803d",

                  fontWeight: 700,

                  minWidth: "auto",

                  p: 0,

                  "&:hover": {
                    backgroundColor:
                      "transparent",
                  },
                }}
              >
                Forgot password?
              </Button>

            </Box>


            <TextField
              fullWidth

              placeholder="Enter your password"

              type={
                showPassword
                  ? "text"
                  : "password"
              }

              value={password}

              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}

              InputProps={{
                endAdornment: (

                  <InputAdornment
                    position="end"
                  >

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

              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2.5,

                  backgroundColor: "#f9fafb",

                  "&:hover fieldset": {
                    borderColor: "#16a34a",
                  },

                  "&.Mui-focused fieldset": {
                    borderColor: "#16a34a",
                  },
                },
              }}
            />


            {/* REMEMBER */}

            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}

                  onChange={(e) =>
                    setRememberMe(
                      e.target.checked
                    )
                  }

                  sx={{
                    color: "#9ca3af",

                    "&.Mui-checked": {
                      color: "#16a34a",
                    },
                  }}
                />
              }

              label={
                <Typography
                  variant="body2"
                  color="#4b5563"
                >
                  Remember me
                </Typography>
              }

              sx={{
                mt: 1,
                mb: 2,
              }}
            />


            {/* LOGIN BUTTON */}

            <Button
              fullWidth

              variant="contained"

              size="large"

              endIcon={
                <ArrowForward />
              }

              onClick={handleLogin}

              sx={{
                py: 1.6,

                borderRadius: 2.5,

                textTransform: "none",

                fontSize: 16,

                fontWeight: 900,

                background:
                  "linear-gradient(135deg, #15803d, #16a34a)",

                boxShadow:
                  "0 8px 20px rgba(22,163,74,0.20)",

                "&:hover": {
                  background:
                    "linear-gradient(135deg, #166534, #15803d)",

                  boxShadow:
                    "0 10px 25px rgba(22,163,74,0.28)",
                },
              }}
            >
              Sign in
            </Button>


            {/* DIVIDER */}

            <Box
              sx={{
                display: "flex",

                alignItems: "center",

                gap: 2,

                my: 3,
              }}
            >

              <Divider
                sx={{
                  flex: 1,
                }}
              />

              <Typography
                variant="caption"
                color="text.secondary"
              >
                OR
              </Typography>

              <Divider
                sx={{
                  flex: 1,
                }}
              />

            </Box>


            {/* REGISTER */}

            <Box
              sx={{
                textAlign: "center",
              }}
            >

              <Typography
                variant="body2"
                color="text.secondary"
                component="span"
              >
                Don't have an account?
              </Typography>


              <Button
                onClick={() =>
                  navigate("/register")
                }

                sx={{
                  ml: 0.5,

                  textTransform: "none",

                  color: "#15803d",

                  fontWeight: 900,

                  "&:hover": {
                    backgroundColor:
                      "transparent",

                    textDecoration:
                      "underline",
                  },
                }}
              >
                Create an account
              </Button>

            </Box>


            {/* SECURITY */}

            <Box
              sx={{
                display: "flex",

                justifyContent: "center",

                alignItems: "center",

                gap: 1,

                mt: 5,

                color: "#9ca3af",
              }}
            >

              <Security
                sx={{
                  fontSize: 16,
                }}
              />

              <Typography
                variant="caption"
              >
                Secure access to your farm
              </Typography>

            </Box>


            {/* DEMO INFORMATION */}

            <Box
              sx={{
                mt: 3,

                p: 1.5,

                borderRadius: 2,

                backgroundColor: "#f8fafc",

                textAlign: "center",
              }}
            >

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Demo account: admin@gmail.com /
                123456
              </Typography>

            </Box>

          </Paper>

        </Box>

      </Box>

    </Box>
  );
}


/* ==========================================================
   FEATURE COMPONENT
========================================================== */

function Feature({
  icon,
  title,
  text,
}) {

  return (

    <Box
      sx={{
        display: "flex",

        gap: 2,

        alignItems: "center",
      }}
    >

      <Avatar
        sx={{
          width: 42,
          height: 42,

          backgroundColor:
            "rgba(255,255,255,0.13)",

          color: "#ffffff",
        }}
      >
        {icon}
      </Avatar>


      <Box>

        <Typography
          fontWeight={800}
          fontSize={14}
        >
          {title}
        </Typography>

        <Typography
          fontSize={12}
          sx={{
            opacity: 0.72,
            mt: 0.3,
          }}
        >
          {text}
        </Typography>

      </Box>

    </Box>
  );
}