import {
  TextField,
  Button,
  Paper,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  Alert
} from "@mui/material";

import {
  Visibility,
  VisibilityOff
} from "@mui/icons-material";

import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function Login() {

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const navigate = useNavigate();


  const handleLogin = () => {

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }


    // Demo login
    if (
      email === "admin@gmail.com" &&
      password === "123456"
    ) {
      navigate("/dashboard");
    } 
    else {
      setError("Invalid email or password");
    }

  };


  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5"
      }}
    >

      <Paper
        elevation={5}
        sx={{
          padding: 4,
          width: 350,
          borderRadius: 3
        }}
      >

        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          mb={1}
        >
          AgroLens PLF
        </Typography>


        <Typography
          align="center"
          color="text.secondary"
          mb={3}
        >
          Precision Livestock Farming
        </Typography>


        {
          error && (
            <Alert severity="error">
              {error}
            </Alert>
          )
        }


        <TextField
          label="Email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
        />


        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          fullWidth
          margin="normal"

          value={password}
          onChange={(e)=>setPassword(e.target.value)}

          slotProps={{
            input:{
              endAdornment:(

                <InputAdornment position="end">

                  <IconButton
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                  >

                    {
                      showPassword ?
                      <VisibilityOff/>
                      :
                      <Visibility/>
                    }

                  </IconButton>

                </InputAdornment>

              )
            }
          }}

        />


        <Button
          variant="contained"
          fullWidth
          sx={{mt:3}}
          onClick={handleLogin}
        >
          LOGIN
        </Button>


      </Paper>

    </Box>
  );
}