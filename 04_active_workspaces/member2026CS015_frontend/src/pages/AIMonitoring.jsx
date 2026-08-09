import { useState } from "react";

import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  Button,
  LinearProgress,
  TextField,
  MenuItem,
  Divider,
  Alert,
} from "@mui/material";

import {
  Psychology,
  Videocam,
  Warning,
  CheckCircle,
  Favorite,
  Thermostat,
  DirectionsRun,
  Visibility,
  Pets,
  NotificationsActive,
  CameraAlt,
  Refresh,
} from "@mui/icons-material";


const animals = [
  {
    id: "COW001",
    name: "Gauri",
    type: "Cow",
    emoji: "🐄",
    health: 94,
    activity: 88,
    temperature: "38.4°C",
    behavior: "Normal",
    risk: "Low",
    camera: "Camera 01",
  },

  {
    id: "COW002",
    name: "Lakshmi",
    type: "Cow",
    emoji: "🐄",
    health: 78,
    activity: 62,
    temperature: "39.2°C",
    behavior: "Less Active",
    risk: "Medium",
    camera: "Camera 02",
  },

  {
    id: "BUF001",
    name: "Kamadhenu",
    type: "Buffalo",
    emoji: "🐃",
    health: 91,
    activity: 84,
    temperature: "38.7°C",
    behavior: "Normal",
    risk: "Low",
    camera: "Camera 03",
  },

  {
    id: "GOAT001",
    name: "Meenu",
    type: "Goat",
    emoji: "🐐",
    health: 69,
    activity: 55,
    temperature: "39.5°C",
    behavior: "Unusual",
    risk: "High",
    camera: "Camera 04",
  },

  {
    id: "SHE001",
    name: "Moti",
    type: "Sheep",
    emoji: "🐑",
    health: 88,
    activity: 79,
    temperature: "39.0°C",
    behavior: "Normal",
    risk: "Low",
    camera: "Camera 05",
  },

  {
    id: "HEN001",
    name: "Layer Group A",
    type: "Chicken",
    emoji: "🐔",
    health: 93,
    activity: 90,
    temperature: "41.1°C",
    behavior: "Normal",
    risk: "Low",
    camera: "Camera 06",
  },
];


