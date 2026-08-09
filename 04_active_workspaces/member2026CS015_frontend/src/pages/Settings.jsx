import { useState } from "react";
import {
  Box,
  Card,
  Typography,
  Switch,
  Divider,
  Button,
  TextField,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import {
  Settings as SettingsIcon,
  DarkMode,
  LightMode,
  Notifications,
  Person,
  Security,
  Save,
  Lock,
} from "@mui/icons-material";

export default function Settings() {
  // Dark mode starts ON
  const [darkMode, setDarkMode] = useState(true);

  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  const [profileOpen, setProfileOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);

  const [name, setName] = useState("AgroLens Farmer");
  const [email, setEmail] = useState("admin@gmail.com");

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [message, setMessage] = useState("");

  const saveSettings = () => {
    localStorage.setItem("darkMode", darkMode);
    localStorage.setItem("notifications", notifications);
    localStorage.setItem("emailAlerts", emailAlerts);

    setMessage("Settings saved successfully!");
  };

  const saveProfile = () => {
    setProfileOpen(false);
    setMessage("Profile updated successfully!");
  };

  const changePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setMessage("Please fill all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("New passwords do not match.");
      return;
    }

    setPasswordOpen(false);

    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");

    setMessage("Password changed successfully!");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        p: {
          xs: 2,
          sm: 3,
          md: 4,
        },

        backgroundColor: darkMode
          ? "#111827"
          : "#f5f8ff",

        color: darkMode
          ? "#ffffff"
          : "#111827",

        transition: "all 0.3s ease",
      }}
    >
      {/* HEADER */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          mb: 4,
        }}
      >
        <Box
          sx={{
            width: 55,
            height: 55,
            borderRadius: 3,

            display: "flex",
            alignItems: "center",
            justifyContent: "center",

            backgroundColor: darkMode
              ? "#064e3b"
              : "#dcfce7",

            color: "#16a34a",
          }}
        >
          <SettingsIcon fontSize="large" />
        </Box>

        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
          >
            Settings
          </Typography>

          <Typography
            sx={{
              color: darkMode
                ? "#9ca3af"
                : "#6b7280",
            }}
          >
            Manage your AgroLens PLF preferences
          </Typography>
        </Box>
      </Box>

      {/* APPEARANCE */}

      <Card
        sx={{
          maxWidth: 850,
          mb: 3,
          p: 3,
          borderRadius: 4,

          backgroundColor: darkMode
            ? "#1f2937"
            : "#ffffff",

          color: darkMode
            ? "#ffffff"
            : "#111827",

          border: darkMode
            ? "1px solid #374151"
            : "1px solid #e5e7eb",

          boxShadow: "none",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
        >
          Appearance
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mt: 0.5,
            mb: 2,
            color: darkMode
              ? "#9ca3af"
              : "#6b7280",
          }}
        >
          Customize the appearance of AgroLens PLF.
        </Typography>

        <Divider
          sx={{
            mb: 2,
            borderColor: darkMode
              ? "#374151"
              : "#e5e7eb",
          }}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            {darkMode ? (
              <DarkMode
                sx={{ color: "#fbbf24" }}
              />
            ) : (
              <LightMode
                sx={{ color: "#f59e0b" }}
              />
            )}

            <Box>
              <Typography fontWeight="bold">
                Dark Mode
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: darkMode
                    ? "#9ca3af"
                    : "#6b7280",
                }}
              >
                {darkMode
                  ? "Dark theme is enabled"
                  : "Light theme is enabled"}
              </Typography>
            </Box>
          </Box>

          <Switch
            checked={darkMode}
            onChange={(e) =>
              setDarkMode(e.target.checked)
            }
            color="success"
          />
        </Box>
      </Card>

      {/* NOTIFICATIONS */}

      <Card
        sx={{
          maxWidth: 850,
          mb: 3,
          p: 3,
          borderRadius: 4,

          backgroundColor: darkMode
            ? "#1f2937"
            : "#ffffff",

          color: darkMode
            ? "#ffffff"
            : "#111827",

          border: darkMode
            ? "1px solid #374151"
            : "1px solid #e5e7eb",

          boxShadow: "none",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
        >
          Notifications
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mt: 0.5,
            mb: 2,
            color: darkMode
              ? "#9ca3af"
              : "#6b7280",
          }}
        >
          Manage your livestock alerts.
        </Typography>

        <Divider
          sx={{
            mb: 2,
            borderColor: darkMode
              ? "#374151"
              : "#e5e7eb",
          }}
        />

        {/* Notifications */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Notifications
              sx={{ color: "#16a34a" }}
            />

            <Box>
              <Typography fontWeight="bold">
                Notifications
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: darkMode
                    ? "#9ca3af"
                    : "#6b7280",
                }}
              >
                Receive farm and animal alerts.
              </Typography>
            </Box>
          </Box>

          <Switch
            checked={notifications}
            onChange={(e) =>
              setNotifications(
                e.target.checked
              )
            }
            color="success"
          />
        </Box>

        {/* Email */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Notifications
              sx={{ color: "#3b82f6" }}
            />

            <Box>
              <Typography fontWeight="bold">
                Email Alerts
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: darkMode
                    ? "#9ca3af"
                    : "#6b7280",
                }}
              >
                Receive alerts through email.
              </Typography>
            </Box>
          </Box>

          <Switch
            checked={emailAlerts}
            onChange={(e) =>
              setEmailAlerts(
                e.target.checked
              )
            }
            color="success"
          />
        </Box>
      </Card>

      {/* PROFILE */}

      <Card
        sx={{
          maxWidth: 850,
          mb: 3,
          p: 3,
          borderRadius: 4,

          backgroundColor: darkMode
            ? "#1f2937"
            : "#ffffff",

          color: darkMode
            ? "#ffffff"
            : "#111827",

          border: darkMode
            ? "1px solid #374151"
            : "1px solid #e5e7eb",

          boxShadow: "none",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
        >
          Profile
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mt: 0.5,
            mb: 2,
            color: darkMode
              ? "#9ca3af"
              : "#6b7280",
          }}
        >
          Manage your personal information.
        </Typography>

        <Divider
          sx={{
            mb: 2,
            borderColor: darkMode
              ? "#374151"
              : "#e5e7eb",
          }}
        />

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 2,
          }}
        >
          <Person
            sx={{ color: "#16a34a" }}
          />

          <Typography fontWeight="bold">
            {name}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          color="success"
          onClick={() => setProfileOpen(true)}
        >
          Edit Profile
        </Button>
      </Card>

      {/* SECURITY */}

      <Card
        sx={{
          maxWidth: 850,
          mb: 3,
          p: 3,
          borderRadius: 4,

          backgroundColor: darkMode
            ? "#1f2937"
            : "#ffffff",

          color: darkMode
            ? "#ffffff"
            : "#111827",

          border: darkMode
            ? "1px solid #374151"
            : "1px solid #e5e7eb",

          boxShadow: "none",
        }}
      >
        <Typography
          variant="h6"
          fontWeight="bold"
        >
          Security
        </Typography>

        <Typography
          variant="body2"
          sx={{
            mt: 0.5,
            mb: 2,
            color: darkMode
              ? "#9ca3af"
              : "#6b7280",
          }}
        >
          Protect your AgroLens account.
        </Typography>

        <Divider
          sx={{
            mb: 2,
            borderColor: darkMode
              ? "#374151"
              : "#e5e7eb",
          }}
        />

        <Button
          variant="outlined"
          color="success"
          startIcon={<Security />}
          onClick={() =>
            setPasswordOpen(true)
          }
        >
          Change Password
        </Button>
      </Card>

      {/* SAVE */}

      <Box
        sx={{
          maxWidth: 850,
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant="contained"
          color="success"
          startIcon={<Save />}
          onClick={saveSettings}
          sx={{
            px: 4,
            py: 1.3,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: "bold",
          }}
        >
          Save Changes
        </Button>
      </Box>

      {/* ================= PROFILE DIALOG ================= */}

      <Dialog
        open={profileOpen}
        onClose={() =>
          setProfileOpen(false)
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Edit Profile
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            sx={{ mt: 1, mb: 2 }}
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setProfileOpen(false)
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="success"
            onClick={saveProfile}
          >
            Save Profile
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================= PASSWORD DIALOG ================= */}

      <Dialog
        open={passwordOpen}
        onClose={() =>
          setPasswordOpen(false)
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Lock />
            Change Password
          </Box>
        </DialogTitle>

        <DialogContent>
          <TextField
            fullWidth
            label="Current Password"
            type="password"
            value={oldPassword}
            onChange={(e) =>
              setOldPassword(
                e.target.value
              )
            }
            sx={{ mt: 1, mb: 2 }}
          />

          <TextField
            fullWidth
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(
                e.target.value
              )
            }
            sx={{ mb: 2 }}
          />

          <TextField
            fullWidth
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(
                e.target.value
              )
            }
          />
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setPasswordOpen(false)
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            color="success"
            onClick={changePassword}
          >
            Change Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* ================= SUCCESS MESSAGE ================= */}

      <Snackbar
        open={Boolean(message)}
        autoHideDuration={3000}
        onClose={() => setMessage("")}
      >
        <Alert
          severity="success"
          onClose={() => setMessage("")}
          variant="filled"
        >
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}