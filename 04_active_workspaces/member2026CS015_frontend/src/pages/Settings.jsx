import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  MenuItem,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "Admin",
    email: "admin@gmail.com",
    password: "123456",
    language: "English",
  });

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleSave = () => {
    alert("Settings Saved Successfully!");
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <Box p={3}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Settings
      </Typography>

      <Paper sx={{ p: 3 }}>

        <Typography variant="h6" mb={2}>
          User Profile
        </Typography>

        <TextField
          label="Full Name"
          fullWidth
          margin="normal"
          value={profile.name}
          onChange={(e) =>
            setProfile({ ...profile, name: e.target.value })
          }
        />

        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={profile.email}
          onChange={(e) =>
            setProfile({ ...profile, email: e.target.value })
          }
        />

        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={profile.password}
          onChange={(e) =>
            setProfile({
              ...profile,
              password: e.target.value,
            })
          }
        />

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" mb={2}>
          Preferences
        </Typography>

        <TextField
          select
          label="Language"
          fullWidth
          margin="normal"
          value={profile.language}
          onChange={(e) =>
            setProfile({
              ...profile,
              language: e.target.value,
            })
          }
        >
          <MenuItem value="English">English</MenuItem>
          <MenuItem value="Hindi">Hindi</MenuItem>
          <MenuItem value="Marathi">Marathi</MenuItem>
        </TextField>

        <FormControlLabel
          control={
            <Switch
              checked={notifications}
              onChange={(e) =>
                setNotifications(e.target.checked)
              }
            />
          }
          label="Enable Notifications"
        />

        <br />

        <FormControlLabel
          control={
            <Switch
              checked={darkMode}
              onChange={(e) =>
                setDarkMode(e.target.checked)
              }
            />
          }
          label="Dark Mode"
        />

        <Divider sx={{ my: 3 }} />

        <Box display="flex" gap={2}>
          <Button
            variant="contained"
            color="success"
            onClick={handleSave}
          >
            Save Settings
          </Button>

          <Button
            variant="outlined"
            color="error"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>

      </Paper>
    </Box>
  );
}