export default function AIMonitoring() {

  const [animalType, setAnimalType] =
    useState("ALL");

  const [monitoring, setMonitoring] =
    useState(true);


  const filteredAnimals =
    animalType === "ALL"
      ? animals
      : animals.filter(
          (animal) =>
            animal.type === animalType
        );


  const highRisk =
    animals.filter(
      (animal) =>
        animal.risk === "High"
    ).length;


  const mediumRisk =
    animals.filter(
      (animal) =>
        animal.risk === "Medium"
    ).length;


  const healthy =
    animals.filter(
      (animal) =>
        animal.health >= 85
    ).length;


  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f5f8ff",
        p: {
          xs: 2,
          sm: 3,
          md: 4,
        },
      }}
    >

      {/* =================================================
          HEADER
      ================================================== */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            md: "center",
          },
          flexWrap: "wrap",
          gap: 2,
          mb: 4,
        }}
      >

        <Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >

            <Avatar
              sx={{
                width: 52,
                height: 52,
                backgroundColor:
                  "#dbeafe",
                color: "#2563eb",
              }}
            >
              <Psychology />
            </Avatar>

            <Typography
              variant="h4"
              fontWeight={900}
              color="#172554"
            >
              AI Monitoring 🤖
            </Typography>

          </Box>

          <Typography
            color="text.secondary"
            sx={{
              mt: 1,
              ml: 0.5,
            }}
          >
            Real-time AI monitoring of
            animal health, behaviour and
            activity.
          </Typography>

        </Box>


        <Button
          variant="contained"
          startIcon={
            monitoring
              ? <Visibility />
              : <Refresh />
          }
          onClick={() =>
            setMonitoring(!monitoring)
          }
          sx={{
            borderRadius: 3,
            textTransform: "none",
            fontWeight: 800,
            backgroundColor:
              monitoring
                ? "#16a34a"
                : "#2563eb",
            px: 3,
            "&:hover": {
              backgroundColor:
                monitoring
                  ? "#15803d"
                  : "#1d4ed8",
            },
          }}
        >
          {monitoring
            ? "AI Monitoring Active"
            : "Start Monitoring"}
        </Button>

      </Box>


      {/* =================================================
          LIVE STATUS
      ================================================== */}

      {monitoring && (

        <Alert
          severity="success"
          icon={<CheckCircle />}
          sx={{
            mb: 3,
            borderRadius: 3,
            fontWeight: 700,
          }}
        >
          AI monitoring is currently
          active. Cameras and animal
          activity data are being analysed
          continuously.
        </Alert>

      )}


      {/* =================================================
          SUMMARY
      ================================================== */}

      <Grid
        container
        spacing={2.5}
        sx={{ mb: 4 }}
      >

        <SummaryCard
          title="Animals Monitored"
          value={animals.length}
          subtitle="AI tracking active"
          icon={<Pets />}
          background="#dbeafe"
          color="#2563eb"
        />

        <SummaryCard
          title="Healthy"
          value={healthy}
          subtitle="Low health risk"
          icon={<Favorite />}
          background="#dcfce7"
          color="#16a34a"
        />

        <SummaryCard
          title="Medium Risk"
          value={mediumRisk}
          subtitle="Needs observation"
          icon={<Warning />}
          background="#fef3c7"
          color="#d97706"
        />

        <SummaryCard
          title="High Risk"
          value={highRisk}
          subtitle="Immediate attention"
          icon={<NotificationsActive />}
          background="#fee2e2"
          color="#dc2626"
        />

      </Grid>


      {/* =================================================
          FILTER
      ================================================== */}

      <Card
        sx={{
          mb: 3,
          borderRadius: 4,
          boxShadow: "none",
          border:
            "1px solid #e5e7eb",
        }}
      >

        <CardContent>

          <Grid
            container
            spacing={2}
            alignItems="center"
          >

            <Grid
              item
              xs={12}
              md={5}
            >

              <TextField
                select
                fullWidth
                label="Animal Type"
                value={animalType}
                onChange={(e) =>
                  setAnimalType(
                    e.target.value
                  )
                }
              >

                <MenuItem value="ALL">
                  🐾 All Animals
                </MenuItem>

                <MenuItem value="Cow">
                  🐄 Cows
                </MenuItem>

                <MenuItem value="Buffalo">
                  🐃 Buffaloes
                </MenuItem>

                <MenuItem value="Goat">
                  🐐 Goats
                </MenuItem>

                <MenuItem value="Sheep">
                  🐑 Sheep
                </MenuItem>

                <MenuItem value="Chicken">
                  🐔 Chickens
                </MenuItem>

              </TextField>

            </Grid>


            <Grid
              item
              xs={12}
              md={4}
            >

              <Chip
                icon={<CameraAlt />}
                label="6 AI Cameras Online"
                color="success"
                sx={{
                  height: 44,
                  fontWeight: 800,
                }}
              />

            </Grid>


            <Grid
              item
              xs={12}
              md={3}
            >

              <Chip
                icon={<Psychology />}
                label="AI Confidence: 94%"
                sx={{
                  height: 44,
                  fontWeight: 800,
                  backgroundColor:
                    "#ede9fe",
                  color: "#6d28d9",
                }}
              />

            </Grid>

          </Grid>

        </CardContent>

      </Card>


      {/* =================================================
          ALERTS
      ================================================== */}

      <Grid
        container
        spacing={2.5}
        sx={{ mb: 4 }}
      >

        <Grid
          item
          xs={12}
          md={7}
        >

          <Card
            sx={{
              borderRadius: 4,
              boxShadow: "none",
              border:
                "1px solid #fecaca",
            }}
          >

            <CardContent>

              <Box
                sx={{
                  display: "flex",
                  alignItems:
                    "center",
                  gap: 1,
                  mb: 2,
                }}
              >

                <NotificationsActive
                  sx={{
                    color: "#dc2626",
                  }}
                />

                <Typography
                  variant="h6"
                  fontWeight={900}
                >
                  AI Alerts
                </Typography>

                <Chip
                  size="small"
                  label="2 Active"
                  sx={{
                    ml: "auto",
                    backgroundColor:
                      "#fee2e2",
                    color: "#dc2626",
                    fontWeight: 800,
                  }}
                />

              </Box>


              <AlertItem
                animal="GOAT001 — Meenu"
                message="Unusual behaviour detected. Activity has decreased significantly."
                severity="High"
                time="5 min ago"
              />


              <AlertItem
                animal="COW002 — Lakshmi"
                message="Reduced activity and slightly elevated temperature detected."
                severity="Medium"
                time="18 min ago"
              />

            </CardContent>

          </Card>

        </Grid>


        {/* CAMERA STATUS */}

        <Grid
          item
          xs={12}
          md={5}
        >

          <Card
            sx={{
              height: "100%",
              borderRadius: 4,
              boxShadow: "none",
              border:
                "1px solid #e5e7eb",
            }}
          >

            <CardContent>

              <Typography
                variant="h6"
                fontWeight={900}
                sx={{ mb: 2 }}
              >
                Camera Status
              </Typography>


              <CameraStatus
                camera="Camera 01"
                location="Cattle Shed"
                status="Online"
              />

              <CameraStatus
                camera="Camera 02"
                location="Milking Area"
                status="Online"
              />

              <CameraStatus
                camera="Camera 03"
                location="Buffalo Shed"
                status="Online"
              />

              <CameraStatus
                camera="Camera 04"
                location="Goat Area"
                status="Online"
              />

            </CardContent>

          </Card>

        </Grid>

      </Grid>


      {/* =================================================
          ANIMAL MONITORING
      ================================================== */}

      <Typography
        variant="h6"
        fontWeight={900}
        sx={{ mb: 2 }}
      >
        Live Animal Monitoring
      </Typography>


      <Grid
        container
        spacing={2.5}
      >

        {filteredAnimals.map(
          (animal) => (

            <Grid
              item
              xs={12}
              sm={6}
              lg={4}
              key={animal.id}
            >

              <AnimalCard
                animal={animal}
              />

            </Grid>

          )
        )}

      </Grid>


      {/* =================================================
          AI ANALYSIS
      ================================================== */}

      <Card
        sx={{
          mt: 4,
          borderRadius: 4,
          color: "white",
          background:
            "linear-gradient(135deg, #172554, #2563eb)",
        }}
      >

        <CardContent sx={{ p: 3 }}>

          <Box
            sx={{
              display: "flex",
              alignItems:
                "center",
              gap: 1.5,
              mb: 3,
            }}
          >

            <Avatar
              sx={{
                backgroundColor:
                  "rgba(255,255,255,0.15)",
              }}
            >
              <Psychology />
            </Avatar>

            <Box>

              <Typography
                variant="h6"
                fontWeight={900}
              >
                AI Farm Analysis
              </Typography>

              <Typography
                variant="body2"
                sx={{ opacity: 0.75 }}
              >
                Automated insights from
                computer vision and animal
                monitoring.
              </Typography>

            </Box>

          </Box>


          <Grid
            container
            spacing={2}
          >

            <Grid
              item
              xs={12}
              md={4}
            >

              <Insight
                title="Behaviour"
                text="Most animals are showing normal movement and feeding behaviour."
              />

            </Grid>


            <Grid
              item
              xs={12}
              md={4}
            >

              <Insight
                title="Health"
                text="AI identified 2 animals that require closer observation."
              />

            </Grid>


            <Grid
              item
              xs={12}
              md={4}
            >

              <Insight
                title="Prediction"
                text="Current activity patterns indicate stable farm conditions."
              />

            </Grid>

          </Grid>

        </CardContent>

      </Card>

    </Box>
  );
}


/* =====================================================
   SUMMARY CARD
===================================================== */

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  background,
  color,
}) {

  return (
    <Grid
      item
      xs={12}
      sm={6}
      md={3}
    >

      <Card
        sx={{
          borderRadius: 4,
          boxShadow: "none",
          border:
            "1px solid #e5e7eb",
        }}
      >

        <CardContent>

          <Avatar
            sx={{
              backgroundColor:
                background,
              color,
              mb: 2,
            }}
          >
            {icon}
          </Avatar>


          <Typography
            variant="body2"
            color="text.secondary"
          >
            {title}
          </Typography>


          <Typography
            variant="h5"
            fontWeight={900}
            sx={{ mt: 0.5 }}
          >
            {value}
          </Typography>


          <Typography
            variant="caption"
            color="text.secondary"
          >
            {subtitle}
          </Typography>

        </CardContent>

      </Card>

    </Grid>
  );
}


/* =====================================================
   ANIMAL CARD
===================================================== */

function AnimalCard({ animal }) {

  const riskColor =
    animal.risk === "High"
      ? "#dc2626"
      : animal.risk === "Medium"
      ? "#d97706"
      : "#16a34a";


  return (
    <Card
      sx={{
        borderRadius: 4,
        boxShadow: "none",
        border:
          animal.risk === "High"
            ? "1px solid #fecaca"
            : "1px solid #e5e7eb",
      }}
    >

      <CardContent>

        {/* HEADER */}

        <Box
          sx={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >

          <Box
            sx={{
              display: "flex",
              alignItems:
                "center",
              gap: 1.5,
            }}
          >

            <Avatar
              sx={{
                width: 55,
                height: 55,
                fontSize: 30,
                backgroundColor:
                  "#eff6ff",
              }}
            >
              {animal.emoji}
            </Avatar>

            <Box>

              <Typography
                fontWeight={900}
              >
                {animal.id}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {animal.name} •{" "}
                {animal.type}
              </Typography>

            </Box>

          </Box>


          <Chip
            size="small"
            label={`${animal.risk} Risk`}
            sx={{
              fontWeight: 800,
              color: riskColor,
              backgroundColor:
                animal.risk === "High"
                  ? "#fee2e2"
                  : animal.risk === "Medium"
                  ? "#fef3c7"
                  : "#dcfce7",
            }}
          />

        </Box>


        <Divider sx={{ mb: 2 }} />


        {/* HEALTH */}

        <Metric
          label="AI Health Score"
          value={animal.health}
          suffix="%"
          icon={<Favorite />}
          color="#16a34a"
        />


        {/* ACTIVITY */}

        <Metric
          label="Activity Level"
          value={animal.activity}
          suffix="%"
          icon={<DirectionsRun />}
          color="#2563eb"
        />


        {/* TEMPERATURE */}

        <Box
          sx={{
            display: "flex",
            alignItems:
              "center",
            justifyContent:
              "space-between",
            mt: 2,
            p: 1.5,
            borderRadius: 2.5,
            backgroundColor:
              "#f8fafc",
          }}
        >

          <Box
            sx={{
              display: "flex",
              alignItems:
                "center",
              gap: 1,
            }}
          >

            <Thermostat
              sx={{ color: "#ef4444" }}
            />

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Temperature
            </Typography>

          </Box>

          <Typography
            fontWeight={900}
          >
            {animal.temperature}
          </Typography>

        </Box>


        {/* BEHAVIOUR */}

        <Box sx={{ mt: 2 }}>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            Detected Behaviour
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems:
                "center",
              justifyContent:
                "space-between",
              mt: 0.5,
            }}
          >

            <Typography
              fontWeight={800}
            >
              {animal.behavior}
            </Typography>

            <Chip
              size="small"
              label={
                animal.behavior ===
                "Normal"
                  ? "Normal"
                  : "Review"
              }
              color={
                animal.behavior ===
                "Normal"
                  ? "success"
                  : "warning"
              }
            />

          </Box>

        </Box>


        {/* CAMERA */}

        <Button
          fullWidth
          variant="outlined"
          startIcon={<Videocam />}
          sx={{
            mt: 2.5,
            borderRadius: 2.5,
            textTransform: "none",
            fontWeight: 800,
            borderColor: "#2563eb",
            color: "#2563eb",
          }}
        >
          View {animal.camera}
        </Button>

      </CardContent>

    </Card>
  );
}


/* =====================================================
   METRIC
===================================================== */

function Metric({
  label,
  value,
  suffix,
  icon,
  color,
}) {

  return (
    <Box sx={{ mb: 2 }}>

      <Box
        sx={{
          display: "flex",
          justifyContent:
            "space-between",
          mb: 0.7,
        }}
      >

        <Box
          sx={{
            display: "flex",
            alignItems:
              "center",
            gap: 0.7,
          }}
        >

          <Box sx={{ color }}>
            {icon}
          </Box>

          <Typography
            variant="body2"
            color="text.secondary"
          >
            {label}
          </Typography>

        </Box>


        <Typography
          fontWeight={900}
        >
          {value}
          {suffix}
        </Typography>

      </Box>


      <LinearProgress
        variant="determinate"
        value={value}
        sx={{
          height: 7,
          borderRadius: 5,
          backgroundColor: "#e5e7eb",

          "& .MuiLinearProgress-bar": {
            backgroundColor: color,
            borderRadius: 5,
          },
        }}
      />

    </Box>
  );
}


/* =====================================================
   ALERT ITEM
===================================================== */

function AlertItem({
  animal,
  message,
  severity,
  time,
}) {

  const color =
    severity === "High"
      ? "#dc2626"
      : "#d97706";


  return (
    <Box
      sx={{
        p: 2,
        mb: 1.5,
        borderRadius: 3,
        backgroundColor:
          severity === "High"
            ? "#fef2f2"
            : "#fffbeb",
      }}
    >

      <Box
        sx={{
          display: "flex",
          justifyContent:
            "space-between",
          gap: 2,
        }}
      >

        <Typography
          fontWeight={900}
          sx={{ color }}
        >
          {animal}
        </Typography>

        <Chip
          size="small"
          label={severity}
          sx={{
            fontWeight: 800,
            color,
          }}
        />

      </Box>


      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 0.5 }}
      >
        {message}
      </Typography>


      <Typography
        variant="caption"
        color="text.secondary"
      >
        {time}
      </Typography>

    </Box>
  );
}


/* =====================================================
   CAMERA STATUS
===================================================== */

function CameraStatus({
  camera,
  location,
  status,
}) {

  return (
    <Box
      sx={{
        display: "flex",
        alignItems:
          "center",
        justifyContent:
          "space-between",
        py: 1.2,
        borderBottom:
          "1px solid #f1f5f9",
      }}
    >

      <Box
        sx={{
          display: "flex",
          alignItems:
            "center",
          gap: 1.2,
        }}
      >

        <CameraAlt
          sx={{ color: "#2563eb" }}
        />

        <Box>

          <Typography
            variant="body2"
            fontWeight={800}
          >
            {camera}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
          >
            {location}
          </Typography>

        </Box>

      </Box>


      <Chip
        size="small"
        label={status}
        color="success"
        sx={{
          fontWeight: 800,
        }}
      />

    </Box>
  );
}


/* =====================================================
   INSIGHT
===================================================== */

function Insight({
  title,
  text,
}) {

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: 3,
        backgroundColor:
          "rgba(255,255,255,0.1)",
        height: "100%",
      }}
    >

      <Typography
        fontWeight={900}
        sx={{ mb: 0.5 }}
      >
        {title}
      </Typography>

      <Typography
        variant="body2"
        sx={{ opacity: 0.8 }}
      >
        {text}
      </Typography>

    </Box>
  );
}